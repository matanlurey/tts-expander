/** Execute `npm run generate` to regenerate **/
import { ObjectState, SaveState } from '@matanlurey/tts-save-format/src/types';
export interface ExpandedObjectState {
    Object: ObjectState;
    ContainedObjectPaths?: string[];
    StatesPaths?: {
        [k: string]: string;
    };
}
export interface ExpandedSaveState {
    Save: SaveState;
    ObjectPaths?: string[];
}
