import path from 'path';
import { ImportDeclaration } from 'estree';
import {
    createCachedOptions,
    createEntityOrderMap,
    getEntityName,
    normalizeFilePathFromImport,
} from '../utils';
import {
    CachedEnforceEntityHierarchyOptions,
    EnforceEntityHierarchyOptions,
} from './types';
import { getLayer } from '../utils/layers';

export const DEFAULT_ALIAS = '~';

const getResultOptions = createCachedOptions((options: EnforceEntityHierarchyOptions): CachedEnforceEntityHierarchyOptions => {
    const checkingLayers = options.checkingLayers ?? []
    const hierarchy = options.hierarchy ?? []
    const alias = options.alias ?? DEFAULT_ALIAS

    return ({
        ...options,
        checkingLayers,
        alias,
        hierarchy,
        hierarchySet: new Set(hierarchy),
        layersSet: new Set(checkingLayers),
        entityOrderMap: createEntityOrderMap(hierarchy),
    })
})

export const createEnforceEntityHierarchyRule = (args: {
    options: EnforceEntityHierarchyOptions;
    filename: string;
    report: (args: { messageId: 'wrongEntityDirection'; node: ImportDeclaration } & Record<string, any>) => void;
}) => {
    const { options, filename, report } = args

    const resultOptions = getResultOptions(options)

    const { layersSet, entityOrderMap, hierarchySet, alias } = resultOptions

    const relativeCurrentFilePath = path.relative(process.cwd(), filename)
    const currentLayer = getLayer({ filePath: relativeCurrentFilePath, layersSet })
    const currentEntity = getEntityName(relativeCurrentFilePath, hierarchySet)

    return {
        ImportDeclaration(node: ImportDeclaration) {
            const importPath = node.source.value;
            if (typeof importPath !== 'string') return;

            const resolvedImportPath = normalizeFilePathFromImport({
                importPath,
                alias,
                currentFilePath: filename,
            });

            const relativeImportFilePath = typeof resolvedImportPath === 'string' ? path.relative(process.cwd(), resolvedImportPath) : null;

            const importLayer = getLayer({ filePath: relativeImportFilePath, layersSet });

            if (!relativeImportFilePath || !importLayer || !currentLayer || currentLayer !== importLayer) return

            const importedEntity = getEntityName(relativeImportFilePath, hierarchySet);

            if (!currentEntity || !importedEntity || currentEntity === importedEntity) return;

            const currentIndex = entityOrderMap.get(currentEntity);
            const importedIndex = entityOrderMap.get(importedEntity);

            if (currentIndex === undefined || importedIndex === undefined) return;

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
