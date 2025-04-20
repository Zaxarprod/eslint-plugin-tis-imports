import { ImportDeclaration } from "estree";
import { RestrictImportsOptions, RestrictImportsError } from "./types";
export declare const DEFAULT_ALIAS = "~";
export declare const createRestrictImportsRule: (args: {
    report: (args: {
        messageId: RestrictImportsError;
        node: ImportDeclaration;
    } & Record<string, any>) => void;
    filename: string;
    options: RestrictImportsOptions;
}) => {
    ImportDeclaration(node: ImportDeclaration): void;
};
