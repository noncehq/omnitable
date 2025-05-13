import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'

import { dependencies } from './package.json'

const is_dev = process.env.NODE_ENV === 'development'
const postcss_plugins = ['autoprefixer', 'postcss-import', 'postcss-nested', 'postcss-calc']

export default defineConfig({
	mode: is_dev ? 'development' : 'production',
	lib: [{ format: 'esm' }],
	source: {
		entry: {
			components: './src/components/index.ts',
			theme: './src/theme/index.ts',
			preset: './src/preset/index.ts',
			antd_next15_polyfill: './src/antd_next15_polyfill/index.ts'
		}
	},
	output: {
		target: 'web',
		injectStyles: true,
		cleanDistPath: true,
		filename: {
			js: '[name]/index.js'
		},
		externals: Object.keys(dependencies)
	},
	plugins: [pluginReact()],
	tools: {
		postcss: (_, { addPlugins }) => {
			addPlugins(postcss_plugins.map((item) => require(item)))
		}
	}
})
