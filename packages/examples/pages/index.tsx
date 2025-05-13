import { useToggle } from 'ahooks'
import { Modal } from 'appframe/components'
import Omnitable from 'omnitable'
import { $ } from 'stk/utils'

import styles from './index.css'

console.log(Omnitable);

const Index = () => {
	const [open, { toggle }] = useToggle()

	return (
		<div className={$.cx(styles._local)}>
			<button onClick={toggle}>toggle</button>
			<Modal open={open} maskClosable onCancel={toggle}>1231</Modal>
		</div>
	)
}

export default $.memo(Index)
