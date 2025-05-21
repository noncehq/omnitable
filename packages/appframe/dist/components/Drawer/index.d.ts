import type { MouseEvent, ReactNode } from 'react';
export interface IProps {
    children: ReactNode;
    open: boolean;
    placement?: 'left' | 'right' | 'top' | 'bottom';
    className?: HTMLDivElement['className'];
    bodyClassName?: HTMLDivElement['className'];
    title?: string | number;
    width?: string | number;
    height?: string | number;
    maskClosable?: boolean;
    disableOverflow?: boolean;
    disablePadding?: boolean;
    zIndex?: number;
    header_actions?: ReactNode;
    onCancel?: (e?: MouseEvent<HTMLElement>) => void;
    getRef?: (v: HTMLElement | null) => void;
}
declare const _default: import("react").MemoExoticComponent<(props: IProps) => import("react").ReactPortal>;
export default _default;
