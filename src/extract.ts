import { ObjectState, SaveState } from '@matanlurey/tts-save-format/src/types';
import * as fs from 'fs-extra';
import path from 'path';
import { VarnishObjectState, VarnishSaveState } from './schema';

export type SplitFragment = {
  contents: string;
  filePath: string;
};

/**
 * Represents splitting a larger metadata file into logical chunks.
 *
 * This is the in-memory representation of the file system.
 */
export interface SplitState<
  T extends {
    LuaScript?: string;
    XmlUI?: string;
  }
> {
  /**
   * Partial metadata specific to object `T`.
   */
  metadata: {
    contents: Partial<T>;
    filePath: string;
  };

  /**
   * Child objects, in order of appereance.
   */
  children: Array<{
    contents: SplitObjectState;
    filePath: string;
  }>;

  /**
   * Lua script, if any.
   */
  luaScript?: SplitFragment;

  /**
   * XML UI, if any.
   */
  xmlUi?: SplitFragment;
}

export interface SplitObjectState extends SplitState<ObjectState> {
  /**
   * Swappable states, if any.
   */
  states: {
    [key: string]: {
      contents: SplitObjectState;
      filePath: string;
    };
  };
}

export type SplitSaveState = SplitState<SaveState>;

function copyObjectWithoutDuplicateNodes(
  object: ObjectState,
  name: string,
): ObjectState {
  const copy = { ...object };
  if (copy.ContainedObjects) {
    copy.ContainedObjects = [];
  }
  if (copy.States) {
    copy.States = {};
  }
  if (copy.LuaScript) {
    copy.LuaScript = `#include ./${name}.lua`;
  }
  if (copy.XmlUI) {
    copy.XmlUI = `#include ./${name}.xml`;
  }
  return copy;
}

function copySaveWithoutDuplicateNodes(
  save: SaveState,
  name: string,
): SaveState {
  const copy = { ...save };
  if (copy.LuaScript) {
    copy.LuaScript = `#include ./${name}.lua`;
  }
  if (copy.ObjectStates) {
    copy.ObjectStates = [];
  }
  if (copy.XmlUI) {
    copy.XmlUI = `#include ./${name}.xml`;
  }
  return copy;
}

function defaultName(object: ObjectState): string {
  return `${object.Name}.${object.GUID}`;
}

function splitStates(
  states: { [key: string]: ObjectState },
  split: (
    object: ObjectState,
    name: (object: ObjectState) => string,
  ) => SplitObjectState,
  name = defaultName,
): {
  [key: string]: {
    contents: SplitObjectState;
    filePath: string;
  };
} {
  const result: {
    [key: string]: {
      contents: SplitObjectState;
      filePath: string;
    };
  } = {};
  for (const state in states) {
    result[state] = {
      contents: split(states[state], name),
      filePath: `${name(states[state])}.json`,
    };
  }
  return result;
}

function splitLua(
  input: {
    LuaScript?: string;
  },
  name: string,
): undefined | SplitFragment {
  return {
    contents: input.LuaScript || '',
    filePath: `${name}.lua`,
  };
}

function splitXml(
  input: {
    XmlUI?: string;
  },
  name: string,
): SplitFragment {
  return {
    contents: input.XmlUI || '',
    filePath: `${name}.xml`,
  };
}

/**
 * Returns the provided @param object split into a tree of @returns {SplitObjectState}.
 */
export function splitObject(
  object: ObjectState,
  name = defaultName,
): SplitObjectState {
  const objectName = name(object);
  const result: SplitObjectState = {
    metadata: {
      contents: copyObjectWithoutDuplicateNodes(object, objectName),
      filePath: `${objectName}.json`,
    },
    children: (object.ContainedObjects || []).map((o) => {
      return {
        filePath: `${name(o)}.json`,
        contents: splitObject(o),
      };
    }),
    states: splitStates(object.States || {}, splitObject, name),
  };
  if (object.LuaScript) {
    result.luaScript = splitLua(object, objectName);
  }
  if (object.XmlUI) {
    result.xmlUi = splitXml(object, objectName);
  }
  return result;
}

/**
 * Returns the provided @param save split into a tree of @returns {SplitSaveState}.
 */
