// 为文章和页面生成原始 Markdown 路由(如 /debounce-throttle.md、/about.md)
// 页面源文件是 source/<dir>/index.md 或 source/<dir>/README.md,
// 构建成 <dir>/index.html 后,这里按同样的目录映射成 <dir>.md。
function mdPath(routePath) {
  return routePath.replace(/index\.html$/, '').replace(/\/$/, '') + '.md'
}

// GitHub Pages/hexo-server send `Content-Type: text/markdown` with no charset,
// so browsers may guess wrong on non-ASCII text. A BOM forces UTF-8 detection.
const withBom = raw => '\uFEFF' + raw

hexo.extend.generator.register('post_markdown_source', locals => [
  // 文章:post.raw 是带 front-matter 的原始 markdown
  ...locals.posts.toArray().map(post => ({
    path: mdPath(post.path),
    data: withBom(post.raw)
  })),
  // 页面:hexo 模型里 raw 是源文件的原文(含 front-matter);_content 已被
  // before_generate 的 render 剥掉 front-matter 并转成 HTML,不能用来还原原文。
  ...locals.pages.toArray()
    .filter(page => /^(index|readme)\.[^/]+$/i.test(page.source.split('/').pop() || ''))
    .map(page => ({
      path: mdPath(page.path),
      data: withBom(page.raw)
    }))
])

hexo.extend.helper.register('md_url', function (postPath) {
  return this.url_for(mdPath(postPath))
})
