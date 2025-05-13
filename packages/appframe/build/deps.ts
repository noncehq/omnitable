import { writeFileSync } from 'fs'

import { dependencies } from '../package.json'

const deps = Object.keys(dependencies).join(' ')

writeFileSync(`${process.cwd()}/deps`, deps)
