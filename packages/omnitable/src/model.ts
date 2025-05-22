import to from 'await-to-js'
import dayjs from 'dayjs'
import { Decimal } from 'decimal.js'
import { groupBy, omit, pick, uniqBy } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import mustache from 'mustache'
import { nanoid } from 'nanoid'
import { ofetch } from 'ofetch'

import { setStorageWhenChange } from '@omnitable/stk/mobx'
import { deepEqual } from '@omnitable/stk/react'
import { $, isMillisecondTimestamp } from '@omnitable/stk/utils'

import { timeline_args_map } from './metadata'

import type { Omnitable } from './types'
import type { useAppProps } from 'antd/es/app/context'
import type { IReactionDisposer, Lambda } from 'mobx'
import type { StatType } from './metadata'
import type { CategoricalChartState } from 'recharts/types/chart/types'

export default class Index {
	antd = null as unknown as useAppProps
	primary = 'id'
	props = null as unknown as Omnitable.Props
	config = null as unknown as Omnitable.Config
	filter_columns = [] as Array<Omnitable.FilterColumn & Omnitable.Field>
	table_columns = [] as Array<Omnitable.TableColumn & Omnitable.Field>
	form_columns = [] as Array<Omnitable.FormColumn & Omnitable.Field>
	editing_info = null as null | { row_index: number; field: string; focus: boolean }

	sort_columns = [] as Array<Omnitable.TableColumn & Omnitable.Field>
	sort_field_options = [] as Array<{ label: string; value: any; disabled?: boolean }>
	sort_params = [] as Array<{ field: string; order: 'desc' | 'asc' }>
	filter_relation = 'and' as 'and' | 'or'
	filter_params = [] as Array<{ field: string; expression: string; value: any; shadow?: boolean }>
	stat_params = [] as Array<{ field: string; type: StatType }>
	stat_items = [] as Array<any>

	group_params = { fields: [], acc: [] } as {
		fields: Array<{ label: string; value: string }>
		acc: Array<{ label: string; value: string }>
	}

	visible_columns = [] as Array<{ name: string; id: string; visible: boolean }>

	apply_view_name = ''
	views = [] as Array<{
		name: string
		sort_params: Index['sort_params']
		filter_relation: Index['filter_relation']
		filter_params: Index['filter_params']
		stat_params: Index['stat_params']
		group_params: Index['group_params']
		visible_columns: Index['visible_columns']
	}>

	modal_type = 'view' as 'view' | 'edit' | 'add'
	modal_index = null as any
	modal_visible = false
	modal_view_visible = false

	loading_init = true
	querying = false
	loading = false
	refreshing = false
	living = false

	timeline_type = 'hours' as 'minutes' | 'hours' | 'days'
	timeline_timestamp = dayjs().valueOf()
	timeline_focus = null as number | null
	timeline_range = null as [number, number] | null
	timeline_items = [] as Array<any>
	timeline_querying = false

	items = [] as Array<any>
	items_raw = [] as Array<any>
	pagination = { page: 1, pagesize: 12, total: 0 } as {
		page: number
		pagesize: number
		total: number
	}

	living_timer = null as NodeJS.Timeout | null
	disposers = [] as Array<IReactionDisposer | Lambda>

	constructor() {
		makeAutoObservable(
			this,
			{
				antd: false,
				primary: false,
				props: false,
				config: false,
				items_raw: false,
				living_timer: false,
				disposers: false
			},
			{ autoBind: true }
		)
	}

