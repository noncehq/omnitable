import { Button, Form, Select } from 'antd'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { $ } from '@omnitable/stk/utils'
import { DotsSixVertical, Trash } from '@phosphor-icons/react'

import type { FormListFieldData } from 'antd'
import type { IPropsGroupItem } from '../../types'

const { Item } = Form

const Index = (props: IPropsGroupItem & FormListFieldData) => {
  const { group_field_options, name, remove, ...rest } = props

  const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } = useSortable({
    id: name,
  })

  return (
    <div
      className="form_list_item w_100 flex"
      style={{ transform: CSS.Translate.toString(transform), transition }}
      ref={setNodeRef}
      {...attributes}>
      <Item {...rest} className="field_name" name={[name]}>
        <Select showSearch labelInValue placeholder="Select group field" options={group_field_options}></Select>
      </Item>
      <Button className="btn" onClick={() => remove(name)}>
        <Trash></Trash>
      </Button>
      <Button {...listeners} className="btn" ref={setActivatorNodeRef}>
        <DotsSixVertical weight="bold"></DotsSixVertical>
      </Button>
    </div>
  )
}

export default $.memo(Index)
