import { lazy, useMemo, Suspense } from 'react'
import { $ } from 'stk/utils'

interface IProps {
	id: string
}

const Index = (props: IProps) => {
	const { id } = props

	if (!id) return

	const Component = useMemo(() => lazy(() => import(`@website/public/icons/${id}.svg?inline`)), [id])

	return (
		<Suspense fallback={null}>
			<Component />
		</Suspense>
	)
}

export default $.memo(Index)
