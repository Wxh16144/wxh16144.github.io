// 可选的 HTML 压缩，_config.yml 的 minify.enable 控制开关。
// 挂在 after_generate 而非 after_render:html：主题 partial() 用 renderSync 同步渲染，
// 异步的 html-minifier-terser 会导致拿到 Promise 而不是压缩后的字符串。
const { minify } = require('html-minifier-terser')
// 压缩外部 .css(html-minifier 只处理内联样式)
const CleanCSS = require('clean-css')

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

  // 压缩外部 CSS(如 css/style.css),html-minifier 只处理内联样式
  const cssPaths = hexo.route.list().filter(path => path.endsWith('.css'))
  await Promise.all(cssPaths.map(async path => {
    const css = await streamToString(hexo.route.get(path))
    const output = new CleanCSS({ level: 2 }).minify(css)
    if (output.errors.length) throw new Error(`CSS 压缩失败 ${path}: ${output.errors.join(', ')}`)
    hexo.route.set(path, output.styles)
  }))

  hexo.log.info(`已压缩 ${htmlPaths.length} 个 HTML、${cssPaths.length} 个 CSS 文件`)
}, 20) // 晚于其它 after_generate 执行
