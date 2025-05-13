import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import { useLayoutEffect, useRef, useState } from 'react'
import { useDeepMemo } from 'stk/react'
import { $ } from 'stk/utils'

import { CaretRight } from '@phosphor-icons/react'

import { readonly_fields } from '../metadata'
import Component from './Component'

import type { IPropsCol, IPropsComponent } from '../types'

const { Item } = Form

const Index = (props: IPropsCol) => {
	const {
		column,
		value,
		row_index,
		focus,
		item,
		group_info,
		group_level,
		group_replace,
		setEditingField,
		onToggleGroupItems
	} = props
	const { type, bind, readonly } = column
	const ref = useRef<HTMLTableCellElement>(null)
	const [hover, setHover] = useState(false)

	useLayoutEffect(() => {
		const td = ref.current

		if (!td || readonly || readonly_fields.includes(type)) return

		const setHoverTrue = () => setHover(true)
		const setHoverFalse = () => setHover(false)

		td.addEventListener('mouseenter', setHoverTrue)
		td.addEventListener('mouseleave', setHoverFalse)

		return () => {
			td.removeEventListener('mouseenter', setHoverTrue)
			td.removeEventListener('mouseleave', setHoverFalse)
		}
	}, [readonly, type])

	const onFocus = useMemoizedFn(v => {
		if (v) {
			setEditingField?.({ row_index, field: bind, focus: true })
		} else {
			setEditingField?.(null)
		}
	})

	const onBlur = useMemoizedFn(() => setEditingField?.(null))

	const props_component: IPropsComponent = {
		column,
		row_index,
		editing: focus || hover
	}

	if (props_component.editing) {
		props_component['onFocus'] = onFocus
		props_component['onBlur'] = onBlur
	} else {
		props_component['value'] = value
	}

	if (item) props_component['item'] = item

	if (group_replace !== undefined) props_component['group_replace'] = group_replace

	const Content = useDeepMemo(() => <Component {...props_component}></Component>, [props_component])

	const onToggleGroup = group_info ? useMemoizedFn(() => onToggleGroupItems?.(group_info.group_id)) : undefined

	return (
		<td
			className={$.cx(
				'form_table_td',
				type === 'operation' && 'operation',
				column.sticky && 'sticky left_0'
			)}
			width={column.width}
			style={{ textAlign: column.align }}
			ref={ref}
		>
			{group_level && <span style={{ paddingLeft: `calc((1.2em + 8px) * ${group_level})` }}></span>}
			{group_info && (
				<span
					className={$.cx(
						'btn_toggle_group inline_flex justify_center align_center clickable',
						group_info.group_visible_self && 'visible'
					)}
					onClick={onToggleGroup}
				>
					<CaretRight weight='bold'></CaretRight>
				</span>
			)}
			{group_replace !== undefined ? (
				group_replace
			) : props_component.editing ? (
				<Item name={bind} noStyle>
					{Content}
				</Item>
			) : (
				Content
			)}
		</td>
	)
}

export default $.memo(Index)
