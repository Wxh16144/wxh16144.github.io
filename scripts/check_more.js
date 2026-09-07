// hexo server 启动时检查：哪些文章缺少 <!--more--> 分隔符
// 用途：SEO 自动描述优先取 <!--more--> 前的内容(excerpt)；
// 没有分隔符又没有手写 description 的文章会退化为“截取正文前 60 字符”，这里提醒补分隔符。
// 挂 hexo-server 启动完成后的 'server' 事件（server.js: this.emit('server')）。
const MORE_RE = /<!--\s*more\s*-->/i

hexo.on('server', () => {
  const posts = hexo.model('Post').toArray()
  if (!posts.length) return

  const lacksMore = posts.filter(p => !MORE_RE.test(p.raw || ''))
  if (!lacksMore.length) {
    hexo.log.info(`[seo] 全部 ${posts.length} 篇文章都已包含 <!--more--> 分隔符 ✓`)
    return
  }

  const needsAttention = lacksMore.filter(p => !(p.description || p.summary))
  const coveredByDesc = lacksMore.filter(p => !needsAttention.includes(p))

  if (needsAttention.length) {
    hexo.log.warn(`[seo] ${needsAttention.length} 篇文章缺少 <!--more--> 且未写 description，` +
      'SEO 描述将退化为截取正文前 60 字符，建议补上分隔符:')
    needsAttention.forEach(p => hexo.log.warn(`  - ${p.source}`))
  }
  if (coveredByDesc.length) {
    hexo.log.info(`[seo] 另有 ${coveredByDesc.length} 篇缺少 <!--more-->，但已写 description/summary，不受影响`)
  }
})
