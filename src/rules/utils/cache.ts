export const checkActualCache = <T>(options: T, lastOptionsRef: T | null) => {
    return options === lastOptionsRef
}

export const createCachedOptions = <TRaw, TCached>(compute: (raw: TRaw) => TCached) => {
    let lastRaw: TRaw | null = null;
    let lastResult: TCached | null = null;

    return (raw: TRaw): TCached => {
        if (checkActualCache(raw, lastRaw) && lastResult !== null) {
            return lastResult;
        }

        lastRaw = raw;
        lastResult = compute(raw);
        return lastResult;
    };
}