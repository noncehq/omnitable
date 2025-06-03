import { Rectangle } from 'recharts'

import { $ } from '@omnitable/stk/utils'

interface IProps {
  x: number
  y: number
  width: number
  height: number
  focus: boolean
}

const Index = (props: IProps) => {
  const { x, y, width, height, focus } = props

  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill="rgba(var(--color_text_rgb), 0.03)"
      stroke={focus ? 'var(--color_text)' : 'none'}
      strokeWidth={1}
    />
  )
}

export default $.memo(Index)
