import type { InputProps, InputNumberProps } from 'antd'
import type { TextAreaProps } from 'antd/es/input'
import type { ReactNode } from 'react'
import type { StatType } from '../metadata'
import type { CSSProperties } from 'react'

export * from './components'

export namespace Omnitable {
	export type Props = LowCodeConfig | Config

	export interface LowCodeConfig {
		config_url: string
	}

	export interface Config {
		// 表名称，用于本地存储的前缀（请保持唯一）
		name: string
		// 主键，默认为 'id'
		primary?: string
		baseurl: string
		// 支持mustache语法 /delete/{{id}} => /delete/3
		actions: {
			// POST
			query: Action
			// POST
			create?: Action
			// POST
			update?: Action
			// POST
			delete?: Action
		}
		hooks?: {
			// 处理数据查询到的数据
			afterQuery?: (v: any) => any
			// 处理要创建的数据
			beforeCreate?: (v: any) => any
			// 处理要变更的数据
			beforeUpdate?: (v: any) => any
		}
		filter?: {
			columns: Array<FilterColumn>
			props?: {}
			flat?: boolean
		}
		stat?: {
			// 预先配置的字段，指定字段生成数据分析结果
			columns?: Array<{ name: string; type: StatType }>
			// 隐藏配置按钮
			hide?: boolean
		}
		// 开启数据分组，支持多层级，
		group?: {
			// 预先配置的字段，表示顺序层级，格式为：'Period > Farm > Pool'
			order?: string
			// 指定在生成group时，哪些字段的值进行累加
			acc?: Array<string>
			// 隐藏配置按钮
			hide?: boolean
		}
		// 显示刷新按钮
		refresh?: {
			// 切换页面时刷新
			on_show?: boolean
		}
		// 开启定时刷新，单位秒
		live?: number
		// 时间线配置
		timeline?: {
			api: string
			// 控制器绑定的查询字段
			control_bind: string
			// 横坐标绑定的变量
			label_bind: string
			// 数据项
			items: Array<{ label: string; bind: string; color: PresetColor | string }>
		}
		table: {
			columns: Array<TableColumn>
			props?: {
				// 预置的pagesize
				pagesize?: number
				border?: boolean
				// 点击row展开详情
				row_click?: boolean
				// 根据某个字段的值改变row的背景色
				row_bg?: {
					bind: string
					options: Record<string, PresetColor | string>
				}
			}
			delete_tips?: { title?: string; content?: string }
		}
		// 可选 form，如果不写就使用 table 的 columns 配置
		form?: {
			// columns中 的字段会覆盖 bind 相同的 table_columns 中的字段
			columns?: Array<FormColumn>
			props?: {}
			// 在table_columns的基础上扩展
			use_table_columns?: boolean
			exclude_table_columns?: Array<string>
		}
		fields: {
			// filter和table可覆盖common中定义的字段
			common: Fields
			filter?: Fields
			table?: Fields
			form?: Fields
		}
	}

	export type Action =
		| string
		| {
				api: string
				params: Record<string, any>
		  }

	export interface BaseColumn {
		name: string
		width?: number
		// form 24栅格，span表示跨度
		span?: number
	}

	export interface FilterColumn extends BaseColumn {
		datatype: 'string' | 'number' | 'array' | 'date'
	}

	export interface TableColumn extends BaseColumn {
		sort?: boolean
		readonly?: boolean
		sticky?: boolean
		align?: CSSProperties['textAlign']
	}

	export interface FormColumn extends BaseColumn {
		readonly?: boolean
	}

	export interface Fields {
		[key: string]: Field
	}

	export type Field = { bind: string } & FieldComponent

	export type FieldComponent =
		| Text
		| Input
		| InputNumber
		| Textarea
		| Select
		| Tag
		| Date
		| DatePicker
		| RangePicker
		| Priority
		| Editor
		| Comments
		| Operation

	export type Text = {
		type: 'text'
		props?: {
			// 开启format的情况下，会传入整个item作为参数
			format?: string
			// "({{value}})"
			textwrap?: string
			// 使用了上面其中一种格式化后prefix和suffix会失效
			prefix?: string
			suffix?: string
		}
	}

	export type Input = {
		type: 'input'
		props?: InputProps
	}

	export type InputNumber = {
		type: 'input_number'
		props?: InputNumberProps
	}

	export type Textarea = {
		type: 'textarea'
		props?: TextAreaProps
	}

	export type Select = {
		type: 'select'
		props: {
			options?: Array<SelectOption>
			// 如果设置remote，则忽略options，使用remote请求options
			remote?: {
				// 如果未设置search，则使用api获取options
				api: string
				// 开启关键词搜索options，值为查询key名称
				search?: string
				// 附带的请求参数
				query?: Record<string, any>
			}
			mode?: 'single' | 'multiple' | 'tags'
			placeholder?: string
			borderless?: boolean
		}
	}

	export interface SelectOption {
		label: ReactNode
		value: string | number | boolean
		icon?: string
	}

	export interface Tag {
		type: 'tag'
		props: {
			options: Array<TagOption>
			mode?: 'dot' | 'text' | 'full'
			dot_shape?: 'circle' | 'round'
			dot_size?: number
			icon_size?: number | string
			icon_position?: 'left' | 'right'
			use_bg?: boolean
			center?: boolean
			prefix?: string
			suffix?: string
		}
	}

	export interface TagOption {
		label?: ReactNode
		value: string | number | boolean | '__self__'
		color: PresetColor | string | ((v: TagOption['value']) => PresetColor | string)
		icon?: string | ((v: TagOption['value']) => string)
	}

	export type Date = {
		type: 'date'
		props?: {
			format?: string
		}
	}

	export type DatePicker = {
		type: 'date_picker'
		props?: {
			format?: string
		}
	}

	export type RangePicker = {
		type: 'range_picker'
		props?: {
			format?: string | [string, string]
		}
	}

	export type Priority = {
		type: 'priority'
		props?: {}
	}

	export type Editor = {
		type: 'editor'
		props?: {
			max_height?: number
		}
	}

	export type Comments = {
		type: 'comments'
		props: {
			// 数据绑定的key
			binds: {
				date: string
				text: string
				role?: string
			}
		}
	}

	export type Operation = {
		type: 'operation'
		props?: {
			no_edit?: boolean
			no_delete?: boolean
		}
	}

	export type PresetColor = 'light' | 'dark' | 'danger' | 'success' | 'warning'

	export interface Error {
		error: string
		message: string
	}

	export type MutationResponse = Error | { id: number }

	export interface List {
		items: Array<any>
		page: number
		pagesize: number
		total: number
	}
}
