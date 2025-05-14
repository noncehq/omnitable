# Omnitable examples

online preview: https://omnitable-examples.pages.dev/

## Deps

before use omnitable, some deps should install in you app, see `omnitable/deps`.

```bash
pnpm install --save [all external deps in `omnitable/deps`]
```

## Presets

import presets in your app entry:

```tsx
import 'appframe/global.css'
import 'appframe/preset'
```

## Context

use preset context in root layout:

```tsx
import { App } from 'antd'
import en_US from 'antd/locale/en_US'
import { AntdConfigProvider } from 'appframe/components'
import { getAntdTheme } from 'appframe/theme'
import { useMemo } from 'react'
import { useOutlet } from 'react-router-dom'

import styles from './layout.module.css'
import Nav from './Nav'

export default () => {
	const outlet = useOutlet()
	const theme = useMemo(() => getAntdTheme('light'), [])

	return (
		<AntdConfigProvider locale={en_US} theme={theme}>
			<App prefixCls='omni'>
				<div className={styles._local}>
					<Nav></Nav>
					{outlet}
				</div>
			</App>
		</AntdConfigProvider>
	)
}
```

## Using

```tsx
import Omnitable from 'omnitable'

import config from '../../config_normal'

const Index = () => {
	return (
		<div className='table_example_wrap'>
			<Omnitable {...config}></Omnitable>
		</div>
	)
}

export default Index
```

## Attension

Using omnitable in Nextjs, you shuold add `"use client"` on top of file.