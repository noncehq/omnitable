import { $ } from '@omnitable/stk/utils'

import styles from './index.module.css'

import type { ReactNode } from 'react'

export interface IProps {
  className?: string
  size?: number
  desc?: string
  logo: ReactNode
}

const Index = (props: IProps) => {
  const { className, size = 96, desc, logo } = props

  return (
    <div className={$.cx('flex flex_column justify_center align_center', styles._local, className)}>
      <div className="loading_wrap relative">
        <div
          className="loading_icon bottom w_100 h_100 absolute top_0 left_0"
          style={{ width: size, height: size }}>
          {logo}
        </div>
        <div
          className="loading_icon top w_100 h_100 absolute top_0 left_0"
          style={{ width: size, height: size }}>
          {logo}
        </div>
      </div>
      {desc && <span className="desc border_box text_center">{desc}</span>}
    </div>
  )
}

export default $.memo(Index)
