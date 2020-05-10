import * as fs from 'fs-extra';
import minimist from 'minimist';
import path from 'path';
import { SplitObjectState } from '../dist';
import { SplitIO } from '../src';

async function extractSources(fromDir: string, toDir: string): Promise<void> {
  const io = new SplitIO();
  await Promise.all(
    fs.readdirSync(fromDir).map(async (sample) => {
      const output = path.join(toDir, sample.split('.')[0]);
      await fs.remove(output);
      await fs.mkdirp(output);
      const state = await io.readSaveAndSplit(path.join(fromDir, sample));
      await io.writeSplit(output, state);
    }),
  );
}

async function extractNames(fromFile: string, toFile: string): Promise<void> {
  const io = new SplitIO();
  const saveFile = await io.readSaveAndSplit(fromFile);
  const output = {
    names: new Set<string>(),
    nickNames: new Set<string>(),
  };

  function walkTree(object: SplitObjectState): void {
    const { Name, Nickname } = object.metadata.contents;
    // https://github.com/matanlurey/tts-save-format/issues/4
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    output.names.add(Name!);
    if (Nickname) {
      output.nickNames.add(Nickname);
    }
    object.children?.forEach((c) => walkTree(c.contents));
    Object.values(object.states).forEach((c) => walkTree(c.contents));
  }

  saveFile.children?.forEach((c) => walkTree(c.contents));

  return fs.writeFile(
    toFile,
    JSON.stringify(
      {
        names: Array.from(output.names),
        nickNames: Array.from(output.nickNames),
      },
      undefined,
      '  ',
    ),
  );
}

const args = minimist(process.argv.splice(2));

switch (args.type) {
  case 'sources':
    extractSources(args.from, args.to);
    break;
  case 'names':
    extractNames(args.from, args.to);
    break;
  default:
    console.error('Unknown command', args);
    process.exit(1);
}
