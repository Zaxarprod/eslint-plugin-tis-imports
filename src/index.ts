import { enforceEntityHierarchyRule } from "./rules/entitiesHierarchy";
import { layersImportRule } from "./rules/layerImportsRule";
import { restrictImportsRule } from "./rules/restrictImports";

export const rules = {
    'layer-imports': layersImportRule,
    'entities-hierarchy': enforceEntityHierarchyRule,
    'restrict-imports': restrictImportsRule,
};