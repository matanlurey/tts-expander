"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const filenamify_1 = __importDefault(require("filenamify"));
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function copyObjectWithoutDuplicateNodes(object, name) {
    const copy = Object.assign({}, object);
    if (copy.ContainedObjects) {
        copy.ContainedObjects = [];
    }
    if (copy.States) {
        copy.States = {};
    }
    if (copy.LuaScript) {
        copy.LuaScript = `#include ./${name}.lua`;
    }
    if (copy.XmlUI) {
        copy.XmlUI = `#include ./${name}.xml`;
    }
    return copy;
}
function copySaveWithoutDuplicateNodes(save, name) {
    const copy = Object.assign({}, save);
    if (copy.LuaScript) {
        copy.LuaScript = `#include ./${name}.lua`;
    }
    if (copy.ObjectStates) {
        copy.ObjectStates = [];
    }
    if (copy.XmlUI) {
        copy.XmlUI = `#include ./${name}.xml`;
    }
    return copy;
}
function nameObject(object) {
    // Determine base name.
    const { Name, Nickname } = object;
    let name = Nickname && Nickname.trim().length ? `${Nickname}` : `${Name}`;
    // Remove brackets and parentheses and some punctuation.
    name = name.replace(/\]|\[|\)|\(|\,|\'/g, '_');
    // Sanitize filename.
    name = filenamify_1.default(name, { replacement: '_' });
    // Normalize spaces and periods.
    name = name.trim();
    name = name.replace(/\s/g, '_');
    name = name.replace(/_+/g, '_');
    name = name.replace(/\.+/g, '.');
    // Remove trailing and leading underscores.
    name = name.replace(/(^[_]+)|([_]+$.])/g, '');
    // Add a unique GUID and/or CardID.
    if (object.GUID) {
        name = `${name}.${object.GUID}`;
    }
    if (object.CardID || object.CardID === 0) {
        name = `${name}.${object.CardID}`;
    }
    // Remove trailing and leading periods.
    name = name.replace(/(^[.]+)|([.]+$.])/g, '');
    return name;
}
exports.nameObject = nameObject;
function splitStates(states, split, name = nameObject) {
    const result = {};
    for (const state in states) {
        result[state] = {
            contents: split(states[state], name),
            filePath: `${name(states[state])}.json`,
        };
    }
    return result;
}
function splitLua(input, name) {
    return {
        contents: input.LuaScript || '',
        filePath: `${name}.lua`,
    };
}
function splitXml(input, name) {
    return {
        contents: input.XmlUI || '',
        filePath: `${name}.xml`,
    };
}
/**
 * Returns the provided @param object split into a tree of @returns {SplitObjectState}.
 */
function splitObject(object, name = nameObject) {
    var _a;
    const objectName = name(object);
    const result = {
        metadata: {
            contents: copyObjectWithoutDuplicateNodes(object, objectName),
            filePath: `${objectName}.json`,
        },
        states: splitStates(object.States || {}, splitObject, name),
    };
    if (object.ContainedObjects) {
        result.children = (_a = object.ContainedObjects) === null || _a === void 0 ? void 0 : _a.map((o) => {
            return {
                filePath: `${name(o)}.json`,
                contents: splitObject(o),
            };
        });
    }
    if (object.LuaScript) {
        result.luaScript = splitLua(object, objectName);
    }
    if (object.XmlUI) {
        result.xmlUi = splitXml(object, objectName);
    }
    return result;
}
exports.splitObject = splitObject;
/**
 * Returns the provided @param save split into a tree of @returns {SplitSaveState}.
 */
function splitSave(save, name = nameObject) {
    const result = {
        metadata: {
            contents: copySaveWithoutDuplicateNodes(save, save.SaveName),
            filePath: `${save.SaveName}.json`,
        },
        children: save.ObjectStates.map((o) => {
            return {
                filePath: `${name(o)}.json`,
                contents: splitObject(o),
            };
        }),
    };
    if (save.LuaScript) {
        result.luaScript = splitLua(save, save.SaveName);
    }
    if (save.XmlUI) {
        result.xmlUi = splitXml(save, save.SaveName);
    }
    return result;
}
exports.splitSave = splitSave;
const matchUrls = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
/**
 * Rewrites all URLs in the provided @param input.
 */
