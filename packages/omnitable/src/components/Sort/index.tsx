import { useMemoizedFn } from 'ahooks'
import { Button, Form, Popover } from 'antd'
import { useLayoutEffect, useMemo } from 'react'

import { DndContext } from '@dnd-kit/core'
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { deepEqual } from '@omnitable/stk/react'
import { $ } from '@omnitable/stk/utils'
import { ArrowsDownUp } from '@phosphor-icons/react'

import styles from '../../index.module.css'
import SortItem from './Item'

import type { IPropsSort } from '../../types'

const { useForm, List } = Form

const Index = (props: IPropsSort) => {
  const { sort_params, sort_field_options, use_by_view, onChangeSort } = props
  const [form] = useForm()
  const counts = sort_params.length
  const { setFieldsValue, getFieldsValue } = form

  const next_field_value = useMemo(() => {
    if (!sort_field_options.length) return

    return sort_field_options.filter(item => !item.disabled)[0]?.value
  }, [sort_field_options])

  useLayoutEffect(() => {
    const item = { items: sort_params }
    const form_values = getFieldsValue()

    if (deepEqual(item, form_values)) return

    setFieldsValue(item)
  }, [sort_params])

  const onReset = useMemoizedFn(() => onChangeSort([]))

  const onValuesChange = useMemoizedFn(() => {
    const form_values = getFieldsValue()
    const items = (form_values.items as IPropsSort['sort_params']).filter(item => item)

    if (!items.length) return onReset()

    if (items.every(item => item.field && item.order)) {
      onChangeSort(items)
    }
  })

  const Content = (
    <div className={$.cx('flex flex_column', styles.popover_wrap)}>
      <span className="title">{counts ? 'Sort By' : 'No sorting applied'}</span>
      <Form className="flex align_center" form={form} onValuesChange={onValuesChange}>
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
                        <SortItem
                          sort_field_options={sort_field_options}
                          remove={remove}
                          {...args}
                          key={args.key}></SortItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="desc">Add sorting to organize your rows.</div>
                )}
              </div>
              <div className={$.cx('form_list_actions flex', items.length > 0 && 'has_items')}>
                <Button
                  className="clickable"
                  type="primary"
                  disabled={!next_field_value}
                  onClick={() => add({ field: next_field_value, order: 'asc' })}>
                  Add sort
                </Button>
                {counts > 0 && (
                  <Button className="clickable" onClick={onReset}>
                    Reset sorting
                  </Button>
                )}
              </div>
            </div>
          )}
        </List>
      </Form>
    </div>
  )

  if (use_by_view) return Content

  return (
    <Popover trigger={['click']} placement="bottomLeft" content={Content} forceRender>
      <div>
        <button className="header_btn_wrap border_box flex align_center clickable mr_8">
          <ArrowsDownUp className="icon"></ArrowsDownUp>
          <span className="label">Sort</span>
          {counts > 0 && <span className="counts flex align_center">{counts}</span>}
        </button>
      </div>
    </Popover>
  )
}

export default $.memo(Index)
