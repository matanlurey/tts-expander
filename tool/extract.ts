import * as fs from 'fs-extra';
import path from 'path';
import { SplitIO } from '../src/extract';

const io = new SplitIO();

(async (): Promise<void> => {
  await Promise.all(
    fs.readdirSync(path.join('samples', 'saves')).map(async (sample) => {
      const output = path.join('samples', 'sources', sample);
      await fs.remove(output);
      await fs.mkdirp(output);
      const state = await io.readSaveAndSplit(
        path.join('samples', 'saves', sample),
      );
      await io.writeSplit(output, state);
    }),
  );
})();
