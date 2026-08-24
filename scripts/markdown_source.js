// 为每篇文章生成原始 Markdown 路由，如 /debounce-throttle.md
function mdPath(postPath) {
  return postPath.replace(/index\.html$/, '').replace(/\/$/, '') + '.md'
}

hexo.extend.generator.register('post_markdown_source', locals =>
  locals.posts.toArray().map(post => ({
    path: mdPath(post.path),
    // GitHub Pages/hexo-server send `Content-Type: text/markdown` with no charset,
    // so browsers may guess wrong on non-ASCII text. A BOM forces UTF-8 detection.
    data: '\uFEFF' + post.raw
  }))
)

hexo.extend.helper.register('md_url', function (postPath) {
  return this.url_for(mdPath(postPath))
})
