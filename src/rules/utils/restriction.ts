export const createAllowedFoldersMap = (imports: { checkingImport: string, allowedFolders: string[] }[]) => {
    const allowedFoldersMap: Map<string, Set<string>> = new Map()

    imports.forEach((importItem) => {
        importItem.allowedFolders.forEach((folder) => {
            const oldFolder = allowedFoldersMap.get(folder)

            if (oldFolder) {
                oldFolder.add(importItem.checkingImport)
            } else {
                allowedFoldersMap.set(folder, new Set([importItem.checkingImport]))
            }
        })
    })

    return allowedFoldersMap
}

export const getAllowedFolderInfo = (args: {
    filename: string
    allowedFoldersMap: Map<string, Set<string>>
}) => {
    const { filename, allowedFoldersMap } = args

    const entries = Array.from(allowedFoldersMap.entries())

    let allowedImports: string[] = []

    for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i]

        const include = filename.includes(key)

        if (include) {
            allowedImports = [...allowedImports, ...Array.from(value)]
        }
    }

    return {
        allowedImportsSet: new Set(allowedImports),
    }
}