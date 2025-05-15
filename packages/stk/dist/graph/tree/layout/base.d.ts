import type { Node, Options } from '../types';
export default class Tree {
    rootNode: Node;
    options: Options;
    constructor(root: Node, options?: Options);
    execute(): void;
}
