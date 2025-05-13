import { defineConfig } from '@rslib/core'

import { dependencies } from './package.json'

const modules = ['common', 'dnd', 'emittery', 'mobx', 'react', 'storage', 'dom', 'graph', 'utils']

export default defineConfig({
	mode: 'production',
	lib: [{ format: 'esm' }],
	source: {
		entry: modules.reduce((total, item) => {
			total[item] = `./src/${item}/index.ts`

			return total
		}, {})
	},
	output: {
		target: 'web',
		injectStyles: true,
		cleanDistPath: true,
		filename: {
			js: '[name]/index.js'
		},
		externals: Object.keys(dependencies)
	}
})
