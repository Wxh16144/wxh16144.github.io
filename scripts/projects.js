// /projects/ 的清单只在模板里渲染，页面生成的 .md 会把这张表丢掉，
// llms.txt 指向 /projects.md 时就只剩一句介绍。这里按数据源补一份。
const MD_ROUTE = 'projects.md'
const SOURCE = 'projects/index.md'

hexo.extend.filter.register('after_generate', () => {
  const page = hexo.model('Page').findOne({ source: SOURCE })
  const projects = hexo.locals.get('data').projects || []
  if (!page || !projects.length) return

  const items = projects.map(p => `- [${p.name}](https://github.com/${p.repo})：${p.desc}`)
  // 与 markdown_source.js 一致：GitHub Pages 不带 charset，用 BOM 强制 UTF-8
  hexo.route.set(MD_ROUTE, '\uFEFF' + [page.raw.trimEnd(), '', ...items, ''].join('\n'))
})
