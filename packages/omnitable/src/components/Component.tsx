import { useMemo } from 'react'
import { $ } from 'stk/utils'

import Date from '../fields/Date'
import DatePicker from '../fields/DatePicker'
import Input from '../fields/Input'
import InputNumber from '../fields/InputNumber'
import Operation from '../fields/Operation'
import Priority from '../fields/Priority'
import RangePicker from '../fields/RangePicker'
import Select from '../fields/Select'
import Tag from '../fields/Tag'
import Text from '../fields/Text'
import Textarea from '../fields/Textarea'

import type { IPropsComponent } from '../types'

const Index = (props: IPropsComponent) => {
	const {
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
		onChange
	} = props
	const { type, width, props: self_props } = column

	const Component = useMemo(() => {
		// 这里不使用React.lazy进行动态导入，因为单元格进入编辑状态时会闪现空白，如果是Form可使用动态导入
		switch (force_type || type) {
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
			case 'operation':
				return Operation
		}
	}, [force_type, type])

	return (
		// @ts-ignore
		<Component
			{...{
				self_props,
				value,
				editing,
				item,
				disabled,
				use_by_filter,
				use_by_form,
				onFocus,
				onBlur,
				onChange
			}}
			width={use_by_form ? undefined : width}
		/>
	)
}

export default $.memo(Index)
