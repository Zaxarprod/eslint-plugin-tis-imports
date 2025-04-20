export type RestrictImportConfig = {
    checkingImport: string;
    allowedFolders: string[];
};
export type RestrictImportsOptions = {
    imports?: RestrictImportConfig[];
    alias?: string;
};
export type CachedRestrictImportsOptions = {
    imports: RestrictImportConfig[];
    alias: string;
    checkingImports: string[];
    allowedFoldersMap: Map<string, Set<string>>;
};
export type RestrictImportsError = 'forbiddenImport';
