import { useMemo } from 'react'

import { $ } from '@omnitable/stk/utils'

import { useContext } from '../context'
import Comments from '../fields/Comments'
import Date from '../fields/Date'
import DatePicker from '../fields/DatePicker'
import Editor from '../fields/Editor'
import Index from '../fields/Index'
import Input from '../fields/Input'
import InputNumber from '../fields/InputNumber'
import RangePicker from '../fields/RangePicker'
import Select from '../fields/Select'
import Tag from '../fields/Tag'
import Text from '../fields/Text'
import Textarea from '../fields/Textarea'

import type { IPropsComponent, Omnitable } from '../types'

const X = (props: IPropsComponent) => {
  const {
    row_index,
    column,
    value,
    item,
    force_type,
    editing,
    disabled,
    use_by_filter,
    use_by_form,
    onFocus,
    onBlur,
    onChange,
  } = props
  const { type, width, props: self_props } = column
  const ref_register_fields = useContext(v => v.ref_register_fields)

  const Target = useMemo(() => {
    const target_type = type === 'register' ? column.field : force_type || type
    const register_fields = ref_register_fields.current

    if (register_fields && target_type in register_fields) {
      return register_fields[target_type]
    }

    switch (target_type) {
      case 'index':
        return Index
      case 'text':
        return Text
      case 'input':
        return Input
      case 'input_number':
        return InputNumber
      case 'textarea':
        return Textarea
      case 'select':
        return Select
      case 'tag':
        return Tag
      case 'date':
        return Date
      case 'date_picker':
        return DatePicker
      case 'range_picker':
        return RangePicker
      case 'editor':
        return Editor
      // TODO: migrated to usage `register_fields`
      case 'comments':
        return Comments
    }
  }, [force_type, type, column, ref_register_fields])

  const target_props = {
    row_index,
    self_props,
    value,
    editing,
    item,
    disabled,
    use_by_filter,
    use_by_form,
    width: use_by_form ? undefined : width,
    onFocus,
    onBlur,
    onChange,
  }

  if (Target && 'Component' in Target) {
    const Component = (Target as Omnitable.RegisterFieldValue).Component
    return <Component {...target_props} />
  } else {
    console.warn(`Field type "${type}" is not registered or not supported.`)
  }

  return (
    // @ts-ignore
    <Target {...target_props} />
  )
}

export default $.memo(X)
