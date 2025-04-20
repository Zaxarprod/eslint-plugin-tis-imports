"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayer = exports.createLayersOrderMap = void 0;
const createLayersOrderMap = (layers) => {
    const layersOrderMap = new Map();
    layers.forEach((layer, index) => {
        layersOrderMap.set(layer, index);
    });
    return layersOrderMap;
};
exports.createLayersOrderMap = createLayersOrderMap;
const getLayer = (args) => {
    const { filePath, layersSet } = args;
    if (!filePath)
        return null;
    const normalized = filePath.replace(/\\/g, '/');
    const layer = normalized.split('/').find((item) => layersSet.has(item));
    return layer ?? null;
};
exports.getLayer = getLayer;
