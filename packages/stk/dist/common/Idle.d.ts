import type { IReactionDisposer, Lambda } from 'mobx';
import type { Watch } from '@/mobx';
type MaybePromise<T> = T | Promise<T>;
interface Config<T = {}> {
    context?: T;
    events?: string[];
    onIdle?: () => MaybePromise<any>;
    onActive?: () => MaybePromise<any>;
    onHide?: () => MaybePromise<any>;
    onShow?: () => MaybePromise<any>;
}
export default class Index<T = {}> {
    config: Config<T>;
    time: number;
    idle: boolean;
    visible: boolean;
    timer: any;
    acts: Array<IReactionDisposer | Lambda>;
    watch: Watch<Index>;
    constructor();
    init(time: number, config: Config<T>): void;
    on(): void;
    off(): void;
    private start;
    private active;
    private changeVisible;
}
export {};
