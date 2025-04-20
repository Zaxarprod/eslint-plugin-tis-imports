export declare const checkActualCache: <T>(options: T, lastOptionsRef: T | null) => boolean;
export declare const createCachedOptions: <TRaw, TCached>(compute: (raw: TRaw) => TCached) => (raw: TRaw) => TCached;
