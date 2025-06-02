import { useMemo } from 'react'
import { App } from 'antd'
import en_US from 'antd/locale/en_US'
import { useOutlet } from 'react-router-dom'

import { AntdConfigProvider } from '@omnitable/appframe/components'
import { getAntdTheme } from '@omnitable/appframe/theme'

import Nav from './Nav'

import styles from './layout.module.css'

export default () => {
  const outlet = useOutlet()
  const theme = useMemo(() => getAntdTheme('light'), [])

  return (
    <AntdConfigProvider locale={en_US} theme={theme}>
      <App prefixCls="omni">
        <div className={styles._local}>
          <Nav></Nav>
          {outlet}
        </div>
      </App>
    </AntdConfigProvider>
  )
}
