import path from 'path'
import { ImportDeclaration } from "estree";

import { CachedLayerImportsRuleOptions, LayerImportError, LayerImportsRuleOptions } from "./types";
import { checkRelativePath, createCachedOptions, createLayersOrderMap, getLayer, normalizeFilePathFromImport } from "../utils";
import { getSubfolderAfterLayer } from '../utils/layers';


export const DEFAULT_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
export const DEFAULT_ALIAS = '~'

const getCachedOptions = createCachedOptions((options: LayerImportsRuleOptions): CachedLayerImportsRuleOptions => {
    const layers = options.layers ?? DEFAULT_LAYERS
    const alias = options.alias ?? DEFAULT_ALIAS

    return ({
        ...options,
        layers,
        alias,
        publicApiEnabled: options.publicApiEnabled ?? false,
        layersSet: new Set(layers),
        layersOrderMap: createLayersOrderMap(layers),
        notStrictLayersSet: options.notStrictLayers ? new Set(options.notStrictLayers) : undefined,
    })
})

export const createLayerImportsRule = (args: {
    report: (args: { messageId: LayerImportError, node: ImportDeclaration } & Record<string, any>) => void
    filename: string
    options: LayerImportsRuleOptions
}) => {
    const { options, filename, report } = args

    const resultOptions = getCachedOptions(options)

    const { alias, layersSet, notStrictLayersSet, layersOrderMap, publicApiEnabled } = resultOptions

    const currentFilePath = filename
    const relativePath = path.relative(process.cwd(), currentFilePath);

    // Layer by currentFile
    const currentLayer = getLayer({
        filePath: relativePath,
        layersSet,
    });

    const currentSubfolder = currentLayer ? getSubfolderAfterLayer(relativePath, currentLayer) : null

    return {
        ImportDeclaration(node: ImportDeclaration) {
            // Get all paths
            const importPath = node.source.value;

            const resolvedImportPath = normalizeFilePathFromImport({ importPath: typeof importPath === 'string' ? importPath : undefined, alias, currentFilePath })

            // Layer by currentImport
            const importLayer = getLayer({
                filePath: resolvedImportPath,
                layersSet,
            });

            if (!currentLayer || !importLayer || typeof importPath !== 'string' || !resolvedImportPath) return;

            const currentLayerOrder = layersOrderMap.get(currentLayer) ?? 0
            const importLayerOrder = layersOrderMap.get(importLayer) ?? 0

            if (notStrictLayersSet) {
                if (currentLayerOrder === importLayerOrder &&
                    notStrictLayersSet.has(currentLayer) &&
                    !checkRelativePath({ path: importPath })
                ) {
                    report({
                        node,
                        messageId: 'sameLayerAlias',
                        data: { currentLayer },
                    })
                }
            }

            const importSubfolder = getSubfolderAfterLayer(resolvedImportPath, importLayer)

            if (importLayerOrder === currentLayerOrder && !notStrictLayersSet?.has(currentLayer) && currentSubfolder && importSubfolder && currentSubfolder !== importSubfolder) {
                report({
                    node,
                    messageId: 'wrongDirection',
                    data: { importingLayer: importLayer, currentLayer },
                });
            }

            if (importLayerOrder < currentLayerOrder ) {
                report({
                    node,
                    messageId: 'wrongDirection',
                    data: { importingLayer: importLayer, currentLayer },
                });
            }

            if (publicApiEnabled && currentLayer !== importLayer) {
                const innerLayerFolders = resolvedImportPath.split(`${importLayer}/`)[1]

                const innerLayerFoldersLength = innerLayerFolders?.split('/').length ?? 0

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
}