# Adpters

## adapter for cube

```ts
import adapter from '@omnitable/adapters/cube'

const cube_api = cube(process.env.PUBLIC_CUBE_API_TOKEN, { apiUrl: process.env.PUBLIC_CUBE_API_URL })

const config={
      name: 'table_cube',
	adapter: adapter(cube),
      // ...
}
```