export declare const checkAbsolutePath: (args: {
    alias: string;
    path: string;
}) => boolean;
export declare const checkRelativePath: (args: {
    path: string;
}) => boolean;
export declare const normalizeFilePathFromImport: (args: {
    importPath?: string;
    alias: string;
    currentFilePath: string;
}) => string | null;