	async init(args: { props: Index['props']; antd: Index['antd'] }) {
		const { props, antd } = args

		this.loading_init = true
		this.antd = antd

		if ('config_url' in props) {
			await this.getConfig(props.config_url)
		} else {
			this.config = props
		}

		if ('suspending' in this.config && this.config['suspending']) return

		this.disposers = [setStorageWhenChange([{ [`${this.config.name}:views`]: 'views' }], this)]

		const primary = this.config.primary
		const pagesize = this.config.table.props?.pagesize

		if (primary) this.primary = primary
		if (pagesize) this.pagination = { ...this.pagination, pagesize }

		this.make()
		this.getSortFieldOptions()

		if (this.config.group) this.makeGroupParams()
		if (this.config.stat?.columns?.length) this.makeStatParams()

		await this.query()

		this.loading_init = false

		this.on()
	}

	async getConfig(config_url: string) {
		const [err, res] = await to<Index['config']>(ofetch(config_url))

		if (err) return this.antd.message.error(`配置请求出错 ${err.message}`)

		this.config = res
	}

	async query(ignore_querying?: boolean, ignore_timeline_query?: boolean) {
		if (!ignore_querying) this.querying = true

		let err = null as Error
		let res = null as Omnitable.Error | { data: Omnitable.List }

		if (this.config.adapter) {
			res = await this.config.adapter.query(
				$.copy({
					config: this.config,
					sort_params: this.sort_params,
					filter_relation: this.filter_relation,
					filter_params: this.filter_params.filter(i => 'value' in i),
					page: this.pagination.page,
					pagesize: this.pagination.pagesize
				})
			)
		} else {
			const { api, params } = this.getAction(this.config.actions.query)

			const response = await to<Omnitable.Error | { data: Omnitable.List }>(
				ofetch(`${this.config.baseurl}${api}`, {
					method: 'POST',
					body: {
						sort_params: this.sort_params,
						filter_relation: this.filter_relation,
						filter_params: this.filter_params.filter(i => 'value' in i),
						page: this.pagination.page,
						pagesize: this.pagination.pagesize,
						params
					}
				})
			)

			err = response[0]
			res = response[1]
		}

		if (!ignore_querying) this.querying = false

		if (err) {
			this.antd.message.error(`Query error: ${err?.message}`)

			return false
		}

		if ('error' in res) {
			this.antd.message.error(`${res.error}: ${res.message}`)

			return false
		}

		const items = this.config.hooks?.afterQuery ? this.config.hooks.afterQuery(res.data.items) : res.data.items

		this.items_raw = items

		if (this.group_params.fields.length) {
			this.items = this.makeGroupData(items, $.copy(this.group_params.fields), $.copy(this.group_params.acc))
		} else {
			this.items = items
		}

		this.pagination = { ...this.pagination, ...omit(res.data, 'items') }

		this.getStatItems()

		if (!ignore_timeline_query) this.queryTimeline()
	}

	async create(v: any) {
		this.loading = true

		const { api, params } = this.getAction(this.config.actions.create!)

		const [err, res] = await to<Omnitable.MutationResponse>(
			ofetch(`${this.config.baseurl}${api}`, {
				method: 'POST',
				body: {
					...(this.config.hooks?.beforeCreate ? this.config.hooks.beforeCreate(v) : v),
					params
				}
			})
		)

		this.loading = false
		this.modal_visible = false

		if (err) {
			this.antd.message.error(`Create error: ${err.message}`)

			return false
		}

		if ('error' in res) {
			this.antd.message.error(`${res.error}: ${res.message}`)

			return false
		}

		this.query()
	}

	async update(primary_value: number | string, v: any) {
		this.loading = true

		const { api, params } = this.getAction(this.config.actions.update!)

		const url = mustache.render(`${this.config.baseurl}${api}`, {
			[this.primary]: primary_value
		})

		const [err, res] = await to<Omnitable.MutationResponse>(
			ofetch(url, {
				method: 'POST',
				body: {
					...(this.config.hooks?.beforeUpdate ? this.config.hooks.beforeUpdate(v) : v),
					params
				}
			})
		)

		this.loading = false
		this.modal_visible = false

		if (err) {
			this.antd.message.error(`Update error: ${err.message}`)

			return false
		}

		if ('error' in res) {
			this.antd.message.error(`${res.error}: ${res.message}`)

			return false
		}

		this.query(true)
	}

