import { useInsertionEffect } from 'react'
import { App } from 'antd'

import { $ } from '@omnitable/stk/utils'

import type { IPropsAntd } from '../types'

const { useApp } = App

const Index = (props: IPropsAntd) => {
  const { setAntd } = props
  const antd = useApp()

  useInsertionEffect(() => {
    setAntd(antd)
  }, [antd])

  return null
}

export default $.memo(Index)
