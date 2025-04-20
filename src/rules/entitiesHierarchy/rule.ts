import { Rule } from 'eslint';
import { EnforceEntityHierarchyOptions, EntityHierarchyError, CachedEnforceEntityHierarchyOptions } from './types';
import { createEnforceEntityHierarchyRule, DEFAULT_ALIAS } from './createEntitiesHierarchy';

const PROPERTIES: Exclude<Rule.RuleModule['meta'], undefined>['schema'] = {
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

const MESSAGES: Record<EntityHierarchyError, string> = {
    wrongEntityDirection: 'Импорт из сущности "{{importingEntity}}" в "{{currentEntity}}" нарушает иерархию.',
};

const DOCS = {
    description: 'Запрещает импорт из родительской сущности в дочернюю внутри одного слоя (entities, features и т.д.)',
    recommended: true,
};

export const enforceEntityHierarchyRule: Rule.RuleModule = (() => {
    return {
        meta: {
            type: 'problem',
            docs: DOCS,
            schema: [PROPERTIES],
            messages: MESSAGES,
        },
        defaultOptions: [{ alias: DEFAULT_ALIAS, checkingLayers: [], hierarchy: [] }],

        create(context) {
            return createEnforceEntityHierarchyRule({
                options: context.options[0],
                filename: context.filename,
                report: context.report,
            });
        },
    };
})();