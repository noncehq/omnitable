import { useMemoizedFn } from 'ahooks'
import { Empty } from 'antd'
import { useLayoutEffect, useRef, Fragment } from 'react'
import { $, StickyTableHeader } from 'stk/utils'

import Row from './Row'
import Th from './Th'

import type { IPropsTable } from '../types'

const Index = (props: IPropsTable) => {
	const {
		primary,
		table_columns,
		data,
		editing_info,
		sort_params,
		modal_index,
		table_props,
		onChange,
		onSort,
		onRowClick,
		setEditingInfo,
		setItems
	} = props
	const table = useRef<HTMLTableElement>(null)
	const clone_table = useRef<HTMLTableElement>(null)
	const sticky = useRef<StickyTableHeader>(null)
	const sticky_top = table_props.header_sticky_top || 0

	useLayoutEffect(() => {
		if (table.current && clone_table.current) {
			sticky.current = new StickyTableHeader(table.current, clone_table.current, {
				max: sticky_top
			})

			return () => sticky.current?.destroy()
		}
	}, [sort_params, sticky_top])

	const getOrder = useMemoizedFn((item: IPropsTable['table_columns'][number]) => {
		if (!item.sort || !sort_params.length) return

		return sort_params.find(s => s.field === item.bind)?.order
	})

	const onToggleGroupItems = useMemoizedFn((group_id: string) => {
		const items = $.copy(data)
		const target_group_ids = group_id.split('/') as Array<string>
		const target_items = [] as Array<any>

		let parent_visible = null as boolean | null

		items.forEach(item => {
			if (!item['__stat_type__']) {
				const item_group_ids = item['__group_id__'].split('/') as Array<string>

				if (item['__group_id__'] === group_id) {
					parent_visible = !item['__group_visible_self__']
					item['__group_visible_self__'] = !item['__group_visible_self__']
				} else {
					if (item['__group_id__'].indexOf(group_id) !== -1) {
						if (!parent_visible) {
							item['__group_visible_self__'] = false
							item['__group_visible_children__'] = false
						} else {
							if (item_group_ids.length - 1 === target_group_ids.length) {
								item['__group_visible_children__'] = !item['__group_visible_children__']
							}
						}
					}
				}

				target_items.push(item)
			}
		})

		setItems(target_items)
	})

	const table_class = $.cx('table_wrap w_100', table_props?.border && 'border_style')

	return (
		<Fragment>
			<div className='table_container w_100'>
				<table className={table_class} ref={table}>
					<thead>
						<tr className={$.cx(modal_index === 0 && 'selected')}>
							{table_columns.map(item => (
								<Th
									column={item}
									order={getOrder(item)}
									onSort={item.sort ? onSort : undefined}
									key={item.name}
								></Th>
							))}
						</tr>
					</thead>
					{data.length ? (
						<tbody>
							{data.map((item, index) =>
								!item['__group_top__'] &&
								item['__group_visible_children__'] === false ? null : (
									<Row
										table_columns={table_columns}
										modal_index={modal_index}
										item={item}
										index={index}
										editing_info={
											editing_info?.row_index === index && editing_info
												? editing_info
												: null
										}
										row_bg={table_props?.row_bg}
										row_click={table_props?.row_click}
										onChange={onChange}
										onRowClick={onRowClick}
										setEditingInfo={setEditingInfo}
										onToggleGroupItems={onToggleGroupItems}
										key={
											item[primary] ||
											item['__group_id__'] ||
											item['__stat_type__']
										}
									></Row>
								)
							)}
						</tbody>
					) : (
						<tbody>
							<tr>
								<td colSpan={9999}>
									<div
										className='w_100 flex justify_center align_center'
										style={{ height: 300 }}
									>
										<Empty description={null}></Empty>
									</div>
								</td>
							</tr>
						</tbody>
					)}
				</table>
			</div>
			<div className={$.cx('table_container w_100', !sticky_top && 'clone')} style={{ zIndex: 103 }}>
				<table className={table_class} ref={clone_table} />
			</div>
		</Fragment>
	)
}

export default $.memo(Index)
