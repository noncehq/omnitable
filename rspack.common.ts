import type {RspackOptions} from '@rspack/core'

const postcss_plugins=['autoprefixer','postcss-import', 'postcss-nested', 'postcss-calc']

export default {
	watchOptions: {
		ignored: /node_modules/
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	experiments: {
            css:true,
            // parallelLoader:true,
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
				test: /\.global\.css$/,
				type: 'css',
				use: [
					{
						loader: 'postcss-loader',
                                    // parallel: true,
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
				type: 'css/module',
				exclude: /\.global\.css$/,
				use: [
					{
						loader: 'postcss-loader',
						// parallel: true,
						options: {
							postcssOptions: {
								plugins: postcss_plugins
							}
						}
					}
				]
			},
			{
				test: /\.(png|jpg|svg|mp3)$/,
				type: 'asset/resource'
			},
			{
				resourceQuery: /raw/,
				type: 'asset/source'
			}
		]
	}
} as RspackOptions