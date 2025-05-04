export type LayerImportsRuleOptions = {
    alias?: string
    layers?: string[]
    publicApiEnabled?: boolean
    notStrictLayers?: string[]
    publicApiExcludeLayers?: string[]
    checkRelativePathLayers?: string[]
}

export type CachedLayerImportsRuleOptions = {
    alias: string
    layers: string[]
    publicApiEnabled: boolean
    layersSet: Set<string>
    layersOrderMap: Map<string, number>
    notStrictLayers?: string[]
    notStrictLayersSet?: Set<string>
    publicApiExcludeLayers?: string[]
    publicApiExcludeLayersSet?: Set<string>
    checkRelativePathLayers?: string[]
    checkRelativePathLayersSet?: Set<string>
}

export type LayerImportError = 'sameLayerAlias' | 'wrongDirection' | 'publicApiError'