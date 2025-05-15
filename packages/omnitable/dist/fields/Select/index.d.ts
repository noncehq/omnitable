import type { Omnitable, ComponentType } from '../../types';
declare const _default: import("react").MemoExoticComponent<(props: ComponentType<{
    options?: Array<Omnitable.SelectOption>;
    remote?: {
        api: string;
        search?: string;
        query?: Record<string, any>;
    };
    single?: boolean;
    mode?: "multiple" | "tags";
    placeholder?: string;
    borderless?: boolean;
}>) => import("react").JSX.Element | import("react").ReactNode>;
export default _default;
