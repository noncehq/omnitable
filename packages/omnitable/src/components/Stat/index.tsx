import { useMemoizedFn } from 'ahooks'
import { Button, Form, Popover } from 'antd'
import { uniqBy } from 'lodash-es'
import { useLayoutEffect } from 'react'

import { DndContext } from '@dnd-kit/core'
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { deepEqual } from '@omnitable/stk/react'
import { $ } from '@omnitable/stk/utils'
import { ArrowsDownUp } from '@phosphor-icons/react'

import styles from '../../index.module.css'
import StatItem from './Item'

import type { IPropsStat } from '../../types'

const { useForm, List } = Form

const Index = (props: IPropsStat) => {
	const { stat_params, visible_columns, use_by_view, onChangeStat } = props
	const [form] = useForm()
	const counts = stat_params.length
	const { setFieldsValue, getFieldsValue } = form

	useLayoutEffect(() => {
		const item = { items: stat_params }
		const form_values = getFieldsValue()

		if (deepEqual(item, form_values)) return

		setFieldsValue(item)
	}, [stat_params])

	const onReset = useMemoizedFn(() => onChangeStat([]))

	const onValuesChange = useMemoizedFn(() => {
		const form_values = getFieldsValue()
		const items = (form_values.items as IPropsStat['stat_params']).filter(item => item)

		if (!items.length) return onReset()

		if (items.every(item => item.field && item.type)) {
			onChangeStat(uniqBy(items, (item: IPropsStat['stat_params'][number]) => `${item.field}-${item.type}`))
		}
	})

	const Content = (
		<div className={$.cx('flex flex_column', styles.popover_wrap)}>
			<span className='title'>{counts ? 'Stat By' : 'No stating applied'}</span>
			<Form className='flex align_center' form={form} onValuesChange={onValuesChange}>
				<List name='items'>
					{(items, { add, remove, move }) => (
						<div className='form_list_wrap w_100 flex flex_column'>
							<div className='form_list_items w_100 flex flex_column'>
								{items.length ? (
									<DndContext
										onDragEnd={({ active, over }) => {
											if (!over) return

											move(active.id as number, over.id as number)
										}}
									>
										<SortableContext
											items={items.map(item => ({
												...item,
												id: item.name
											}))}
											strategy={verticalListSortingStrategy}
										>
											{items.map(args => (
												<StatItem visible_columns={visible_columns} remove={remove} {...args} key={args.key}></StatItem>
											))}
										</SortableContext>
									</DndContext>
								) : (
									<div className='desc'>Add stating to stat your rows.</div>
								)}
							</div>
							<div className={$.cx('form_list_actions flex', items.length > 0 && 'has_items')}>
								<Button className='clickable' type='primary' onClick={() => add()}>
									Add stat
								</Button>
								{counts > 0 && (
									<Button className='clickable' onClick={onReset}>
										Reset stating
									</Button>
								)}
							</div>
						</div>
					)}
				</List>
			</Form>
		</div>
	)

	if (use_by_view) return Content

	return (
		<Popover trigger={['click']} placement='bottomLeft' content={Content} forceRender>
			<div>
				<button className='header_btn_wrap border_box flex align_center clickable mr_8'>
					<ArrowsDownUp className='icon'></ArrowsDownUp>
					<span className='label'>Stat</span>
					{counts > 0 && <span className='counts flex align_center'>{counts}</span>}
				</button>
			</div>
		</Popover>
	)
}

export default $.memo(Index)
