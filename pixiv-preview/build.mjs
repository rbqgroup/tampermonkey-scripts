import { build } from 'esbuild'

const metadata = `// ==UserScript==
// @name         Pixiv Preview
// @namespace    https://github.com/KagurazakaIris/tampermonkey-scripts
// @version      0.6.0
// @description  悬浮预览 Pixiv 作品，并可通过滚轮切图、B 键收藏和 U 键取消收藏
// @license      MIT
// @match        https://www.pixiv.net/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      i.pximg.net
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.18.2/dist/zip-native.min.js
// ==/UserScript==`

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/pixiv-preview.user.js',
  bundle: true,
  format: 'iife',
  target: ['chrome120'],
  minify: false,
  sourcemap: false,
  legalComments: 'inline',
  banner: { js: metadata },
})
