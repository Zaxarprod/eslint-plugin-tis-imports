export declare const createLayersOrderMap: (layers: string[]) => Map<string, number>;
export declare const getLayer: (args: {
    filePath?: string | null;
    layersSet: Set<string>;
}) => string | null;
