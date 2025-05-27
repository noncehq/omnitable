import type { SelectProps } from 'antd';
import type { useAppProps } from 'antd/es/app/context';
import type { Omnitable } from '../../types';
type Options = Array<Omnitable.SelectOption>;
export default class Index {
    antd: useAppProps;
    base_url: string;
    remote: Omnitable.Select["props"]["remote"];
    multiple: boolean;
    options: Array<Omnitable.SelectOption>;
    search_props: SelectProps<any, Omnitable.SelectOption>;
    loading_search: boolean;
    constructor();
    init(args: {
        antd: Index['antd'];
        options_raw: Array<Omnitable.SelectOption> | undefined;
        base_url: string;
        remote: Index['remote'];
        multiple: Index['multiple'];
    }): void;
    get(): Promise<false | Options>;
    search(v: string): Promise<boolean>;
}
export {};
