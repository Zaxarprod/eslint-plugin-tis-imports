import { ImportDeclaration } from "estree";
import { LayerImportError, LayerImportsRuleOptions } from "./types";
export declare const DEFAULT_LAYERS: string[];
export declare const DEFAULT_ALIAS = "~";
export declare const createLayerImportsRule: (args: {
    report: (args: {
        messageId: LayerImportError;
        node: ImportDeclaration;
    } & Record<string, any>) => void;
    filename: string;
    options: LayerImportsRuleOptions;
}) => {
    ImportDeclaration(node: ImportDeclaration): void;
};
