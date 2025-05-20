import cx from 'classix';
import Handle from './Handle';
declare const _default: {
    cx: typeof cx;
    memo: <T extends import("react").ComponentType<any>>(Component: T) => import("react").MemoExoticComponent<T>;
    copy: <T>(input: T) => T;
    Handle: typeof Handle;
};
export default _default;