	async delete(primary_value: number | string) {
		const { api, params } = this.getAction(this.config.actions.delete!)

		const url = mustache.render(`${this.config.baseurl}${api}`, {
			[this.primary]: primary_value
		})

		const [err, res] = await to<Omnitable.MutationResponse>(ofetch(url, { method: 'POST', body: { params } }))

		if (err) {
			this.antd.message.error(`Delete error: ${err.message}`)

			return false
		}

		if ('error' in res) {
			this.antd.message.error(`${res.error}: ${res.message}`)

			return false
		}

		this.query(true)
	}

	async queryTimeline() {
		if (!this.config?.timeline) return

		this.timeline_querying = true

		const [err, res] = await to<Omnitable.Error | { data: Index['timeline_items'] }>(
			ofetch(`${this.config.baseurl}${this.config.timeline!.api}`, {
				method: 'GET',
				query: { type: this.timeline_type, timestamp: this.timeline_timestamp }
			})
		)

		this.timeline_querying = false

		if (err) {
			this.antd.message.error(`Query timeline error: ${err?.message}`)

			return false
		}

		if ('error' in res) {
			this.antd.message.error(`${res.error}: ${res.message}`)

			return false
		}

		this.timeline_items = res.data
	}

	async onChange(index: number, v: any) {
		const operation = v._operation
		const from_modal = index === -1

		if (operation) {
			if (operation.key === 'delete') {
				this.modal_index = index

				this.antd.modal.confirm({
					title: this.config.table.delete_tips?.title || 'Are you absolutely sure?',
					content:
						this.config.table.delete_tips?.content ||
						'This action cannot be undone. This will permanently delete this record.',
					centered: true,
					closable: true,
					icon: null,
					destroyOnClose: true,
					getContainer: () => document.body,
					onOk: async () => {
						const target_item = this.items[index]

						this.items.splice(index, 1)

						const res = await this.delete(target_item[this.primary])

						if (res === undefined) {
							this.modal_index = -2

							return
						}

						// 更新出错，重新插入数据
						this.items.splice(index, 0, target_item)
					},
					onCancel: () => {
						this.modal_index = -2
					}
				})
			} else {
				this.modal_type = operation.key
				this.modal_index = index
				this.modal_visible = true
			}
		} else {
			const target_index = from_modal ? this.modal_index : index
			const target_item = this.items[target_index]

			this.items[target_index] = { ...target_item, ...v }

			if (!Object.keys(v).length) {
				if (from_modal) {
					this.modal_visible = false
					this.modal_index = -2
				}

				return
			}

			const res = await this.update(target_item[this.primary], v)

			if (res === undefined) {
				if (from_modal) {
					this.modal_visible = false
					this.modal_index = -2
				}

				return
			}

			// 更新出错，还原数据
			this.items[target_index] = target_item
		}
	}

	async onRefresh() {
		this.refreshing = true

		await this.query(true)

		this.refreshing = false
	}

	onLive() {
		if (this.living) {
			this.living = false

			if (this.living_timer) clearInterval(this.living_timer)
		} else {
			this.living = true

			this.living_timer = setInterval(() => {
				this.updateTimelineTimestamp()
				this.query(true)
			}, this.config.live! * 1000)
		}
	}

