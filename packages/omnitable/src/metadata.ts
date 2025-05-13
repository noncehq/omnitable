import type { Omnitable } from './types'

export const timeline_args_map = {
	minutes: {
		duration_format: 'HH:mm:ss',
		start_format: 'HH:mm:ss',
		end_format: 'HH:mm:ss',
		span_value: 30,
		span_unit: 'minute'
	},
	hours: {
		duration_format: 'MM-DD HH:mm',
		start_format: 'MM-DD HH:mm',
		end_format: 'HH:mm',
		span_value: 24,
		span_unit: 'hour'
	},
	days: {
		duration_format: 'MM-DD HH[H]',
		start_format: 'MM-DD HH[H]',
		end_format: 'HH[H]',
		span_value: 30,
		span_unit: 'day'
	}
} as const

export const timeline_type_options = [
	{ label: 'minutes', value: 'minutes' },
	{ label: 'hours', value: 'hours' },
	{ label: 'days', value: 'days' }
]

export const pagesize_options = [12, 30, 60, 100, 300, 600, 1200]

export const readonly_fields = ['text', 'tag', 'date']

export const sort_options = [
	{
		label: 'Asc',
		value: 'asc'
	},
	{
		label: 'Desc',
		value: 'desc'
	}
]

export const filter_relation_options = [
	{
		label: 'and',
		value: 'and'
	},
	{
		label: 'or',
		value: 'or'
	}
]

export const stat_options = [
	{
		label: 'SUM',
		value: 'SUM'
	},
	{
		label: 'AVG',
		value: 'AVG'
	},
	{
		label: 'COUNT',
		value: 'COUNT'
	},
	{
		label: 'MIN',
		value: 'MIN'
	},
	{
		label: 'MAX',
		value: 'MAX'
	}
] as const

export const preset_color = {
	light: 'var(--color_text_softlight)',
	dark: 'var(--color_text_greylight)',
	success: 'var(--color_success)',
	warning: 'var(--color_warning)',
	danger: 'var(--color_danger)'
}

export type StatType = (typeof stat_options)[number]['value']

export const common_expressions = ['is empty', 'is not empty']

export const filter_expressions = {
	string: ['contains', 'does not contain', 'is', 'is not', ...common_expressions],
	number: [
		'is',
		'is not',
		'is less then',
		'is less then or euqal to',
		'is greater then',
		'is greater then or euqal to',
		'is between',
		...common_expressions
	],
	array: ['has any of', 'has none of', ...common_expressions],
	date: [
		'is',
		'is not',
		'is before',
		'is after',
		'is on or before',
		'is on or after',
		'is between',
		...common_expressions
	]
}

export const getFilterComponentType = (datatype: Omnitable.FilterColumn['datatype'], expression: string) => {
	switch (datatype) {
		case 'string':
			return 'input'
		case 'number':
			return 'input_number'
		case 'array':
			return 'select'
		case 'date':
			if (expression === 'is between') return 'range_picker'

			return 'date_picker'
		default:
			return 'input'
	}
}
