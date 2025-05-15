interface Options {
    useSession?: boolean;
}
type KeyMap = Record<string, string | ((v: any) => any) | Handlers> | string;
interface Handlers {
    fromStorage: (v: any) => any;
    toStorage: (v: any) => any;
}
declare const _default: (keys: Array<KeyMap>, instance: any, options?: Options) => import("mobx").Lambda;
export default _default;
