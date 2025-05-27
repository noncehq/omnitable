import { useMemoizedFn } from 'ahooks'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'

import { $ } from '@omnitable/stk/utils'

import styles from './index.module.css'

import type { Dayjs } from 'dayjs'
import type { ComponentType, Omnitable } from '../../types'

const Index = (props: ComponentType<Omnitable.DatePicker['props']>) => {
  const { self_props, width, value, editing, use_by_form, onFocus, onChange } = props
  const { format = 'MMMM D, YYYY' } = self_props || {}

  const onChangeDate = useMemoizedFn((v: Dayjs) => onChange?.(v.format('YYYY-MM-DDTHH:mm:ss.SSS')))

  return (
    <div
      className={$.cx('w_100 flex align_center', styles._local, use_by_form && styles.use_by_form)}
      style={{ width }}>
      {editing ? (
        <DatePicker
          {...self_props}
          classNames={{ popup: { root: styles.popup } }}
          className="w_100"
          placement="bottomLeft"
          suffixIcon={null}
          allowClear={false}
          format={format}
          getPopupContainer={() => document.body}
          value={value ? dayjs(value) : undefined}
          onFocus={onFocus}
          onChange={onChangeDate}></DatePicker>
      ) : (
        <span className="text_wrap w_100 line_clamp_1 border_box inline_flex align_center">
          {value ? dayjs(value).format(format) : '-'}
        </span>
      )}
    </div>
  )
}

export default $.memo(Index)
