"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowedFolderInfo = exports.createAllowedFoldersMap = void 0;
const createAllowedFoldersMap = (imports) => {
    const allowedFoldersMap = new Map();
    imports.forEach((importItem) => {
        importItem.allowedFolders.forEach((folder) => {
            const oldFolder = allowedFoldersMap.get(folder);
            if (oldFolder) {
                oldFolder.add(importItem.checkingImport);
            }
            else {
                allowedFoldersMap.set(folder, new Set([importItem.checkingImport]));
            }
        });
    });
    return allowedFoldersMap;
};
exports.createAllowedFoldersMap = createAllowedFoldersMap;
const getAllowedFolderInfo = (args) => {
    const { filename, allowedFoldersMap } = args;
    const entries = Array.from(allowedFoldersMap.entries());
    let allowedImports = [];
    for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        const include = filename.includes(key);
        if (include) {
            allowedImports = [...allowedImports, ...Array.from(value)];
        }
    }
    return {
        allowedImportsSet: new Set(allowedImports),
    };
};
exports.getAllowedFolderInfo = getAllowedFolderInfo;
