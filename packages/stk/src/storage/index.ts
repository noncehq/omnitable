import { emit } from './extends/watch'
import { createProxyStorage } from './proxy/storage'
import { decode, encode } from './proxy/transform'
import { createExpiredFunc, prefix, proxyMap, StorageValue } from './shared'
import { isObject } from './utils'

const is_server = typeof window === 'undefined'

const _local = typeof localStorage !== 'undefined' ? localStorage : undefined
const _session = typeof sessionStorage !== 'undefined' ? sessionStorage : undefined

if (!is_server) {
	window.addEventListener('storage', (e: StorageEvent) => {
		if (e.key && e.key.startsWith(prefix)) {
			let newValue: StorageValue = e.newValue,
				oldValue: StorageValue = e.oldValue

			if (e.newValue) {
				newValue = decode(e.newValue, createExpiredFunc(_local, e.key))

				if (isObject(newValue)) {
					newValue = proxyMap.get(newValue) || newValue
				}
			}

			if (e.oldValue) {
				oldValue = decode(e.oldValue, createExpiredFunc(_local, e.key))

				if (isObject(oldValue)) {
					oldValue = proxyMap.get(oldValue) || oldValue
				}
			}

			emit(_local, e.key.slice(prefix.length), newValue, oldValue)
		}
	})
}

export { setPrefix } from './shared'
export { encode, decode }

export const local: any = createProxyStorage(_local)
export const session: any = createProxyStorage(_session)
