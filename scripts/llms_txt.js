// 站点 llms.txt(https://llmstxt.org/):给 agent 的站点索引,链接一律指向
// markdown_source.js 产出的 .md 路由,省得 agent 再从 HTML 里扒正文。
const DESC_MAX = 100

const toText = s => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
const mdPath = p => p.replace(/index\.html$/, '').replace(/\/$/, '') + '.md'
const absPath = p => hexo.config.url.replace(/\/+$/, '') + '/' + p

// about/notes/bookmarks 各是一整页 .md,自动摘要会把标题和日期当成正文带出来,说明只能手写
const PAGES = {
  'about.md': { name: 'About', desc: '个人简介：技术栈、开源贡献、联系方式' },
  'notes.md': { name: 'Notes', desc: '按时间倒序的速记流水，含 Git / macOS / 编辑器等零散技巧' },
  'bookmarks.md': { name: 'Bookmarks', desc: '设计与体验优秀的网站、工具合集' }
}

hexo.extend.generator.register('llms_txt', locals => {
  const link = (name, md, desc) => `- [${name}](${absPath(md)})${desc ? ': ' + desc : ''}`

  // 只列真的存在 md 路由,拿不到元数据的(将来新增的目录)先不出现
  const pageMds = new Set(locals.pages.toArray().map(page => mdPath(page.path)))
  const pages = Object.entries(PAGES)
    .filter(([md]) => pageMds.has(md))
    .map(([md, meta]) => link(meta.name, md, meta.desc))

  // 年份按真实日期分组:2099 的常青文章自成一组排最前,与首页列表顺序一致
  const groups = []
  locals.posts.sort('-date').forEach(post => {
    const year = post.date.year()
    let group = groups[groups.length - 1]
    if (!group || group.year !== year) {
      groups.push(group = { year, items: [] })
    }
    // 摘要链与 head.ejs 一致:description > summary > excerpt > 正文
    const desc = (toText(post.description) || toText(post.summary) ||
      toText(post.excerpt) || toText(post.content)).slice(0, DESC_MAX)
    group.items.push(link(post.title, mdPath(post.path), desc))
  })

  const findMe = hexo.extend.helper.get('contact_links')()
    .map(item => `- [${item.name}](${item.url})`)

  const bio = (hexo.theme.config.bio || []).join('')
  const lines = [`# ${hexo.config.title}`, '']
  if (bio) lines.push(`> ${bio}`, '')
  lines.push('## Pages', '', ...pages, '', '## Posts')
  groups.forEach(group => lines.push('', `### ${group.year}`, '', ...group.items))
  lines.push('', '## Find me', '', ...findMe)

  // llms.txt 也由 GitHub Pages 以 text/plain 发送且不带 charset,加 BOM 强制按 UTF-8 解码
  return [{ path: 'llms.txt', data: '\uFEFF' + lines.join('\n') + '\n' }]
})
