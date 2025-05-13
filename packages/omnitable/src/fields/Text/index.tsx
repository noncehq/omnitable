import mustache from 'mustache'
import { useMemo } from 'react'
import { $ } from 'stk/utils'

import styles from './index.module.css'

import type { Omnitable, ComponentType } from '../../types'

const Index = (props: ComponentType<Omnitable.Text['props']>) => {
	const { value, use_by_form, disabled, item, self_props } = props
	const { format, prefix, suffix, textwrap } = self_props || {}

	const text = useMemo(() => {
		if (!value) return '-'
		if (format) return mustache.render(format, item || {})
		if (textwrap) return mustache.render(textwrap, { value })

		return `${prefix ?? ''}${value}${suffix ?? ''}`
	}, [value, format, prefix, suffix, textwrap])

	return (
		<span
			className={$.cx(
				'border_box',
				styles._local,
				use_by_form && styles.use_by_form,
				disabled && styles.disabled
			)}
		>
			{text}
		</span>
	)
}

export default $.memo(Index)
