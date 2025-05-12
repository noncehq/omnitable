export default (length?: number) => {
	if (!length) length = 30

	const seed = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
	const array = new Uint8Array(length)

	window.crypto.getRandomValues(array)

	let result = ''

	for (let i = 0; i < length; i++) {
		result += seed[array[i] % seed.length]
	}

	return result
}
