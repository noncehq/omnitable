import { deepmerge } from 'deepmerge-ts'

import { rslib } from '../../config'

import type { RslibConfig } from '@rslib/core'

const modules = ['_placeholder', 'cube']

export default deepmerge(rslib, {
  source: {
    entry: modules.reduce(
      (total, item) => {
        total[item] = `./src/${item}/index.ts`

        return total
      },
      {} as Record<string, string>,
    ),
  },
} as Partial<RslibConfig>)