	make() {
		if (this.config.filter?.defaults) {
			this.filter_params = this.config.filter?.defaults
		}

		this.filter_columns =
			this.config.filter?.columns.map(item => {
				const field = this.config.fields.filter?.[item.name] || this.config.fields.common?.[item.name]

				return { ...item, ...field }
			}) || []

		this.table_columns = this.config.table.columns.map(item => {
			const field = this.config.fields.table?.[item.name] || this.config.fields.common?.[item.name]
			const column = { ...item, ...field }

			if (item.sort) {
				this.sort_columns.push(column)

				if (typeof item.sort === 'string') {
					this.sort_params.push({
						field: field.bind,
						order: item.sort
					})
				}
			}

			this.visible_columns.push({ name: column.name, id: column.bind, visible: true })

			return column
		})

		this.sort_params = $.copy(this.sort_params)

		if (!this.config.form || this.config.form?.use_table_columns) {
			const target_columns = this.config.form
				? uniqBy([...this.config.table.columns, ...(this.config.form?.columns || [])], 'name').filter(
						item => !(this.config.form?.exclude_table_columns || []).includes(item.name)
					)
				: this.config.table.columns

			const form_columns = target_columns
				.map(item => {
					const field =
						this.config.fields.form?.[item.name] ||
						this.config.fields.common?.[item.name] ||
						this.config.fields.table?.[item.name]

					if (field.bind === '_operation') return null

					return { ...item, ...field }
				})
				.filter(item => item !== null)

			this.form_columns = uniqBy(form_columns, 'name')
		} else {
			this.form_columns =
				this.config.form?.columns?.map(item => {
					const field = this.config.fields.form?.[item.name] || this.config.fields.common?.[item.name]

					return { ...item, ...field }
				}) || []
		}
	}

	makeStatParams() {
		const columns = this.config.stat?.columns

		if (!columns || !columns.length) return

		columns.forEach(item => {
			const stat_item = this.visible_columns.find(s => s.name === item.name)

			if (stat_item) {
				this.stat_params.push({ field: stat_item.id, type: item.type })
			}
		})

		this.stat_params = $.copy(this.stat_params)
	}

	makeGroupParams() {
		const { order, acc } = this.config.group!

		if (!order) return

		const field_names = order.replace(/\s+/g, '').split('>')
		const visible_columns = [] as Index['visible_columns']
		const group_params = { fields: [], acc: [] } as Index['group_params']

		this.visible_columns.forEach(item => {
			if (field_names.includes(item.name)) {
				group_params.fields.push({ label: item.name, value: item.id })
			}

			if (acc && acc.includes(item.name)) {
				group_params.acc.push({ label: item.name, value: item.id })
			}

			if (!field_names.slice(1).includes(item.name)) {
				visible_columns.push(item)
			}
		})

		this.visible_columns = $.copy(visible_columns)
		this.group_params = $.copy(group_params)
	}

	makeGroupVisible() {
		const fields = $.copy(this.group_params.fields)
		const visible_columns = [] as Index['visible_columns']
		const visible_fields = fields.slice(1)

		this.table_columns.forEach(column => {
			if (!visible_fields.find(f => f.label === column.name)) {
				visible_columns.push({ name: column.name, id: column.bind, visible: true })
			}
		})

		this.visible_columns = $.copy(visible_columns)
	}

