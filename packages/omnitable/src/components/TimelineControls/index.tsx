import { useMemoizedFn } from 'ahooks'
import { Select } from 'antd'
import { LoadingCircle } from 'appframe/components'
import dayjs from 'dayjs'
import { $ } from 'stk/utils'

import { ArrowCounterClockwise, CaretLeft, CaretRight } from '@phosphor-icons/react'

import { timeline_args_map, timeline_type_options } from '../../metadata'
import styles from './index.module.css'

import type { IPropsTimelineControls } from '../../types'

const Index = (props: IPropsTimelineControls) => {
	const {
		timeline_type,
		timeline_timestamp,
		timeline_querying,
		timeline_range,
		onChangeTimelineType,
		onChangeTimelineTimestamp,
		onResetTimeline
	} = props
	const prev = useMemoizedFn(() => onChangeTimelineTimestamp('prev'))
	const next = useMemoizedFn(() => onChangeTimelineTimestamp('next'))

	return (
		<div className={$.cx('border_box flex align_center relative', styles._local)}>
			<div className='btn_wrap flex justify_center align_center clickable' onClick={prev}>
				<CaretLeft></CaretLeft>
			</div>
			<div className='type_wrap'>
				<Select
					suffixIcon={null}
					popupMatchSelectWidth={false}
					variant='borderless'
					value={timeline_type}
					options={timeline_type_options}
					onChange={onChangeTimelineType}
				></Select>
			</div>
			<div className='btn_wrap flex justify_center align_center clickable' onClick={next}>
				<CaretRight></CaretRight>
			</div>
			{timeline_range ? (
				<div className='timestamp_wrap'>
					{dayjs(timeline_range[0]).format(timeline_args_map[timeline_type].start_format)}-
					{dayjs(timeline_range[1]).format(timeline_args_map[timeline_type].end_format)}
				</div>
			) : (
				<div className='timestamp_wrap'>
					{dayjs(timeline_timestamp).format(timeline_args_map[timeline_type].duration_format)}
				</div>
			)}
			<div
				className='btn_wrap btn_reset flex justify_center align_center clickable'
				onClick={onResetTimeline}
			>
				<ArrowCounterClockwise size={14}></ArrowCounterClockwise>
			</div>
			{timeline_querying && (
				<div className='timeline_loading_wrap flex justify_center align_center absolute'>
					<LoadingCircle size={14}></LoadingCircle>
				</div>
			)}
		</div>
	)
}

export default Index
