// Type definitions for yaml-cfn.

import {Schema} from "js-yaml";

export const schema: Schema;

export function yamlParse(str: string): any;
export function yamlDump(obj: any): string;
