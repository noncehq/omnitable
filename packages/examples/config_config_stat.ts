import type { Omnitable } from './types'

export default {
	name: 'table_config_stat',
	primary: 'id',
	baseurl:
		process.env.NODE_ENV === 'production'
			? 'https://omnitable-worker.openages.workers.dev/api/omnitable/mining'
			: 'http://localhost:8787/api/omnitable/mining',
	actions: {
		query: '/query'
	},
	filter: {
		columns: [
			{ name: 'Period', datatype: 'date' },
			{ name: 'Farm', datatype: 'array' },
			{ name: 'Pool', datatype: 'array' },
			{ name: 'Hashrate', datatype: 'number' },
			{ name: 'Earning', datatype: 'number' }
		]
	},
	table: {
		columns: [
			{ name: '#', width: 60 },
			{ name: 'Period', width: 240, sort: true },
			{ name: 'Farm' },
			{ name: 'Pool' },
			{ name: 'Earning', sort: true },
			{ name: 'Hashrate', sort: true },
			{ name: 'Operation' }
		],
		props: {
			pagesize: 10
		}
	},
	stat: {
		columns: [
			{ name: 'Earning', type: 'SUM' },
			{ name: 'Earning', type: 'AVG' },
			{ name: 'Earning', type: 'MIN' },
			{ name: 'Earning', type: 'MAX' },
			{ name: 'Earning', type: 'COUNT' },

			{ name: 'Hashrate', type: 'SUM' },
			{ name: 'Hashrate', type: 'AVG' },
			{ name: 'Hashrate', type: 'MIN' },
			{ name: 'Hashrate', type: 'MAX' },
			{ name: 'Hashrate', type: 'COUNT' }
		]
	},
	group: {
		hide: true
	},
	form: {
		use_table_columns: true
	},
	fields: {
		common: {
			'#': {
				bind: 'id',
				type: 'text'
			},
			Period: {
				bind: 'period',
				type: 'date',
				props: {
					format: 'YYYY-MM-DD'
				}
			},
			Farm: {
				bind: 'farm',
				type: 'text'
			},
			Pool: {
				bind: 'pool',
				type: 'text'
			},
			Earning: {
				bind: 'earning',
				type: 'text',
				props: {
					suffix: ' BTC'
				}
			},
			Hashrate: {
				bind: 'hashrate',
				type: 'text',
				props: {
					suffix: ' EH/s'
				}
			},
			Operation: {
				bind: '_operation',
				type: 'operation',
				props: {
					no_edit: true,
					no_delete: true
				}
			}
		},
		filter: {
			Period: {
				bind: 'period',
				type: 'date_picker',
				props: {
					placeholder: 'Select date'
				}
			},
			Farm: {
				bind: 'farm',
				type: 'select',
				props: {
					remote: {
						api: '/searchFarms',
						search: 'keyword'
					},
					placeholder: 'Search farm'
				}
			},
			Pool: {
				bind: 'pool',
				type: 'select',
				props: {
					options: [
						{
							label: 'ProfitMine',
							value: 'ProfitMine'
						},
						{
							label: 'MaxiHash',
							value: 'MaxiHash'
						},
						{
							label: 'SwiftPool',
							value: 'SwiftPool'
						},
						{
							label: 'SolidPool',
							value: 'SolidPool'
						}
					],
					placeholder: 'Search farm'
				}
			},
			Hashrate: {
				bind: 'hashrate',
				type: 'input_number',
				props: {
					placeholder: 'Enter a value'
				}
			},
			earning: {
				bind: 'earning',
				type: 'input_number',
				props: {
					placeholder: 'Enter a value'
				}
			}
		}
	}
} as Omnitable.Config
