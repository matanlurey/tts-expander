import { ObjectState, SaveState } from '@matanlurey/tts-save-format/src/types';
import eol from 'eol';
import namify from 'filenamify';
import * as fs from 'fs-extra';
import path from 'path';
import { ExpandedObjectState, ExpandedSaveState } from './schema';

export { ExpandedObjectState, ExpandedSaveState } from './schema';

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
  children?: Array<{
    contents: SplitObjectState;
    filePath: string;
  }>;

  /**
   * Lua script, if any.
   */
  luaScript?: SplitFragment;

  /**
   * Lua state JSON, if any.
   */
  luaScriptState?: SplitFragment;

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
  if (copy.LuaScriptState) {
    copy.LuaScriptState = `#include ./${name}.state.json`;
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

export function nameObject(object: ObjectState): string {
  // Determine base name.
  const { Name, Nickname } = object;
  let name = Nickname && Nickname.trim().length ? `${Nickname}` : `${Name}`;

  // Remove brackets and parentheses and some punctuation.
  name = name.replace(/\]|\[|\)|\(|\,|\'/g, '_');

  // Sanitize filename.
  name = namify(name, { replacement: '_' });

  // Normalize spaces and periods.
  name = name.trim();
  name = name.replace(/\s/g, '_');
  name = name.replace(/_+/g, '_');
  name = name.replace(/\.+/g, '.');

  // Remove trailing and leading underscores.
  name = name.replace(/(^[_]+)|([_]+$.])/g, '');

  // Add a unique GUID and/or CardID.
  if (object.GUID) {
    name = `${name}.${object.GUID}`;
  }
  if (object.CardID || object.CardID === 0) {
    name = `${name}.${object.CardID}`;
  }

  // Remove trailing and leading periods.
  name = name.replace(/(^[.]+)|([.]+$.])/g, '');

  return name;
}

function splitStates(
  states: { [key: string]: ObjectState },
  split: (
    object: ObjectState,
    name: (object: ObjectState) => string,
  ) => SplitObjectState,
  name = nameObject,
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

const matchIncludeLine = /\#include\s+\!\/(.*)/;
const matchIncludedLua = /\-{4}\#include\s+(.*)/;

function reduceLuaIncludes(lines: string[]): string {
  const output: string[] = [];
  let inStatement: string | undefined;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(matchIncludedLua);
    if (match) {
      if (inStatement) {
        inStatement = undefined;
      } else {
        inStatement = match[1];
        output.push(`#include ${inStatement}`);
      }
    } else if (!inStatement) {
      output.push(line);
    }
    i++;
  }
  return output.join('\n');
}

async function insertLuaIncludes(
  lines: string[],
  includesDir: string,
  readString: (file: string) => Promise<string>,
): Promise<string> {
  const output: string[] = [];
  for (const line of lines) {
    const match = line.match(matchIncludeLine);
    if (match) {
      const url = match[1];
      output.push(`----#include !/${url}`);
      const content = await readString(path.join(includesDir, `${url}.ttslua`));
      output.push(content);
      output.push(`----#include !/${url}`);
    } else {
      output.push(line);
    }
  }
  return output.join('\n');
}

function splitLua(
  input: {
    LuaScript?: string;
  },
  name: string,
): undefined | SplitFragment {
  let lua = input.LuaScript || '';
  if (lua.length > 0) {
    lua = reduceLuaIncludes(lua.split('\n'));
  }
  return {
    contents: lua,
    filePath: `${name}.lua`,
  };
}

