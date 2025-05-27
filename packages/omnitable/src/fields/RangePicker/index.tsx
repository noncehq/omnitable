import { useMemoizedFn } from 'ahooks'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'

import { $ } from '@omnitable/stk/utils'

import styles from './index.module.css'

import type { Dayjs } from 'dayjs'
import type { ComponentType, Omnitable } from '../../types'

const { RangePicker } = DatePicker

const Index = (props: ComponentType<Omnitable.RangePicker['props']>) => {
  const { self_props, width, value, editing, use_by_form, onFocus, onChange } = props
  const { format = 'YYYY-MM-DD HH:mm:ss' } = self_props || {}

  const onChangeDate = useMemoizedFn((v: [Dayjs | null, Dayjs | null] | null) =>
    onChange?.(
      v?.[0] && v?.[1] ? [v[0].format('YYYY-MM-DDTHH:mm:ss.SSS'), v[1].format('YYYY-MM-DDTHH:mm:ss.SSS')] : [],
    ),
  )

  return (
    <div
      className={$.cx('w_100 flex align_center', styles._local, use_by_form && styles.use_by_form)}
      style={{ width }}>
      {editing ? (
        <RangePicker
          {...self_props}
          showTime
          classNames={{ popup: { root: styles.popup } }}
          className="w_100"
          placement="bottomLeft"
          suffixIcon={null}
          allowClear={false}
          format={format}
          getPopupContainer={() => document.body}
          value={value ? [dayjs(value[0]), dayjs(value[1])] : undefined}
          onFocus={onFocus}
          onChange={onChangeDate}></RangePicker>
      ) : (
        <span className="text_wrap w_100 line_clamp_1 border_box inline_flex align_center">
          {value
            ? `${dayjs(value[0]).format(Array.isArray(format) ? format[0] : format)} - ${dayjs(value[1]).format(Array.isArray(format) ? format[1] : format)}`
            : '-'}
        </span>
      )}
    </div>
  )
}

export default $.memo(Index)
