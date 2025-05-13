import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'

import { dependencies } from './package.json'

const is_dev = process.env.NODE_ENV === 'development'
const is_prod = process.env.NODE_ENV === 'production'
const postcss_plugins = ['autoprefixer', 'postcss-import', 'postcss-nested', 'postcss-calc']

export default defineConfig({
	mode: is_dev ? 'development' : 'production',
	lib: [{ format: 'esm' }],
	source: {
		entry: {
			index: './src/index.tsx'
		}
	},
	output: {
		target: 'web',
		injectStyles: true,
		cleanDistPath: is_prod,
		externals: Object.keys(dependencies)
	},
	plugins: [pluginReact()],
	tools: {
		postcss: (_, { addPlugins }) => {
			addPlugins(postcss_plugins.map(item => require(item)))
		}
	}
})
