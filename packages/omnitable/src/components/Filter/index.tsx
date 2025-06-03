import { useLayoutEffect, useMemo } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Button, Form, Popover } from 'antd'

import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { deepEqual } from '@omnitable/stk/react'
import { $ } from '@omnitable/stk/utils'
import { FunnelSimple } from '@phosphor-icons/react'

import { filter_expressions } from '../../metadata'
import FilterItem from './Item'

import styles from '../../index.module.css'

import type { IPropsFilter } from '../../types'

const { useForm, List } = Form

const Index = (props: IPropsFilter) => {
  const { filter_columns, filter_relation, filter_params, use_by_view, onChangeFilter } = props
  const [form] = useForm()
  const counts = filter_params.length
  const { setFieldsValue, getFieldsValue } = form

  const { default_option, filter_field_options } = useMemo(() => {
    const default_column = filter_columns[0]

    return {
      default_option: {
        field: default_column.bind,
        expression: filter_expressions[default_column.datatype][0],
      } as IPropsFilter['filter_params'][number],
      filter_field_options: filter_columns.map(item => ({ label: item.name, value: item.bind })),
    }
  }, [filter_columns])

  useLayoutEffect(() => {
    const item = { items: filter_params || [] }
    const form_values = getFieldsValue()

    if (deepEqual(item, form_values)) return

    setFieldsValue(item)
  }, [filter_params])

  const onReset = useMemoizedFn(() => onChangeFilter({ filter_params: [] }))

  const onValuesChange = useMemoizedFn(() => {
    const form_values = getFieldsValue()
    const items = (form_values.items as IPropsFilter['filter_params']).filter(item => item)

    if (!items.length) return onReset()

    if (items.every(item => item.field && item.expression)) {
      items.map(item => {
        const column = filter_columns.find(it => it.bind === item.field)!
        const expressions = filter_expressions[column.datatype]

        if (!expressions.includes(item.expression)) {
          item['expression'] = expressions[0]
        }
      })

      onChangeFilter({ filter_params: items })
    }
  })

  const onChangeRelation = useMemoizedFn(v => {
    onChangeFilter({ filter_relation: v })
  })

  const has_range_picker = useMemo(() => filter_params.some(item => item.expression === 'is between'), [filter_params])

  const Content = (
    <div className={$.cx('flex flex_column', styles.popover_wrap, has_range_picker && styles.has_range_picker)}>
      <span className="title">{counts ? 'Filters' : 'No filters applied'}</span>
      <div className="w_100 flex">
        <Form
          className="w_100 flex"
          form={form}
          onValuesChange={onValuesChange}
          onFieldsChange={fields => {
            if (!fields[0]) return

            const name_path = fields[0]?.name
            const value = fields[0]?.value

            if (name_path?.length !== 3) return

            if (name_path.at(0) === 'items') {
              const form_values = getFieldsValue()
              const items = form_values.items as IPropsFilter['filter_params']

              if (name_path.at(-1) === 'field') {
                const index = name_path[1]

                delete items[index]['value']

                onChangeFilter({ filter_params: items, ignore_query: true })
              } else if (name_path.at(-1) === 'expression') {
                if (['set', 'notSet'].includes(value)) {
                  onChangeFilter({ filter_params: items })
                }
              }
            }
          }}>
          <List name="items">
            {(items, { add, remove, move }) => (
              <div className="form_list_wrap w_100 flex flex_column">
                <div className="form_list_items w_100 flex flex_column">
                  {items.length ? (
                    <DndContext
                      onDragEnd={({ active, over }) => {
                        if (!over) return

                        move(active.id as number, over.id as number)
                      }}>
                      <SortableContext
                        items={items.map(item => ({
                          ...item,
                          id: item.name,
                        }))}
                        strategy={verticalListSortingStrategy}>
                        {items.map(args => (
                          <FilterItem
                            filter_relation={filter_relation}
                            filter_columns={filter_columns}
                            filter_field_options={filter_field_options}
                            filter_param={filter_params[args.name] || default_option}
                            onChangeRelation={onChangeRelation}
                            remove={remove}
                            {...args}
                            key={args.key}></FilterItem>
                        ))}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div className="desc">Add filters to refine your rows.</div>
                  )}
                </div>
                <div
                  className={$.cx('form_list_actions filter_actions flex', items.length > 0 && 'has_items')}
                  style={{ paddingLeft: items.length > 0 ? 80 : 0 }}>
                  <Button className="clickable" type="primary" onClick={() => add(default_option)}>
                    Add filter
                  </Button>
                  {counts > 0 && (
                    <Button className="clickable" onClick={onReset}>
                      Reset filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </List>
        </Form>
      </div>
    </div>
  )

  if (use_by_view) return Content

  return (
    <Popover trigger={['click']} placement="bottomLeft" content={Content} forceRender>
      <div>
        <button className="header_btn_wrap border_box flex align_center clickable mr_8">
          <FunnelSimple className="icon"></FunnelSimple>
          <span className="label">Filter</span>
          {counts > 0 && <span className="counts flex align_center">{counts}</span>}
        </button>
      </div>
    </Popover>
  )
}

export default $.memo(Index)
