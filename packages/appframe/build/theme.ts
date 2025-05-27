import { writeFileSync } from 'fs'
import { join } from 'path'

import common from '../src/theme/common'
import dark from '../src/theme/dark'
import light from '../src/theme/light'

const output_path = join(process.cwd(), `/src/styles`)

const getVars = (theme: any) => {
  return Object.keys(theme).reduce((total, key: string) => {
    const value = theme[key]

    total += `--${key}:${value};\n`

    return total
  }, '')
}

writeFileSync(`${output_path}/common.css`, `.omni,.omnitable_root {\n${getVars(common)}}`)
writeFileSync(`${output_path}/light.css`, `.omni,.omnitable_root {\n${getVars(light)}}`)
writeFileSync(
  `${output_path}/dark.css`,
  `[data-theme='dark'] .omni,.dark .omni, [data-theme='dark'] .omnitable_root,.dark .omnitable_root {\n${getVars(dark)}}`,
)
