// 顶部导航自动发现：source/ 下有 index.* 或 readme.* 的一级目录自动进 nav。
// colophon 是给少数人深挖的页面，入口只在 footer，不占导航位。
const SKIP = new Set(['colophon'])

hexo.extend.helper.register('auto_nav', function () {
  const seen = new Set()

  hexo.model('Page').toArray().forEach(page => {
    const m = /^([^/]+)\/(index|readme)\.[^/]+$/i.exec(page.source)
    if (m && !SKIP.has(m[1])) seen.add(m[1])
  })

  return Array.from(seen)
    .sort()
    .map(name => ({ name, url: `/${name}/` }))
})
