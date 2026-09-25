import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import test from 'node:test'

const execFileAsync = promisify(execFile)

test('构建产物通过 @require 加载 zip.js，而不是内联依赖代码', async () => {
  await execFileAsync(process.execPath, ['build.mjs'])

  const code = await readFile('dist/pixiv-preview.user.js', 'utf8')
  assert.match(
    code,
    /^\/\/ @require\s+https:\/\/cdn\.jsdelivr\.net\/npm\/@zip\.js\/zip\.js@2\.18\.2\/dist\/zip-native\.min\.js$/m
  )
  assert.doesNotMatch(code, /node_modules\/@zip\.js\/zip\.js/)
})
