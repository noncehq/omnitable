import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import { useLayoutEffect, useRef, useState } from 'react'

import { useDeepMemo } from '@omnitable/stk/react'
import { $ } from '@omnitable/stk/utils'
import { CaretRight } from '@phosphor-icons/react'

import { useContext } from '../context'
import { readonly_fields } from '../metadata'
import Component from './Component'

import type { IPropsCol, IPropsComponent } from '../types'

const { Item } = Form

const Index = (props: IPropsCol) => {
  const {
    column,
    value,
    row_index,
    focus,
    item,
    group_info,
    group_level,
    group_replace,
    setEditingField,
    onToggleGroupItems,
  } = props
  const { type, bind, readonly } = column
  const ref_register_fields = useContext(v => v.ref_register_fields)

  const ref = useRef<HTMLTableCellElement>(null)
  const [hover, setHover] = useState(false)

  useLayoutEffect(() => {
    const td = ref.current
    const register_fields = ref_register_fields.current
    const readonly_register_fields = []

    if (register_fields) {
      Object.keys(register_fields).forEach(key => {
        const register_field = register_fields[key]

        if ('Component' in register_field && register_field['readonly']) {
          readonly_register_fields.push(key)
        }
      })
    }

    if (
      !td ||
      readonly ||
      readonly_fields.includes(type) ||
      (type === 'register' && readonly_register_fields.includes(column.field))
    ) {
      return
    }

    const setHoverTrue = () => setHover(true)
    const setHoverFalse = () => setHover(false)

    td.addEventListener('mouseenter', setHoverTrue)
    td.addEventListener('mouseleave', setHoverFalse)

    return () => {
      td.removeEventListener('mouseenter', setHoverTrue)
      td.removeEventListener('mouseleave', setHoverFalse)
    }
  }, [readonly, type, column])

  const onFocus = useMemoizedFn(v => {
    if (v) {
      setEditingField?.({ row_index, field: bind, focus: true })
    } else {
      setEditingField?.(null)
    }
  })

  const onBlur = useMemoizedFn(() => setEditingField?.(null))

  const props_component: IPropsComponent = {
    row_index,
    column,
    editing: focus || hover,
  }

  if (props_component.editing) {
    props_component['onFocus'] = onFocus
    props_component['onBlur'] = onBlur
  } else {
    props_component['value'] = value
  }

  if (item) props_component['item'] = item

  if (group_replace !== undefined) props_component['group_replace'] = group_replace

  const Content = useDeepMemo(() => <Component {...props_component}></Component>, [props_component])

  const onToggleGroup = group_info
    ? useMemoizedFn(() => onToggleGroupItems?.(group_info.group_id))
    : undefined

  return (
    <td
      className={$.cx(
        'form_table_td',
        type === 'operation' && 'operation',
        column.sticky && 'sticky left_0',
      )}
      width={column.width}
      style={{ textAlign: column.align }}
      ref={ref}>
      {group_level && <span style={{ paddingLeft: `calc((1.2em + 8px) * ${group_level})` }}></span>}
      {group_info && (
        <span
          className={$.cx(
            'btn_toggle_group inline_flex justify_center align_center clickable',
            group_info.group_visible_self && 'visible',
          )}
          onClick={onToggleGroup}>
          <CaretRight weight="bold"></CaretRight>
        </span>
      )}
      {group_replace !== undefined ? (
        group_replace
      ) : props_component.editing ? (
        <Item name={bind} noStyle>
          {Content}
        </Item>
      ) : (
        Content
      )}
    </td>
  )
}

export default $.memo(Index)
