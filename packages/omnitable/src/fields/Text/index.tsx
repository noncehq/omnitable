import mustache from 'mustache'
import { useMemo } from 'react'

import { $ } from '@omnitable/stk/utils'

import styles from './index.module.css'
import { getMustacheView } from './utils'

import type { Omnitable, ComponentType } from '../../types'

const Index = (props: ComponentType<Omnitable.Text['props']>) => {
	const { value, use_by_form, disabled, item, self_props } = props
	const { format, prefix, suffix, textwrap } = self_props || {}

	const text = useMemo(() => {
		if (!value) return '-'

		const view = getMustacheView(value, item || {})

		if (format) return mustache.render(format, view)
		if (textwrap) return mustache.render(textwrap, view)

		return `${prefix ?? ''}${value}${suffix ?? ''}`
	}, [value, format, prefix, suffix, textwrap])

	const has_span = text.indexOf('<span>') !== -1

	return (
		<span
			className={$.cx(
				'border_box',
				styles._local,
				use_by_form && styles.use_by_form,
				disabled && styles.disabled
			)}
			dangerouslySetInnerHTML={{ __html: has_span ? text : null }}
		>
			{!has_span && text}
		</span>
	)
}

export default $.memo(Index)
