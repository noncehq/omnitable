type Template = Array<string | number | object> | string | number | boolean | Record<string, any>;
type FunctionType = <T>(template: Template & T, data: Record<string, any>) => T;
declare const Index: FunctionType;
export default Index;
