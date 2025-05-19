import { $ } from '@omnitable/stk/utils'

import { Select } from '../../components'
import Icon from './Icon'

import type { Omnitable, ComponentType } from '../../types'

const options = [
	{
		label: (
			<span className='flex align_center'>
				<Icon value={0}></Icon>
				No priority
			</span>
		),
		value: 0
	},
	{
		label: (
			<span className='flex align_center'>
				<Icon value={4}></Icon>
				Urgent
			</span>
		),
		value: 4
	},
	{
		label: (
			<span className='flex align_center'>
				<Icon value={3}></Icon>
				High
			</span>
		),
		value: 3
	},
	{
		label: (
			<span className='flex align_center'>
				<Icon value={2}></Icon>
				Medium
			</span>
		),
		value: 2
	},
	{
		label: (
			<span className='flex align_center'>
				<Icon value={1}></Icon>
				Low
			</span>
		),
		value: 1
	}
]

const Index = (props: ComponentType<Omnitable.Priority['props']>) => {
	return <Select {...props} self_props={{ ...props.self_props, options }}></Select>
}

export default $.memo(Index)
