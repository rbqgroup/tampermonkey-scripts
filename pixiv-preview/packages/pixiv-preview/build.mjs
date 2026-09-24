import { build } from 'esbuild'

const metadata = `// ==UserScript==
// @name         Pixiv Preview
// @namespace    https://github.com/KagurazakaIris/tampermonkey-scripts
// @version      0.1.0
// @description  悬浮预览 Pixiv 作品，并可通过滚轮切图和 B 键收藏
// @match        https://www.pixiv.net/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==`

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/pixiv-preview.user.js',
  bundle: true,
  format: 'iife',
  target: ['chrome120'],
  minify: true,
  sourcemap: false,
  legalComments: 'none',
  banner: { js: metadata },
})
