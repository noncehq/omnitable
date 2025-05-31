import to from 'await-to-js'
import { deepmergeCustom } from 'deepmerge-ts'
import { uniq } from 'lodash-es'

import type { CubeApi, Filter, Query } from '@cubejs-client/core'
import type { Model, Omnitable } from '@omnitable/omnitable'

const deepmerge = deepmergeCustom({
  mergeArrays: (values, utils) => {
    return uniq(utils.defaultMergeFunctions.mergeArrays(values))
  },
})

export default (cube: CubeApi) => {
  return {
    async query(args: Omnitable.AdapterQueryArgs) {
      const { config, sort_params, filter_relation, filter_params, page, pagesize } = args
      const cube_options = (config.cube_options || {}) as Query

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
          }) as Array<Filter>,
        },
      ] as Array<Filter>

      const [err, res] = await to(
        cube.load(
          deepmerge(
            {
              order,
              filters,
              offset: (page - 1) * pagesize,
              limit: pagesize,
              total: true,
            },
            cube_options,
          ),
        ),
      )

      if (err) return { error: err, message: err?.message }

      const items = res.rawData()
      const total = res.totalRows()

      return { data: { items, total } }
    },
  } as Omnitable.Adapter
}

declare module '@omnitable/omnitable' {
  namespace Omnitable {
    export interface Config {
      cube_options?: Partial<Query>
    }
  }
}
