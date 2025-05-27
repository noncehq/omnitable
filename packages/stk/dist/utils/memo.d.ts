import type { ComponentType, MemoExoticComponent } from 'react';
type Memo = <T extends ComponentType<any>>(Component: T) => MemoExoticComponent<T>;
declare const Index: Memo;
export default Index;
