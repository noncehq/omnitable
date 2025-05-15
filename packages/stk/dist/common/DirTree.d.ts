export type RawNode<T = {}> = {
    id: string;
    pid?: string;
    prev_id?: string;
    next_id?: string;
    [key: string]: any;
} & T;
type RawNodes<T = {}> = Array<RawNode<T>>;
export type TreeItem<T = {}> = RawNode<T> & {
    children?: Tree<T>;
};
type Tree<T = {}> = Array<TreeItem<T>>;
type ArgsMove = {
    active_parent_index: Array<number>;
    over_parent_index: Array<number>;
    droppable: boolean;
};
export default class Index<T = {}> {
    tree: Tree<T>;
    constructor();
    init(raw_nodes: RawNodes<T>): TreeItem<T>[];
    find(id: string, _tree?: Tree<T>): TreeItem<T>;
    insert(item: RawNode<T>, focusing_index?: Array<number>): {
        item: RawNode<T>;
        effect_items: RawNodes<T>;
    };
    remove(focusing_index: Array<number>): {
        id: string;
        remove_items: Tree<T>;
        effect_items: TreeItem<T>[];
    };
    update(focusing_index: Array<number>, data: Omit<RawNode<T>, 'id'>): {
        [key: string]: any;
        id: string;
        pid?: string;
        prev_id?: string;
        next_id?: string;
    } & T & {
        children?: Tree<T>;
    } & Omit<RawNode<T>, "id">;
    move(args: ArgsMove): {
        effect_items: RawNodes<T>;
    };
    getItem(indexes: Array<number>): {
        item: TreeItem<T>;
        cloned_item: TreeItem<T>;
        target_level: TreeItem<T>[];
        target_index: number;
    };
    private getDroppableItem;
    private getRawTreeMap;
    private getTree;
    private sortTree;
    private sortLostTree;
    private take;
    private place;
    private getUniqEffectItems;
    private getIndexes;
    private getherItems;
}
export {};
