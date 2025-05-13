import type { Omnitable } from './types'

export default {
	name: 'table_normal',
	primary: 'id',
	baseurl:
		process.env.NODE_ENV === 'production'
			? 'https://omnitable-worker.openages.workers.dev/api/omnitable'
			: 'http://localhost:8787/api/omnitable',
	actions: {
		query: '/query',
		create: '/create',
		update: '/update/{{id}}',
		delete: '/delete/{{id}}'
	},
	filter: {
		columns: [
			{ name: 'Title', datatype: 'string' },
			{ name: 'Status', datatype: 'array' },
			{ name: 'Priority', datatype: 'array' },
			{ name: 'Create At', datatype: 'date' },
			{ name: 'Update At', datatype: 'date' }
		]
	},
	table: {
		columns: [
			{ name: 'Task', readonly: true, sticky: true },
			{ name: 'Priority', sort: true },
			{ name: 'Title', width: 540, span: 24 },
			{ name: 'Status', sort: true, span: 24 },
			{ name: 'Create At', readonly: true, sort: true },
			{ name: 'Update At', readonly: true, sort: true },
			{ name: 'Operation' }
		]
	},
	group: {
		hide: true
	},
	form: {
		use_table_columns: true,
		exclude_table_columns: ['Create At', 'Update At'],
		columns: [
			{ name: 'Desc', span: 24 },
			{ name: 'Comments', span: 24 }
		]
	},
	fields: {
		common: {
			Title: {
				bind: 'title',
				type: 'input',
				props: {
					placeholder: 'Search titles'
				}
			},
			Status: {
				bind: 'status',
				type: 'select',
				props: {
					options: [
						{
							label: 'Todo',
							value: 0,
							icon: 'acorn'
						},
						{
							label: 'In-progress',
							value: 1,
							icon: 'timer'
						},
						{
							label: 'Done',
							value: 2,
							icon: 'check-circle'
						},
						{
							label: 'Canceled',
							value: 3,
							icon: 'x-circle'
						}
					],
					placeholder: 'Select status'
				}
			},
			Priority: {
				bind: 'priority',
				type: 'priority',
				props: {
					placeholder: 'Select priorities',
					borderless: true
				}
			},
			'Create At': {
				bind: 'create_at',
				type: 'date',
				props: {
					placeholder: 'Select date'
				}
			},
			'Update At': {
				bind: 'update_at',
				type: 'date',
				props: {
					placeholder: 'Select date'
				}
			},
			Operation: {
				bind: '_operation',
				type: 'operation'
			}
		},
		filter: {},
		table: {
			Task: {
				bind: 'id',
				type: 'text',
				props: {
					format: 'Task-{{id}}'
				}
			}
		},
		form: {
			Title: {
				bind: 'title',
				type: 'textarea',
				props: {
					rows: 3
				}
			},
			Desc: {
				bind: 'description',
				type: 'editor',
				props: {
					max_height: 360
				}
			},
			Comments: {
				bind: 'comments',
				type: 'comments',
				props: {
					binds: {
						date: 'date',
						text: 'text',
						role: 'role'
					}
				}
			}
		}
	}
} as Omnitable.Config
