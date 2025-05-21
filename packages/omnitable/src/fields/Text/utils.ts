import Decimal from 'decimal.js'

const getPercent = (value: number | string) => new Decimal(value).mul(100).toFixed(2) + '%'

export const getMustacheView = (value: any, item: any) => ({
	...item,
	__self__: () => value,
	__percent__: () => getPercent(value),
	__change__: () => {
		return (children: string, render: (template: string) => string) => {
			const percent = new Decimal(render(children)).toNumber()
			const up = percent >= 0

			return `<i class="ph ph-arrow-${up ? 'up' : 'down'}"/> <span style="color:rgb(${up ? '34 197 94' : '239 68 68'} / var(--tw-text-opacity, 1))">${getPercent(percent)}</span>`
		}
	}
})
