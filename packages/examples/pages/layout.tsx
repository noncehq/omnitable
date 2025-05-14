import { App } from 'antd'
import en_US from 'antd/locale/en_US'
import { AntdConfigProvider } from 'appframe/components'
import { getAntdTheme } from 'appframe/theme'
import { useMemo } from 'react'
import { useOutlet } from 'react-router-dom'

import styles from './layout.module.css'
import Nav from './Nav'

export default () => {
	const outlet = useOutlet()
	const theme = useMemo(() => getAntdTheme('light'), [])

	return (
		<AntdConfigProvider locale={en_US} theme={theme}>
			<App prefixCls='omni'>
				<div className={styles._local}>
					<Nav></Nav>
					{outlet}
				</div>
			</App>
		</AntdConfigProvider>
	)
}
