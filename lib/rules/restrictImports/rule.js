"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictImportsRule = void 0;
const createRestrictImportsRule_1 = require("./createRestrictImportsRule");
const PROPERTIES = {
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
};
const MESSAGES = {
    forbiddenImport: "Импорт модуля из '{{checkingImport}}' запрещён в '{{importingFile}}'"
};
const DOCS = {
    description: 'Запрещает импорт файлов/папок, не находящихся в разрешённых слоях проекта',
};
exports.restrictImportsRule = (() => {
    return {
        meta: {
            type: 'problem',
            docs: DOCS,
            schema: [PROPERTIES],
            messages: MESSAGES,
        },
        defaultOptions: [{ imports: [], alias: createRestrictImportsRule_1.DEFAULT_ALIAS }],
        create(context) {
            return (0, createRestrictImportsRule_1.createRestrictImportsRule)({
                options: context.options[0],
                filename: context.filename,
                report: context.report,
            });
        },
    };
})();