	makeGroupData(
		items: Index['items'],
		fields: Index['group_params']['fields'],
		acc: Index['group_params']['acc'],
		target = [] as Index['items'],
		level = 0,
		group_id?: string
	) {
		if (level === fields.length) return target

		const group_field = fields[level]
		const group_data = groupBy(items, group_field.value)
		const group_field_is_number = typeof this.items_raw[0]?.[group_field.value] === 'number'

		level += 1

		Object.keys(group_data).forEach(group_field_value => {
			const children = group_data[group_field_value]
			const current_group_id =
				(group_id ? `${group_id}/` : '') + `${group_field.value}:${group_field.label}:${group_field_value}`

			// 如果field_value是number类型，需要进行还原
			if (group_field_is_number) {
				group_field_value = parseFloat(group_field_value) as unknown as string

				// 如果数字是时间，需要进行格式化
				if (
					this.filter_columns.find(col => col.name === group_field.label)?.datatype === 'date' ||
					isMillisecondTimestamp(group_field_value as unknown as number)
				) {
					group_field_value = dayjs(group_field_value).format('YYYY-MM-DD')
				}
			}

			const group_parent = this.visible_columns.reduce((total, item) => {
				if (item.id === group_field.value) return total

				if (acc.find(a => a.label === item.name)) {
					total[item.id] = children.reduce((all, child) => {
						const real_all = new Decimal(all)
						const real_value = new Decimal(child[item.id])

						all = real_all.plus(real_value).toNumber()

						return all
					}, 0)
				} else {
					total[item.id] = null
				}

				total['__group_field__'] = group_field.value
				total['__group_name__'] = group_field.label
				total['__group_value__'] = group_field_value
				total['__group_id__'] = current_group_id
				total['__group_visible_self__'] = false
				total['__group_visible_children__'] = false

				if (level === 1) {
					total['__group_top__'] = true
				}

				if (level > 1) {
					total['__group_replace__'] = {
						name: this.group_params.fields[0].label,
						value: group_field_value
					}
				}

				if (level < fields.length) {
					total['__group_toggle__'] = true
				}

				return total
			}, {} as any)

			target.push({
				[group_field.value]: group_field_value,
				__group_level__: level - 1,
				...group_parent
			})

			if (level < fields.length) {
				this.makeGroupData(children, fields, acc, target, level, current_group_id)
			}

			if (level === fields.length) {
				children.forEach(item => {
					target.push({
						...item,
						__group_field__: group_field.value,
						__group_name__: this.group_params.fields[0].label,
						__group_id__: current_group_id + '/' + item.id,
						__group_visible_children__: false,
						__group_level__: level,
						__group_bottom__: true,
						__group_replace__: {
							name: this.group_params.fields[0].label,
							value: ''
						}
					})
				})
			}
		})

		return target
	}

	getSortFieldOptions(v?: Index['sort_params']) {
		const options = [] as Index['sort_field_options']
		const disabled_options = [] as Index['sort_field_options']
		const sort_params = v || this.sort_params

		this.sort_columns.forEach(item => {
			const target_item = { label: item.name, value: item.bind }

			if (sort_params.find(s => s.field === item.bind)) {
				disabled_options.push({ ...target_item, disabled: true })
			} else {
				options.push(target_item)
			}
		})

		const sort_field_options = [...options, ...disabled_options]

		if (v) return sort_field_options

		this.sort_field_options = sort_field_options
	}

	getStatItems() {
		if (!this.stat_params.length || !this.items_raw.length) return (this.stat_items = [])

		const items = $.copy(this.items_raw)
		const counts = items.length

		const stat_params_map = this.stat_params.reduce(
			(total, item) => {
				total[`${item.field}:${item.type}`] = {
					...item,
					value: 0
				}

				return total
			},
			{} as Record<string, { field: string; type: StatType; value: number }>
		)

		for (let index = 0; index < items.length; index++) {
			const item = items[index]

			Object.keys(stat_params_map).forEach(key => {
				const stat_item = stat_params_map[key]
				const { field, type } = stat_item
				const stat_item_value = new Decimal(stat_item.value)
				const value = new Decimal(item[field])
				const real_value = value.toNumber()

				switch (type) {
					case 'SUM':
						stat_item.value = stat_item_value.plus(value).toNumber()
						break
					case 'AVG':
						stat_item.value = stat_item_value.plus(value).toNumber()

						if (index === counts - 1) {
							const total_value = new Decimal(stat_item.value)

							stat_item.value = new Decimal(total_value.div(new Decimal(counts)).toFixed(3)).toNumber()
						}
						break
					case 'COUNT':
						if (index === counts - 1) {
							stat_item.value = counts
						}
						break
					case 'MIN':
						if (index === 0 || real_value < stat_item.value) {
							stat_item.value = real_value
						}

						break
					case 'MAX':
						if (real_value > stat_item.value) {
							stat_item.value = real_value
						}
						break
				}
			})
		}

		const stat_items = [] as Array<any>

		Object.keys(stat_params_map).forEach(key => {
			const stat_item = stat_params_map[key]
			const { field, type, value } = stat_item

			stat_items.push({
				__stat_field__: field,
				__stat_type__: type,
				__stat_value__: value
			})
		})

		const group_stat_items = groupBy(stat_items, '__stat_type__')

		this.stat_items = Object.keys(group_stat_items).reduce(
			(total, key) => {
				const items = group_stat_items[key]

				const target = items.reduce((all, it) => {
					all['__stat_type__'] = key
					all[it['__stat_field__']] = it['__stat_value__']

					return all
				}, {} as any)

				total.push(target)

				return total
			},
			[] as Array<any>
		)
	}

