declare module 'normalize-newline' {
  export default function (input: string | Buffer): string;
}

declare module '@appguru/luafmt' {
  export function formatter(options: object): (lua: string) => string;
}
