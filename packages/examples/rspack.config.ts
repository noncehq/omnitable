import { resolve } from 'path'

import { defineConfig } from '@rspack/cli'
import { CopyRspackPlugin, HtmlRspackPlugin, LightningCssMinimizerRspackPlugin } from '@rspack/core'
import ReactRefreshPlugin from '@rspack/plugin-react-refresh'

const postcss_plugins = ['autoprefixer', 'postcss-import', 'postcss-nested', 'postcss-calc']
const is_dev = process.env.NODE_ENV === 'development'
const is_prod = process.env.NODE_ENV === 'production'
const is_module = false
const targets = 'chrome >= 120'

const BASE_URL = is_prod ? 'https://if-server.openages.com' : 'http://localhost:8787'

const plugins_dev = [
	new ReactRefreshPlugin({
		exclude: [/node_modules/]
	})
]

const plugins_prod = [
	new CopyRspackPlugin({
		patterns: [{ from: './public', to: './', globOptions: { ignore: ['**/index.html'] } }]
	})
]

const config = is_prod ? defineConfig({ devtool: false }) : {}

module.exports = defineConfig({
	...config,
	entry: {
		main: './index.tsx'
	},
	output: {
		clean: is_prod
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		tsConfig: resolve(__dirname, 'tsconfig.json')
	},
	devServer: {
		proxy: [
			{
				context: '/api',
				target: BASE_URL,
				changeOrigin: true
			}
		]
	},
	optimization: {
		minimizer: [
			new LightningCssMinimizerRspackPlugin({
				minimizerOptions: {
					targets
				}
			})
		]
	},
	plugins: [
		new HtmlRspackPlugin({
			title: 'Omnitable examples',
			template: './public/index.html',
			scriptLoading: is_module ? 'module' : 'defer',
			templateParameters: {
				NODE_ENV: process.env.NODE_ENV!
			}
		}),
		...(is_dev ? plugins_dev : plugins_prod)
	],
	watchOptions: {
		ignored: /node_modules/
	},
	experiments: {
		css: true,
		rspackFuture: {
			bundlerInfo: { force: false }
		}
	},
	module: {
		parser: {
			css: { namedExports: false },
			'css/auto': { namedExports: false },
			'css/module': { namedExports: false }
		},
		rules: [
			{
				test: /\.tsx?$/,
				type: 'javascript/auto',
				use: {
					loader: 'builtin:swc-loader',
					options: {
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
									development: is_dev,
									refresh: is_dev,
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
			},
			{
				test: /\.module\.css$/,
				type: 'css/module',
				use: [
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: postcss_plugins
							}
						}
					}
				]
			},
			{
				test: /\.css$/,
				type: 'css',
				exclude: /\.module\.css$/,
				use: [
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: postcss_plugins
							}
						}
					}
				]
			},
			{
				resourceQuery: /raw/,
				type: 'asset/source'
			},
			{
				test: /\.(png|jpg|svg|mp3)$/,
				exclude: /\.svg\?react$/,
				type: 'asset/resource'
			},
			{
				test: /\.svg$/,
				resourceQuery: 'react',
				issuer: /\.[jt]sx?$/,
				use: [{ loader: '@svgr/webpack', options: { icon: true } }]
			}
		]
	}
})
