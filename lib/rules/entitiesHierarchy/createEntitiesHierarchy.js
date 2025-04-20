"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnforceEntityHierarchyRule = exports.DEFAULT_ALIAS = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const layers_1 = require("../utils/layers");
exports.DEFAULT_ALIAS = '~';
const getResultOptions = (0, utils_1.createCachedOptions)((options) => {
    const checkingLayers = options.checkingLayers ?? [];
    const hierarchy = options.hierarchy ?? [];
    const alias = options.alias ?? exports.DEFAULT_ALIAS;
    return ({
        ...options,
        checkingLayers,
        alias,
        hierarchy,
        hierarchySet: new Set(hierarchy),
        layersSet: new Set(checkingLayers),
        entityOrderMap: (0, utils_1.createEntityOrderMap)(hierarchy),
    });
});
const createEnforceEntityHierarchyRule = (args) => {
    const { options, filename, report } = args;
    const resultOptions = getResultOptions(options);
    const { layersSet, entityOrderMap, hierarchySet, alias } = resultOptions;
    const relativeCurrentFilePath = path_1.default.relative(process.cwd(), filename);
    const currentLayer = (0, layers_1.getLayer)({ filePath: relativeCurrentFilePath, layersSet });
    const currentEntity = (0, utils_1.getEntityName)(relativeCurrentFilePath, hierarchySet);
    return {
        ImportDeclaration(node) {
            const importPath = node.source.value;
            if (typeof importPath !== 'string')
                return;
            const resolvedImportPath = (0, utils_1.normalizeFilePathFromImport)({
                importPath,
                alias,
                currentFilePath: filename,
            });
            const relativeImportFilePath = typeof resolvedImportPath === 'string' ? path_1.default.relative(process.cwd(), resolvedImportPath) : null;
            const importLayer = (0, layers_1.getLayer)({ filePath: relativeImportFilePath, layersSet });
            if (!relativeImportFilePath || !importLayer || !currentLayer || currentLayer !== importLayer)
                return;
            const importedEntity = (0, utils_1.getEntityName)(relativeImportFilePath, hierarchySet);
            if (!currentEntity || !importedEntity || currentEntity === importedEntity)
                return;
            const currentIndex = entityOrderMap.get(currentEntity);
            const importedIndex = entityOrderMap.get(importedEntity);
            if (currentIndex === undefined || importedIndex === undefined)
                return;
            if (importedIndex < currentIndex) {
                report({
                    node,
                    messageId: 'wrongEntityDirection',
                    data: {
                        currentEntity,
                        importingEntity: importedEntity,
                    },
                });
            }
        },
    };
};
exports.createEnforceEntityHierarchyRule = createEnforceEntityHierarchyRule;
