/**
 * 生成 旧URL → 新URL 对照清单 redirect-map.json
 * 运行: node scripts/build-redirect-map.js
 * 之后手动填写每条记录的 new 字段
 */
const fs = require('fs')
const path = require('path')

const POSTS_DIR = path.resolve(__dirname, '../source/_posts')
const OUT_FILE  = path.resolve(__dirname, '../redirect-map.json')

// 简单 front-matter 解析（只需 date / permalink / title）
function parseFrontMatter(content) {
  const fm = {}
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return fm
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/)
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '')
  }
  return fm
}

// 兼容 2018/07/21 和 2025-06-07 14:53:06
function normalizeDate(raw) {
  const m = String(raw).match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (!m) return null
  return {
    year: m[1],
    month: m[2].padStart(2, '0'),
    day: m[3].padStart(2, '0'),
  }
}

const entries = []
for (const file of fs.readdirSync(POSTS_DIR)) {
  if (!file.endsWith('.md')) continue
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
  const fm = parseFrontMatter(raw)

  let oldPath
  if (fm.permalink) {
    // front matter 里的 permalink 会覆盖默认规则
    oldPath = '/' + fm.permalink.replace(/^\/+|\/+$/g, '') + '/'
  } else {
    const d = normalizeDate(fm.date)
    if (!d) {
      console.warn(`[跳过] 缺少有效 date: ${file}`)
      continue
    }
    // :title 即文件名(去 .md)，对应你的 :year/:month/:day/:title/
    oldPath = `/${d.year}/${d.month}/${d.day}/${file.replace(/\.md$/, '')}/`
  }

  entries.push({
    old: oldPath,
    title: fm.title || file.replace(/\.md$/, ''),
    new: '', // ← 在这里填新地址（绝对 URL 或相对路径都行）
  })
}

// 保留上次已填写的内容，避免重跑时清空
let existing = []
try { existing = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')) } catch (e) { /* 首次运行 */ }

const merged = entries.map(e => {
  const prev = existing.find(x => x.old === e.old)
  return prev && prev.new ? { ...e, new: prev.new } : e
})

fs.writeFileSync(OUT_FILE, JSON.stringify(merged, null, 2))
console.log(`✔ 已生成 ${OUT_FILE}，共 ${merged.length} 条，请填写 new 字段`)