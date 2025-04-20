"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const entitiesHierarchy_1 = require("./rules/entitiesHierarchy");
const layerImportsRule_1 = require("./rules/layerImportsRule");
const restrictImports_1 = require("./rules/restrictImports");
exports.rules = {
    'layer-imports': layerImportsRule_1.layersImportRule,
    'entities-hierarchy': entitiesHierarchy_1.enforceEntityHierarchyRule,
    'restrict-imports': restrictImports_1.restrictImportsRule,
};
