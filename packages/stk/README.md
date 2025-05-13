# STK

Shared toolkit for web apps.

To maximize the HMR performance in the main project development environment, you should install all externals in you app:

```bash
pnpm install --save react react-dom fast-equals ahooks mobx lodash-es scheduler classix rfdc
```

Packaging pure es module code with `bun` (aligned with `rollup` in behavior and extremely fast, suitable for packaging libraries that do not change often), and errors encountered during debugging with `rspack`.