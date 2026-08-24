// 约定：目录下没有 index.* 时，README.* 顶替成该目录的首页
hexo.extend.filter.register('before_generate', async function () {
  const Page = hexo.model('Page')
  const pages = Page.toArray()

  const indexDirs = new Set(
    pages
      .filter(p => /(^|\/)index\.[^/]+$/i.test(p.source))
      .map(p => p.source.replace(/[^/]+$/, ''))
  )

  const readmePages = pages.filter(p => /(^|\/)readme\.[^/]+$/i.test(p.source))

  await Promise.all(readmePages.map(p => {
    const dir = p.source.replace(/[^/]+$/, '')
    if (indexDirs.has(dir)) return

    const ext = p.path.split('.').pop()
    p.path = `${dir}index.${ext}`
    return p.save()
  }))
})
