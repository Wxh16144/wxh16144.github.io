/**
 * 复制历史跳转页和 Markdown 原文
 *
 * 使用方式:
 *   node copy-history.js
 *
 * 说明:
 *   - public/ 下的跳转页复制到 history/
 *   - source/_posts/ 下的全部 Markdown 复制到 markdown/
 *   - Markdown 使用 redirect-map.json 的 new 字段重命名
 *   - 可重复执行，每次会重新生成目标目录
 */
const fs = require('fs')
const path = require('path')

const ROOT = __dirname
const MAP_FILE = path.join(ROOT, 'redirect-map.json')
const SRC_DIR = path.join(ROOT, 'public')
const DEST_DIR = path.join(ROOT, 'history')
const MARKDOWN_SRC_DIR = path.join(ROOT, 'source/_posts')
const MARKDOWN_DEST_DIR = path.join(ROOT, 'markdown')

function normalizeMarkdownName(filename) {
  return filename
    .replace(/\.md$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function main() {
  let map
  try {
    map = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'))
  } catch (e) {
    console.error(`✖ 无法读取 ${MAP_FILE}，请先运行 node scripts/build-redirect-map.js`)
    process.exit(1)
  }

  if (!fs.existsSync(SRC_DIR)) {
    console.error(`✖ 找不到构建产物 ${SRC_DIR}，请先运行 npm run build`)
    process.exit(1)
  }

  fs.rmSync(DEST_DIR, { recursive: true, force: true })
  fs.rmSync(MARKDOWN_DEST_DIR, { recursive: true, force: true })
  fs.mkdirSync(MARKDOWN_DEST_DIR, { recursive: true })

  // 判断是否跳转 stub 页
  const isStub = (html) => /http-equiv=["']?refresh|location\.replace/.test(html)

  let copied = 0
  let missing = 0
  let stubCount = 0
  let realCount = 0

  for (const { old: oldPath } of map) {
    const rel = oldPath.replace(/^\/+|\/+$/g, '') // e.g. 2025/06/07/xxx
    const src = path.join(SRC_DIR, rel)
    const dest = path.join(DEST_DIR, rel)

    if (!fs.existsSync(src)) {
      console.warn(`⚠ 源不存在，跳过: ${rel}`)
      missing++
      continue
    }

    fs.cpSync(src, dest, { recursive: true })
    copied++

    const html = fs.readFileSync(path.join(src, 'index.html'), 'utf8')
    if (isStub(html)) stubCount++
    else realCount++
  }

  console.log(`✔ 已复制 ${copied} 篇文章 → ${path.relative(ROOT, DEST_DIR)}/`)
  if (missing) console.warn(`⚠ ${missing} 篇在 public/ 中不存在（未生成）`)
  console.log(`  内容统计: ${realCount} 篇原文, ${stubCount} 篇跳转页`)

  const markdownNames = new Map(
    map.map(({ old, new: newPath }) => [
      `${decodeURIComponent(old.split('/').filter(Boolean).at(-1))}.md`,
      `${newPath.replace(/^\/+|\/+$/g, '')}.md`,
    ])
  )
  const sourceMarkdown = fs.readdirSync(MARKDOWN_SRC_DIR)
    .filter(filename => filename.endsWith('.md'))

  let markdownCopied = 0
  for (const filename of sourceMarkdown) {
    const targetName = markdownNames.get(filename) || `${normalizeMarkdownName(filename)}.md`
    const src = path.join(MARKDOWN_SRC_DIR, filename)
    const dest = path.join(MARKDOWN_DEST_DIR, targetName)

    if (fs.existsSync(dest)) {
      console.error(`✖ Markdown 文件名冲突: ${targetName}`)
      process.exit(1)
    }

    fs.copyFileSync(src, dest)
    markdownCopied++
  }

  console.log(`✔ 已复制并重命名 ${markdownCopied} 篇 Markdown → ${path.relative(ROOT, MARKDOWN_DEST_DIR)}/`)
}

main()
