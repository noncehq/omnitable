import type { Omnitable } from './types';
export declare const timeline_args_map: {
    readonly minutes: {
        readonly duration_format: "HH:mm:ss";
        readonly start_format: "HH:mm:ss";
        readonly end_format: "HH:mm:ss";
        readonly span_value: 30;
        readonly span_unit: "minute";
    };
    readonly hours: {
        readonly duration_format: "MM-DD HH:mm";
        readonly start_format: "MM-DD HH:mm";
        readonly end_format: "HH:mm";
        readonly span_value: 24;
        readonly span_unit: "hour";
    };
    readonly days: {
        readonly duration_format: "MM-DD HH[H]";
        readonly start_format: "MM-DD HH[H]";
        readonly end_format: "HH[H]";
        readonly span_value: 30;
        readonly span_unit: "day";
    };
};
export declare const timeline_type_options: {
    label: string;
    value: string;
}[];
export declare const pagesize_options: number[];
export declare const readonly_fields: string[];
export declare const sort_options: {
    label: string;
    value: string;
}[];
export declare const filter_relation_options: {
    label: string;
    value: string;
}[];
export declare const stat_options: readonly [{
    readonly label: "SUM";
    readonly value: "SUM";
}, {
    readonly label: "AVG";
    readonly value: "AVG";
}, {
    readonly label: "COUNT";
    readonly value: "COUNT";
}, {
    readonly label: "MIN";
    readonly value: "MIN";
}, {
    readonly label: "MAX";
    readonly value: "MAX";
}];
export declare const preset_color: {
    light: string;
    dark: string;
    success: string;
    warning: string;
    danger: string;
};
export type StatType = (typeof stat_options)[number]['value'];
export declare const common_expressions: string[];
export declare const filter_expressions: {
    string: string[];
    number: string[];
    array: string[];
    date: string[];
};
export declare const getFilterComponentType: (datatype: Omnitable.FilterColumn["datatype"], expression: string) => "input" | "input_number" | "select" | "date_picker" | "range_picker";
