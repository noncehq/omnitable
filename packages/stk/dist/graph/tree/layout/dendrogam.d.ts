import type { Node, Options } from '../types';
export type CurrentOptions = typeof DEFAULT_OPTIONS & Options;
declare const DEFAULT_OPTIONS: {
    isHorizontal: boolean;
    nodeSep: number;
    nodeSize: number;
    rankSep: number;
    subTreeSep: number;
};
declare const _default: (root: Node, options?: CurrentOptions) => Node;
export default _default;
