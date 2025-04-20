export declare const createAllowedFoldersMap: (imports: {
    checkingImport: string;
    allowedFolders: string[];
}[]) => Map<string, Set<string>>;
export declare const getAllowedFolderInfo: (args: {
    filename: string;
    allowedFoldersMap: Map<string, Set<string>>;
}) => {
    allowedImportsSet: Set<string>;
};
