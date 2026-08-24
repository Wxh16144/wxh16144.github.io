// 顶部导航自动发现：source/ 下有 index.* 或 readme.* 的一级目录自动进 nav
hexo.extend.helper.register('auto_nav', function () {
  const seen = new Set()

  hexo.model('Page').toArray().forEach(page => {
    const m = /^([^/]+)\/(index|readme)\.[^/]+$/i.exec(page.source)
    if (m) seen.add(m[1])
  })

  return Array.from(seen)
    .sort()
    .map(name => ({ name, url: `/${name}/` }))
})
