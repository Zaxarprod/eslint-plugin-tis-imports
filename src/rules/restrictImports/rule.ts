import { Rule } from "eslint";

import { RestrictImportsError } from "./types";
import { createRestrictImportsRule, DEFAULT_ALIAS } from "./createRestrictImportsRule";

const PROPERTIES: Exclude<Rule.RuleModule['meta'], undefined>['schema'] = {
    type: 'object',
    properties: {
        alias: { type: 'string' },
        imports: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    checkingImport: { type: 'string' },
                    allowedFolders: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                },
                required: ['checkingImport', 'allowedFolders'],
                additionalProperties: false
            }
        }
    },
    required: ['imports', 'alias'],
    additionalProperties: false
}

const MESSAGES: Record<RestrictImportsError, string> = {
    forbiddenImport: "Импорт модуля из '{{checkingImport}}' запрещён в '{{importingFile}}'"
}

const DOCS = {
    description: 'Запрещает импорт файлов/папок, не находящихся в разрешённых слоях проекта',
}

export const restrictImportsRule: Rule.RuleModule = (() => {
    return {
        meta: {
            type: 'problem',
            docs: DOCS,
            schema: [PROPERTIES],
            messages: MESSAGES,
        },
        defaultOptions: [{ imports: [], alias: DEFAULT_ALIAS }],
        create(context) {
            return createRestrictImportsRule({
                options: context.options[0],
                filename: context.filename,
                report: context.report,
            })
        },
    };
})()