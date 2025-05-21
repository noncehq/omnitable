import mustache from 'mustache'
import { useMemo } from 'react'

import { $ } from '@omnitable/stk/utils'

import styles from './index.module.css'
import { getMustacheView } from './utils'

import type { Omnitable, ComponentType } from '../../types'
import type { DOMAttributes } from 'react'

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

	const has_span = text.indexOf('</span>') !== -1
	const attrs = {} as DOMAttributes<HTMLSpanElement>

	if (has_span) {
		attrs['dangerouslySetInnerHTML'] = { __html: has_span ? text : null }
	} else {
		attrs['children'] = text
	}

	return (
		<span
			className={$.cx(
				'inline_flex align_center border_box',
				styles._local,
				use_by_form && styles.use_by_form,
				disabled && styles.disabled
			)}
			{...attrs}
		></span>
	)
}

export default $.memo(Index)
