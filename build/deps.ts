import { writeFileSync } from 'fs'
import { uniq } from 'lodash-es'

import { dependencies as deps_appframe } from '../packages/appframe/package.json'
import { dependencies as deps_omnitable } from '../packages/omnitable/package.json'
import { dependencies as deps_stk } from '../packages/stk/package.json'

const deps =uniq([...Object.keys(deps_stk),...Object.keys(deps_appframe),...Object.keys(deps_omnitable)]).filter(item=>!['stk','appframe','omnitable'].includes(item)).join(' ')

writeFileSync(`${process.cwd()}/deps.sh`, `pnpm install --save ${deps}`)
