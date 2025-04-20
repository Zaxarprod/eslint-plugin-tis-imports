"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeFilePathFromImport = exports.checkRelativePath = exports.checkAbsolutePath = void 0;
const path_1 = __importDefault(require("path"));
const checkAbsolutePath = (args) => {
    const { alias, path } = args;
    return path.startsWith(alias);
};
exports.checkAbsolutePath = checkAbsolutePath;
const checkRelativePath = (args) => {
    const { path } = args;
    return path.startsWith('.');
};
exports.checkRelativePath = checkRelativePath;
const normalizeFilePathFromImport = (args) => {
    const { importPath, currentFilePath, alias } = args;
    if (!importPath)
        return null;
    if ((0, exports.checkAbsolutePath)({ path: importPath, alias })) {
        return importPath.slice(alias.length + 1);
    }
    if ((0, exports.checkRelativePath)({ path: importPath })) {
        return path_1.default.resolve(path_1.default.dirname(currentFilePath), importPath);
    }
    return null;
};
exports.normalizeFilePathFromImport = normalizeFilePathFromImport;
