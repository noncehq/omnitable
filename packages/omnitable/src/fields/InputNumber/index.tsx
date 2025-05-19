import { useMemoizedFn } from 'ahooks'
import { InputNumber } from 'antd'
import { debounce } from 'lodash-es'

import { $ } from '@omnitable/stk/utils'

import styles from './index.module.css'

import type { Omnitable, ComponentType } from '../../types'

const Index = (props: ComponentType<Omnitable.InputNumber['props']>) => {
	const { self_props, width, value, editing, use_by_form, disabled, onFocus, onBlur, onChange } = props
	const {} = self_props || {}

	const debounceChange = onChange ? useMemoizedFn(debounce(onChange!, 300)) : undefined

	return (
		<div
			className={$.cx(styles._local, use_by_form && styles.use_by_form, disabled && styles.disabled)}
			style={{ width }}
		>
			{editing ? (
				<InputNumber
					{...self_props}
					className='w_100'
					variant={use_by_form ? 'outlined' : 'borderless'}
					defaultValue={value}
					onFocus={onFocus}
					onBlur={onBlur}
					onChange={debounceChange}
				></InputNumber>
			) : (
				<span className='text_wrap border_box inline_flex align_center'>{value}</span>
			)}
		</div>
	)
}

export default $.memo(Index as any)
