import { ObjectState, SaveState } from '@matanlurey/tts-save-format/src/types';
import * as fs from 'fs-extra';
import path from 'path';

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
  },
  O extends Partial<T>
> {
  /**
   * Partial metadata specific to object `T`.
   */
  metadata: {
    contents: O;
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

type ObjectParts = {
  ContainedObjects?: ObjectState[];
  LuaScript?: string;
  States?: { [key: string]: ObjectState };
  XmlUI?: string;
};

export interface SplitObjectState extends SplitState<ObjectState, ObjectParts> {
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

type SaveParts = {
  ContainedObjects?: SplitObjectState[];
  LuaScript?: string;
  XmlUI?: string;
};

export type SplitSaveState = SplitState<SaveState, SaveParts>;

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

  private async writeSplitSave(
    to: string,
    data: SplitSaveState,
  ): Promise<void> {
    const outJson = path.join(to, data.metadata.filePath);
    await this.writeJson(outJson, data.metadata.contents);

    if (data.luaScript) {
      const outLua = path.join(to, data.luaScript.filePath);
      await this.writeFile(outLua, data.luaScript.contents, 'utf-8');
    }

    if (data.xmlUi) {
      const outLua = path.join(to, data.xmlUi.filePath);
      await this.writeFile(outLua, data.xmlUi.contents, 'utf-8');
    }

    if (data.children) {
      const outChild = path.join(to, path.basename(data.metadata.filePath));
      await Promise.all(
        data.children.map((c) => this.writeSplitObject(outChild, c.contents)),
      );
    }
  }

  private async writeSplitObject(
    to: string,
    data: SplitObjectState,
  ): Promise<void> {
    const outJson = path.join(to, data.metadata.filePath);
    await this.writeJson(outJson, data.metadata.contents);

    if (data.luaScript) {
      const outLua = path.join(to, data.luaScript.filePath);
      await this.writeFile(outLua, data.luaScript.contents, 'utf-8');
    }

    if (data.xmlUi) {
      const outLua = path.join(to, data.xmlUi.filePath);
      await this.writeFile(outLua, data.xmlUi.contents, 'utf-8');
    }

    if (data.children) {
      const outChild = path.join(to, path.basename(data.metadata.filePath));
      await Promise.all(
        data.children.map((c) => this.writeSplitObject(outChild, c.contents)),
      );
    }

    if (data.states) {
      const outStates = path.join(
        to,
        `${path.basename(data.metadata.filePath)}.states`,
      );
      await Promise.all(
        Object.entries(data.states).map((c) =>
          this.writeSplitObject(outStates, c[1].contents),
        ),
      );
    }
  }
}
