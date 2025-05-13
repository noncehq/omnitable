import { useMemoizedFn } from 'ahooks'
import { Checkbox } from 'antd'
import { $ } from 'stk/utils'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DotsSixVertical } from '@phosphor-icons/react'

import type { IPropsFieldsItem } from '../../types'

const Index = (props: IPropsFieldsItem) => {
	const { item, index, onChange } = props
	const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
		id: item.name,
		disabled: item.id === '_operation'
	})

	const onClick = useMemoizedFn(() => onChange(index, item.visible))

	return (
		<div
			className='field w_100 border_box flex align_center justify_between cursor_point'
			style={{ transform: CSS.Translate.toString(transform), transition }}
			ref={setNodeRef}
			{...attributes}
			onClick={onClick}
		>
			<div className='field_left flex align_center'>
				<Checkbox checked={item.visible}></Checkbox>
				<span className='name'>{item.name}</span>
			</div>
			<div className='btn_drag flex justify_center align_center' ref={setActivatorNodeRef}>
				<DotsSixVertical {...listeners} weight='bold'></DotsSixVertical>
			</div>
		</div>
	)
}

export default $.memo(Index)
