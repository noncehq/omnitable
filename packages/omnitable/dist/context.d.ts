export interface Context {
    base_url: string;
}
export declare const Context: import("node_modules/stk/dist/react/useContextSelector").Context<Context>;
export declare const Provider: import("react").ComponentType<{
    value: Context;
    children: import("react").ReactNode;
}>;
export declare const useContext: <Selected>(selector: (value: Context) => Selected) => Selected;
