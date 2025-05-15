import type { Node } from './types';
export declare const mix: <Base, A, B, C>(dist: Base & A & B & C, src1?: A, src2?: B, src3?: C) => Base & A & B & C;
export declare const getHeight: (prev_node: Node, current_node: Node, align: "center" | undefined, height_field?: string) => number;
