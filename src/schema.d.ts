/* tslint:disable */
/** Execute `npm run generate` to regenerate **/

import { ObjectState, SaveState } from '@matanlurey/tts-save-format/src/types';

/* Generated from VarnishObjectState.json */

export interface VarnishObjectState {
  Object: ObjectState;
  ContainedObjectPaths: string[];
  StatesPaths: {
    [k: string]: string;
  };
}

/* Generated from VarnishSaveState.json */

export interface VarnishSaveState {
  Save: SaveState;
  ObjectPaths: string[];
}
