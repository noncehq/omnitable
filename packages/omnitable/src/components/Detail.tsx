import { useLayoutEffect } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Button, Col, ConfigProvider, Form, Row } from 'antd'

import { deepEqual } from '@omnitable/stk/react'
import { $ } from '@omnitable/stk/utils'

import styles from '../index.module.css'
import FormComponent from './FormComponent'

import type { IPropsDetail } from '../types'

const { useForm, Item } = Form

const Index = (props: IPropsDetail) => {
  const { form_columns, modal_type, item, loading, onSubmit, onClose } = props
  const [form] = useForm()
  const { setFieldsValue, getFieldsValue, resetFields } = form

  const disabled = modal_type === 'view'

  useLayoutEffect(() => {
    if (!item) return resetFields()

    const form_item = getFieldsValue()

    if (deepEqual(item, form_item)) return

    setFieldsValue(item)
  }, [item])

  const onFinish = useMemoizedFn(values => {
    onSubmit(values)
  })

  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 30,
          controlHeightSM: 30,
        },
      }}>
      <Form className={styles.Detail} form={form} layout="vertical" disabled={disabled} onFinish={onFinish}>
        <Row gutter={12} wrap>
          {form_columns.map((col, index) => (
            <Col span={col.span || 12} key={index}>
              <Item label={col.name} name={col.bind}>
                <FormComponent
                  column={col}
                  disabled={disabled || col.readonly}
                  item={col.type === 'text' && col.props?.format ? item : undefined}></FormComponent>
              </Item>
            </Col>
          ))}
        </Row>
        {modal_type !== 'view' && (
          <div className="actions_wrap w_100 border_box flex justify_end sticky bottom_0">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </div>
        )}
      </Form>
    </ConfigProvider>
  )
}

export default $.memo(Index)
