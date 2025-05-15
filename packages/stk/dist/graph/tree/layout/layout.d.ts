import type { Node, Options } from '../types';
declare const VALID_DIRECTIONS: readonly ["LR", "RL", "TB", "BT", "H", "V"];
export type Direction = (typeof VALID_DIRECTIONS)[number];
declare const _default: (root: Node, options: Options, layoutAlgrithm: (root: Node, options: Options) => void) => Node;
export default _default;
