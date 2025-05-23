import { Loader2 } from 'lucide-react'

import { $ } from '@omnitable/stk/utils'

import styles from './index.module.css'

export interface IProps {
  className?: HTMLDivElement['className']
  size?: number
  color?: string
}

const Index = (props: IProps) => {
  const { className, size = 24, color = 'var(--color_text)' } = props

  return (
    <div className={$.cx('flex', styles._local, className)} style={{ width: size, height: size }}>
      <Loader2 className="w_100 h_100" strokeWidth={2.1} color={color}></Loader2>
    </div>
  )
}

export default $.memo(Index)
