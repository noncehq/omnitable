import { FC, SVGProps } from 'react'

declare module '*.css'
declare module '*.png'
declare module '*.jpeg'

declare module '*.svg' {
	const content: FC<SVGProps<SVGSVGElement>>

	export default content
}
