import { readFileSync, writeFileSync } from 'fs'
import postcss from 'postcss'

const from = `${process.cwd()}/src/styles/index.css`
const to = `${process.cwd()}/dist/global.css`
const source = readFileSync(from)

const plugins = ['autoprefixer', 'postcss-import', 'postcss-nested', 'postcss-calc']

const { css } = await postcss(plugins.map((item) => require(item))).process(source, { from })

writeFileSync(to, css)
