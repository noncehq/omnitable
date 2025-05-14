import { deepmerge } from 'deepmerge-ts'

import { pluginReact } from '@rsbuild/plugin-react'

import { rslib } from '../../config'
import { dependencies } from './package.json'

import type { RslibConfig } from '@rslib/core'

export default deepmerge(rslib, {
	source: {
		entry: {
			components: './src/components/index.ts',
			theme: './src/theme/index.ts',
			preset: './src/preset/index.ts'
		}
	},
	output: {
		externals: Object.keys(dependencies)
	},
	plugins: [pluginReact()]
} as Partial<RslibConfig>)
