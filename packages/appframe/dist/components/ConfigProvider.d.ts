import type { PropsWithChildren } from 'react';
import type { ConfigProviderProps } from 'antd/es/config-provider';
export interface IProps extends PropsWithChildren, Omit<ConfigProviderProps, 'locale' | 'theme'> {
    locale: 'en' | 'zh';
    theme: 'light' | 'dark';
}
declare const _default: import("react").MemoExoticComponent<(props: IProps) => import("react").JSX.Element>;
export default _default;
