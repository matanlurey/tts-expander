import path from 'path';
import { SplitIO } from '../src';

test('should split and rewrite a URL', async () => {
  const splitter = new SplitIO({
    ban: /http\:\/\/.*\.steamusercontent.com/g,
    from: 'https://assets.swlegion.dev/',
    to: 'http://localhost:8080/',
  });
  const extracted = await splitter.readSaveAndSplit(
    path.join('test', 'data', 'save_with_urls.json'),
  );
  expect(extracted.luaScript?.contents).toEqual(
    "local url = 'https://assets.swlegion.dev/path'",
  );
});
