import cx from 'classix';
import Handle from './Handle';
declare const _default: {
    cx: typeof cx;
    memo: <T>(el: (props: T) => import("react").JSX.Element | import("react").ReactNode) => React.MemoExoticComponent<(props: T) => import("react").JSX.Element | import("react").ReactNode>;
    copy: <T>(input: T) => T;
    Handle: typeof Handle;
};
export default _default;
