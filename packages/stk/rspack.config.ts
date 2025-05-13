// For debuf (rspack show build error)

import { resolve } from 'path'

import { defineConfig } from '@rspack/cli'

import { dependencies } from './package.json'

const is_prod = process.env.NODE_ENV === 'production'

const name = 'graph'

module.exports = defineConfig({
	extends: '../../rspack.common.ts',
	entry: {
		main: `./src/${name}/index.ts`
	},
	output: {
		module: true,
		clean: is_prod,
		path: resolve(__dirname, `dist/${name}`)
	},
	resolve: {
		tsConfig: resolve(__dirname, 'tsconfig.json')
	},
	externals: Object.keys(dependencies)
})
