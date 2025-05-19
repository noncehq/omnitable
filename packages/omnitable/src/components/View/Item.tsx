import { useMemoizedFn } from 'ahooks'
import { Button, Input } from 'antd'

import { $ } from '@omnitable/stk/utils'
import { Trash } from '@phosphor-icons/react'

import Fields from '../Fields'
import Filter from '../Filter'
import Group from '../Group'
import Sort from '../Sort'
import Stat from '../Stat'

import type { IPropsViewItem, IPropsSort, IPropsFilter, IPropsGroup, IPropsFields, IPropsStat } from '../../types'

const Index = (props: IPropsViewItem) => {
	const {
		hide,
		filter_columns,
		visible_columns,
		view,
		view_index,
		getSortFieldOptions,
		getGroupFieldOptions,
		remove,
		onApplyView,
		onChangeView
	} = props

	const onChangeName = useMemoizedFn(e => {
		onChangeView(view_index, { ...view, name: e.target.value })
	})

	const onRemove = useMemoizedFn(() => remove(view_index))
	const onApply = useMemoizedFn(() => onApplyView(view))

	const props_sort: IPropsSort = {
		sort_field_options: getSortFieldOptions(view.sort_params)!,
		sort_params: view.sort_params,
		use_by_view: true,
		onChangeSort: useMemoizedFn(v => onChangeView(view_index, { ...view, sort_params: v }))
	}

	const props_filter: IPropsFilter = {
		filter_columns,
		filter_relation: view.filter_relation,
		filter_params: view.filter_params,
		use_by_view: true,
		onChangeFilter: useMemoizedFn(v => onChangeView(view_index, { ...view, ...v }))
	}

	const props_stat: IPropsStat = {
		visible_columns,
		stat_params: view.stat_params,
		use_by_view: true,
		onChangeStat: useMemoizedFn(v => onChangeView(view_index, { ...view, stat_params: v }))
	}

	const props_group: IPropsGroup = {
		group_params: view.group_params,
		use_by_view: true,
		getGroupFieldOptions,
		onChangeGroup: useMemoizedFn(v => onChangeView(view_index, { ...view, group_params: v }))
	}

	const props_fields: IPropsFields = {
		visible_columns: view.visible_columns,
		use_by_view: true,
		onChangeVisibleColumns: useMemoizedFn(v => onChangeView(view_index, { ...view, visible_columns: v }))
	}

	return (
		<div className='view_item_wrap flex flex_column'>
			<div className='view_option name_wrap w_100 flex justify_between align_center'>
				<Input
					className='view_name'
					value={view.name}
					variant='borderless'
					onChange={onChangeName}
				></Input>
				<div className='view_actions flex align_center'>
					<Button className='btn_remove btn' onClick={onRemove}>
						<Trash></Trash>
					</Button>
					<Button className='btn_apply btn' type='primary' onClick={onApply}>
						Apply
					</Button>
				</div>
			</div>
			<div className='view_option w_100'>
				<Sort {...props_sort}></Sort>
			</div>
			<div className='view_option w_100'>
				<Filter {...props_filter}></Filter>
			</div>
			{!hide?.stat && (
				<div className='view_option w_100'>
					<Stat {...props_stat}></Stat>
				</div>
			)}
			{!hide?.group && (
				<div className='view_option w_100'>
					<Group {...props_group}></Group>
				</div>
			)}
			<div className='view_option w_100'>
				<Fields {...props_fields}></Fields>
			</div>
		</div>
	)
}

export default $.memo(Index)
