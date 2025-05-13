# Appframe

Preset components and utils for omnitable app.

To maximize the HMR performance in the main project development environment, you should install all externals in you app:

```bash
pnpm install --save "[deps]"
```

`deps` is appframe dir file 'deps'.

Add workspace deps to your package.json:

```json
{
      "dependencies":{
            "appframe": "workspace:*",
            "stk": "workspace:*",
            "omnitable": "workspace:*"
      }
}
```