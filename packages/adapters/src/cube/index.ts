import to from 'await-to-js'
import { deepmergeCustom } from 'deepmerge-ts'
import { uniq } from 'lodash-es'

import type { Model, Omnitable } from '@omnitable/omnitable'
import type { Filter, TimeDimension, CubeApi } from '@cubejs-client/core'
import type { Query } from '@cubejs-client/core'

const deepmerge = deepmergeCustom({
	mergeArrays: (values, utils) => {
		return uniq(utils.defaultMergeFunctions.mergeArrays(values))
	}
})

export default (cube: CubeApi) => {
	return {
		async query(args: Omnitable.AdapterQueryArgs) {
			const {
				config,
				sort_params,
				time_dimensions = [],
				filter_relation,
				filter_params,
				page,
				pagesize
			} = args
			const cube_options = (config.cube_options || {}) as Query

			const measures = [] as Array<string>
			const dimensions = [] as Array<string>
			const target_time_dimensions = [] as Array<TimeDimension>

			time_dimensions.forEach(item => {
				const field = (config.fields.table?.[item.dimension] || config.fields.common?.[item.dimension])!

				target_time_dimensions.push({
					dimension: field.bind,
					granularity: item.granularity,
					dateRange: item.date_range
				})
			})

			config.table.columns.forEach(item => {
				const field = (config.fields.table?.[item.name] || config.fields.common?.[item.name])!

				if (!field.bind.startsWith('_')) {
					if (item.measure) {
						measures.push(field.bind)
					} else {
						const is_time_dimention = target_time_dimensions.find(
							t => t.dimension === field.bind
						)

						if (!is_time_dimention) dimensions.push(field.bind)
					}
				}
			})

			const order = sort_params.map(item => [item.field, item.order], []) as Array<
				[string, Model['sort_params'][number]['order']]
			>

			const filters = [
				{
					[filter_relation]: filter_params.map(item => {
						const target = {} as { member: string; operator: string; values: Array<string> }

						target['member'] = item.field
						target['operator'] = item.expression
						target['values'] = Array.isArray(item.value) ? item.value : [item.value]

						return target
					}) as Array<Filter>
				}
			] as Array<Filter>

			const [err, res] = await to(
				cube.load(
					deepmerge(
						{
							measures,
							dimensions,
							order,
							timeDimensions: target_time_dimensions,
							filters,
							offset: (page - 1) * pagesize,
							limit: pagesize,
							total: true
						},
						cube_options
					)
				)
			)

			if (err) return { error: err, message: err?.message }

			const items = res.rawData()
			const total = res.totalRows()

			return { data: { items, total } }
		}
	} as Omnitable.Adapter
}

declare module '@omnitable/omnitable' {
	namespace Omnitable {
		export interface Config {
			// cube 自定义配置项，可覆盖和合并table生成的query配置
			cube_options?: Partial<Query>
		}
	}
}
