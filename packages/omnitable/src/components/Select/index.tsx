import { Select } from 'antd'
import { useMemo } from 'react'

import { $ } from '@omnitable/stk/utils'

import styles from './index.module.css'

import type { Omnitable, ComponentType } from '../../types'

const Index = (props: ComponentType<Omnitable.Select['props']>) => {
	const { self_props, width, value, editing, use_by_form, use_by_filter, onFocus, onBlur, onChange } = props
	const { options, remote, mode, borderless, ...rest_props } = self_props
	const multiple = mode !== undefined

	const option = useMemo(() => {
		if (!options || !options.length) return value

		if (multiple) {
			if (!value || !Array.isArray(value) || !value.length) return

			const targets = options.filter(item => value.includes(item.value)).map(item => item.label)

			return targets.join(',')
		}

		return options.find(item => item.value === value)?.label
	}, [options, value])

	return (
		<div className={$.cx(styles._local, borderless && styles.borderless)} style={{ width }}>
			{editing ? (
				<Select
					{...rest_props}
					className={$.cx((mode || Boolean(width) || remote?.search) && 'w_100')}
					classNames={{ popup: { root: $.cx(styles.popup) } }}
					size={use_by_form ? 'middle' : 'small'}
					popupMatchSelectWidth={false}
					virtual={false}
					suffixIcon={null}
					mode={use_by_filter ? 'multiple' : mode}
					options={options}
					value={value}
					getPopupContainer={() => document.body}
					onOpenChange={onFocus}
					onFocus={onFocus}
					onBlur={onBlur}
					onChange={onChange}
				></Select>
			) : (
				<span
					className={$.cx(
						'text_wrap w_100 border_box inline_flex align_center',
						!option && 'placeholder'
					)}
				>
					{option || self_props.placeholder}
				</span>
			)}
		</div>
	)
}

export default $.memo(Index)
