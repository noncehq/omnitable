import { useMemoizedFn } from 'ahooks'
import { Tooltip } from 'antd'

import { $ } from '@omnitable/stk/utils'
import { CaretDown, CaretUp } from '@phosphor-icons/react'

import type { IPropsTh } from '../types'

const Index = (props: IPropsTh) => {
	const { column, order, onSort } = props
	const { type, name, desc, bind, sort } = column
	const is_operation = type === 'operation'
	const text = is_operation ? '' : name

	const onClick = useMemoizedFn(() => onSort?.(bind))

	return (
		<th
			className={$.cx(
				'form_table_th',
				sort && 'sort cursor_point',
				column.sticky && 'sticky left_0',
				is_operation && 'sticky right_0'
			)}
			style={{ textAlign: column.align }}
			onClick={sort ? onClick : undefined}
		>
			{sort ? (
				<div className='inline_flex align_center'>
					{desc ? (
						<Tooltip title={desc}>
							<span className='desc'>{name}</span>
						</Tooltip>
					) : (
						<span>{name}</span>
					)}
					<div className={$.cx('table_sort flex_column justify_center', order && 'order')}>
						{(order === 'asc' || !order) && <CaretUp className='asc' weight='bold'></CaretUp>}
						{(order === 'desc' || !order) && (
							<CaretDown className='desc' weight='bold'></CaretDown>
						)}
					</div>
				</div>
			) : desc ? (
				<Tooltip title={desc}>
					<span className='desc'>{name}</span>
				</Tooltip>
			) : (
				text
			)}
		</th>
	)
}

export default $.memo(Index)
