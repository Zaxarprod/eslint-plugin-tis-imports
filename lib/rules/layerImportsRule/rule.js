"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layersImportRule = void 0;
const createLayerImportsRule_1 = require("./createLayerImportsRule");
const PROPERTIES = {
    type: 'object',
    properties: {
        publicApiEnabled: { type: 'boolean' },
        alias: { type: 'string' },
        layers: {
            type: 'array',
            items: { type: 'string' },
        },
        notStrictLayers: {
            type: 'array',
            items: { type: 'string' },
        },
    },
    required: ['layers', 'alias'],
    additionalProperties: false,
};
const MESSAGES = {
    sameLayerAlias: 'Импорт из слоя "{{currentLayer}}" в самого себя возможен только относительным путём.',
    wrongDirection: 'Импорт из слоя "{{importingLayer}}" в "{{currentLayer}}" нарушает иерархию.',
    publicApiError: 'Импорт должен быть из index файла согласно public API.'
};
const DOCS = {
    description: 'Контролирует импорты между слоями в FSD архитектуре',
    recommended: true,
};
exports.layersImportRule = (() => {
    return {
        meta: {
            type: 'problem',
            docs: DOCS,
            schema: [PROPERTIES],
            messages: MESSAGES,
        },
        defaultOptions: [{ alias: createLayerImportsRule_1.DEFAULT_ALIAS, layers: createLayerImportsRule_1.DEFAULT_LAYERS, publicApiEnabled: false }],
        create(context) {
            return (0, createLayerImportsRule_1.createLayerImportsRule)({
                options: context.options[0],
                filename: context.filename,
                report: context.report,
            });
        },
    };
})();
