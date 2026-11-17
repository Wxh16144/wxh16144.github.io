// 站点订阅源(RSS 2.0):文章在 /feed.xml,notes 在 /notes.xml。
// notes 是一整页持续累积的 markdown,这里按 `## 标题` + `_YYYY/M/D_` 拆成条目,
// 链接带上与 hexo-renderer-marked 一致的标题锚点,读者点进 RSS 就能定位到那一条。
const { Feed } = require('feed')
const frontMatter = require('hexo-front-matter')
const { slugize, stripHTML, unescapeHTML } = require('hexo-util')

const SUMMARY_MAX = 200
const DATE_RE = /^_(\d{4})\/(\d{1,2})\/(\d{1,2})_$/
const FENCE_RE = /^\s*(?:```|~~~)/

// feed 只负责实体转义,XML 1.0 禁用的控制字符进来前先清掉
const clean = s => String(s || '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')

// markdown -> 纯文本交给站点自己的渲染器,不用手写正则剥语法
const mdText = md => unescapeHTML(stripHTML(
  hexo.render.renderSync({ text: String(md || ''), engine: 'markdown' })
))
const toText = s => clean(mdText(s)).replace(/\s+/g, ' ').trim()

// 第一段可读文字当摘要,跳过代码块
function summary(md) {
  // 代码块里也会有空行,按块累计 fence 数量判断当前是否还在块内
  let open = false
  for (const block of String(md || '').split(/\n{2,}/)) {
    const fences = block.match(/^\s*(?:```|~~~)/gm) || []
    const wasOpen = open
    if (fences.length) open = (open + fences.length) % 2 === 1
    if (wasOpen || fences.length || !block.trim()) continue
    const text = toText(block)
    if (text) return text.slice(0, SUMMARY_MAX)
  }
  return ''
}

// feed 序列化 pubDate / lastBuildDate 时只调用 date.toUTCString(),固定输出 GMT:
// 只写日期的文章按北京时间零点解析,XML 里就成了前一天 16:00。覆盖这个方法让序列化
// 带上站点时区偏移,瞬间不变而字面日期与作者写的一致(Fri, 13 Nov 2026 00:00:00 +0800)。
class ZonedDate extends Date {
  constructor(value, format) {
    super(value)
    this.format = format
  }

  toUTCString() {
    return this.format(this)
  }
}

// Intl 的 longOffset 只给得出 GMT+08:00,这里转成 RFC 822 要求的 +0800
function rfc822(formatter, date) {
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value }) => [type, value])
  )
  const zone = /^GMT(?:([+-])(\d{1,2}):?(\d{2})?)?$/.exec(parts.timeZoneName || 'GMT')
  const offset = zone && zone[1]
    ? `${zone[1]}${zone[2].padStart(2, '0')}${zone[3] || '00'}`
    : '+0000'
  return `${parts.weekday}, ${parts.day} ${parts.month} ${parts.year} ` +
    `${parts.hour}:${parts.minute}:${parts.second} ${offset}`
}

function createZonedDate() {
  const timeZone = hexo.config.timezone || 'UTC'
  let formatter
  try {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      timeZoneName: 'longOffset'
    })
  } catch (err) {
    hexo.log.warn(`RSS 时区 ${timeZone} 无效,回退 GMT: ${err.message}`)
    return value => new Date(value)
  }
  return value => {
    const date = new Date(value)
    // 日期无效时保留原输出(Invalid Date),别让格式化抛错中断整站构建
    return Number.isNaN(date.getTime())
      ? date
      : new ZonedDate(date, d => rfc822(formatter, d))
  }
}

function createRss({ title, description, link, self, items }) {
  const zonedDate = createZonedDate()
  const rss = new Feed({
    title,
    description,
    id: link,
    link,
    language: hexo.config.language || 'zh-CN',
    feed: self,
    updated: zonedDate(new Date()),
    author: { name: hexo.config.author, link: hexo.config.url }
  })
  items.forEach(item => rss.addItem({
    title: item.title,
    link: item.link,
    date: zonedDate(item.date),
    description: item.description
  }))
  return rss.rss2()
}

// 拆 notes:标题 + 紧跟的日期行算一条,重名标题按 -1/-2 编号,与渲染器一致
function parseNotes(raw, transform) {
  // hexo-front-matter 直接把 front-matter 摘掉,剩下正文(_content)
  const lines = frontMatter.parse(String(raw || ''))._content.split(/\r?\n/)
  const headingRe = /^(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/
  const seen = {}
  const entries = []
  let inFence = false

  lines.forEach((line, index) => {
    if (FENCE_RE.test(line)) {
      inFence = !inFence
      return
    }
    if (inFence) return
    const match = headingRe.exec(line)
    if (!match) return

    let dateLine = index + 1
    while (dateLine < lines.length && !lines[dateLine].trim()) dateLine++
    const dateMatch = DATE_RE.exec((lines[dateLine] || '').trim())
    if (!dateMatch) return

    const title = toText(match[2])
    let id = slugize(title, { transform })
    if (seen[id]) id = `${id}-${seen[id]++}`
    else seen[id] = 1

    const [, year, month, day] = dateMatch
    entries.push({
      index,
      id,
      dateLine,
      title,
      // notes 只记日期,按 UTC 零点发布,读者看到的仍是同一天
      date: new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
    })
  })

  return entries.map((entry, i) => ({
    title: entry.title,
    id: entry.id,
    date: entry.date,
    description: summary(
      lines.slice(entry.dateLine + 1, entries[i + 1] ? entries[i + 1].index : lines.length).join('\n')
    )
  }))
}

hexo.extend.generator.register('rss', locals => {
  const { config, theme } = hexo
  const siteUrl = config.url.replace(/\/+$/, '')
  const transform = (config.marked && config.marked.modifyAnchors) || 0

  const now = new Date()
  const posts = locals.posts.sort('-date').toArray()
    // 常青/持续更新的文章日期在 2099,会污染订阅流:超过当前日期的都不收
    .filter(post => post.date.toDate() <= now)
    .map(post => ({
      title: post.title,
      link: post.permalink,
      date: post.date.toDate(),
      // 摘要链与 head.ejs 一致:description > summary > excerpt > 正文
      description: (toText(post.description) || toText(post.summary) ||
        toText(post.excerpt) || toText(post.content)).slice(0, SUMMARY_MAX)
    }))

  const routes = [{
    path: 'feed.xml',
    data: createRss({
      title: config.title,
      description: toText(config.description) || toText((theme.bio || []).join('')),
      link: siteUrl + '/',
      self: siteUrl + '/feed.xml',
      items: posts
    })
  }]

  const notesPage = locals.pages.toArray().find(page => page.source === 'notes/index.md')
  if (!notesPage) return routes

  const notes = parseNotes(notesPage.raw, transform)
    .sort((a, b) => b.date - a.date)
    .map(entry => ({
      title: entry.title,
      link: `${siteUrl}/notes/#${entry.id}`,
      date: entry.date,
      description: entry.description
    }))

  routes.push({
    path: 'notes.xml',
    data: createRss({
      title: `${config.title} · Notes`,
      description: '按时间倒序的速记流水，含 Git / macOS / 编辑器等零散技巧',
      link: siteUrl + '/notes/',
      self: siteUrl + '/notes.xml',
      items: notes
    })
  })

  return routes
})
