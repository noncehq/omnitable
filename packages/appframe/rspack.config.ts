import { resolve } from 'path'

import { defineConfig } from '@rspack/cli'

const is_dev = process.env.NODE_ENV === 'development'
const is_prod = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
	mode: 'production',
	entry: {
		components: './components/index.ts',
		preset: './preset/index.ts',
		theme: './theme/index.ts'
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
	watchOptions: {
		ignored: /node_modules/
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		tsConfig: resolve(__dirname, 'tsconfig.json')
	},
	externals: ['react', 'react-dom', 'antd', 'fast-equals', 'ahooks', 'mobx', 'lodash-es', '@swc/helpers'],
	experiments: {
		rspackFuture: {
			bundlerInfo: { force: false }
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				type: 'javascript/auto',
				use: {
					loader: 'builtin:swc-loader',
					options: {
						isModule: true,
						jsc: {
							parser: {
								syntax: 'typescript',
								tsx: true,
								dynamicImport: true,
								exportDefaultFrom: true,
								exportNamespaceFrom: true,
								decorators: true
							},
							transform: {
								legacyDecorator: true,
								decoratorMetadata: true,
								react: {
									development: !is_prod,
									refresh: !is_prod,
									runtime: 'automatic',
									useBuiltins: true
								}
							},
							externalHelpers: true
						},
						env: {
							targets: 'chrome >= 120'
						}
					}
				}
			}
		]
	}
})
