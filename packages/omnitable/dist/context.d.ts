import type { Omnitable } from './types';
import type { MutableRefObject } from 'react';
export interface Context {
    base_url: string;
    ref_register_fields: MutableRefObject<Omnitable.Config['register_fields']>;
}
export declare const Context: import("node_modules/@omnitable/stk/dist/react/useContextSelector").Context<Context>;
export declare const Provider: import("react").ComponentType<{
    value: Context;
    children: import("react").ReactNode;
}>;
export declare const useContext: <Selected>(selector: (value: Context) => Selected) => Selected;