	getGroupFieldOptions(v: Index['group_params']['fields']) {
		const options = [] as Array<{ label: string; value: any; disabled?: boolean }>
		const disabled_options = [] as Array<{ label: string; value: any; disabled?: boolean }>

		this.table_columns.forEach(item => {
			const target_item = { label: item.name, value: item.bind }

			if (v.find(s => s.value === item.bind) || item.bind === '_operation') {
				disabled_options.push({ ...target_item, disabled: true })
			} else {
				options.push(target_item)
			}
		})

		return [...options, ...disabled_options]
	}

	onSort(field: string) {
		const exist_sort_index = this.sort_params.findIndex(item => item.field === field)

		if (exist_sort_index === -1) {
			this.sort_params.push({ field, order: 'asc' })
		} else {
			const exist_sort = this.sort_params[exist_sort_index]

			if (exist_sort.order === 'asc') {
				this.sort_params[exist_sort_index].order = 'desc'
			} else {
				this.sort_params.splice(exist_sort_index, 1)
			}
		}

		this.sort_params = $.copy(this.sort_params)

		this.clearApplyView()
		this.query()
	}

	onChangeSort(v: Index['sort_params']) {
		this.sort_params = v

		this.getSortFieldOptions()
		this.clearApplyView()
		this.query()
	}

	onChangeFilter(args: {
		filter_relation?: Index['filter_relation']
		filter_params?: Index['filter_params']
		ignore_query?: boolean
	}) {
		const { filter_relation, filter_params, ignore_query } = args

		if (filter_relation) this.filter_relation = filter_relation
		if (filter_params) this.filter_params = filter_params

		const target_filter_params = this.filter_params.filter(item => item.value)

		this.clearApplyView()

		if (filter_params?.length && !target_filter_params.length) return

		if (!ignore_query) this.query()
	}

	onChangeStat(v: Index['stat_params']) {
		this.stat_params = v

		this.getStatItems()
	}

	onChangeGroup(v: Index['group_params'], apply_view?: boolean) {
		this.group_params = v

		if (!apply_view) this.clearApplyView()

		this.makeGroupVisible()

		if (this.group_params.fields.length) {
			this.items = this.makeGroupData(this.items_raw, $.copy(this.group_params.fields), $.copy(this.group_params.acc))
		} else {
			this.items = this.items_raw
		}
	}

	onChangeTimelineType(v: Index['timeline_type']) {
		this.onResetTimeline()

		this.timeline_type = v
		this.timeline_timestamp = dayjs().valueOf()

		this.queryTimeline()
	}

	onChangeTimelineTimestamp(v: 'prev' | 'next') {
		const { span_value, span_unit } = timeline_args_map[this.timeline_type]

		this.timeline_timestamp = dayjs(this.timeline_timestamp)
			[v === 'prev' ? 'subtract' : 'add'](span_value, span_unit)
			.valueOf()

		this.queryTimeline()
	}