function splitLuaState(
  input: {
    LuaScriptState?: string;
  },
  name: string,
): undefined | SplitFragment {
  const contents = input.LuaScriptState || '';
  return {
    contents,
    filePath: `${name}.state.json`,
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
  name = nameObject,
): SplitObjectState {
  const objectName = name(object);
  const result: SplitObjectState = {
    metadata: {
      contents: copyObjectWithoutDuplicateNodes(object, objectName),
      filePath: `${objectName}.json`,
    },
    states: splitStates(object.States || {}, splitObject, name),
  };
  if (object.ContainedObjects) {
    result.children = object.ContainedObjects?.map((o) => {
      return {
        filePath: `${name(o)}.json`,
        contents: splitObject(o),
      };
    });
  }
  if (object.LuaScript) {
    result.luaScript = splitLua(object, objectName);
  }
  if (object.LuaScriptState) {
    result.luaScriptState = splitLuaState(object, objectName);
  }
  if (object.XmlUI) {
    result.xmlUi = splitXml(object, objectName);
  }
  return result;
}

/**
 * Returns the provided @param save split into a tree of @returns {SplitSaveState}.
 */
export function splitSave(save: SaveState, name = nameObject): SplitSaveState {
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
  if (save.LuaScriptState) {
    result.luaScriptState = splitLuaState(save, save.SaveName);
  }
  if (save.XmlUI) {
    result.xmlUi = splitXml(save, save.SaveName);
  }
  return result;
}

const matchUrls = /[a-z]+:\/\/[\S].+?(?=[\'|\"|\s])/gi;

/**
 * Rewrites all URLs in the provided @param input.
 */
export function rewriteUrlStrings(
  input: string,
  options?: {
    fileName?: string;
    ban?: string | RegExp | ((url: string) => boolean);
    from?: string;
    to?: string;
  },
): string {
  if (!options) {
    return input;
  }
  return input.replace(matchUrls, (subString, offset): string => {
    if (options.ban) {
      let allow = true;
      if (typeof options.ban == 'function') {
        allow = options.ban(subString);
      } else {
        allow = subString.match(options.ban) === null;
      }
      if (!allow) {
        let message = `Unsupported URL: "${subString}"`;
        if (options.fileName) {
          message = `${message} in ${options.fileName}:${offset}`;
        } else {
          message = `${message} in ${input.length} characters:${offset}`;
        }
        throw new Error(message);
      }
    }
    if (options.from && options.to) {
      return subString.replace(options.from, options.to);
    }
    return subString;
  });
}

/**
 * Handles reading/wrting split states to disk or other locations.
 */
export class SplitIO {
  private readonly readFile = fs.readFile;
  private readonly writeFile = fs.writeFile;
  private readonly mkdirp = fs.mkdirp;

  constructor(
    private readonly options?: {
      ban?: string | RegExp | ((url: string) => boolean);
      from?: string;
      to?: string;
      normalizeNewLines?: boolean;
    },
  ) {}

  private writeString(file: string, content: string): Promise<void> {
    let normalized = content;
    if (this.options?.normalizeNewLines !== false) {
      normalized = eol.lf(normalized);
      if (!normalized.endsWith('\n')) {
        normalized = `${normalized}\n`;
      }
    }
    return this.writeFile(file, normalized, 'utf-8');
  }

  private rewriteFromSource(input: string, fileName?: string): string {
    if (this.options) {
      return rewriteUrlStrings(input, {
        ban: this.options.ban,
        from: this.options.from,
        to: this.options.to,
        fileName: fileName,
      });
    }
    return input;
  }

  private rewriteFromBuild(input: string, fileName?: string): string {
    if (this.options) {
      return rewriteUrlStrings(input, {
        to: this.options.from,
        from: this.options.to,
        fileName: fileName,
      });
    }
    return input;
  }

  private async writeJson(file: string, content: {}): Promise<void> {
    return this.writeString(file, JSON.stringify(content, undefined, '  '));
  }

  /**
   * Reads a @type {SaveState} and returns it as a @type {SplitSaveState}.
   *
   * @see writeSplit
   */
  async readSaveAndSplit(file: string): Promise<SplitSaveState> {
    const rawJson = this.rewriteFromBuild(
      await this.readFile(file, 'utf-8'),
      file,
    );
    return splitSave(JSON.parse(rawJson));
  }

  /**
   * Writes a @type {SplitSaveState} to disk as a tree of files.
   */
  async writeSplit(to: string, data: SplitSaveState): Promise<string> {
    return this.writeSplitSave(to, data);
  }

  private toEncodedSave(data: SplitSaveState): ExpandedSaveState {
    return {
      Save: data.metadata.contents as SaveState,
      ObjectPaths: data.children?.map((c) => c.filePath) || [],
    };
  }

  private toEncodedObject(data: SplitObjectState): ExpandedObjectState {
    const StatePaths: { [key: string]: string } = {};
    for (const k in data.states) {
      StatePaths[k] = data.states[k].filePath;
    }
    const result: ExpandedObjectState = {
      Object: data.metadata.contents as ObjectState,
      StatesPaths: StatePaths,
    };
    if (data.children) {
      result.ContainedObjectPaths = data.children.map((c) => c.filePath);
    }
    return result;
  }

  private async writeSplitSave(
    to: string,
    data: SplitSaveState,
  ): Promise<string> {
    const outJson = path.join(to, data.metadata.filePath);
    await this.writeJson(outJson, this.toEncodedSave(data));

    if (data.luaScript) {
      const outLua = path.join(to, data.luaScript.filePath);
      await this.writeString(outLua, data.luaScript.contents);
    }

    if (data.luaScriptState) {
      const outJson = path.join(to, data.luaScriptState.filePath);
      await this.writeString(outJson, data.luaScriptState.contents);
    }

    if (data.xmlUi) {
      const outLua = path.join(to, data.xmlUi.filePath);
      await this.writeString(outLua, data.xmlUi.contents);
    }

    if (data.children && data.children.length) {
      const outChild = path.join(to, data.metadata.filePath.split('.')[0]);
      await this.mkdirp(outChild);
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data.children.map((c) => this.writeSplitObject(outChild, c.contents!)),
      );
    }

    return outJson;
  }

  private async writeSplitObject(
    to: string,
    data: SplitObjectState,
  ): Promise<void> {
    const outJson = path.join(to, data.metadata.filePath);
    await this.writeJson(outJson, this.toEncodedObject(data));

    if (data.luaScript) {
      const outLua = path.join(to, data.luaScript.filePath);
      await this.writeString(outLua, data.luaScript.contents);
    }

    if (data.luaScriptState) {
      const outLua = path.join(to, data.luaScriptState.filePath);
      await this.writeString(outLua, data.luaScriptState.contents);
    }

    if (data.xmlUi) {
      const outLua = path.join(to, data.xmlUi.filePath);
      await this.writeString(outLua, data.xmlUi.contents);
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
        `${data.metadata.filePath.split('.')[0]}.States`,
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

  /**
   * Reads a directory structure representing a @type {SplitSaveState}.
   */
  async readAndCollapse(file: string): Promise<SaveState> {
    return this.collapseSave(await this.readExtractedSave(file));
  }

  private collapseSave(save: SplitSaveState): SaveState {
    return {
      ...save.metadata.contents,
      LuaScript: save.luaScript?.contents || '',
      LuaScriptState: save.luaScriptState?.contents || '',
      XmlUI: save.xmlUi?.contents || '',
      ObjectStates:
        save.children?.map((c) => this.collapseObject(c.contents)) || [],
    } as SaveState;
  }

  private collapseObject(object: SplitObjectState): ObjectState {
    const result = {
      ...object.metadata.contents,
      LuaScript: object.luaScript?.contents || '',
      LuaScriptState: object.luaScriptState?.contents || '',
      XmlUI: object.xmlUi?.contents || '',
    } as ObjectState;
    if (object.children) {
      result.ContainedObjects = object.children.map((c) =>
        this.collapseObject(c.contents),
      );
    }
    if (Object.keys(object.states).length) {
      const states: { [k: string]: ObjectState } = {};
      for (const k in object.states) {
        states[k] = this.collapseObject(object.states[k].contents);
      }
      result.States = states;
    }
    return result;
  }

  private async readIncludes(
    dirName: string,
    includes: string,
    luaOrXml?: string,
  ): Promise<SplitFragment | undefined> {
    if (!luaOrXml) {
      return undefined;
    }
    if (!luaOrXml.startsWith('#include')) {
      throw `Unexpected: ${luaOrXml}`;
    }
    const relativeFile = luaOrXml.split('#include')[1].trim();
    const filePath = path.join(dirName, relativeFile);
    let contents = await this.readFile(filePath, 'utf-8');
    if (contents.indexOf('#include !/') !== -1) {
      contents = await insertLuaIncludes(
        contents.split('\n'),
        includes,
        (file: string) => this.readFile(file, 'utf-8'),
      );
    }
    contents = this.rewriteFromSource(contents, filePath);
    return {
      filePath: relativeFile,
      contents,
    };
  }

  private async readExtractedSave(file: string): Promise<SplitSaveState> {
    const rawJson = this.rewriteFromSource(
      await this.readFile(file, 'utf-8'),
      file,
    );
    const includesDir = path.join(path.dirname(file), 'includes');
    const entry = JSON.parse(rawJson) as ExpandedSaveState;
    const result: SplitSaveState = {
      metadata: {
        contents: entry.Save,
        filePath: path.basename(file),
      },
      luaScript: await this.readIncludes(
        path.dirname(file),
        includesDir,
        entry.Save.LuaScript,
      ),
      luaScriptState: await this.readIncludes(
        path.dirname(file),
        includesDir,
        entry.Save.LuaScriptState,
      ),
      xmlUi: await this.readIncludes(
        path.dirname(file),
        includesDir,
        entry.Save.XmlUI,
      ),
    };
    if (entry.ObjectPaths) {
      result.children = await Promise.all(
        entry.ObjectPaths.map(async (relative) => {
          const target = path.join(
            path.dirname(file),
            path.basename(file).split('.')[0],
            relative,
          );
          return {
            filePath: path.basename(target),
            contents: await this.readExtractedObject(target, includesDir),
          };
        }),
      );
    }
    return result;
  }

  private async readExtractedObject(
    file: string,
    includesDir: string,
  ): Promise<SplitObjectState> {
    const rawJson = this.rewriteFromSource(await this.readFile(file, 'utf-8'));
    const entry = JSON.parse(rawJson) as ExpandedObjectState;
    const states: {
      [key: string]: {
        contents: SplitObjectState;
        filePath: string;
      };
    } = {};
    for (const k in entry.StatesPaths) {
      const target = path.join(
        path.dirname(file),
        path.basename(file).split('.')[0] + '.States',
        entry.StatesPaths[k],
      );
      states[k] = {
        filePath: path.basename(target),
        contents: await this.readExtractedObject(target, includesDir),
      };
    }
    const result: SplitObjectState = {
      metadata: {
        contents: entry.Object,
        filePath: path.basename(file),
      },
      states,
      luaScript: await this.readIncludes(
        path.dirname(file),
        includesDir,
        entry.Object.LuaScript,
      ),
      luaScriptState: await this.readIncludes(
        path.dirname(file),
        includesDir,
        entry.Object.LuaScriptState,
      ),
      xmlUi: await this.readIncludes(
        path.dirname(file),
        includesDir,
        entry.Object.XmlUI,
      ),
    };
    if (entry.ContainedObjectPaths) {
      result.children = await Promise.all(
        entry.ContainedObjectPaths.map(async (relative) => {
          const target = path.join(
            path.dirname(file),
            path.basename(file).split('.')[0],
            relative,
          );
          return {
            filePath: path.basename(target),
            contents: await this.readExtractedObject(target, includesDir),
          };
        }),
      );
    }
    return result;
  }
}
