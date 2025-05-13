import type { Omnitable } from './types'

export default {
	name: 'table_log',
	primary: 'id',
	baseurl:
		process.env.NODE_ENV === 'production'
			? 'https://omnitable-worker.openages.workers.dev/api/omnitable/log'
			: 'http://localhost:8787/api/omnitable/log',
	actions: {
		query: '/query'
	},
	filter: {
		columns: [
			{ name: 'Date', datatype: 'date' },
			{ name: 'Status', datatype: 'array' },
			{ name: 'Method', datatype: 'array' },
			{ name: 'Host', datatype: 'string' },
			{ name: 'region_full', datatype: 'string' }
		]
	},
	stat: {
		hide: true
	},
	group: {
		hide: true
	},
	refresh: {
		on_show: true
	},
	live: 3,
	timeline: {
		api: '/getStatusTimeline',
		control_bind: 'create_at',
		label_bind: 'duration',
		items: [
			{
				label: 'Error',
				bind: '5xx',
				color: 'danger'
			},
			{
				label: 'Warning',
				bind: '4xx',
				color: 'warning'
			},
			{
				label: 'Success',
				bind: '2xx',
				color: 'light'
			}
		]
	},
	table: {
		columns: [
			{ name: '#', width: 24, align: 'center' },
			{ name: 'Date', width: 210, sort: true },
			{ name: 'Status' },
			{ name: 'Bg', width: 36, align: 'center' },
			{ name: 'Icon' },
			{ name: 'Method' },
			{ name: 'Host' },
			{ name: 'Pathname', span: 24 },
			{ name: 'Latency', sort: true, span: 24 },
			{ name: 'Region', span: 24 }
		],
		props: {
			pagesize: 18,
			border: true,
			row_click: true,
			row_bg: {
				bind: 'status',
				options: {
					400: 'dark',
					404: 'warning',
					500: 'danger',
					503: 'danger'
				}
			}
		}
	},
	form: {
		use_table_columns: true,
		exclude_table_columns: ['#', 'Bg', 'Icon']
	},
	fields: {
		common: {
			'#': {
				bind: 'status',
				type: 'tag',
				props: {
					mode: 'dot',
					dot_shape: 'round',
					options: [
						{
							label: '200',
							value: 200,
							color: 'success'
						},
						{
							label: '400',
							value: 400,
							color: 'dark'
						},
						{
							label: '404',
							value: 404,
							color: 'warning'
						},
						{
							label: '500',
							value: 500,
							color: 'danger'
						},
						{
							label: '503',
							value: 503,
							color: 'light'
						}
					]
				}
			},
			Date: {
				bind: 'create_at',
				type: 'date',
				props: {
					format: 'YYYY-MM-DD HH:mm:ss'
				}
			},
			Status: {
				bind: 'status',
				type: 'tag',
				props: {
					mode: 'text',
					options: [
						{
							value: 200,
							color: 'success'
						},
						{
							value: 400,
							color: 'dark'
						},
						{
							value: 404,
							color: 'warning'
						},
						{
							value: 500,
							color: 'danger'
						},
						{
							value: 503,
							color: 'light'
						}
					]
				}
			},
			Bg: {
				bind: 'status',
				type: 'tag',
				props: {
					mode: 'text',
					use_bg: true,
					options: [
						{
							value: 200,
							color: 'success'
						},
						{
							value: 400,
							color: 'dark'
						},
						{
							value: 404,
							color: 'warning'
						},
						{
							value: 500,
							color: 'danger'
						},
						{
							value: 503,
							color: 'light'
						}
					]
				}
			},
			Icon: {
				bind: 'status',
				type: 'tag',
				props: {
					mode: 'text',
					options: [
						{
							value: 200,
							color: 'success',
							icon: 'acorn'
						},
						{
							value: 400,
							color: 'dark',
							icon: 'airplane'
						},
						{
							value: 404,
							color: 'warning',
							icon: 'apple-logo'
						},
						{
							value: 500,
							color: 'danger',
							icon: 'at'
						},
						{
							value: 503,
							color: 'light',
							icon: 'baby'
						}
					]
				}
			},
			Method: {
				bind: 'method',
				type: 'text'
			},
			Host: {
				bind: 'host',
				type: 'text'
			},
			Pathname: {
				bind: 'pathname',
				type: 'text'
			},
			Latency: {
				bind: 'latency',
				type: 'text',
				props: {
					suffix: 'ms'
				}
			},
			Region: {
				bind: 'region_short',
				type: 'text',
				props: {
					format: '{{region_short}} {{region_full}}'
				}
			}
		},
		filter: {
			Method: {
				bind: 'method',
				type: 'select',
				props: {
					options: [
						{
							label: 'Get',
							value: 'GET'
						},
						{
							label: 'Post',
							value: 'POST'
						}
					]
				}
			}
		}
	}
} as Omnitable.Config
