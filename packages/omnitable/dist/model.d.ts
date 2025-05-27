import type { useAppProps } from 'antd/es/app/context';
import type { IReactionDisposer, Lambda } from 'mobx';
import type { CategoricalChartState } from 'recharts/types/chart/types';
import type { StatType } from './metadata';
import type { Omnitable } from './types';
export default class Index {
    antd: useAppProps;
    primary: string;
    props: Omnitable.Props;
    config: Omit<Omnitable.Config, "register_fields">;
    filter_columns: Array<Omnitable.FilterColumn & Omnitable.Field>;
    table_columns: Array<Omnitable.TableColumn & Omnitable.Field>;
    form_columns: Array<Omnitable.FormColumn & Omnitable.Field>;
    editing_info: null | {
        row_index: number;
        field: string;
        focus: boolean;
    };
    sort_columns: Array<Omnitable.TableColumn & Omnitable.Field>;
    sort_field_options: Array<{
        label: string;
        value: any;
        disabled?: boolean;
    }>;
    sort_params: Array<{
        field: string;
        order: "desc" | "asc";
    }>;
    filter_relation: "and" | "or";
    filter_params: Array<{
        field: string;
        expression: string;
        value: any;
        shadow?: boolean;
    }>;
    stat_params: Array<{
        field: string;
        type: StatType;
    }>;
    stat_items: Array<any>;
    group_params: {
        fields: Array<{
            label: string;
            value: string;
        }>;
        acc: Array<{
            label: string;
            value: string;
        }>;
    };
    visible_columns: Array<{
        name: string;
        id: string;
        visible: boolean;
    }>;
    apply_view_name: string;
    views: Array<{
        name: string;
        sort_params: Index["sort_params"];
        filter_relation: Index["filter_relation"];
        filter_params: Index["filter_params"];
        stat_params: Index["stat_params"];
        group_params: Index["group_params"];
        visible_columns: Index["visible_columns"];
    }>;
    modal_type: "view" | "edit" | "add";
    modal_index: any;
    modal_visible: boolean;
    modal_view_visible: boolean;
    loading_init: boolean;
    querying: boolean;
    loading: boolean;
    refreshing: boolean;
    living: boolean;
    timeline_type: "minutes" | "hours" | "days";
    timeline_timestamp: number;
    timeline_focus: number | null;
    timeline_range: [number, number] | null;
    timeline_items: Array<any>;
    timeline_querying: boolean;
    items: Array<any>;
    items_raw: Array<any>;
    pagination: {
        page: number;
        pagesize: number;
        total: number;
    };
    living_timer: NodeJS.Timeout | null;
    disposers: Array<IReactionDisposer | Lambda>;
    constructor();
    init(args: {
        props: Index['props'];
    }): Promise<void>;
    getConfig(config_url: string): Promise<boolean>;
    query(ignore_querying?: boolean, ignore_timeline_query?: boolean): Promise<boolean>;
    create(v: any): Promise<boolean>;
    update(primary_value: number | string, v: any): Promise<boolean>;
    delete(primary_value: number | string): Promise<boolean>;
    queryTimeline(): Promise<boolean>;
    onChange(index: number, v: any): Promise<void>;
    onRefresh(): Promise<void>;
    onLive(): void;
    make(): void;
    makeStatParams(): void;
    makeGroupParams(): void;
    makeGroupVisible(): void;
    makeGroupData(items: Index['items'], fields: Index['group_params']['fields'], acc: Index['group_params']['acc'], target?: Index["items"], level?: number, group_id?: string): any[];
    getSortFieldOptions(v?: Index['sort_params']): {
        label: string;
        value: any;
        disabled?: boolean;
    }[];
    getStatItems(): any[];
    getGroupFieldOptions(v: Index['group_params']['fields']): {
        label: string;
        value: any;
        disabled?: boolean;
    }[];
    onSort(field: string): void;
    onChangeSort(v: Index['sort_params']): void;
    onChangeFilter(args: {
        filter_relation?: Index['filter_relation'];
        filter_params?: Index['filter_params'];
        ignore_query?: boolean;
    }): void;
    onChangeStat(v: Index['stat_params']): void;
    onChangeGroup(v: Index['group_params'], apply_view?: boolean): void;
    onChangeTimelineType(v: Index['timeline_type']): void;
    onChangeTimelineTimestamp(v: 'prev' | 'next'): void;
    onTimelineFocus(args: CategoricalChartState): void;
    onResetTimeline(): void;
    resetTimelineFocus(): void;
    onAddView(): void;
    onApplyView(view: Index['views'][number]): void;
    onSubmit(v: any): void;
    onChangePagination(page: number, pagesize: number): void;
    clearApplyView(): void;
    onVisibilityChange(): void;
    updateTimelineTimestamp(): void;
    getAction(v: Omnitable.Action): {
        api: string;
        params: Record<string, any>;
    };
    on(): void;
    off(): void;
}
