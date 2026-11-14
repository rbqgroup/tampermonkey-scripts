import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { Script } from 'node:vm'

// 保留已在线调整的脚本，不进行打包转换，避免改变页面上下文和元数据。
const source = await readFile(new URL('./src/twitter-minimal.user.js', import.meta.url), 'utf8')
// 构建时仅检查语法，不执行用户脚本。
new Script(source, { filename: 'twitter-minimal.user.js' })
await mkdir(new URL('./dist/', import.meta.url), { recursive: true })
await writeFile(
  new URL('./dist/twitter-minimal.user.js', import.meta.url),
  source,
)
