import Decimal from 'decimal.js'

import type { Omnitable } from './types'

export default {
	name: 'table_compare',
	primary: 'id',
	baseurl:
		process.env.NODE_ENV === 'production'
			? 'https://omnitable-worker.openages.workers.dev/api/omnitable/mining'
			: 'http://localhost:8787/api/omnitable/mining',
	actions: {
		query: '/compare'
	},
	filter: {
		columns: [
			{ name: 'Farm', datatype: 'array' },
			{ name: 'Pool', datatype: 'array' },
			{ name: 'Earning', datatype: 'number' }
		]
	},
	hooks: {
		afterQuery: (items: Array<any>) => {
			items.forEach(item => {
				const earning = new Decimal(item.earning)
				const earning_7d = new Decimal(item.earning_7d)
				const earning_28d = new Decimal(item.earning_7d)

				item['change_7d'] = new Decimal(
					earning.minus(earning_7d).div(earning_7d).mul(100).toFixed(2)
				).toNumber()

				item['change_28d'] = new Decimal(
					earning.minus(earning_28d).div(earning_28d).mul(100).toFixed(2)
				).toNumber()
			})

			return items
		}
	},
	table: {
		columns: [
			{ name: '#', width: 60 },
			{ name: 'Period', width: 240, sort: true },
			{ name: 'Farm' },
			{ name: 'Pool' },
			{ name: 'Earning', sort: true },
			{ name: 'Earning (7D)' },
			{ name: 'Change (7D)' },
			{ name: 'Earning (28D)' },
			{ name: 'Change (28D)' },
			{ name: 'Operation' }
		],
		props: {
			pagesize: 100
		}
	},
	group: {
		order: 'Period > Farm > Pool',
		acc: ['Earning', 'Earning (7D)', 'Change (7D)', 'Earning (28D)', 'Change (28D)']
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
			'Earning (7D)': {
				bind: 'earning_7d',
				type: 'text',
				props: {
					suffix: ' BTC'
				}
			},
			'Change (7D)': {
				bind: 'change_7d',
				type: 'tag',
				props: {
					icon_size: '0.8em',
					suffix: '%',
					options: [
						{
							value: '__self__',
							icon: (v: number) => (v > 0 ? 'caret-up' : 'caret-down'),
							color: (v: number) => (v > 0 ? 'success' : 'danger')
						}
					]
				}
			},
			'Earning (28D)': {
				bind: 'earning_28d',
				type: 'text',
				props: {
					suffix: ' BTC'
				}
			},
			'Change (28D)': {
				bind: 'change_28d',
				type: 'tag',
				props: {
					icon_size: '0.8em',
					suffix: '%',
					options: [
						{
							value: '__self__',
							icon: (v: number) => (v > 0 ? 'caret-up' : 'caret-down'),
							color: (v: number) => (v > 0 ? 'success' : 'danger')
						}
					]
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
