import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import common from '../src/theme/common/index'
import dark from '../src/theme/dark/index'
import light from '../src/theme/light/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const output_path = join(__dirname, '..', 'src', 'styles')

const getVars = theme => {
  return Object.keys(theme).reduce((total, key) => {
    const value = theme[key]
    total += `--${key}:${value};\n` // Ensure newline character
    return total
  }, '')
}

// Ensure the output directory exists (though it should already)
// import { mkdirSync } from 'fs';
// mkdirSync(output_path, { recursive: true });

writeFileSync(join(output_path, 'common.css'), `.omni,.omnitable_root {\n${getVars(common)}\n}`)
writeFileSync(join(output_path, 'light.css'), `.omni,.omnitable_root {\n${getVars(light)}\n}`)
writeFileSync(
  join(output_path, 'dark.css'),
  `[data-theme='dark'] .omni,.dark .omni, [data-theme='dark'] .omnitable_root,.dark .omnitable_root {\n${getVars(dark)}\n}`,
)

console.log('Theme files generated successfully!')
