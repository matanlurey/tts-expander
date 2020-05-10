import { ObjectState, SaveState } from '@matanlurey/tts-save-format/src/types';
import * as fs from 'fs-extra';
export { ExpandedObjectState, ExpandedSaveState } from './schema';
export declare type SplitFragment = {
    contents: string;
    filePath: string;
};
/**
 * Represents splitting a larger metadata file into logical chunks.
 *
 * This is the in-memory representation of the file system.
 */
export interface SplitState<T extends {
    LuaScript?: string;
    XmlUI?: string;
}> {
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
export declare type SplitSaveState = SplitState<SaveState>;
declare function defaultName(object: ObjectState): string;
/**
 * Returns the provided @param object split into a tree of @returns {SplitObjectState}.
 */
export declare function splitObject(object: ObjectState, name?: typeof defaultName): SplitObjectState;
/**
 * Returns the provided @param save split into a tree of @returns {SplitSaveState}.
 */
export declare function splitSave(save: SaveState, name?: typeof defaultName): SplitSaveState;
/**
 * Handles reading/wrting split states to disk or other locations.
 */
export declare class SplitIO {
    private readonly readFile;
    private readonly writeFile;
    private readonly mkdirp;
    constructor(readFile?: typeof fs.readFile, writeFile?: typeof fs.writeFile, mkdirp?: typeof fs.mkdirp);
    private readJson;
    private writeJson;
    /**
     * Reads a @type {SaveState} and returns it as a @type {SplitSaveState}.
     *
     * @see writeSplit
     */
    readSaveAndSplit(file: string): Promise<SplitSaveState>;
    /**
     * Writes a @type {SplitSaveState} to disk as a tree of files.
     */
    writeSplit(to: string, data: SplitSaveState): Promise<string>;
    private toEncodedSave;
    private toEncodedObject;
    private writeSplitSave;
    private writeSplitObject;
    /**
     * Reads a directory structure representing a @type {SplitSaveState}.
     */
    readAndCollapse(file: string): Promise<SaveState>;
    private collapseSave;
    private collapseObject;
    private readIncludes;
    private readExtractedSave;
    private readExtractedObject;
}
