import dayjs from 'dayjs'

import { $ } from '@omnitable/stk/utils'

import styles from './index.module.css'

import type { Omnitable, ComponentType } from '../../types'

const Index = (props: ComponentType<Omnitable.Date['props']>) => {
  const { self_props, value, use_by_form, disabled } = props
  const { format = 'YYYY-MM-DD' } = self_props || {}

  return (
    <span
      className={$.cx(
        'border_box',
        styles._local,
        use_by_form && styles.use_by_form,
        disabled && styles.disabled,
      )}>
      {value ? dayjs(value).format(format || 'YYYY-MM-DD') : '-'}
    </span>
  )
}

export default $.memo(Index)
