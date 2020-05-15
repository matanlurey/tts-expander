import { rewriteUrlStrings } from '../src';

const input = JSON.stringify(
  {
    steamUrl: 'http://cloud-3.steamusercontent.com/ugc/8/B/',
    localHost: 'http://localhost/some/path',
    anotherUrl: 'https://anotherhost.com/some/path',
  },
  undefined,
  '  ',
);

test('should support no-op rewrite URL', () => {
  expect(rewriteUrlStrings(input)).toEqual(input);
});

test('should allow non-banned URLs', () => {
  expect(() =>
    rewriteUrlStrings(input, {
      ban: /http\:\/\/.*\.doesnotappear.com/,
    }),
  ).not.toThrowError();
});

test('should ban Steam URLs', () => {
  expect(() =>
    rewriteUrlStrings(input, {
      ban: /http\:\/\/.*\.steamusercontent.com/,
    }),
  ).toThrowError('Unsupported URL');
});

test('should rewrite https://another to http://localhost', () => {
  expect(
    rewriteUrlStrings(input, {
      from: 'https://anotherhost.com',
      to: 'http://localhost',
    }),
  ).toEqual(
    JSON.stringify(
      {
        steamUrl: 'http://cloud-3.steamusercontent.com/ugc/8/B/',
        localHost: 'http://localhost/some/path',
        anotherUrl: 'http://localhost/some/path',
      },
      undefined,
      '  ',
    ),
  );
});

test('should rewrite http://localhost to https://another', () => {
  expect(
    rewriteUrlStrings(input, {
      to: 'https://anotherhost.com',
      from: 'http://localhost',
    }),
  ).toEqual(
    JSON.stringify(
      {
        steamUrl: 'http://cloud-3.steamusercontent.com/ugc/8/B/',
        localHost: 'https://anotherhost.com/some/path',
        anotherUrl: 'https://anotherhost.com/some/path',
      },
      undefined,
      '  ',
    ),
  );
});

test('should rewrite to/from file:// URLs', () => {
  expect(
    rewriteUrlStrings('"https://domain.com/bird.jpg"', {
      from: 'https://domain.com/',
      to: 'file://C:\\Directory\\Assets\\',
    }),
  ).toEqual('"file://C:\\Directory\\Assets\\bird.jpg"');

  expect(
    rewriteUrlStrings('"file://C:\\Directory\\Assets\\bird.jpg"', {
      from: 'file://C:\\Directory\\Assets\\',
      to: 'https://domain.com/',
    }),
  ).toEqual('"https://domain.com/bird.jpg"');
});
