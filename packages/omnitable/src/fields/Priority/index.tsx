import { useMemo } from 'react'

import { $ } from '@omnitable/stk/utils'

import { Select } from '../../components'
import Icon from './Icon'

import type { ReactNode } from 'react'
import type { ComponentType, Omnitable } from '../../types'

const options_preset = [
  {
    label: (
      <span className="flex align_center">
        <Icon value={0}></Icon>
        No priority
      </span>
    ),
    value: 0,
  },
  {
    label: (
      <span className="flex align_center">
        <Icon value={4}></Icon>
        Urgent
      </span>
    ),
    value: 4,
  },
  {
    label: (
      <span className="flex align_center">
        <Icon value={3}></Icon>
        High
      </span>
    ),
    value: 3,
  },
  {
    label: (
      <span className="flex align_center">
        <Icon value={2}></Icon>
        Medium
      </span>
    ),
    value: 2,
  },
  {
    label: (
      <span className="flex align_center">
        <Icon value={1}></Icon>
        Low
      </span>
    ),
    value: 1,
  },
] as Array<{ label: ReactNode; value: undefined | string | number }>

const Index = (props: ComponentType<Omnitable.Priority['props']>) => {
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
