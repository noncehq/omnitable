# Omnitable examples

online preview: https://omnitable-examples.pages.dev/

## Local use

By run `git submodule add git@github.com:noncehq/ominitable.git omnitable` to add omnitable monorepo in you app root dir, then add `pnpm-workspace.yaml` in you app root dir, and add below to `pnpm-workspace.yaml`:

```yaml
packages:
      - 'omnitable/*'
```

Add this to your package.json:

```json
{
      "dependencies":{
            "appframe": "workspace:*",
            "stk": "workspace:*",
            "omnitable": "workspace:*"
      }
}
```

## Deps

Before use omnitable, some deps should install in you app, see `deps.sh`.

```bash
pnpm install --save [all external deps in `deps.sh`]
```

## Presets

Import presets in your app entry:

```tsx
import 'appframe/global.css'
import 'appframe/preset'
```

## Context

Using preset context in root layout:

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