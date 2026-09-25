# tampermonkey-scripts

一组使用 TypeScript 编写的 Tampermonkey 用户脚本集合，通过 npm workspaces 进行管理。

## 仓库结构

```
.
├── pixiv-preview/           Pixiv 悬浮预览脚本
│   ├── src/                 脚本源码
│   ├── tests/               单元测试
│   ├── dist/                构建产物（由 CI 自动提交）
│   └── build.mjs            esbuild 构建脚本
├── .github/workflows/       GitHub Actions 工作流
├── package.json             workspaces 根配置
└── tsconfig.json            共享 TypeScript 配置
```

## 脚本列表

| 脚本 | 说明 | 构建产物 |
| --- | --- | --- |
| [pixiv-preview](./pixiv-preview) | 悬浮预览 Pixiv 作品，支持滚轮切图、动图播放与收藏快捷键 | `pixiv-preview/dist/pixiv-preview.user.js` |

## 开发

需要 Node.js 22 或更高版本。

```bash
npm install                       # 安装所有 workspace 依赖
npm run build                     # 构建全部脚本
npm run typecheck                 # 对所有 workspace 执行类型检查
npm test -w pixiv-preview         # 运行 pixiv-preview 单元测试
```

构建产物统一输出到各 workspace 的 `dist/` 目录，不参与类型检查。

## 自动构建

当 `main` 分支的提交涉及脚本源码、依赖或工作流文件时，GitHub Actions 会执行 `npm ci && npm run build`，并在产物发生变化时自动提交 `dist/*.user.js`，因此无需手动提交构建结果。工作流定义见 [.github/workflows/update-pixiv-preview.yml](./.github/workflows/update-pixiv-preview.yml)。

## 许可证

[MIT](./LICENSE)
