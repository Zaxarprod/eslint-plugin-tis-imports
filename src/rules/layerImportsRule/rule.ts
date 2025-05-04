import { Rule } from "eslint";

import { createLayerImportsRule, DEFAULT_ALIAS, DEFAULT_LAYERS } from "./createLayerImportsRule";
import { LayerImportError } from "./types";

const PROPERTIES: Exclude<Rule.RuleModule['meta'], undefined>['schema'] = {
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
        publicApiExcludeLayers: {
            type: 'array',
            items: { type: 'string' },
        },
    },
    required: ['layers', 'alias'],
    additionalProperties: false,
}

const MESSAGES: Record<LayerImportError, string> = {
    sameLayerAlias: 'Импорт из слоя "{{currentLayer}}" в самого себя возможен только относительным путём.',
    wrongDirection: 'Импорт из слоя "{{importingLayer}}" в "{{currentLayer}}" нарушает иерархию.',
    publicApiError: 'Импорт должен быть из index файла согласно public API.'
}

const DOCS = {
    description: 'Контролирует импорты между слоями в FSD архитектуре',
    recommended: true,
}

export const layersImportRule: Rule.RuleModule = (() => {
    return {
        meta: {
            type: 'problem',
            docs: DOCS,
            schema: [PROPERTIES],
            messages: MESSAGES,
        },
        defaultOptions: [{ alias: DEFAULT_ALIAS, layers: DEFAULT_LAYERS, publicApiEnabled: false }],

        create(context) {
            return createLayerImportsRule({
                options: context.options[0],
                filename: context.filename,
                report: context.report,
            })
        },
    };
})()