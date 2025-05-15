export declare let prefix: string;
export declare function setPrefix(str: string): void;
export declare const proxyMap: WeakMap<object, object>;
export interface StorageLike {
    [x: string]: any;
    clear(): void;
    getItem(key: string): string | null;
    key(key: number): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    length: number;
}
export type StorageValue = string | object | null;
export interface TargetObject {
    type: string;
    value: string | object;
    expires?: ExpiresType;
}
export interface ActiveEffect {
    storage: object;
    key: string;
    proxy: any;
}
export declare const activeEffect: ActiveEffect;
export declare let shouldTrack: boolean;
export declare function pauseTracking(): void;
export declare function enableTracking(): void;
export type EffectFn<V = any, OV = any> = (value?: V, oldValue?: OV) => any;
export interface Effect {
    ctx: any;
    fn: EffectFn;
}
export type EffectMap = Map<string, Effect[]>;
export type ExpiresType = string | number | Date;
export declare function createExpiredFunc(target: object, key: string): () => void;
