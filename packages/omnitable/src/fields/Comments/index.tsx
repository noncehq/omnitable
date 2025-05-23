import { useMemoizedFn } from 'ahooks'
import { Button, Form, Input } from 'antd'
import dayjs from 'dayjs'
import { debounce } from 'lodash-es'
import { useLayoutEffect } from 'react'

import { deepEqual } from '@omnitable/stk/react'
import { $ } from '@omnitable/stk/utils'
import { Plus } from '@phosphor-icons/react'

import styles from './index.module.css'

import type { Omnitable, ComponentType } from '../../types'

const { Item, List, useForm } = Form
const { TextArea } = Input

const Index = (props: ComponentType<Omnitable.Comments['props']>) => {
  const { self_props, value = [], disabled, onChange } = props
  const { binds } = self_props || {}
  const [form] = useForm()
  const { setFieldsValue, getFieldsValue } = form

  useLayoutEffect(() => {
    const item = { items: value }
    const form_values = getFieldsValue()

    if (deepEqual(item, form_values)) return

    setFieldsValue(item)
  }, [value])

  const debounceChange = useMemoizedFn(debounce(onChange!, 600))

  const onValuesChange = useMemoizedFn((_, values) => {
    debounceChange(values.items)
  })

  const add = useMemoizedFn(() => {
    const target = { [binds.date]: dayjs().valueOf(), [binds.text]: '', __new__: true }

    if (binds.role) (target[binds.role] = 'role'), value.push(target)

    onChange!($.copy(value))
  })

  return (
    <Form component={false} disabled={disabled} form={form} onValuesChange={onValuesChange}>
      <List name="items">
        {items => (
          <div className={$.cx('form_items_wrap w_100 flex flex_column', styles._local)}>
            {items.length > 0 && (
              <div className="form_items flex flex_column">
                {items.map(({ key, name: index, ...rest }) => (
                  <div
                    className="form_item_wrap w_100 border_box flex flex_column relative"
                    key={key}>
                    <div className="item_header flex justify_between align_center">
                      <span className="field_date mr_12">
                        {value?.[index]?.[binds.date]
                          ? dayjs(value[index][binds.date]).format('YYYY-MM-DD HH:mm')
                          : ''}
                      </span>
                      {binds.role && (
                        <Item {...rest} name={[index, binds.role]} noStyle>
                          <Input
                            className="field_role text_right"
                            variant="borderless"
                            maxLength={30}
                            disabled={!value[index]['__new__']}></Input>
                        </Item>
                      )}
                    </div>
                    <Item {...rest} name={[index, binds.text]} noStyle>
                      <TextArea
                        className="field_text"
                        autoSize={{ minRows: 2 }}
                        disabled={!value[index]['__new__']}></TextArea>
                    </Item>
                  </div>
                ))}
              </div>
            )}
            <Button className="btn_add" onClick={add}>
              <Plus></Plus>
            </Button>
          </div>
        )}
      </List>
    </Form>
  )
}

export default $.memo(Index)
