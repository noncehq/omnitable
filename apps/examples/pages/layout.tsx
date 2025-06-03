import { useMemo } from 'react'
import { App } from 'antd'
import { useOutlet } from 'react-router-dom'

import { AntdConfigProvider } from '@omnitable/appframe/components'
import { getAntdTheme } from '@omnitable/appframe/theme'

import Nav from './Nav'

import styles from './layout.module.css'

export default () => {
  const outlet = useOutlet()
  const theme = useMemo(() => getAntdTheme('light'), [])

  return (
    // @ts-ignore
    <AntdConfigProvider locale="en" theme={theme}>
      <App prefixCls="omni">
        <div className={styles._local}>
          <Nav></Nav>
          {outlet}
        </div>
      </App>
    </AntdConfigProvider>
  )
}
