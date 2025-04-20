"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceEntityHierarchyRule = void 0;
const createEntitiesHierarchy_1 = require("./createEntitiesHierarchy");
const PROPERTIES = {
    type: 'object',
    properties: {
        alias: { type: 'string' },
        checkingLayers: {
            type: 'array',
            items: { type: 'string' },
        },
        hierarchy: {
            type: 'array',
            items: { type: 'string' },
        },
    },
    required: ['checkingLayers', 'hierarchy'],
    additionalProperties: false,
};
const MESSAGES = {
    wrongEntityDirection: 'Импорт из сущности "{{importingEntity}}" в "{{currentEntity}}" нарушает иерархию.',
};
const DOCS = {
    description: 'Запрещает импорт из родительской сущности в дочернюю внутри одного слоя (entities, features и т.д.)',
    recommended: true,
};
exports.enforceEntityHierarchyRule = (() => {
    return {
        meta: {
            type: 'problem',
            docs: DOCS,
            schema: [PROPERTIES],
            messages: MESSAGES,
        },
        defaultOptions: [{ alias: createEntitiesHierarchy_1.DEFAULT_ALIAS, checkingLayers: [], hierarchy: [] }],
        create(context) {
            return (0, createEntitiesHierarchy_1.createEnforceEntityHierarchyRule)({
                options: context.options[0],
                filename: context.filename,
                report: context.report,
            });
        },
    };
})();
