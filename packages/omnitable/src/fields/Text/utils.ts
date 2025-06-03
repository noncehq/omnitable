import Decimal from 'decimal.js'

const getPercent = (value: number | string) => new Decimal(value).mul(100).abs().toFixed(2) + '%'

export const getMustacheView = (value: any, item: any) => ({
  ...item,
  __self__: () => value,
  __percent__: () => getPercent(value),
  __change__: () => {
    return (children: string, render: (template: string) => string) => {
      const percent = new Decimal(render(children)).toNumber()
      const up = percent >= 0

      return `<span class="inline_flex align_center" style="color:var(--color_${up ? 'success' : 'danger'})"><i class="ph ph-arrow-${up ? 'up' : 'down'}"></i>${getPercent(percent)}</span>`
    }
  },
})
