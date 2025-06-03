import { deepmerge } from 'deepmerge-ts'

import { pluginReact } from '@rsbuild/plugin-react'

import { rslib } from '../../config'

import type { RslibConfig } from '@rslib/core'

export default deepmerge(rslib, {
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  lib: [
    {
      format: 'esm',
      bundle: true,
      output: {
        filename: {
          js: 'index.js',
        },
      },
      autoExternal: true,
    },
  ],
  output: {
    filename: {
      js: 'index.js',
    },
  },
  plugins: [pluginReact()],
  performance: { removeConsole: false },
} as Partial<RslibConfig>)
