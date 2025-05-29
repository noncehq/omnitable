import { Fragment, useLayoutEffect, useMemo } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Button, Col, ConfigProvider, Form, Row } from 'antd'

import { deepEqual } from '@omnitable/stk/react'
import { $ } from '@omnitable/stk/utils'

import FormComponent from './FormComponent'

import styles from '../index.module.css'

import type { ReactNode } from 'react'
import type { IPropsDetail } from '../types'

const { useForm, Item } = Form

const Index = (props: IPropsDetail) => {
  const { form_columns, modal_type, item, loading, onSubmit, onClose, render } = props
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

  const Render = useMemo(() => {
    if (!render) {
      return (
        <Fragment>
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
        </Fragment>
      )
    }

    const fields = form_columns.reduce(
      (total, col) => {
        total[col.name] = (
          <Item label={col.name} name={col.bind} noStyle>
            <FormComponent
              column={col}
              disabled={disabled || col.readonly}
              item={col.type === 'text' && col.props?.format ? item : undefined}></FormComponent>
          </Item>
        )

        return total
      },
      {} as Record<string, ReactNode>,
    )

    const options = {
      type: modal_type,
      save: (
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      ),
      close: <Button onClick={onClose}>Cancel</Button>,
      onClose,
    }

    return render(fields, item, options)
  }, [form_columns, modal_type, item, render, onClose])

  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 30,
          controlHeightSM: 30,
        },
      }}>
      <Form className={styles.Detail} form={form} layout="vertical" disabled={disabled} onFinish={onFinish}>
        {Render}
      </Form>
    </ConfigProvider>
  )
}

export default $.memo(Index)
