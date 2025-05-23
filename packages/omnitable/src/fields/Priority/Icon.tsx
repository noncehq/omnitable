import { useMemo } from 'react'

import { $ } from '@omnitable/stk/utils'
import { ExclamationMark } from '@phosphor-icons/react'

import styles from './index.module.css'

interface IProps {
  value?: number
}

const Index = (props: IProps) => {
  const { value } = props

  const Content = useMemo(() => {
    if (value === 0) {
      return (
        <div className="priority_items flex align_end">
          {Array.from({ length: 3 }).map((_, index) => (
            <span className="priority_item" key={index}></span>
          ))}
        </div>
      )
    }

    if ((value as number) < 4) {
      return (
        <div className="priority_items flex align_end">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              className={$.cx('priority_item', (value as number) >= index + 1 && 'active')}
              key={index}></span>
          ))}
        </div>
      )
    }

    return (
      <div className="urgent_wrap flex justify_center align_center">
        <ExclamationMark weight="bold"></ExclamationMark>
      </div>
    )
  }, [value])

  return <div className={$.cx('flex custom_icon_wrap', styles.Icon)}>{Content}</div>
}

export default $.memo(Index)
