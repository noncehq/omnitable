import { deepmerge } from 'deepmerge-ts'

import { rslib } from '../../config'
import { dependencies } from './package.json'

import type { RslibConfig } from '@rslib/core'

const modules = ['common', 'dnd', 'emittery', 'mobx', 'react', 'storage', 'dom', 'graph', 'utils']

export default deepmerge(rslib, {
	source: {
		entry: modules.reduce((total, item) => {
			total[item] = `./src/${item}/index.ts`

			return total
		}, {})
	},
	output: {
		externals: Object.keys(dependencies)
	}
} as Partial<RslibConfig>)
