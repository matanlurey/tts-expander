import path from 'path';
import { reduceLuaIncludes, SplitIO } from '../src';

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

test('should reduce a nested #include', () => {
  const nestedCollapse = [
    '----#include !/matrix',
    '----#include !/nested',
    '-- NESTED INCLUDE',
    '',
    '----#include !/nested',
    '',
    'print("Hello")',
    '',
    '----#include !/matrix',
  ];
  expect(reduceLuaIncludes(nestedCollapse)).toBe('#include !/matrix');
});
