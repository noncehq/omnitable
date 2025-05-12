import { readFileSync, writeFileSync } from 'fs'
import postcss from 'postcss'

const from = `${process.cwd()}/styles/index.css`
const to = `${process.cwd()}/dist/global.css`
const source = readFileSync(from)

const plugins = ['postcss-import', 'postcss-nested', 'postcss-calc', 'autoprefixer']

const { css } = await postcss(plugins.map(item => require(item))).process(source, { from })

writeFileSync(to, css)
