import path from 'path';
import { SplitIO } from '../src';

test('should split and rewrite a URL', async () => {
  const splitter = new SplitIO({
    from: 'https://original.com',
    to: 'https://rewriteme.com',
  });
  const extracted = await splitter.readSaveAndSplit(
    path.join('test', 'data', 'save_with_urls.json'),
  );
  expect(extracted.luaScript?.contents).toEqual(
    "local url = 'https://original.com/path'",
  );
});
