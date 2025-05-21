import type { MouseEvent, ReactNode } from 'react';
export interface IProps {
    children: ReactNode;
    open: boolean;
    className?: HTMLDivElement['className'];
    bodyClassName?: HTMLDivElement['className'];
    title?: string | number;
    width?: string | number;
    minHeight?: string | number;
    maskClosable?: boolean;
    disableOverflow?: boolean;
    disablePadding?: boolean;
    hideClose?: boolean;
    zIndex?: number;
    onCancel?: (e?: MouseEvent<HTMLElement>) => void;
    getContainer?: () => Element;
    getRef?: (v: HTMLDivElement) => void;
}
declare const _default: import("react").MemoExoticComponent<(props: IProps) => import("react/jsx-runtime").JSX.Element>;
export default _default;
