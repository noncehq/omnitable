import { useMemo } from 'react'

import { Select } from '@omnitable/omnitable'
import { $ } from '@omnitable/stk/utils'

import Icon from './Icon'

import type { ComponentType, Omnitable } from '@omnitable/omnitable'

export type PriorityComponentType = {
  type: 'priority'
  props?: {
    options?: [string]
    placeholder?: string
    borderless?: boolean
  }
}

const options_preset = [
  {
    label: (
      <span className="flex align_center">
        <Icon value={0}></Icon>
        No priority
      </span>
    ),
    value: 'no-priority',
  },
  {
    label: (
      <span className="flex align_center">
        <Icon value={4}></Icon>
        Urgent
      </span>
    ),
    value: 'urgent',
  },
  {
    label: (
      <span className="flex align_center">
        <Icon value={3}></Icon>
        High
      </span>
    ),
    value: 'high',
  },
  {
    label: (
      <span className="flex align_center">
        <Icon value={2}></Icon>
        Medium
      </span>
    ),
    value: 'medium',
  },
  {
    label: (
      <span className="flex align_center">
        <Icon value={1}></Icon>
        Low
      </span>
    ),
    value: 'low',
  },
] as Array<Omnitable.SelectOption>

const Index = (props: ComponentType<PriorityComponentType['props']>) => {
  const { options, ...reset_props } = props.self_props || {}

  const target_options = useMemo(() => {
    if (!options || !options.length) return options_preset

    return options_preset.map((item, index) => {
      item['value'] = options[index]

      return item
    })
  }, [])

  return <Select {...props} self_props={{ ...reset_props, options: target_options }}></Select>
}

export default $.memo(Index)
