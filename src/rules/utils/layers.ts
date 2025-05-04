export const createLayersOrderMap = (layers: string[]) => {
    const layersOrderMap = new Map<string, number>()

    layers.forEach((layer, index) => {
        layersOrderMap.set(layer, index)
    })

    return layersOrderMap
}

export const getLayer = (args: {
    filePath?: string | null,
    layersSet: Set<string>
}): string | null => {
    const { filePath, layersSet } = args

    if (!filePath) return null

    const normalized = filePath.replace(/\\/g, '/')

    const layer = normalized.split('/').find((item) => layersSet.has(item))

    return layer ?? null
}

export const getSubfolderAfterLayer = (absolutePath: string, layer: string): string | null => {
    const normalized = absolutePath.replace(/\\/g, '/');
    const parts = normalized.split(`${layer}/`);
    if (parts.length < 2) return null;
  
    const rest = parts[1].split('/');
    return rest[0] ?? null;
}