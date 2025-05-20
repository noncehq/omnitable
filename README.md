# Omnitable examples

online preview: https://omnitable-examples.pages.dev/

## Local use

By run `git submodule add git@github.com:noncehq/omnitable.git omnitable` to add omnitable monorepo in you app root dir, pull submodule:

```bash
git submodule init
git submodule update
```

Then add `pnpm-workspace.yaml` in you app root dir, and add below to `pnpm-workspace.yaml`:

```yaml
packages:
      - 'omnitable/packages/*'
```

Add this to your package.json:

```json
{
      "dependencies":{
            "@omnitable/omnitable": "workspace:*"
      }
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