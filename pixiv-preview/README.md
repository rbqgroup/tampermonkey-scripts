# Pixiv Preview

悬浮预览 Pixiv 作品缩略图的 Tampermonkey 用户脚本。鼠标悬停在作品缩略图上即可就地弹出预览，支持滚轮翻页、Ugoira 动图播放以及收藏快捷键。

## 功能

- 悬停缩略图后延迟弹出预览，自动选择空间较大的一侧并保持原始宽高比
- 滚轮切换多图作品的页码，支持循环切换
- 同时支持静态插画与 Ugoira 动图（经 zip.js 解压后逐帧播放）
- 按 `B` 收藏、按 `U` 取消收藏，并同步缩略图上的红心状态
- 后台多 worker 预加载后续页面，配合基于 LRU 的图片缓存
- 预览加载窗口显示真实下载字节数与百分比进度
- 提供页面内设置面板，可调整预加载、缓存、延迟与清晰度

## 安装

1. 在浏览器中安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展。
2. 打开本仓库 `pixiv-preview/dist/pixiv-preview.user.js`，通过原始文件（Raw）地址或本地文件将其安装到 Tampermonkey。
3. 打开 https://www.pixiv.net/ 即可生效。

脚本通过 `@require` 从 jsDelivr CDN 加载 `@zip.js/zip.js`，仅在预览动图时使用。

## 使用

| 操作 | 说明 |
| --- | --- |
| 悬停缩略图 | 在缩略图旁弹出预览 |
| 滚轮 | 多图作品时切换上一页 / 下一页 |
| `B` | 收藏当前预览的作品 |
| `U` | 取消收藏当前预览的作品 |
| `Esc` | 关闭预览 |

快捷键仅在预览显示时生效，且会被 `Ctrl` / `Shift` / `Alt` / `Meta` 修饰键组合忽略。滚动页面、缩放窗口或切换路由会自动关闭预览。

## 设置

通过 Tampermonkey 菜单中的 “Pixiv Preview 设置” 打开设置面板。

| 设置项 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- |
| 启用后台预加载 | 开启 | 开 / 关 | 是否在预览后预取其余页面 |
| 预加载 worker 数 | 4 | 1 - 8 | 并发预加载任务数 |
| 缓存作品数 | 3 | 1 - 10 | 图片缓存的 LRU 容量 |
| 悬浮延迟（毫秒） | 400 | 0 - 2000 | 悬停到弹出预览的等待时间 |
| 图片清晰度 | 标准 | 标准 / 原图 | 请求 `regular` 或 `original` 图片 |

设置通过 `GM_setValue` 持久化保存。

## 开发

在 `pixiv-preview` 目录下执行：

```bash
npm install        # 安装依赖（也可在仓库根目录执行）
npm run build      # 使用 esbuild 打包为 dist/pixiv-preview.user.js
npm test           # 基于 node:test 运行单元测试
npm run typecheck  # TypeScript 类型检查
```

仓库根目录提供了对应的转发脚本：`npm run build`、`npm run typecheck`。

## 架构

| 模块 | 职责 |
| --- | --- |
| `src/index.ts` | 初始化并装配各模块 |
| `src/api.ts` | Pixiv 同源接口封装，含 CSRF token 处理 |
| `src/artwork-locator.ts` | 从事件目标识别作品缩略图与卡片容器 |
| `src/preview-controller.ts` | 预览生命周期、定位、切图与快捷键 |
| `src/renderer.ts` | 静态图片渲染、进度上报与渲染器分派 |
| `src/ugoira-renderer.ts` / `src/ugoira-player.ts` | 动图下载解压与逐帧播放 |
| `src/browser-image-cache.ts` | 图片 LRU 缓存与并发预加载 |
| `src/bookmark-controller.ts` | 收藏与取消收藏 |
| `src/settings.ts` / `src/settings-panel.ts` | 设置持久化与设置面板 |
| `src/notification.ts` | 右上角状态提示 |
| `src/style.ts` | 样式注入 |
| `src/task-queue.ts` | 并发任务调度工具 |

## 权限说明

| 权限 | 用途 |
| --- | --- |
| `GM_xmlhttpRequest` | 跨域下载 `i.pximg.net` 上的图片与动图 |
| `GM_getValue` / `GM_setValue` | 持久化脚本设置 |
| `GM_registerMenuCommand` | 注册设置菜单入口 |
| `@connect i.pximg.net` | 允许跨域请求图片域名 |

## 限制

- 依赖 Pixiv 当前的页面结构与同源 AJAX 接口，站点改版后可能失效。
- 动图预览设有 96 MB 压缩包、单帧 32 MB、解码 200 万像素的上限保护。
- 收藏功能需要已登录的 Pixiv 账号。

## 许可证

[MIT](../LICENSE)
