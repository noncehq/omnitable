import { useMemoizedFn } from 'ahooks'
import { Button, Form, Popover, Select } from 'antd'
import { pick } from 'lodash-es'
import { useLayoutEffect, useMemo } from 'react'
import { deepEqual } from 'stk/react'
import { $ } from 'stk/utils'

import { DndContext } from '@dnd-kit/core'
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { CaretDoubleRight } from '@phosphor-icons/react'

import styles from '../../index.module.css'
import GroupItem from './Item'

import type { IPropsGroup } from '../../types'

const { useForm, List, Item } = Form

const Index = (props: IPropsGroup) => {
	const { group_params, use_by_view, getGroupFieldOptions, onChangeGroup } = props
	const [form] = useForm()
	const { setFieldsValue, getFieldsValue } = form
	const { fields, acc } = group_params || {}
	const counts = fields.length

	const group_field_options = useMemo(() => getGroupFieldOptions(fields), [fields])

	useLayoutEffect(() => {
		const item = { items: fields, acc }
		const { form_items = [], acc: form_acc = [] } = getFieldsValue()

		const form_values = {
			items: (form_items as Array<{ label: string; value: any }>).map(item => ({
				label: item.label,
				value: item.value
			})),
			acc: form_acc
		}

		if (deepEqual(item, form_values)) return

		setFieldsValue(item)
	}, [fields, acc])

	const onReset = useMemoizedFn(() => onChangeGroup({ fields: [], acc: [] }))

	const onValuesChange = useMemoizedFn(() => {
		const form_values = getFieldsValue()
		const form_items = ((form_values.items as Array<{ label: string; value: any }>) || [])
			.map(item => pick(item, ['label', 'value']))
			.filter(item => item.value)
		const form_acc = ((form_values.acc as Array<{ label: string; value: any }>) || [])
			.map(item => pick(item, ['label', 'value']))
			.filter(item => item.value)

		if (deepEqual({ fields, acc }, { fields: form_items, acc: form_acc })) return

		onChangeGroup({ fields: form_items, acc: form_acc })
	})

	const Content = (
		<div className={$.cx('flex flex_column', styles.popover_wrap, styles.group_wrap)}>
			<Form className='flex flex_column' form={form} onValuesChange={onValuesChange}>
				<div className='acc_wrap flex flex_column'>
					<span className='title'>Acc</span>
					<Item name='acc'>
						<Select
							mode='multiple'
							labelInValue
							placeholder='Select acc fields'
							options={group_field_options}
						></Select>
					</Item>
				</div>
				<span className='title'>{counts ? 'Group By' : 'No grouping applied'}</span>
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
												<GroupItem
													group_field_options={group_field_options}
													remove={remove}
													{...args}
													key={args.key}
												></GroupItem>
											))}
										</SortableContext>
									</DndContext>
								) : (
									<div className='desc'>Add grouping to group your rows.</div>
								)}
							</div>
							<div
								className={$.cx(
									'form_list_actions flex',
									items.length > 0 && 'has_items'
								)}
							>
								<Button className='clickable' type='primary' onClick={() => add()}>
									Add Group
								</Button>
								{counts > 0 && (
									<Button className='clickable' onClick={onReset}>
										Reset grouping
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
					<CaretDoubleRight className='icon'></CaretDoubleRight>
					<span className='label'>Group</span>
					{counts > 0 && (
						<div className='flex group_fields'>
							{fields.map(item => (
								<div className='group_field flex align_center' key={item.value}>
									<div className='counts flex align_center'>{item.label}</div>
									<span className='caret'>{'>'}</span>
								</div>
							))}
						</div>
					)}
				</button>
			</div>
		</Popover>
	)
}

export default $.memo(Index)
