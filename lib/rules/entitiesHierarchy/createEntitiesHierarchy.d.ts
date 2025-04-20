import { ImportDeclaration } from 'estree';
import { EnforceEntityHierarchyOptions } from './types';
export declare const DEFAULT_ALIAS = "~";
export declare const createEnforceEntityHierarchyRule: (args: {
    options: EnforceEntityHierarchyOptions;
    filename: string;
    report: (args: {
        messageId: "wrongEntityDirection";
        node: ImportDeclaration;
    } & Record<string, any>) => void;
}) => {
    ImportDeclaration(node: ImportDeclaration): void;
};
