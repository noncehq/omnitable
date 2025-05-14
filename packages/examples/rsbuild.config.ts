import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvgr } from '@rsbuild/plugin-svgr'

import type { RsbuildConfig } from '@rsbuild/core'

const postcss_plugins = ['autoprefixer', 'postcss-import', 'postcss-nested', 'postcss-calc']

export default {
	server: { port: 666 },
	source: { entry: { index: './index.tsx' } },
	output: { legalComments: 'none' },
	html: { title: 'Omnitable examples', template: './public/index.html' },
	plugins: [pluginReact(), pluginSvgr()],
	tools: {
		postcss: (_, { addPlugins }) => {
			addPlugins(postcss_plugins.map(item => require(item)))
		}
	}
} as RsbuildConfig
