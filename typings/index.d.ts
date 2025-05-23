declare module '*.css'
declare module '*.png'
declare module '*.jpeg'

declare module '*.svg' {
  import { FC, SVGProps } from 'react'

  const content: FC<SVGProps<SVGSVGElement>>

  export default content
}
