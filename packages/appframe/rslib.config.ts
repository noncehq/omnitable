import { deepmerge } from 'deepmerge-ts'

import { pluginReact } from '@rsbuild/plugin-react'

import { rslib } from '../../config'

import type { RslibConfig } from '@rslib/core'

export default deepmerge(rslib, {
  source: {
    entry: {
      components: './src/components/index.ts',
      theme: './src/theme/index.ts',
      preset: './src/preset/index.ts',
    },
  },
  output: {
    copy: [{ from: './src/styles/init.css', to: './init.css' }],
  },
  plugins: [pluginReact()],
} as Partial<RslibConfig>)
