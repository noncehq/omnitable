import { useMemo } from 'react'

import { $ } from '@omnitable/stk/utils'

import { preset_color } from '../../metadata'
import styles from './index.module.css'

import type { Omnitable, ComponentType } from '../../types'
import type { CSSProperties } from 'react'

const Index = (props: ComponentType<Omnitable.Tag['props']>) => {
	const { self_props, width, value, use_by_form } = props
	const {
		options,
		mode = 'full',
		dot_shape = 'circle',
		dot_size = 9,
		icon_size = '1em',
		icon_position = 'left',
		use_bg,
		prefix,
		suffix
	} = self_props

	const option = useMemo(
		() => options.find(item => item.value === value || item.value === '__self__'),
		[value, options]
	)

	const color = useMemo(() => {
		if (!option?.color) return

		let color = ''

		if (typeof option.color === 'function') {
			color = option.color(value)
		} else {
			color = option.color
		}

		if (color in preset_color) {
			color = preset_color[color as keyof typeof preset_color]
		}

		return color
	}, [option?.color, value])

	if (!option) return '-'

	return (
		<div
			className={$.cx(
				'border_box inline_flex align_center',
				styles._local,
				mode === 'dot' && styles.dot_mode,
				use_by_form && styles.use_by_form
			)}
			style={
				{
					width,
					'--tag_color': color
				} as CSSProperties
			}
		>
			<div
				className={$.cx(
					'option_wrap inline_flex align_center',
					mode,
					use_bg && 'use_bg',
					icon_position === 'right' && 'position_right'
				)}
			>
				{option.icon ? (
					<span
						className='icon_wrap flex justify_center align_center'
						style={{ width: icon_size, height: icon_size, fontSize: icon_size }}
					>
						<i
							className={`ph ph-${typeof option.icon === 'function' ? option.icon(value) : option.icon}`}
						></i>
					</span>
				) : (
					<span
						className={$.cx('dot', dot_shape)}
						style={{ width: dot_size, height: dot_size }}
					></span>
				)}
				<span className='text'>
					{prefix}
					{option.label || (option.value === '__self__' ? value : option.value)}
					{suffix}
				</span>
			</div>
		</div>
	)
}

export default $.memo(Index)
