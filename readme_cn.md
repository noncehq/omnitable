# Omnitable

该项目为 monorepo，提供关于使用 omnitable 的环境配置以及组件本体，通过 git submodule 将该仓库添加到指定项目目录，然后在pakcage.json添加 pnpm 依赖，使用 pnpm soft link - "link: ./omnitable/core" 这样的形式来使用本地添加的 omnitable 子仓库。

在 dev 分支开发中🚧.

## Tips

代码格式化需在 vscode 中安装`biome`插件（预览版），才能激活格式化和提交时格式化。