function rewriteUrlStrings(input, options) {
    if (!options) {
        return input;
    }
    return input.replace(matchUrls, (subString) => {
        if (options.ban && subString.match(subString)) {
            throw new Error(`Unsupported URL: "${subString}" (Matched "${options.ban}")`);
        }
        if (options.from && options.to) {
            return subString.replace(options.from, options.to);
        }
        return subString;
    });
}
exports.rewriteUrlStrings = rewriteUrlStrings;
/**
 * Handles reading/wrting split states to disk or other locations.
 */
class SplitIO {
    constructor(options) {
        this.options = options;
        this.readFile = fs.readFile;
        this.writeFile = fs.writeFile;
        this.mkdirp = fs.mkdirp;
    }
    rewriteFromSource(input) {
        if (this.options) {
            return rewriteUrlStrings(input, {
                ban: this.options.ban,
                from: this.options.from,
                to: this.options.to,
            });
        }
        return input;
    }
    rewriteFromBuild(input) {
        if (this.options) {
            return rewriteUrlStrings(input, {
                to: this.options.from,
                from: this.options.to,
            });
        }
        return input;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readJson(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.readFile(file, 'utf-8'));
        });
    }
    writeJson(file, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.writeFile(file, JSON.stringify(content, undefined, '  '), 'utf-8');
        });
    }
    /**
     * Reads a @type {SaveState} and returns it as a @type {SplitSaveState}.
     *
     * @see writeSplit
     */
    readSaveAndSplit(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawJson = this.rewriteFromBuild(yield this.readFile(file, 'utf-8'));
            return splitSave(JSON.parse(rawJson));
        });
    }
    /**
     * Writes a @type {SplitSaveState} to disk as a tree of files.
     */
    writeSplit(to, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.writeSplitSave(to, data);
        });
    }
    toEncodedSave(data) {
        var _a;
        return {
            Save: data.metadata.contents,
            ObjectPaths: ((_a = data.children) === null || _a === void 0 ? void 0 : _a.map((c) => c.filePath)) || [],
        };
    }
    toEncodedObject(data) {
        const StatePaths = {};
        for (const k in data.states) {
            StatePaths[k] = data.states[k].filePath;
        }
        const result = {
            Object: data.metadata.contents,
            StatesPaths: StatePaths,
        };
        if (data.children) {
            result.ContainedObjectPaths = data.children.map((c) => c.filePath);
        }
        return result;
    }
    writeSplitSave(to, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const outJson = path_1.default.join(to, data.metadata.filePath);
            yield this.writeJson(outJson, this.toEncodedSave(data));
            if (data.luaScript) {
                const outLua = path_1.default.join(to, data.luaScript.filePath);
                yield this.writeFile(outLua, data.luaScript.contents, 'utf-8');
            }
            if (data.xmlUi) {
                const outLua = path_1.default.join(to, data.xmlUi.filePath);
                yield this.writeFile(outLua, data.xmlUi.contents, 'utf-8');
            }
            if (data.children && data.children.length) {
                const outChild = path_1.default.join(to, data.metadata.filePath.split('.')[0]);
                yield this.mkdirp(outChild);
                yield Promise.all(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                data.children.map((c) => this.writeSplitObject(outChild, c.contents)));
            }
            return outJson;
        });
    }
    writeSplitObject(to, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const outJson = path_1.default.join(to, data.metadata.filePath);
            yield this.writeJson(outJson, this.toEncodedObject(data));
            if (data.luaScript) {
                const outLua = path_1.default.join(to, data.luaScript.filePath);
                yield this.writeFile(outLua, data.luaScript.contents, 'utf-8');
            }
            if (data.xmlUi) {
                const outLua = path_1.default.join(to, data.xmlUi.filePath);
                yield this.writeFile(outLua, data.xmlUi.contents, 'utf-8');
            }
            if (data.children && data.children.length) {
                const outChild = path_1.default.join(to, data.metadata.filePath.split('.')[0]);
                yield this.mkdirp(outChild);
                yield Promise.all(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                data.children.map((c) => this.writeSplitObject(outChild, c.contents)));
            }
            if (data.states && Object.keys(data.states).length) {
                const outStates = path_1.default.join(to, `${data.metadata.filePath.split('.')[0]}.States`);
                yield this.mkdirp(outStates);
                yield Promise.all(Object.entries(data.states).map((c) => 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.writeSplitObject(outStates, c[1].contents)));
            }
        });
    }
    /**
     * Reads a directory structure representing a @type {SplitSaveState}.
     */
    readAndCollapse(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collapseSave(yield this.readExtractedSave(file));
        });
    }
    collapseSave(save) {
        var _a, _b, _c;
        return Object.assign(Object.assign({}, save.metadata.contents), { LuaScript: ((_a = save.luaScript) === null || _a === void 0 ? void 0 : _a.contents) || '', XmlUI: ((_b = save.xmlUi) === null || _b === void 0 ? void 0 : _b.contents) || '', ObjectStates: ((_c = save.children) === null || _c === void 0 ? void 0 : _c.map((c) => this.collapseObject(c.contents))) || [] });
    }
    collapseObject(object) {
        var _a, _b;
        const result = Object.assign(Object.assign({}, object.metadata.contents), { LuaScript: ((_a = object.luaScript) === null || _a === void 0 ? void 0 : _a.contents) || '', XmlUI: ((_b = object.xmlUi) === null || _b === void 0 ? void 0 : _b.contents) || '' });
        if (object.children) {
            result.ContainedObjects = object.children.map((c) => this.collapseObject(c.contents));
        }
        if (Object.keys(object.states).length) {
            const states = {};
            for (const k in object.states) {
                states[k] = this.collapseObject(object.states[k].contents);
            }
            result.States = states;
        }
        return result;
    }
    readIncludes(dirName, luaOrXml) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!luaOrXml) {
                return undefined;
            }
            if (!luaOrXml.startsWith('#include')) {
                throw `Unexpected: ${luaOrXml}`;
            }
            const relativeFile = luaOrXml.split('#include')[1].trim();
            const contents = this.rewriteFromSource(yield this.readFile(path_1.default.join(dirName, relativeFile), 'utf-8'));
            return {
                filePath: relativeFile,
                contents,
            };
        });
    }
    readExtractedSave(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawJson = this.rewriteFromSource(yield this.readFile(file, 'utf-8'));
            const entry = JSON.parse(rawJson);
            const result = {
                metadata: {
                    contents: entry.Save,
                    filePath: path_1.default.basename(file),
                },
                luaScript: yield this.readIncludes(path_1.default.dirname(file), entry.Save.LuaScript),
                xmlUi: yield this.readIncludes(path_1.default.dirname(file), entry.Save.XmlUI),
            };
            if (entry.ObjectPaths) {
                result.children = yield Promise.all(entry.ObjectPaths.map((relative) => __awaiter(this, void 0, void 0, function* () {
                    const target = path_1.default.join(path_1.default.dirname(file), path_1.default.basename(file).split('.')[0], relative);
                    return {
                        filePath: path_1.default.basename(target),
                        contents: yield this.readExtractedObject(target),
                    };
                })));
            }
            return result;
        });
    }
    readExtractedObject(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = (yield this.readJson(file));
            const states = {};
            for (const k in entry.StatesPaths) {
                const target = path_1.default.join(path_1.default.dirname(file), path_1.default.basename(file).split('.')[0] + '.States', entry.StatesPaths[k]);
                states[k] = {
                    filePath: path_1.default.basename(target),
                    contents: yield this.readExtractedObject(target),
                };
            }
            const result = {
                metadata: {
                    contents: entry.Object,
                    filePath: path_1.default.basename(file),
                },
                states,
                luaScript: yield this.readIncludes(path_1.default.dirname(file), entry.Object.LuaScript),
                xmlUi: yield this.readIncludes(path_1.default.dirname(file), entry.Object.XmlUI),
            };
            if (entry.ContainedObjectPaths) {
                result.children = yield Promise.all(entry.ContainedObjectPaths.map((relative) => __awaiter(this, void 0, void 0, function* () {
                    const target = path_1.default.join(path_1.default.dirname(file), path_1.default.basename(file).split('.')[0], relative);
                    return {
                        filePath: path_1.default.basename(target),
                        contents: yield this.readExtractedObject(target),
                    };
                })));
            }
            return result;
        });
    }
}
exports.SplitIO = SplitIO;
