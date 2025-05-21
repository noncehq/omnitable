import type { InputProps, InputNumberProps } from 'antd';
import type { TextAreaProps } from 'antd/es/input';
import type { ReactNode } from 'react';
import type { StatType } from '../metadata';
import type { CSSProperties } from 'react';
import type { Model } from '..';
export * from './components';
export declare namespace Omnitable {
    interface CommonProps {
        className?: string;
    }
    type Props = CommonProps & (LowCodeConfig | Config);
    interface LowCodeConfig {
        config_url: string;
    }
    interface Config {
        suspending?: boolean;
        locale?: 'en' | 'zh';
        theme?: 'light' | 'dark';
        name: string;
        adapter?: Adapter;
        primary?: string;
        baseurl?: string;
        actions?: {
            query: Action;
            create?: Action;
            update?: Action;
            delete?: Action;
        };
        hooks?: {
            afterQuery?: (v: any) => any;
            beforeCreate?: (v: any) => any;
            beforeUpdate?: (v: any) => any;
        };
        view?: {
            hide?: boolean;
        };
        filter?: {
            columns: Array<FilterColumn>;
            defaults?: Model['filter_params'];
        };
        stat?: {
            columns?: Array<{
                name: string;
                type: StatType;
            }>;
            hide?: boolean;
        };
        group?: {
            order?: string;
            acc?: Array<string>;
            hide?: boolean;
        };
        refresh?: {
            on_show?: boolean;
        };
        live?: number;
        timeline?: {
            api: string;
            control_bind: string;
            label_bind: string;
            items: Array<{
                label: string;
                bind: string;
                color: PresetColor | string;
            }>;
        };
        table: {
            columns: Array<TableColumn>;
            props?: {
                header_sticky_top?: number;
                pagesize?: number;
                border?: boolean;
                row_click?: boolean;
                row_bg?: {
                    bind: string;
                    options: Record<string, PresetColor | string>;
                };
            };
            delete_tips?: {
                title?: string;
                content?: string;
            };
        };
        form?: {
            columns?: Array<FormColumn>;
            props?: {};
            use_table_columns?: boolean;
            exclude_table_columns?: Array<string>;
        };
        fields: {
            common?: Fields;
            filter?: Fields;
            table?: Fields;
            form?: Fields;
        };
        hide_header?: boolean;
        hide_pagination?: boolean;
    }
    interface AdapterQueryArgs {
        config: Omnitable.Config;
        sort_params: Model['sort_params'];
        filter_relation: Model['filter_relation'];
        filter_params: Model['filter_params'];
        page: Model['pagination']['page'];
        pagesize: Model['pagination']['pagesize'];
    }
    interface Adapter {
        query: (args: AdapterQueryArgs) => Promise<Omnitable.Error | {
            data: Omnitable.List;
        }>;
    }
    type Action = string | {
        api: string;
        params: Record<string, any>;
    };
    interface BaseColumn {
        name: string;
        width?: number;
        span?: number;
    }
    interface FilterColumn extends BaseColumn {
        datatype: 'string' | 'number' | 'array' | 'date';
    }
    interface TableColumn extends BaseColumn {
        sort?: boolean | 'asc' | 'desc';
        readonly?: boolean;
        sticky?: boolean;
        align?: CSSProperties['textAlign'];
    }
    interface FormColumn extends BaseColumn {
        readonly?: boolean;
    }
    interface Fields {
        [key: string]: Field;
    }
    type Field = {
        bind: string;
    } & FieldComponent;
    type FieldComponent = Index | Text | Input | InputNumber | Textarea | Select | Tag | Date | DatePicker | RangePicker | Priority | Editor | Comments | Operation;
    type Index = {
        type: 'index';
        props?: {};
    };
    type Text = {
        type: 'text';
        props?: {
            format?: string;
            textwrap?: string;
            prefix?: string;
            suffix?: string;
        };
    };
    type Input = {
        type: 'input';
        props?: InputProps;
    };
    type InputNumber = {
        type: 'input_number';
        props?: InputNumberProps;
    };
    type Textarea = {
        type: 'textarea';
        props?: TextAreaProps;
    };
    type Select = {
        type: 'select';
        props: {
            options?: Array<SelectOption>;
            remote?: {
                api: string;
                search?: string;
                query?: Record<string, any>;
            };
            single?: boolean;
            mode?: 'multiple' | 'tags';
            placeholder?: string;
            borderless?: boolean;
        };
    };
    interface SelectOption {
        label: ReactNode;
        value: string | number | boolean;
        icon?: string;
    }
    interface Tag {
        type: 'tag';
        props: {
            options: Array<TagOption>;
            mode?: 'dot' | 'text' | 'full';
            dot_shape?: 'circle' | 'round';
            dot_size?: number;
            icon_size?: number | string;
            icon_position?: 'left' | 'right';
            use_bg?: boolean;
            center?: boolean;
            prefix?: string;
            suffix?: string;
        };
    }
    interface TagOption {
        label?: ReactNode;
        value: string | number | boolean | '__self__';
        color: PresetColor | string | ((v: TagOption['value']) => PresetColor | string);
        icon?: ReactNode | ((v: TagOption['value']) => ReactNode);
    }
    type Date = {
        type: 'date';
        props?: {
            format?: string;
        };
    };
    type DatePicker = {
        type: 'date_picker';
        props?: {
            format?: string;
        };
    };
    type RangePicker = {
        type: 'range_picker';
        props?: {
            format?: string | [string, string];
        };
    };
    type Priority = {
        type: 'priority';
        props?: {};
    };
    type Editor = {
        type: 'editor';
        props?: {
            max_height?: number;
        };
    };
    type Comments = {
        type: 'comments';
        props: {
            binds: {
                date: string;
                text: string;
                role?: string;
            };
        };
    };
    type Operation = {
        type: 'operation';
        props?: {
            no_edit?: boolean;
            no_delete?: boolean;
        };
    };
    type PresetColor = 'light' | 'dark' | 'danger' | 'success' | 'warning';
    interface Error {
        error: any;
        message?: string;
    }
    type MutationResponse = Error | {
        id: number;
    };
    interface List {
        items: Array<any>;
        total: number;
        page?: number;
        pagesize?: number;
    }
}
