"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitIO = exports.rewriteUrlStrings = exports.splitSave = exports.splitObject = exports.reduceLuaIncludes = exports.nameObject = void 0;
const eol_1 = __importDefault(require("eol"));
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
    if (copy.LuaScriptState) {
        copy.LuaScriptState = `#include ./${name}.state.json`;
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
const matchIncludeLine = /(\#include\s+\!\/(.*)|require\s*\(\s*\'\!\/(.*)\'\)|require\s*\(\s*\"\!\/(.*)\"\))/;
const matchIncludedLua = /\-{4}\#include\s+(.*)/;
const matchIncludedXml = /\<\!\-{2}\s*\#include\s+(.*)/;
/**
 * @internal For testing only.
 */
function reduceLuaIncludes(lines) {
    const output = [];
    let inStatement;
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const match = line.match(matchIncludedLua) || line.match(matchIncludedXml);
        if (match) {
            if (inStatement && match[1] !== inStatement) {
                // Found another (non-matching) #include.
                i++;
                continue;
            }
            else if (inStatement && match[1] === inStatement) {
                i++;
                inStatement = undefined;
                continue;
            }
            else if (!inStatement) {
                inStatement = match[1];
                const isXml = line.indexOf('<!--') !== -1;
                if (isXml) {
                    output.push(`<!--#include ${inStatement.split('-->')[0].trim()}-->`);
                }
                else {
                    output.push(`require('${inStatement}')`);
                }
            }
        }
        else if (!inStatement) {
            output.push(line);
        }
        i++;
    }
    return output.join('\n');
}
exports.reduceLuaIncludes = reduceLuaIncludes;
function insertLuaIncludes(lines, includesDir, readString) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = [];
        for (const line of lines) {
            const match = line.match(matchIncludeLine);
            if (match) {
                const isXml = line.indexOf('<!--') !== -1;
                let url = match[3] || match[2];
                if (isXml) {
                    url = url.split('-->')[0].trim();
                    output.push(`<!-- #include !/${url} -->`);
                    const content = yield readString(path_1.default.join(includesDir, `${url}.xml`));
                    output.push(content);
                    output.push(`<!-- #include !/${url} -->`);
                }
                else {
                    output.push(`----#include !/${url}`);
                    const content = yield readString(path_1.default.join(includesDir, `${url}.ttslua`));
                    output.push(content);
                    output.push(`----#include !/${url}`);
                }
            }
            else {
                output.push(line);
            }
        }
        return output.join('\n');
    });
}
function splitLua(input, name) {
    let lua = input.LuaScript || '';
    if (lua.length > 0) {
        lua = reduceLuaIncludes(lua.split('\n'));
    }
    return {
        contents: lua,
        filePath: `${name}.lua`,
    };
}
function splitLuaState(input, name) {
    const contents = input.LuaScriptState || '';
    return {
        contents,
        filePath: `${name}.state.json`,
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
    if (object.LuaScriptState) {
        result.luaScriptState = splitLuaState(object, objectName);
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
    if (save.LuaScriptState) {
        result.luaScriptState = splitLuaState(save, save.SaveName);
    }
    if (save.XmlUI) {
        result.xmlUi = splitXml(save, save.SaveName);
    }
    return result;
}
exports.splitSave = splitSave;
const matchUrls = /[a-z]+:\/\/[\S].+?(?=[\'|\"|\s])/gi;
/**
 * Rewrites all URLs in the provided @param input.
 */
function rewriteUrlStrings(input, options) {
    if (!options) {
        return input;
    }
    return input.replace(matchUrls, (subString, offset) => {
        if (options.ban) {
            let allow = true;
            if (typeof options.ban == 'function') {
                allow = options.ban(subString);
            }
            else {
                allow = subString.match(options.ban) === null;
            }
            if (!allow) {
                let message = `Unsupported URL: "${subString}"`;
                if (options.fileName) {
                    message = `${message} in ${options.fileName}:${offset}`;
                }
                else {
                    message = `${message} in ${input.length} characters:${offset}`;
                }
                throw new Error(message);
            }
        }
        if (options.from && options.to) {
            return subString.replace(options.from, options.to);
        }
        return subString;
    });
}
exports.rewriteUrlStrings = rewriteUrlStrings;
/**
 * Handles reading/writing split states to disk or other locations.
 */
class SplitIO {
    constructor(options) {
        this.options = options;
        this.readFile = fs.readFile;
        this.writeFile = fs.writeFile;
        this.mkdirp = fs.mkdirp;
    }
    writeString(file, content) {
        var _a;
        let normalized = content;
        if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.normalizeNewLines) !== false) {
            normalized = eol_1.default.lf(normalized);
            if (!normalized.endsWith('\n')) {
                normalized = `${normalized}\n`;
            }
        }
        return this.writeFile(file, normalized, 'utf-8');
    }
    rewriteFromSource(input, fileName) {
        if (this.options) {
            return rewriteUrlStrings(input, {
                ban: this.options.ban,
                from: this.options.from,
                to: this.options.to,
                fileName: fileName,
            });
        }
        return input;
    }
    rewriteFromBuild(input, fileName) {
        if (this.options) {
            return rewriteUrlStrings(input, {
                to: this.options.from,
                from: this.options.to,
                fileName: fileName,
            });
        }
        return input;
    }
    writeJson(file, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.writeString(file, JSON.stringify(content, undefined, '  '));
        });
    }
    /**
     * Reads a @type {SaveState} and returns it as a @type {SplitSaveState}.
     *
     * @see writeSplit
     */
    readSaveAndSplit(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawJson = this.rewriteFromBuild(yield this.readFile(file, 'utf-8'), file);
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
                yield this.writeString(outLua, data.luaScript.contents);
            }
            if (data.luaScriptState) {
                const outJson = path_1.default.join(to, data.luaScriptState.filePath);
                yield this.writeString(outJson, data.luaScriptState.contents);
            }
            if (data.xmlUi) {
                const outLua = path_1.default.join(to, data.xmlUi.filePath);
                yield this.writeString(outLua, data.xmlUi.contents);
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
                yield this.writeString(outLua, data.luaScript.contents);
            }
            if (data.luaScriptState) {
                const outLua = path_1.default.join(to, data.luaScriptState.filePath);
                yield this.writeString(outLua, data.luaScriptState.contents);
            }
            if (data.xmlUi) {
                const outLua = path_1.default.join(to, data.xmlUi.filePath);
                yield this.writeString(outLua, data.xmlUi.contents);
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
        var _a, _b, _c, _d;
        return Object.assign(Object.assign({}, save.metadata.contents), { LuaScript: ((_a = save.luaScript) === null || _a === void 0 ? void 0 : _a.contents) || '', LuaScriptState: ((_b = save.luaScriptState) === null || _b === void 0 ? void 0 : _b.contents) || '', XmlUI: ((_c = save.xmlUi) === null || _c === void 0 ? void 0 : _c.contents) || '', ObjectStates: ((_d = save.children) === null || _d === void 0 ? void 0 : _d.map((c) => this.collapseObject(c.contents))) || [] });
    }
    collapseObject(object) {
        var _a, _b, _c;
        const result = Object.assign(Object.assign({}, object.metadata.contents), { LuaScript: ((_a = object.luaScript) === null || _a === void 0 ? void 0 : _a.contents) || '', LuaScriptState: ((_b = object.luaScriptState) === null || _b === void 0 ? void 0 : _b.contents) || '', XmlUI: ((_c = object.xmlUi) === null || _c === void 0 ? void 0 : _c.contents) || '' });
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
    readIncludes(dirName, includes, luaOrXml) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!luaOrXml) {
                return undefined;
            }
            if (!luaOrXml.startsWith('#include')) {
                throw `Unexpected: ${luaOrXml}`;
            }
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const _this = this;
            function recursiveReadAndInclude(fileName) {
                return __awaiter(this, void 0, void 0, function* () {
                    const raw = yield _this.readFile(fileName, 'utf-8');
                    if (raw.indexOf('#include !/') !== -1 || raw.indexOf('require(') !== -1) {
                        return yield insertLuaIncludes(raw.split('\n'), includes, recursiveReadAndInclude);
                    }
                    else {
                        return raw;
                    }
                });
            }
            const relativeFile = luaOrXml.split('#include')[1].trim();
            const filePath = path_1.default.join(dirName, relativeFile);
            let contents = yield recursiveReadAndInclude(filePath);
            contents = this.rewriteFromSource(contents, filePath);
            return {
                filePath: relativeFile,
                contents,
            };
        });
    }
    readExtractedSave(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawJson = this.rewriteFromSource(yield this.readFile(file, 'utf-8'), file);
            const includesDir = path_1.default.join(path_1.default.dirname(file), 'includes');
            const entry = JSON.parse(rawJson);
            const result = {
                metadata: {
                    contents: entry.Save,
                    filePath: path_1.default.basename(file),
                },
                luaScript: yield this.readIncludes(path_1.default.dirname(file), includesDir, entry.Save.LuaScript),
                luaScriptState: yield this.readIncludes(path_1.default.dirname(file), includesDir, entry.Save.LuaScriptState),
                xmlUi: yield this.readIncludes(path_1.default.dirname(file), includesDir, entry.Save.XmlUI),
            };
            if (entry.ObjectPaths) {
                result.children = yield Promise.all(entry.ObjectPaths.map((relative) => __awaiter(this, void 0, void 0, function* () {
                    const target = path_1.default.join(path_1.default.dirname(file), path_1.default.basename(file).split('.')[0], relative);
                    return {
                        filePath: path_1.default.basename(target),
                        contents: yield this.readExtractedObject(target, includesDir),
                    };
                })));
            }
            return result;
        });
    }
    readExtractedObject(file, includesDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawJson = this.rewriteFromSource(yield this.readFile(file, 'utf-8'));
            const entry = JSON.parse(rawJson);
            const states = {};
            for (const k in entry.StatesPaths) {
                const target = path_1.default.join(path_1.default.dirname(file), path_1.default.basename(file).split('.')[0] + '.States', entry.StatesPaths[k]);
                states[k] = {
                    filePath: path_1.default.basename(target),
                    contents: yield this.readExtractedObject(target, includesDir),
                };
            }
            const result = {
                metadata: {
                    contents: entry.Object,
                    filePath: path_1.default.basename(file),
                },
                states,
                luaScript: yield this.readIncludes(path_1.default.dirname(file), includesDir, entry.Object.LuaScript),
                luaScriptState: yield this.readIncludes(path_1.default.dirname(file), includesDir, entry.Object.LuaScriptState),
                xmlUi: yield this.readIncludes(path_1.default.dirname(file), includesDir, entry.Object.XmlUI),
            };
            if (entry.ContainedObjectPaths) {
                result.children = yield Promise.all(entry.ContainedObjectPaths.map((relative) => __awaiter(this, void 0, void 0, function* () {
                    const target = path_1.default.join(path_1.default.dirname(file), path_1.default.basename(file).split('.')[0], relative);
                    return {
                        filePath: path_1.default.basename(target),
                        contents: yield this.readExtractedObject(target, includesDir),
                    };
                })));
            }
            return result;
        });
    }
}
exports.SplitIO = SplitIO;
