import { useMemoizedFn } from 'ahooks'
import { Popover } from 'antd'

import { DndContext } from '@dnd-kit/core'
import { arrayMove, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { $ } from '@omnitable/stk/utils'
import { SlidersHorizontal } from '@phosphor-icons/react'

import styles from '../../index.module.css'
import Item from './Item'

import type { IPropsFields } from '../../types'
import type { DragEndEvent } from '@dnd-kit/core'

const Index = (props: IPropsFields) => {
	const { visible_columns, use_by_view, onChangeVisibleColumns } = props

	const onChange = useMemoizedFn((index, visible) => {
		const columns = $.copy(visible_columns)

		columns[index]['visible'] = !visible

		onChangeVisibleColumns(columns)
	})

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over) return
		if (over.id === '_operation') return

		let active_index: number
		let over_index: number

		visible_columns.forEach((item, index) => {
			if (item.name === active.id) active_index = index
			if (item.name === over.id) over_index = index
		})

		const target_columns = arrayMove(visible_columns, active_index!, over_index!)

		onChangeVisibleColumns(target_columns)
	})

	const Content = (
		<div className={$.cx('flex flex_column', styles.popover_wrap, styles.fields_wrap)}>
			<DndContext onDragEnd={onDragEnd}>
				<SortableContext
					items={visible_columns.map(item => ({ ...item, id: item.name }))}
					strategy={verticalListSortingStrategy}
				>
					{visible_columns.map((item, index) => (
						<Item item={item} index={index} onChange={onChange} key={item.name}></Item>
					))}
				</SortableContext>
			</DndContext>
		</div>
	)

	if (use_by_view) return Content

	return (
		<Popover
			rootClassName='fields_popover'
			trigger={['click']}
			placement='bottomRight'
			content={Content}
			destroyOnHidden
		>
			<div>
				<button className='header_btn_wrap border_box flex align_center clickable'>
					<SlidersHorizontal className='icon'></SlidersHorizontal>
					<span className='label'>Fields</span>
				</button>
			</div>
		</Popover>
	)
}

export default $.memo(Index)
