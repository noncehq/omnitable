import to from 'await-to-js'
import { debounce } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { ofetch } from 'ofetch'
import { decode, encode } from 'stk/storage'

import type { SelectProps } from 'antd'
import type { Omnitable } from '../../types'
import type { useAppProps } from 'antd/es/app/context'

type Options = Array<Omnitable.SelectOption>

export default class Index {
	antd = null as unknown as useAppProps
	base_url = ''
	remote = null as unknown as Omnitable.Select['props']['remote']
	multiple = false
	options = [] as Array<Omnitable.SelectOption>
	search_props = {} as SelectProps<any, Omnitable.SelectOption>
	loading_search = false

	constructor() {
		makeAutoObservable(
			this,
			{ antd: false, base_url: false, remote: false, multiple: false },
			{ autoBind: true }
		)
	}

	init(args: {
		antd: Index['antd']
		options_raw: Array<Omnitable.SelectOption> | undefined
		base_url: string
		remote: Index['remote']
		multiple: Index['multiple']
	}) {
		const { antd, options_raw, base_url, remote, multiple } = args

		this.antd = antd
		this.base_url = base_url

		if (options_raw) this.options = options_raw

		if (remote) {
			this.remote = remote

			if (this.remote.search) {
				this.search_props = {
					showSearch: true,
					filterOption: false,
					defaultActiveFirstOption: false,
					onSearch: debounce(this.search, 450, { leading: false })
				}
			} else {
				this.get()
			}
		}

		this.multiple = multiple
	}

	async get() {
		const remote = this.remote!

		const query = remote.query!
		const session_key = `${remote.api}|${new URLSearchParams(query).toString()}`
		const session_cache = decode(sessionStorage.getItem(session_key)) as Options

		if (session_cache) return (this.options = session_cache)

		const url = remote.api.indexOf('https') !== -1 ? remote.api : `${this.base_url}${remote.api}`

		const [err, res] = await to<Omnitable.Error | Options>(ofetch(url, { query }))

		if (err) {
			this.antd.message.error(`Query error: ${err?.message}`)

			return false
		}

		if ('error' in res) {
			this.antd.message.error(`${res.error}: ${res.message}`)

			return false
		}

		this.options = res

		sessionStorage.setItem(session_key, encode(res))
	}

	async search(v: string) {
		this.loading_search = true

		const remote = this.remote!
		const search = remote.search!
		const query = { ...remote.query, [search]: v }
		const url = remote.api.indexOf('https') !== -1 ? remote.api : `${this.base_url}${remote.api}`

		const [err, res] = await to<Omnitable.Error | Options>(ofetch(url, { query }))

		this.loading_search = false

		if (err) {
			this.antd.message.error(`Query error: ${err?.message}`)

			return false
		}

		if ('error' in res) {
			this.antd.message.error(`${res.error}: ${res.message}`)

			return false
		}

		this.options = res
	}
}
