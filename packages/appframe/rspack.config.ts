import { resolve } from 'path'

import { defineConfig } from '@rspack/cli'

import { dependencies } from './package.json'

const is_dev = process.env.NODE_ENV === 'development'
const is_prod = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
	extends: '../../rspack.common.ts',
	mode: 'production',
	entry: {
		components: './src/components/index.ts',
		theme: './src/theme/index.ts',
		preset: './src/preset/index.ts',
		antd_next15_polyfill: './src/antd_next15_polyfill/index.ts'
	},
	optimization: {
		// 开发库时需要关闭，否则会将 export tree shaking 掉
		usedExports: false
	},
	output: {
		clean: is_prod,
		module: true,
		path: resolve(__dirname, 'dist'),
		filename: '[name]/index.js'
	},
	devtool: is_dev ? 'source-map' : false,
	resolve: {
		tsConfig: resolve(__dirname, 'tsconfig.json')
	},
	externals: Object.keys(dependencies)
})