export default function splitSave(
  save: SaveState,
  name = defaultName,
): SplitSaveState {
  const result: SplitSaveState = {
    metadata: {
      contents: copySaveWithoutDuplicateNodes(save, save.SaveName),
      filePath: `${save.SaveName}.json`,
    },
    children: save.ObjectStates.map((o) => {
      return {
        filePath: `${name(o)}.json`,
        contents: splitObject(o),
      };
    }),
  };
  if (save.LuaScript) {
    result.luaScript = splitLua(save, save.SaveName);
  }
  if (save.XmlUI) {
    result.xmlUi = splitXml(save, save.SaveName);
  }
  return result;
}

/**
 * Handles reading/wrting split states to disk or other locations.
 */
export class SplitIO {
  constructor(
    private readonly readFile = fs.readFile,
    private readonly writeFile = fs.writeFile,
    private readonly mkdirp = fs.mkdirp,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async readJson(file: string): Promise<any> {
    return JSON.parse(await this.readFile(file, 'utf-8'));
  }

  private async writeJson(file: string, content: {}): Promise<void> {
    return this.writeFile(
      file,
      JSON.stringify(content, undefined, '  '),
      'utf-8',
    );
  }

  async readSaveAndSplit(file: string): Promise<SplitSaveState> {
    return splitSave(await this.readJson(file));
  }

  async writeSplit(to: string, data: SplitSaveState): Promise<void> {
    return this.writeSplitSave(to, data);
  }

  private toEncodedSave(data: SplitSaveState): VarnishSaveState {
    return {
      Save: data.metadata.contents as SaveState,
      ObjectPaths: data.children.map((c) => c.filePath),
    };
  }

  private toEncodedObject(data: SplitObjectState): VarnishObjectState {
    const StatePaths: { [key: string]: string } = {};
    for (const k in data.states) {
      StatePaths[k] = data.states[k].filePath;
    }
    return {
      Object: data.metadata.contents as ObjectState,
      ContainedObjectPaths: data.children.map((c) => c.filePath),
      StatesPaths: StatePaths,
    };
  }

  private async writeSplitSave(
    to: string,
    data: SplitSaveState,
  ): Promise<void> {
    const outJson = path.join(to, data.metadata.filePath);
    await this.writeJson(outJson, this.toEncodedSave(data));

    if (data.luaScript) {
      const outLua = path.join(to, data.luaScript.filePath);
      await this.writeFile(outLua, data.luaScript.contents, 'utf-8');
    }

    if (data.xmlUi) {
      const outLua = path.join(to, data.xmlUi.filePath);
      await this.writeFile(outLua, data.xmlUi.contents, 'utf-8');
    }

    if (data.children && data.children.length) {
      const outChild = path.join(to, data.metadata.filePath.split('.')[0]);
      await this.mkdirp(outChild);
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data.children.map((c) => this.writeSplitObject(outChild, c.contents!)),
      );
    }
  }

  private async writeSplitObject(
    to: string,
    data: SplitObjectState,
  ): Promise<void> {
    const outJson = path.join(to, data.metadata.filePath);
    await this.writeJson(outJson, this.toEncodedObject(data));

    if (data.luaScript) {
      const outLua = path.join(to, data.luaScript.filePath);
      await this.writeFile(outLua, data.luaScript.contents, 'utf-8');
    }

    if (data.xmlUi) {
      const outLua = path.join(to, data.xmlUi.filePath);
      await this.writeFile(outLua, data.xmlUi.contents, 'utf-8');
    }

    if (data.children && data.children.length) {
      const outChild = path.join(to, data.metadata.filePath.split('.')[0]);
      await this.mkdirp(outChild);
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data.children.map((c) => this.writeSplitObject(outChild, c.contents!)),
      );
    }

    if (data.states && Object.keys(data.states).length) {
      const outStates = path.join(
        to,
        `${data.metadata.filePath.split('.')[0]}.states`,
      );
      await this.mkdirp(outStates);
      await Promise.all(
        Object.entries(data.states).map((c) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.writeSplitObject(outStates, c[1].contents!),
        ),
      );
    }
  }
}
