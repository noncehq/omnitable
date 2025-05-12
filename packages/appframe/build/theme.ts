import { writeFileSync } from 'fs'
import { join } from 'path'

import common from '../theme/common'
import dark from '../theme/dark'
import light from '../theme/light'

const output_path = join(process.cwd(), `/styles`)

const getVars = (theme: any) => {
	return Object.keys(theme).reduce((total, key: string) => {
		const value = theme[key]

		total += `--${key}:${value};\n`

		return total
	}, '')
}

writeFileSync(`${output_path}/common.css`, `:root {\n${getVars(common)}}`)
writeFileSync(`${output_path}/light.css`, `:root {\n${getVars(light)}}`)
writeFileSync(`${output_path}/dark.css`, `[data-theme='dark'] {\n${getVars(dark)}}`)
