import { useOutlet } from 'react-router-dom'
import { $ } from 'stk/utils'

import styles from './index.css'

const Index = () => {
	const outlet = useOutlet()

	return <div className={$.cx(styles._local)}>{outlet}</div>
}

export default $.memo(Index)
