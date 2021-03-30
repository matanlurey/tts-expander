import path from 'path';
import { SplitIO } from '../src';

test('should collapse an object with Lua that uses #include', async () => {
  const tree = await new SplitIO().readAndCollapse(
    path.join('test', 'data', 'split_with_includes.json'),
  );
  expect(tree.LuaScript).toEqual(
    [
      '----#include !/matrix',
      '----#include !/nested',
      '-- NESTED INCLUDE',
      '',
      '----#include !/nested',
      '',
      'print("Hello")',
      '',
      '----#include !/matrix',
    ].join('\n') + '\n',
  );
});
