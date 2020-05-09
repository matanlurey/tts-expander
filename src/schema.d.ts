/* tslint:disable */
/** Execute `npm run generate` to regenerate **/

import { ObjectState, SaveState } from '@matanlurey/tts-save-format/src/types';

/* Generated from ExpandedObjectState.json */

export interface ExpandedObjectState {
  Object: ObjectState;
  ContainedObjectPaths?: string[];
  StatesPaths?: {
    [k: string]: string;
  };
}

/* Generated from ExpandedSaveState.json */

export interface ExpandedSaveState {
  Save: SaveState;
  ObjectPaths?: string[];
}
