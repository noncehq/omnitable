import type Model from '../model'
import type { Omnitable } from '../types'

export interface IPropsSort {
	sort_field_options: Model['sort_field_options']
	sort_params: Model['sort_params']
	use_by_view?: boolean
	onChangeSort: Model['onChangeSort']
}

export interface IPropsSortItem {
	sort_field_options: Model['sort_field_options']
	remove: (index: number | number[]) => void
}

export interface IPropsFilter {
	filter_columns: Model['filter_columns']
	filter_relation: Model['filter_relation']
	filter_params: Model['filter_params']
	use_by_view?: boolean
	onChangeFilter: Model['onChangeFilter']
}

export interface IPropsFilterItem {
	filter_field_options: Array<{ label: string; value: any }>
	filter_relation: Model['filter_relation']
	filter_columns: Model['filter_columns']
	filter_param: Model['filter_params'][number]
	onChangeRelation: (v: Model['filter_relation']) => void
	remove: (index: number | number[]) => void
}

export interface IPropsStat {
	visible_columns: Model['visible_columns']
	stat_params: Model['stat_params']
	use_by_view?: boolean
	onChangeStat: Model['onChangeStat']
}

export interface IPropsStatItem {
	visible_columns: Model['visible_columns']
	remove: (index: number | number[]) => void
}

export interface IPropsGroup {
	group_params: Model['group_params']
	use_by_view?: boolean
	getGroupFieldOptions: Model['getGroupFieldOptions']
	onChangeGroup: Model['onChangeGroup']
}

export interface IPropsGroupItem {
	group_field_options: Array<{ label: string; value: any; disabled?: boolean }>
	remove: (index: number | number[]) => void
}

export interface IPropsFields {
	visible_columns: Model['visible_columns']
	use_by_view?: boolean
	onChangeVisibleColumns: (v: Model['visible_columns']) => void
}

export interface IPropsFieldsItem {
	item: Model['visible_columns'][number]
	index: number
	onChange: (index: number, visible: boolean) => void
}

export interface IPropsView {
	hide: { stat?: boolean; group?: boolean }
	filter_columns: Model['filter_columns']
	visible_columns: Model['visible_columns']
	views: Model['views']
	getSortFieldOptions: Model['getSortFieldOptions']
	getGroupFieldOptions: Model['getGroupFieldOptions']
	onApplyView: Model['onApplyView']
	onChangeViews: (v: Model['views']) => void
}

export interface IPropsViewItem
	extends Pick<
		IPropsView,
		| 'hide'
		| 'filter_columns'
		| 'visible_columns'
		| 'getSortFieldOptions'
		| 'getGroupFieldOptions'
		| 'onApplyView'
	> {
	view: Model['views'][number]
	view_index: number
	onChangeView: (index: number, v: Model['views'][number]) => void
	remove: (index: number) => void
}

export interface IPropsTimelineControls {
	timeline_type: Model['timeline_type']
	timeline_timestamp: Model['timeline_timestamp']
	timeline_querying: Model['timeline_querying']
	timeline_range: Model['timeline_range']
	onChangeTimelineType: Model['onChangeTimelineType']
	onChangeTimelineTimestamp: Model['onChangeTimelineTimestamp']
	onResetTimeline: Model['onResetTimeline']
}

export interface IPropsTimeline {
	label_bind: Required<Model['config']>['timeline']['label_bind']
	items: Required<Model['config']>['timeline']['items']
	timeline_type: Model['timeline_type']
	timeline_items: Model['timeline_items']
	timeline_focus: Model['timeline_focus']
	onTimelineFocus: Model['onTimelineFocus']
}

export interface IPropsTable {
	primary: Model['primary']
	table_columns: Model['table_columns']
	data: Omnitable.List['items']
	editing_info: Model['editing_info']
	sort_params: Model['sort_params']
	modal_index: Model['modal_index']
	table_props: Model['config']['table']['props']
	onSort: Model['onSort']
	onChange: Model['onChange']
	onRowClick: (v: number) => void
	setEditingInfo: (v: Model['editing_info']) => void
	setItems: (v: Model['items']) => void
}

export interface IPropsTh {
	column: Model['table_columns'][number]
	order?: Model['sort_params'][number]['order']
	onSort?: Model['onSort']
}

export interface IPropsRow
	extends Pick<
		IPropsTable,
		'table_columns' | 'editing_info' | 'modal_index' | 'onChange' | 'onRowClick' | 'setEditingInfo'
	> {
	row_bg: Required<Model['config']['table']>['props']['row_bg']
	row_click: Required<Model['config']['table']>['props']['row_click']
	item: Omnitable.List['items'][number]
	index: number
	onToggleGroupItems: (group_id: string) => void
}

export interface IPropsCol {
	column: Model['table_columns'][number]
	value: any
	row_index: number
	focus: boolean | null
	item?: any
	group_info?: { group_id: string; group_visible_self: boolean; group_visible_children: boolean }
	group_level?: number
	group_replace?: string | number
	setEditingField?: IPropsTable['setEditingInfo']
	onToggleGroupItems?: IPropsRow['onToggleGroupItems']
}

export interface IPropsComponent {
	column: Model['table_columns'][number]
	value?: any
	item?: any
	force_type?: string
	editing?: boolean
	disabled?: boolean
	use_by_filter?: boolean
	use_by_form?: boolean
	onFocus?: (v?: any) => void
	onBlur?: () => void
	onChange?: (v: any) => void
}

export interface ComponentType<T = {}>
	extends Pick<IPropsComponent, 'value' | 'editing' | 'onFocus' | 'onBlur' | 'onChange'> {
	width?: number
	disabled?: boolean
	use_by_form?: boolean
	use_by_filter?: boolean
	item?: boolean
	self_props: T
}

export interface IPropsPagination {
	pagination: Model['pagination']
	onChangePagination: Model['onChangePagination']
}

export interface IPropsDetail {
	form_columns: Model['form_columns']
	modal_type: Model['modal_type']
	item: any
	loading: Model['loading']
	onSubmit: Model['onSubmit']
	onClose: () => void
}
