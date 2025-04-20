export type LayerImportsRuleOptions = {
    alias?: string
    layers?: string[]
    publicApiEnabled?: boolean
    notStrictLayers?: string[]
}

export type CachedLayerImportsRuleOptions = {
    alias: string
    layers: string[]
    publicApiEnabled: boolean
    layersSet: Set<string>
    layersOrderMap: Map<string, number>
    notStrictLayers?: string[]
    notStrictLayersSet?: Set<string>
}

export type LayerImportError = 'sameLayerAlias' | 'wrongDirection' | 'publicApiError'