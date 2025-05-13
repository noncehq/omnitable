import { useMemoizedFn } from 'ahooks'
import { Input } from 'antd'
import { debounce } from 'lodash-es'
import { $ } from 'stk/utils'

import styles from './index.module.css'

import type { Omnitable, ComponentType } from '../../types'

const { TextArea } = Input

const Index = (props: ComponentType<Omnitable.Textarea['props']>) => {
	const { self_props, width, value, editing, use_by_form, onFocus, onBlur, onChange } = props
	const {} = self_props || {}

	const debounceChange = onChange ? useMemoizedFn(debounce(onChange!, 600)) : undefined

	return (
		<div
			className={$.cx('w_100 flex align_center', styles._local, use_by_form && styles.use_by_form)}
			style={{ width }}
		>
			{editing ? (
				<TextArea
					{...self_props}
					className='w_100 line_clamp_1'
					variant={use_by_form ? 'outlined' : 'borderless'}
					defaultValue={value}
					onFocus={onFocus}
					onBlur={onBlur}
					onChange={debounceChange}
				></TextArea>
			) : (
				<span className='text_wrap border_box'>{value}</span>
			)}
		</div>
	)
}

export default $.memo(Index)
