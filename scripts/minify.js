// 可选的 HTML 压缩，_config.yml 的 minify.enable 控制开关。
// 挂在 after_generate 而非 after_render:html：主题 partial() 用 renderSync 同步渲染，
// 异步的 html-minifier-terser 会导致拿到 Promise 而不是压缩后的字符串。
const { minify } = require('html-minifier-terser')

async function streamToString(stream) {
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

hexo.extend.filter.register('after_generate', async () => {
  const cfg = hexo.config.minify
  if (!cfg || !cfg.enable) return

  const htmlPaths = hexo.route.list().filter(path => path.endsWith('.html'))

  await Promise.all(htmlPaths.map(async path => {
    const html = await streamToString(hexo.route.get(path))
    const minified = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true
    })
    hexo.route.set(path, minified)
  }))

  hexo.log.info(`已压缩 ${htmlPaths.length} 个 HTML 文件`)
}, 20) // 晚于其它 after_generate 执行
