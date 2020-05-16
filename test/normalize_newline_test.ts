import * as fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { SplitIO } from '../src';

let workDir: string;

beforeEach(async () => {
  let tmpDir = os.tmpdir();
  if (!tmpDir.endsWith(path.sep)) {
    tmpDir = `${tmpDir}${path.sep}`;
  }
  workDir = await fs.mkdtemp(tmpDir);
});

afterEach(() => fs.remove(workDir));

test('should replace CRLF with LF', async () => {
  const splitter = new SplitIO();
  await splitter.writeSplit(workDir, {
    metadata: {
      contents: {
        SaveName: 'Output',
      },
      filePath: 'Output.json',
    },

    luaScript: {
      contents: ['-- 1', '-- 2', '-- 3'].join('\r\n') + '\r\n',
      filePath: 'Output.lua',
    },
  });

  const outputLua = path.join(workDir, 'Output.lua');
  const savedLua = fs.readFileSync(outputLua, 'utf-8');
  expect(savedLua).toEqual(['-- 1', '-- 2', '-- 3'].join('\n') + '\n');
});
