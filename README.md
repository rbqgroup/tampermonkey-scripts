# tampermonkey-scripts

一组使用 TypeScript 和 JavaScript 编写的 Tampermonkey 用户脚本集合，通过 npm workspaces 进行管理。

## 仓库结构

```
.
├── pixiv-preview/           Pixiv 悬浮预览脚本
│   ├── src/                 脚本源码
│   ├── tests/               单元测试
│   ├── dist/                构建产物（由 CI 自动提交）
│   └── build.mjs            esbuild 构建脚本
├── twitter-minimal/         X 界面精简与行为优化脚本
│   ├── src/                 原生 JavaScript 用户脚本
│   ├── dist/                可直接安装的用户脚本
│   ├── build.mjs            原样复制源码，保留元数据与页面上下文
│   └── README.md            安装、功能与限制说明
├── .github/workflows/       GitHub Actions 工作流
├── package.json             workspaces 根配置
└── tsconfig.json            共享 TypeScript 配置
```

## 脚本列表

| 脚本 | 说明 | 构建产物 |
| --- | --- | --- |
| [pixiv-preview](./pixiv-preview) | 悬浮预览 Pixiv 作品，支持滚轮切图、动图播放与收藏快捷键 | `pixiv-preview/dist/pixiv-preview.user.js` |
| [twitter-minimal](./twitter-minimal) | 精简 X 侧栏、宽屏适配、净化分享链接、快捷关注、Pixiv 资料链接及保守省流 | [安装脚本](https://raw.githubusercontent.com/rbqgroup/tampermonkey-scripts/main/twitter-minimal/dist/twitter-minimal.user.js) |

### X 界面精简

- 左侧只保留主页、探索、通知、聊天、历史、个人资料和更多；隐藏右侧栏及右下角悬浮入口。
- 按媒体查询适配宽窄屏，时间线自身居中，桌面最大宽度为 1000px。
- 净化复制的推文链接，在未关注作者旁显示快捷关注按钮，并同步异步操作状态。
- 作者资料包含直接 Pixiv 链接时，在原生悬浮资料卡中补充可点击链接；复用页面已加载的数据，不额外访问作者主页，也不重复显示简介已有的链接。
- 保守拦截已知 Jot/Scribe 遥测，限制视频自动播放和预加载；不拦截未知业务接口。

此脚本运行在页面上下文，不需要额外授权。点击视频后才能播放；关注状态缓存在当前页面，
刷新后从网站数据重新读取。确认关注关系依赖 X 的内部页面结构及原生接口，网站更新后可能需要适配。

## 开发

需要 Node.js 22 或更高版本。

```bash
npm install                       # 安装所有 workspace 依赖
npm run build                     # 构建全部脚本
npm run typecheck                 # 对所有 workspace 执行类型检查
npm test -w pixiv-preview         # 运行 pixiv-preview 单元测试
```

构建产物统一输出到各 workspace 的 `dist/` 目录，不参与类型检查。
`typecheck` 仅检查提供该命令的 TypeScript workspace；`twitter-minimal` 保留 JavaScript 源码，不进行 TypeScript 类型检查。

## 自动构建

当 `main` 分支的提交涉及脚本源码、依赖或工作流文件时，GitHub Actions 会执行 `npm ci && npm run build`，并在产物发生变化时自动提交 `dist/*.user.js`，因此无需手动提交构建结果。工作流定义见 [.github/workflows/update-pixiv-preview.yml](./.github/workflows/update-pixiv-preview.yml)。

## 许可证

[MIT](./LICENSE)
