import dayjs from 'dayjs'
import { pick } from 'lodash-es'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

import { $ } from '@omnitable/stk/utils'

import { timeline_args_map } from '../../metadata'
import Background from './Background'
import styles from './index.module.css'
import { default as TooltipContent } from './Tooltip'

import type { IPropsTimeline } from '../../types'

export const preset_color = {
	light: 'rgba(var(--color_text_rgb),0.06)',
	dark: 'rgba(var(--color_text_rgb),0.6)',
	success: 'rgba(var(--color_success_rgb),0.6)',
	warning: 'rgba(var(--color_warning_rgb),0.6)',
	danger: 'rgba(var(--color_danger_rgb),0.6)'
}

const Index = (props: IPropsTimeline) => {
	const { label_bind, items, timeline_type, timeline_items, timeline_focus, onTimelineFocus } = props

	return (
		<div className={$.cx(styles._local)}>
			<ResponsiveContainer width='100%' height={60}>
				<BarChart
					margin={{ top: 1, left: 1, right: 1, bottom: 0 }}
					maxBarSize={30}
					barCategoryGap={2}
					data={timeline_items}
					onClick={onTimelineFocus}
				>
					<XAxis
						dataKey={label_bind}
						tickFormatter={v => dayjs(v).format(timeline_args_map[timeline_type].duration_format)}
						tickLine={false}
						axisLine={false}
						fontSize={10}
						tick={{ fill: 'var(--color_text_light)', dy: 0 }}
					/>
					<Tooltip
						wrapperStyle={{ zIndex: 1000 }}
						cursor={{
							fill: 'transparent',
							stroke: 'var(--color_text)',
							strokeWidth: 1
						}}
						content={args => <TooltipContent timeline_type={timeline_type} items={items} payload={args.payload} />}
					/>
					<Bar
						dataKey=''
						stackId='a'
						background={(props: any) => (
							<Background {...pick(props, ['x', 'y', 'width', 'height'])} focus={props.index === timeline_focus} />
						)}
					/>
					{items.map(item => (
						<Bar
							dataKey={item.bind}
							stackId='a'
							fill={item.color in preset_color ? preset_color[item.color as keyof typeof preset_color] : item.color}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}

export default $.memo(Index)
