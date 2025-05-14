import type { RslibConfig } from '@rslib/core'

const is_dev = process.env.NODE_ENV === 'development'
const postcss_plugins = ['autoprefixer', 'postcss-import', 'postcss-nested', 'postcss-calc']

export default ({
	mode: is_dev ? 'development' : 'production',
	lib: [{ format: 'esm' }],
	output: {
		target: 'web',
		injectStyles: true,
		cleanDistPath: true,
		filename: {
			js: '[name]/index.js'
		},
	},
	performance: {
		chunkSplit: { strategy: 'split-by-module' }
	},
	tools: {
            lightningcssLoader: {
			targets: 'chrome >= 120',
			exclude: { isSelector: true }
		},
		postcss: (_, { addPlugins }) => {
			addPlugins(postcss_plugins.map(item => require(item)))
		}
	}
} as RslibConfig)
