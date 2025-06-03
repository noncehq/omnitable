import { useMemo } from 'react'
import dayjs from 'dayjs'

import { $ } from '@omnitable/stk/utils'

import { timeline_args_map } from '../../metadata'
import { preset_color } from './'

import styles from './index.module.css'

import type { TooltipProps } from 'recharts'
import type Model from '../../model'

interface IProps extends Pick<TooltipProps<any, any>, 'payload'> {
  timeline_type: Model['timeline_type']
  items: Required<Model['config']>['header']['timeline']['items']
}

const Index = (props: IProps) => {
  const { timeline_type, items, payload } = props

  if (!payload?.length) return null

  const { payload: item } = payload[0]
  const { range } = item
  const [start, end] = range

  const status_items = useMemo(() => {
    const targets = [] as Array<Required<Model['config']>['header']['timeline']['items'][number] & { count: number }>

    items.forEach(i => {
      if (i.bind in item) {
        targets.push({ ...i, count: item[i.bind] })
      }
    })

    return targets
  }, [items, item])

  return (
    <div className={$.cx('flex flex_column', styles.tooltip)}>
      <span className="title">
        {dayjs(start).format(timeline_args_map[timeline_type].start_format)}-
        {dayjs(end).format(timeline_args_map[timeline_type].end_format)}
      </span>
      <div className="status_items w_100 flex flex_column">
        {status_items.map(item => (
          <div className="status_item w_100 flex justify_between align_center" key={item.bind}>
            <div className="flex align_center">
              <span
                className={$.cx('dot', item.label)}
                style={{
                  backgroundColor:
                    item.color in preset_color ? preset_color[item.color as keyof typeof preset_color] : item.color,
                }}></span>
              <span className="label">{item.label}</span>
              <span className="code">{item.bind}</span>
            </div>
            <span className="count">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default $.memo(Index)
