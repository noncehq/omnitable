import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import { get } from 'lodash-es'
import { useLayoutEffect, useMemo } from 'react'

import { deepEqual } from '@omnitable/stk/react'
import { $ } from '@omnitable/stk/utils'

import { preset_color } from '../metadata'
import Column from './Col'

import type { IPropsRow } from '../types'
import type { FormProps } from 'antd'
import type { CSSProperties } from 'react'

const { useForm } = Form

const Index = (props: IPropsRow) => {
	const {
		table_columns,
		modal_index,
		item,
		index,
		editing_info,
		row_bg,
		row_click,
		onChange,
		onRowClick,
		setEditingInfo,
		onToggleGroupItems
	} = props
	const [form] = useForm()
	const { setFieldsValue, getFieldsValue } = form

	const setEditingField = useMemoizedFn((args: { field: string; focus: boolean } | null) => {
		setEditingInfo(args ? { row_index: index, field: args.field, focus: args.focus } : null)
	})

	useLayoutEffect(() => {
		const form_item = getFieldsValue()

		if (deepEqual(item, form_item)) return

		setFieldsValue(item)
	}, [item])

	const onValuesChange: FormProps['onValuesChange'] = useMemoizedFn(v => {
		onChange(index, v)
		setEditingField(null)
	})

	const style = useMemo(() => {
		if (!row_bg) return {}

		const { bind, options } = row_bg

		if (!(bind in item)) return {}

		const value = item[bind]
		const bg = options[value]

		return {
			'--row_bg': preset_color[bg as keyof typeof preset_color] ?? bg
		} as CSSProperties
	}, [row_bg, item])

	const onRow = useMemoizedFn(() => onRowClick(index))

	return (
		<Form form={form} component={false} onValuesChange={onValuesChange}>
			<tr
				className={$.cx(
					'form_table_tr',
					modal_index === index + 1 && 'selected_prev',
					modal_index === index && 'selected',
					item['__stat_type__'] && 'stat_row',
					style['--row_bg'] && 'has_row_bg',
					row_click && 'cursor_point'
				)}
				style={style}
				onClick={row_click ? onRow : undefined}
			>
				{table_columns.map((col, col_index) => {
					let group_replace = undefined

					const is_group_row =
						(col.bind === item['__group_field__'] && col.name === item['__group_name__']) ||
						col.name === item['__group_replace__']?.name

					const group_info =
						is_group_row && !item['__group_bottom__']
							? {
									group_id: item['__group_id__'],
									group_visible_self: item['__group_visible_self__'],
									group_visible_children: item['__group_visible_children__']
								}
							: undefined

					const group_level =
						(col.name === item['__group_name__'] ||
							col.name === item['__group_replace__']?.name) &&
						item['__group_level__']
							? item['__group_level__']
							: undefined

					if (item['__group_replace__'] && item['__group_replace__'].name === col.name) {
						group_replace = item['__group_replace__'].value
					}

					if (item['__stat_type__'] && !(col.bind in item)) {
						group_replace = ''
					}

					if (item['__stat_type__']) {
						if (col_index === 0) {
							group_replace = (item['__stat_type__'] as string).toUpperCase()
						} else {
							if (item['__stat_type__'] === 'COUNT' && col.bind in item) {
								group_replace = item[col.bind]
							}
						}
					}

					return (
						<Column
							column={col}
							value={get(item, col.bind)}
							group_replace={group_replace}
							row_index={index}
							focus={!col.readonly && editing_info && col.bind === editing_info.field}
							item={col.type === 'text' && col.props?.format ? item : undefined}
							group_info={group_info}
							group_level={group_level}
							setEditingField={col.readonly ? undefined : setEditingField}
							onToggleGroupItems={is_group_row ? onToggleGroupItems : undefined}
							key={col.name}
						></Column>
					)
				})}
			</tr>
		</Form>
	)
}

export default $.memo(Index)
