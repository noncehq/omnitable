import { $ } from '@omnitable/stk/utils'

import styles from './index.module.css'

import type { Omnitable, ComponentType } from '../../types'

const Index = (props: ComponentType<Omnitable.Index['props']>) => {
  const { row_index, use_by_form, disabled } = props

  return (
    <span
      className={$.cx(
        'border_box',
        styles._local,
        use_by_form && styles.use_by_form,
        disabled && styles.disabled,
      )}>
      {row_index + 1}
    </span>
  )
}

export default $.memo(Index)