	onTimelineFocus(args: CategoricalChartState) {
		const index = args.activeTooltipIndex

		if (index === undefined) return

		if (this.timeline_focus !== null) return this.resetTimelineFocus()

		this.timeline_focus = index

		this.timeline_range = this.timeline_items[index].range

		const exist_index = this.filter_params.findIndex(item => item.field === this.config.timeline!.control_bind)

		const target_filter_param = {
			field: this.config.timeline!.control_bind,
			expression: 'is between',
			value: this.timeline_range
		}

		if (exist_index !== -1) {
			this.filter_params[exist_index] = target_filter_param
		} else {
			this.filter_params.push(target_filter_param)
		}

		this.filter_params = $.copy(this.filter_params)

		if (this.living) this.onLive()

		this.query(false, true)
	}

	onResetTimeline() {
		this.timeline_type = 'hours'
		this.timeline_timestamp = dayjs().valueOf()

		this.resetTimelineFocus()
	}

	resetTimelineFocus() {
		this.timeline_focus = null

		if (this.timeline_range) {
			this.timeline_range = null

			this.filter_params = $.copy(this.filter_params.filter(item => item.field !== this.config.timeline!.control_bind))

			this.query(false, true)
		} else {
			this.queryTimeline()
		}
	}

	onAddView() {
		this.views.unshift({
			name: 'Table view ' + nanoid(3),
			sort_params: this.sort_params,
			filter_relation: this.filter_relation,
			filter_params: this.filter_params,
			stat_params: this.stat_params,
			group_params: this.group_params,
			visible_columns: this.visible_columns
		})

		this.views = $.copy(this.views)
	}

	onApplyView(view: Index['views'][number]) {
		this.apply_view_name = view.name
		this.visible_columns = view.visible_columns
		this.modal_view_visible = false

		if (!deepEqual($.copy(this.group_params), view.group_params)) {
			this.group_params = view.group_params

			this.onChangeGroup(view.group_params, true)
		}

		if (
			!deepEqual(
				{
					sort_params: $.copy(this.sort_params),
					filter_relation: $.copy(this.filter_relation),
					filter_params: $.copy(this.filter_params)
				},
				pick(view, ['sort_params', 'filter_relation', 'filter_params'])
			)
		) {
			this.sort_params = view.sort_params
			this.filter_relation = view.filter_relation
			this.filter_params = view.filter_params

			this.query()
		}

		if (!deepEqual($.copy(this.stat_params), view.stat_params)) {
			this.stat_params = view.stat_params

			this.getStatItems()
		}
	}

	onSubmit(v: any) {
		switch (this.modal_type) {
			case 'add':
				this.create(v)
				break
			case 'edit':
				const item = this.items[this.modal_index]
				const target = {} as any

				Object.keys(v).forEach(key => {
					if (!deepEqual(item[key], v[key])) {
						target[key] = v[key]
					}
				})

				this.onChange(-1, target)

				break
		}
	}

	onChangePagination(page: number, pagesize: number) {
		this.pagination = { ...this.pagination, page, pagesize }

		this.query()
	}

	clearApplyView() {
		this.apply_view_name = ''
	}

	onVisibilityChange() {
		const state = document.visibilityState

		if (state === 'visible') {
			this.updateTimelineTimestamp()
			this.onRefresh()
		}
	}

	updateTimelineTimestamp() {
		if (!this.config?.timeline) return

		this.timeline_timestamp = dayjs().valueOf()
	}

	getAction(v: Omnitable.Action) {
		if (typeof v === 'string') return { api: v, params: null }

		return v
	}

	on() {
		if (this.config?.refresh?.on_show) {
			document.addEventListener('visibilitychange', this.onVisibilityChange)
		}
	}

	off() {
		this.filter_columns = []
		this.table_columns = []
		this.visible_columns = []
		this.form_columns = []
		this.editing_info = null
		this.sort_columns = []

		if (this.config?.refresh?.on_show) {
			document.removeEventListener('visibilitychange', this.onVisibilityChange)
		}

		this.disposers.map(item => item())
		this.disposers = []
	}
}
