import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvgr } from '@rsbuild/plugin-svgr'

import type { RsbuildConfig } from '@rsbuild/core'

const is_dev = process.env.NODE_ENV === 'development'
const is_prod = process.env.NODE_ENV === 'production'

const postcss_plugins = ['autoprefixer', 'postcss-import', 'postcss-nested', 'postcss-calc']

export default {
  source: { entry: { index: './index.tsx' } },
  output: { legalComments: 'none' },
  html: { title: 'Omnitable examples', template: './public/index.html' },
  plugins: [pluginReact(), pluginSvgr()],
  performance: { removeConsole: is_prod },
  server: {
    port: 666,
    cors: {
      origin: ['http://localhost:8787'],
    },
  },
  tools: {
    lightningcssLoader: {
      targets: 'chrome >= 120',
      exclude: { isSelector: true },
    },
    postcss: (_, { addPlugins }) => {
      addPlugins(postcss_plugins.map(item => require(item)))
    },
  },
} as RsbuildConfig
