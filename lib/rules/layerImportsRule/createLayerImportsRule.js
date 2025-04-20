"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLayerImportsRule = exports.DEFAULT_ALIAS = exports.DEFAULT_LAYERS = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
exports.DEFAULT_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
exports.DEFAULT_ALIAS = '~';
const getCachedOptions = (0, utils_1.createCachedOptions)((options) => {
    const layers = options.layers ?? exports.DEFAULT_LAYERS;
    const alias = options.alias ?? exports.DEFAULT_ALIAS;
    return ({
        ...options,
        layers,
        alias,
        publicApiEnabled: options.publicApiEnabled ?? false,
        layersSet: new Set(layers),
        layersOrderMap: (0, utils_1.createLayersOrderMap)(layers),
        notStrictLayersSet: options.notStrictLayers ? new Set(options.notStrictLayers) : undefined,
    });
});
const createLayerImportsRule = (args) => {
    const { options, filename, report } = args;
    const resultOptions = getCachedOptions(options);
    const { alias, layersSet, notStrictLayersSet, layersOrderMap, publicApiEnabled } = resultOptions;
    const currentFilePath = filename;
    const relativePath = path_1.default.relative(process.cwd(), currentFilePath);
    // Layer by currentFile
    const currentLayer = (0, utils_1.getLayer)({
        filePath: relativePath,
        layersSet,
    });
    return {
        ImportDeclaration(node) {
            // Get all paths
            const importPath = node.source.value;
            const resolvedImportPath = (0, utils_1.normalizeFilePathFromImport)({ importPath: typeof importPath === 'string' ? importPath : undefined, alias, currentFilePath });
            // Layer by currentImport
            const importLayer = (0, utils_1.getLayer)({
                filePath: resolvedImportPath,
                layersSet,
            });
            if (!currentLayer || !importLayer || typeof importPath !== 'string' || !resolvedImportPath)
                return;
            const currentLayerOrder = layersOrderMap.get(currentLayer) ?? 0;
            const importLayerOrder = layersOrderMap.get(importLayer) ?? 0;
            if (notStrictLayersSet) {
                if (currentLayerOrder === importLayerOrder &&
                    notStrictLayersSet.has(currentLayer) &&
                    !(0, utils_1.checkRelativePath)({ path: importPath })) {
                    report({
                        node,
                        messageId: 'sameLayerAlias',
                        data: { currentLayer },
                    });
                }
            }
            if (importLayerOrder < currentLayerOrder) {
                report({
                    node,
                    messageId: 'wrongDirection',
                    data: { importingLayer: importLayer, currentLayer },
                });
            }
            if (publicApiEnabled && currentLayer !== importLayer) {
                const innerLayerFolders = resolvedImportPath.split(`${importLayer}/`)[1];
                const innerLayerFoldersLength = innerLayerFolders?.split('/').length ?? 0;
                if (innerLayerFoldersLength > 1) {
                    report({
                        node,
                        messageId: 'publicApiError',
                        data: {},
                    });
                }
            }
        },
    };
};
exports.createLayerImportsRule = createLayerImportsRule;
