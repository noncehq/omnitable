import { useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { $ } from 'stk/utils'

import { Editor } from '../../components'
import styles from './index.module.css'

import type { Omnitable, ComponentType } from '../../types'

const Index = (props: ComponentType<Omnitable.Editor['props']>) => {
	const { self_props, value, disabled, onChange } = props
	const { max_height } = self_props || {}

	const debounceChange = useMemoizedFn(debounce(onChange!, 600))

	return (
		<div className={$.cx('w_100 flex align_center', styles._local)}>
			<Editor value={value} readonly={disabled} max_height={max_height} onChange={debounceChange}></Editor>
		</div>
	)
}

export default $.memo(Index)
