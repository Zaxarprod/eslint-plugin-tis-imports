export const createEntityOrderMap = (hierarchy: string[]) => {
    const map = new Map<string, number>();

    hierarchy.forEach((entity, index) => {
        map.set(entity, index);
    });

    return map;
};

export const getEntityName = (normalizedPath: string, entitiesSet: Set<string>): string | null => {
    const normalized = normalizedPath.replace(/\\/g, '/')

    const entity = normalized.split('/').find((item) => entitiesSet.has(item))

    return entity ?? null
};