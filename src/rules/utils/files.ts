import path from 'path'

export const checkAbsolutePath = (args: {
    alias: string
    path: string
}) => {
    const { alias, path } = args

    return path.startsWith(alias)
}

export const checkRelativePath = (args: {
    path: string
}) => {
    const { path } = args

    return path.startsWith('.')
}

export const normalizeFilePathFromImport = (args: {
    importPath?: string
    alias: string
    currentFilePath: string
}) => {
    const { importPath, currentFilePath, alias } = args

    if (!importPath) return null

    if (checkAbsolutePath({ path: importPath, alias })) {
        return importPath.slice(alias.length + 1);
    }

    if (checkRelativePath({ path: importPath })) {
        return path.resolve(path.dirname(currentFilePath), importPath);
    }

    return null
}