import { deepmerge } from 'deepmerge-ts'

import { pluginReact } from '@rsbuild/plugin-react'

import { rslib } from '../../config'
import { dependencies } from './package.json'

import type { RslibConfig } from '@rslib/core'

export default deepmerge(rslib, {
	source: {
		entry: {
			index: './src/index.tsx'
		}
	},
	output: {
		externals: Object.keys(dependencies),
		filename: {
			js: 'index.js'
		}
	},
	plugins: [pluginReact()]
} as Partial<RslibConfig>)
