import type { ReactNode, ComponentType } from 'react';
export interface Context<Value> {
    Provider: ComponentType<{
        value: Value;
        children: ReactNode;
    }>;
    displayName?: string;
}
export declare function createContext<Value>(defaultValue: Value): Context<Value>;
export declare function useContextSelector<Value, Selected>(context: Context<Value>, selector: (value: Value) => Selected): Selected;
export declare function useContext<Value>(context: Context<Value>): Value;
export declare function useContextUpdate<Value>(context: Context<Value>): (thunk: () => void, options?: {
    suspense: boolean;
}) => void;
export declare const BridgeProvider: ({ context, value, children }: {
    context: Context<any>;
    value: any;
    children: ReactNode;
}) => import("react").FunctionComponentElement<import("react").ProviderProps<unknown>>;
export declare const useBridgeValue: (context: Context<any>) => any;
