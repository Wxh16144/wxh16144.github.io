// 年份归档（/YYYY/）：按「显示年份」分组，而不是文章的真实日期。
// 常青文章的真实日期在 2099，首页把它们归一化到当前年份显示；归档必须用同一套
// 规则，否则首页 2026 的水印只能指向 /2099/，而 /2026/ 又缺这几篇。
// 因此 hexo-generator-archive 的 yearly 关掉，年份页由这里生成（根路径的
// 全量归档仍由该插件产出，也就是首页）。
hexo.extend.generator.register('yearly_archive', locals => {
  const now = new Date()
  const groups = new Map()

  locals.posts.sort('-date').forEach(post => {
    const real = post.date.toDate()
    const shown = real > now ? now : real
    const year = shown.getFullYear()
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year).push(post)
  })

  return Array.from(groups, ([year, posts]) => ({
    path: `${year}/index.html`,
    layout: 'archive',
    data: { year, posts }
  }))
})
