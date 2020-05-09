import * as fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { SplitIO } from '../src/extract';

let workDir: string;

beforeEach(async () => {
  let tmpDir = os.tmpdir();
  if (!tmpDir.endsWith(path.sep)) {
    tmpDir = `${tmpDir}${path.sep}`;
  }
  workDir = await fs.mkdtemp(tmpDir);
});

afterEach(() => fs.remove(workDir));

// This test suite ensures that we are able to go from
//
//   { Big Json BLOB } --> tree / structure / of / files
//
// ... and back again, without the < Big Json Blob > changing.
fs.readdirSync(path.join('samples', 'saves')).map((sample) => {
  test(sample, async () => {
    const io = new SplitIO();
    const input = path.join('samples', 'saves', sample);

    // Read the file as-is.
    const originalSave = await fs.readJson(input);

    // Takes a save file, converts it to a tree structure.
    const saveToSplit = await io.readSaveAndSplit(input);

    // Write tree structure to disk.
    const outputName = await io.writeSplit(workDir, saveToSplit);

    // Read structure from disk.
    const regeneratedState = await io.readAndCollapse(outputName);

    // Compare
    expect(regeneratedState).toEqual(originalSave);
  });
});
