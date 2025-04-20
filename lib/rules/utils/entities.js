"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityName = exports.createEntityOrderMap = void 0;
const createEntityOrderMap = (hierarchy) => {
    const map = new Map();
    hierarchy.forEach((entity, index) => {
        map.set(entity, index);
    });
    return map;
};
exports.createEntityOrderMap = createEntityOrderMap;
const getEntityName = (normalizedPath, entitiesSet) => {
    const normalized = normalizedPath.replace(/\\/g, '/');
    const entity = normalized.split('/').find((item) => entitiesSet.has(item));
    return entity ?? null;
};
exports.getEntityName = getEntityName;
