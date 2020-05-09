# tts-expander

Node.js library for expanding and collapsing the [save-file format][1] for
[Tabletop Simulator][2].

The goals of this library are:

- Avoid storing a giant monolothic `JSON` blob in version control (i.e. GitHub).
- Ease collaboration and code reviews of changes.
- Make it easier to hand-edit files/properties/scripts when desired.
- Allow the development of more advanced editors and tooling for modding.

[1]: https://kb.tabletopsimulator.com/custom-content/save-file-format/
[2]: https://store.steampowered.com/app/286160/Tabletop_Simulator/

## API

```ts
import * as expander from 'tts-expander';

// Use the library!
```

### `.splitObject`

```ts
const tree = expander.splitObject(/*ObjectState*/ object);
```

Converts an [`ObjectState`][4] into an intermediate object called a
`SplitObjectState` - which is a tree-like structure that represents all of the
metadata, children, and their metadata and children.

### `.splitSave`

```ts
const tree = expander.splitSave(/*ObjectState*/ save);
```

Converts an [`SaveState`][5] into an intermediate object called a
`SplitSaveState` - which is a tree-like structure that represents all of the
metadata, children, and their metadata and children.

A `SplitSaveState` can then be provded to [`SplitIO`](#splitio).

### `SplitIO`

A class that handles reading and writing metadata to disk.

#### `.readSaveAndSplit`

```ts
const io = new expander.SplitIO();
const tree = await io.readSaveAndSplit(pathToSaveFile);
```

Returns a `SplitSaveState` object.

#### `.writeSplit`

```ts
const io = new expander.SplitIO();
await io.writeSplit(pathToDirectory, splitSaveState);
```

Writes a `SplitSaveState` as a tree-based directory structure of files.

#### `.readAndCollapse`

```ts
const io = new expander.SplitIO();
const save = await io.readAndCollapse(pathToDirectory);
```

Reads a tree-based directory structure of files, collapsing into a `SaveState`.

## Schema

`tts-expander` uses the [`@matanlurey/tts-save-format`][3] package in order to
parse and validate the Tabletop Simulator save file format, and introduces two
new meta schemas: [`ExpandedObjectState`](#expandedobjectstate) and
[`ExpandedSaveState`](#expandedsavestate)

### `ExpandedObjectState`

Represents an [`ObjectState`][4] that has had all scripting, user-interface XML,
children, and alternative states "expanded" (and subsequently removed from the
metadata). To be able to piece this object back together into an `ObjectState`
you would need to load additional files and inline them back into the original
metadata.

```json
{
  "Object": {
    "Name": "Block",
    "GUID": "abcdef",
    ...
    // Scripts and XML is changed to an #include reference to another file.
    "LuaScript": "#include Block.lua",
    "XmlUI": "#include Block.xml",
    ...
    // Rest of the metadata.
    // Notably `ContainedObjects` and `States` has been purged.
   },
  "ContainedObjectPaths": [
    // Files that contain the metadata for ContainedObjects.
    "Object-1.json",
    "Object-2.json",
    ...
  ],
  "StatesPaths": {
    // Files that contain the metadata for States.
    "1": "State-1.json",
    "2": "State-2.json",
    ...
  }
}
```

### `ExpandedSaveState`

Similarly, `ExpandedSaveState` references a [`SaveState`][5].

```json
{
  "Save": {
    "Name": "Game",
    ...
    // Scripts and XML is changed to an #include reference to another file.
    "LuaScript": "#include Game.lua",
    "XmlUI": "#include Game.xml",
    ...
    // Rest of the metadata.
    // Notably `ContainedObjects` and `States` has been purged.
   },
  "ObjectStates": [
    // Files that contain the metadata for ContainedObjects.
    "Object-1.json",
    "Object-2.json",
    ...
  ]
}
```

[3]: https://github.com/matanlurey/tts-save-format
[4]: https://github.com/matanlurey/tts-save-format/blob/master/src/schema/ObjectState.json
[5]: https://github.com/matanlurey/tts-save-format/blob/master/src/schema/SaveState.json
