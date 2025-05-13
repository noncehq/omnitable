import { pascalCase } from 'change-case'
import { lazy, useMemo, Suspense } from 'react'
import { $ } from 'stk/utils'

import type { IPropsFormComponent } from '../types'

const Index = (props: IPropsFormComponent) => {
	const { column, value, item, disabled, use_by_filter, force_type, onChange } = props
	const { type, props: self_props } = column

	const Component = useMemo(
		() => lazy(() => import(`../fields/${pascalCase(force_type || type)}`)),
		[type, force_type]
	)

	return (
		<Suspense fallback={null}>
			<Component
				{...{ self_props, value, item, disabled, onChange }}
				use_by_filter={use_by_filter}
				editing
				use_by_form
			/>
		</Suspense>
	)
}

export default $.memo(Index)
