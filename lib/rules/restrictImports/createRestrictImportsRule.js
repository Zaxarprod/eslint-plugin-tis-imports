"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestrictImportsRule = exports.DEFAULT_ALIAS = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
exports.DEFAULT_ALIAS = '~';
const getCachedOptions = (0, utils_1.createCachedOptions)((options) => {
    const imports = options.imports ?? [];
    const allowedFoldersMap = (0, utils_1.createAllowedFoldersMap)(imports);
    return ({
        ...options,
        alias: options.alias ?? exports.DEFAULT_ALIAS,
        checkingImports: imports.map((item) => item.checkingImport),
        imports,
        allowedFoldersMap,
    });
});
const createRestrictImportsRule = (args) => {
    const { options, filename, report } = args;
    const resultOptions = getCachedOptions(options);
    const { checkingImports, allowedFoldersMap, alias } = resultOptions;
    const currentFilePath = filename;
    const absolutePath = path_1.default.resolve(process.cwd(), currentFilePath);
    const { allowedImportsSet } = (0, utils_1.getAllowedFolderInfo)({ filename: absolutePath, allowedFoldersMap });
    return {
        ImportDeclaration(node) {
            // Get all paths
            const importPath = node.source.value;
            if (typeof importPath !== 'string')
                return;
            const absoluteImportPath = (0, utils_1.normalizeFilePathFromImport)({
                alias,
                currentFilePath,
                importPath,
            });
            if (!absoluteImportPath)
                return;
            const checkingImport = checkingImports.find((item) => absoluteImportPath.includes(item));
            if (!checkingImport)
                return;
            if (!allowedImportsSet.has(checkingImport)) {
                report({
                    node,
                    messageId: 'forbiddenImport',
                    data: { checkingImport, importingFile: absolutePath },
                });
            }
        },
    };
};
exports.createRestrictImportsRule = createRestrictImportsRule;
