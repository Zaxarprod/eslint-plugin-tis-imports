export type EnforceEntityHierarchyOptions = {
    alias?: string;
    checkingLayers?: string[];
    hierarchy?: string[];
};
export type CachedEnforceEntityHierarchyOptions = {
    alias: string;
    checkingLayers: string[];
    hierarchy: string[];
    layersSet: Set<string>;
    hierarchySet: Set<string>;
    entityOrderMap: Map<string, number>;
};
export type EntityHierarchyError = 'wrongEntityDirection';
