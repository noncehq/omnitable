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
import Operation from '../fields/Operation'
import Priority from '../fields/Priority'
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

    // 这里不使用React.lazy进行动态导入，因为单元格进入编辑状态时会闪现空白，如果是Form可使用动态导入
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
      case 'priority':
        return Priority
      case 'editor':
        return Editor
      case 'comments':
        return Comments
      case 'operation':
        return Operation
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

  if ('Component' in Target) {
    const Component = (Target as Omnitable.RegisterFieldValue).Component

    return <Component {...target_props} />
  }

  return (
    // @ts-ignore
    <Target {...target_props} />
  )
}

export default $.memo(X)
