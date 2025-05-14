import { useToggle } from 'ahooks'
import { Modal } from 'appframe/components'
import { $ } from 'stk/utils'

import styles from './index.module.css'

const Index = () => {
	const [open, { toggle }] = useToggle()

	return (
		<div className={$.cx(styles._local)}>
			<button onClick={toggle}>toggle</button>
			<Modal open={open} maskClosable onCancel={toggle}>
				12311231
			</Modal>
		</div>
	)
}

export default $.memo(Index)
