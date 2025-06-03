import { useLayoutEffect, useMemo, useState } from 'react'
import { useDeepCompareLayoutEffect, useMemoizedFn } from 'ahooks'
import { App, Select, Spin } from 'antd'
import { observer } from 'mobx-react-lite'

import { LoadingCircle } from '@omnitable/appframe/components'
import { $ } from '@omnitable/stk/utils'

import { useContext } from '../../context'
import Model from './model'

import styles from './index.module.css'

import type { ComponentType, Omnitable } from '../../types'

const { useApp } = App

const Index = (props: ComponentType<Omnitable.Select['props']>) => {
  const { self_props, width, value, editing, use_by_form, use_by_filter, onFocus, onBlur, onChange } = props
  const {
    options: options_raw,
    remote,
    single,
    mode,
    borderless,
    allowClear = false,
    labelInValue = false,
    ...rest_props
  } = self_props || {}

  const [x] = useState(() => new Model())
  const antd = useApp()
  const base_url = useContext(v => v.base_url)
  const [target_value, setTargetValue] = useState(() => value)
  const multiple = mode === 'multiple' || mode === 'tags'
  const options = $.copy(x.options)

  useLayoutEffect(() => {
    x.init({ antd, options_raw, base_url, remote, multiple })
  }, [antd, options_raw, base_url, remote, multiple])

  useDeepCompareLayoutEffect(() => {
    if (!value) return
    if (options.length || !labelInValue) return setTargetValue(value)

    x.getLabeledValues(value).then(res => setTargetValue(res))
  }, [value, options, labelInValue])

  const options_real = useMemo(() => {
    return options.map(item => {
      if (item.icon) {
        item.label = (
          <div className={$.cx('h_100 flex align_center', styles.label)}>
            <div className="icon_wrap flex justify_center align_center" style={{ width: 16, height: 16 }}>
              {item.icon.startsWith('https:') ? (
                <img className="w_100 h_100" src={item.icon} alt="image" />
              ) : (
                <i className={`ph ph-${item.icon}`}></i>
              )}
            </div>
            <span className="text ml_4">{item.label}</span>
          </div>
        )

        delete item['icon']
      }

      return item
    })
  }, [options])

  const option = useMemo(() => {
    if (multiple) {
      if (!value || !Array.isArray(value) || !value.length) return

      const targets = options_real.filter(item => value.includes(item.value)).map(item => item.label)

      return targets.join(',')
    }

    if (!options_real.length) return value

    return options_real.find(item => item.value === value)?.label
  }, [options_real, value])

  const search_props = $.copy(x.search_props)
  const w_100 = (mode || Boolean(width) || remote?.search) && 'w_100'

  const onSelectChange = useMemoizedFn(value => {
    setTargetValue(value)

    if (labelInValue && Array.isArray(value)) {
      return onChange(value.map(item => item.value))
    }

    onChange(value)
  })

  if (x.loading_values) {
    return (
      <div className={$.cx('w_100 border_box flex justify_center align_center', styles.loading_wrap)}>
        <LoadingCircle size={18}></LoadingCircle>
      </div>
    )
  }

  return (
    <div className={$.cx(styles._local, borderless && styles.borderless)} style={{ width }}>
      {editing ? (
        <Select
          {...rest_props}
          {...search_props}
          className={$.cx(w_100)}
          classNames={{ popup: { root: $.cx('omni', styles.popup) } }}
          size={use_by_form ? 'middle' : 'small'}
          popupMatchSelectWidth={false}
          virtual={false}
          suffixIcon={null}
          mode={single ? undefined : use_by_filter ? 'multiple' : mode}
          allowClear={allowClear}
          labelInValue={labelInValue}
          options={options}
          value={target_value}
          notFoundContent={x.loading_search ? <Spin size="small" /> : null}
          getPopupContainer={() => document.body}
          onOpenChange={onFocus}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onSelectChange}></Select>
      ) : (
        <span className={$.cx('text_wrap border_box inline_flex align_center', w_100, !option && 'placeholder')}>
          {option || self_props.placeholder}
        </span>
      )}
    </div>
  )
}

export default $.memo(observer(Index))
