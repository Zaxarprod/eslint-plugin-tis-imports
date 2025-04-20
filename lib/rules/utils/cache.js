"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCachedOptions = exports.checkActualCache = void 0;
const checkActualCache = (options, lastOptionsRef) => {
    return options === lastOptionsRef;
};
exports.checkActualCache = checkActualCache;
const createCachedOptions = (compute) => {
    let lastRaw = null;
    let lastResult = null;
    return (raw) => {
        if ((0, exports.checkActualCache)(raw, lastRaw) && lastResult !== null) {
            return lastResult;
        }
        lastRaw = raw;
        lastResult = compute(raw);
        return lastResult;
    };
};
exports.createCachedOptions = createCachedOptions;
