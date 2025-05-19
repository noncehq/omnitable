import { Button, Form, Select } from 'antd'
import { useMemo } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { $ } from '@omnitable/stk/utils'
import { DotsSixVertical, Trash } from '@phosphor-icons/react'

import { filter_expressions, filter_relation_options, getFilterComponentType } from '../../metadata'
import FormComponent from '../FormComponent'

import type { IPropsFilterItem } from '../../types'
import type { FormListFieldData } from 'antd'

const { Item } = Form

const Index = (props: IPropsFilterItem & FormListFieldData) => {
	const {
		filter_columns,
		filter_field_options,
		filter_relation,
		filter_param,
		name,
		onChangeRelation,
		remove,
		...rest
	} = props
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id: name
	})
	const { field, expression } = filter_param

	const column = useMemo(() => filter_columns.find(item => item.bind === field)!, [field, filter_columns])

	const expression_options = useMemo(
		() => filter_expressions[column.datatype].map(item => ({ label: item, value: item })),
		[column]
	)

	const value_type = useMemo(() => getFilterComponentType(column.datatype, expression), [column, expression])

	return (
		<div
			className='form_list_item w_100 flex'
			style={{ transform: CSS.Translate.toString(transform), transition }}
			ref={setNodeRef}
			{...attributes}
		>
			<div className='relation_wrap'>
				{name === 0 && <span className='relation_item flex justify_center align_center'>where</span>}
				{name === 1 && (
					<span className='relation_item'>
						<Select
							className='w_100'
							options={filter_relation_options}
							value={filter_relation}
							onChange={onChangeRelation}
						></Select>
					</span>
				)}
				{name > 1 && (
					<span className='relation_item flex justify_center align_center'>{filter_relation}</span>
				)}
			</div>
			<Item {...rest} className='field_name' name={[name, 'field']}>
				<Select showSearch options={filter_field_options}></Select>
			</Item>
			<Item {...rest} className='expression_value' name={[name, 'expression']}>
				<Select popupMatchSelectWidth={false} options={expression_options}></Select>
			</Item>
			<Item {...rest} className='filter_value' name={[name, 'value']}>
				<FormComponent
					column={column}
					disabled={false}
					force_type={value_type}
					use_by_filter
				></FormComponent>
			</Item>
			<Button className='btn' onClick={() => remove(name)}>
				<Trash></Trash>
			</Button>
			<Button {...listeners} className='btn' ref={setActivatorNodeRef}>
				<DotsSixVertical weight='bold'></DotsSixVertical>
			</Button>
		</div>
	)
}

export default $.memo(Index)
