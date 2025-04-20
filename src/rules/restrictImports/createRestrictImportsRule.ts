import path from 'path'
import { ImportDeclaration } from "estree";

import { RestrictImportsOptions, RestrictImportsError, CachedRestrictImportsOptions } from "./types";
import { createAllowedFoldersMap, createCachedOptions, getAllowedFolderInfo, normalizeFilePathFromImport } from "../utils";

export const DEFAULT_ALIAS = '~'

const getCachedOptions = createCachedOptions((options: RestrictImportsOptions): CachedRestrictImportsOptions => {
    const imports = options.imports ?? []
    const allowedFoldersMap = createAllowedFoldersMap(imports)

    return ({
        ...options,
        alias: options.alias ?? DEFAULT_ALIAS,
        checkingImports: imports.map((item) => item.checkingImport),
        imports,
        allowedFoldersMap,
    })
})

export const createRestrictImportsRule = (args: {
    report: (args: { messageId: RestrictImportsError, node: ImportDeclaration } & Record<string, any>) => void
    filename: string
    options: RestrictImportsOptions
}) => {
    const { options, filename, report } = args

    const resultOptions = getCachedOptions(options)

    const { checkingImports, allowedFoldersMap, alias } = resultOptions

    const currentFilePath = filename
    const absolutePath = path.resolve(process.cwd(), currentFilePath)

    const { allowedImportsSet } = getAllowedFolderInfo({ filename: absolutePath, allowedFoldersMap })

    return {
        ImportDeclaration(node: ImportDeclaration) {
            // Get all paths
            const importPath = node.source.value;

            if (typeof importPath !== 'string') return

            const absoluteImportPath = normalizeFilePathFromImport({
                alias,
                currentFilePath,
                importPath,
            })

            if (!absoluteImportPath) return

            const checkingImport = checkingImports.find((item) => absoluteImportPath.includes(item))

            if (!checkingImport) return

            if (!allowedImportsSet.has(checkingImport)) {
                report({
                    node,
                    messageId: 'forbiddenImport',
                    data: { checkingImport, importingFile: absolutePath },
                });
            }
        },
    };
}