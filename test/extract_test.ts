import { ObjectState, SaveState } from '@matanlurey/tts-save-format/src/types';
import splitSave, {
  splitObject,
  SplitObjectState,
  SplitSaveState,
} from '../src/extract';

const commonObjectProps = {
  Transform: {
    posX: 0,
    posY: 1,
    posZ: 2,
    rotX: 3,
    rotY: 4,
    rotZ: 5,
    scaleX: 6,
    scaleY: 7,
    scaleZ: 8,
  },
  Nickname: 'Black Pawn',
  Description: 'A Pawn',
  GMNotes: 'My favorite piece',
  IgnoreFoW: false,
  ColorDiffuse: {
    r: 250,
    g: 251,
    b: 252,
  },
  Locked: false,
  Grid: true,
  Snap: true,
  Autoraise: false,
  Sticky: false,
  Tooltip: true,
};

test('should split a simple object, retaining metadata', () => {
  const data: ObjectState = {
    Name: 'Pawn',
    GUID: '123456',
    ...commonObjectProps,
  };
  const expected: SplitObjectState = {
    metadata: {
      contents: data,
      filePath: 'Pawn.123456.json',
    },
    children: [],
    states: {},
  };
  expect(splitObject(data)).toEqual(expected);
});

test('should split an object with Lua', () => {
  const data: ObjectState = {
    Name: 'Pawn',
    GUID: '123456',
    LuaScript: 'print("Hello World")',
    ...commonObjectProps,
  };
  const copy = { ...data, LuaScript: '#include ./Pawn.123456.lua' };
  const expected: SplitObjectState = {
    metadata: {
      contents: copy,
      filePath: 'Pawn.123456.json',
    },
    children: [],
    states: {},
    luaScript: {
      contents: 'print("Hello World")',
      filePath: 'Pawn.123456.lua',
    },
  };
  expect(splitObject(data)).toEqual(expected);
});

test('should split an object with XML', () => {
  const data: ObjectState = {
    Name: 'Pawn',
    GUID: '123456',
    XmlUI: '<Ui>Hello</Ui>',
    ...commonObjectProps,
  };
  const copy = { ...data, XmlUI: '#include ./Pawn.123456.xml' };
  const expected: SplitObjectState = {
    metadata: {
      contents: copy,
      filePath: 'Pawn.123456.json',
    },
    children: [],
    states: {},
    xmlUi: {
      contents: '<Ui>Hello</Ui>',
      filePath: 'Pawn.123456.xml',
    },
  };
  expect(splitObject(data)).toEqual(expected);
});

test('should split an object with ContainedObjects', () => {
  const pawn1: ObjectState = {
    Name: 'Pawn',
    GUID: '10001',
    ...commonObjectProps,
  };
  const pawn2: ObjectState = {
    Name: 'Pawn',
    GUID: '10002',
    ...commonObjectProps,
  };
  const data: ObjectState = {
    Name: 'Bag',
    GUID: '10000',
    ...commonObjectProps,
    ContainedObjects: [pawn1, pawn2],
  };
  const copy = {
    ...data,
    ContainedObjects: [],
  };
  const expected: SplitObjectState = {
    metadata: {
      contents: copy,
      filePath: 'Bag.10000.json',
    },
    children: [
      {
        contents: {
          metadata: {
            contents: pawn1,
            filePath: 'Pawn.10001.json',
          },
          states: {},
          children: [],
        },
        filePath: 'Pawn.10001.json',
      },
      {
        contents: {
          metadata: {
            contents: pawn2,
            filePath: 'Pawn.10002.json',
          },
          states: {},
          children: [],
        },
        filePath: 'Pawn.10002.json',
      },
    ],
    states: {},
  };
  expect(splitObject(data)).toEqual(expected);
});

test('should split an object with States', () => {
  const tokenState1: ObjectState = {
    Name: 'Token',
    GUID: '10001',
    ...commonObjectProps,
  };
  const tokenState2: ObjectState = {
    Name: 'Token',
    GUID: '10002',
    ...commonObjectProps,
  };
  const data: ObjectState = {
    Name: 'Token',
    GUID: '10000',
    ...commonObjectProps,
    States: {
      1: tokenState1,
      2: tokenState2,
    },
  };
  const copy = {
    ...data,
    States: {},
  };
  const expected: SplitObjectState = {
    metadata: {
      contents: copy,
      filePath: 'Token.10000.json',
    },
    children: [],
    states: {
      1: {
        contents: {
          metadata: {
            contents: tokenState1,
            filePath: 'Token.10001.json',
          },
          states: {},
          children: [],
        },
        filePath: 'Token.10001.json',
      },
      2: {
        contents: {
          metadata: {
            contents: tokenState2,
            filePath: 'Token.10002.json',
          },
          states: {},
          children: [],
        },
        filePath: 'Token.10002.json',
      },
    },
  };
  expect(splitObject(data)).toEqual(expected);
});

test('should split a save file with a child object', () => {
  const pawn: ObjectState = {
    Name: 'Pawn',
    GUID: '123456',
    ...commonObjectProps,
  };
  const save: SaveState = {
    SaveName: 'Game',
    GameMode: 'Game',
    Gravity: 1,
    Date: '0-0-0',
    PlayArea: 1,
    Table: 'Table',
    Sky: 'Sky',
    Rules: 'Rules',
    XmlUI: '<!-- Hello World -->',
    LuaScript: '-- Hello World',
    LuaScriptState: '',
    Grid: {
      Type: 0,
      Lines: true,
      Color: {
        r: 0,
        g: 1,
        b: 2,
      },
      Opacity: 0.5,
      ThickLines: false,
      Snapping: true,
      Offset: false,
      BothSnapping: false,
      xSize: 5,
      ySize: 10,
    },
    Lighting: {
      LightIntensity: 0,
      LightColor: {
        r: 253,
        g: 254,
        b: 255,
      },
      AmbientIntensity: 0,
      AmbientType: 0,
      AmbientEquatorColor: {
        r: 0,
        g: 0,
        b: 0,
      },
      AmbientGroundColor: {
        r: 0,
        g: 0,
        b: 0,
      },
      AmbientSkyColor: {
        r: 0,
        g: 0,
        b: 0,
      },
      ReflectionIntensity: 0,
      LutContribution: 0,
      LutIndex: 0,
    },
    Hands: {
      Enable: true,
      DisableUnused: true,
      Hiding: 0,
      HandTransforms: [],
    },
    Turns: {
      Enable: false,
      TurnOrder: [],
      SkipEmpty: true,
      PassTurns: true,
      Type: 0,
      Reverse: false,
    },
    DecalPallet: [],
    TabStates: {},
    VersionNumber: '1.0.0',
    ObjectStates: [pawn],
  };
  const copy = { ...save };
  copy.ObjectStates = [];
  copy.LuaScript = '#include ./Game.lua';
  copy.XmlUI = '#include ./Game.xml';
  const expected: SplitSaveState = {
    metadata: {
      contents: copy,
      filePath: 'Game.json',
    },
    luaScript: {
      contents: '-- Hello World',
      filePath: 'Game.lua',
    },
    xmlUi: {
      contents: '<!-- Hello World -->',
      filePath: 'Game.xml',
    },
    children: [
      {
        contents: {
          metadata: {
            contents: pawn,
            filePath: 'Pawn.123456.json',
          },
          states: {},
          children: [],
        },
        filePath: 'Pawn.123456.json',
      },
    ],
  };
  expect(splitSave(save)).toEqual(expected);
});
