// 中文 webfont 按用字裁剪后自托管（完整鸿蒙字库 8.4 MiB，裁后约 300 KiB）。
// 出错则退回 CDN 完整字库，构建不中断。
const fs = require('fs')
const path = require('path')

const CSS_ROUTE = 'css/font-cjk.css'
const CDN_CSS =
  'https://registry.npmmirror.com/@lobehub/webfont-harmony-sans-sc/1.0.0/files/css/index.css'
const FONT_DIR = path.join(hexo.base_dir, 'node_modules', '@lobehub', 'webfont-harmony-sans-sc', 'fonts')

// 只裁 Regular/Bold 两个字重，其余字重由浏览器就近匹配（100–900 实测均命中，不回退系统字体）
const FACES = [
  {
    file: 'HarmonyOS_Sans_SC_Regular.woff2',
    weight: 'normal',
    local: ['HarmonyOS_Sans_SC_Regular', 'HarmonyOS Sans SC']
  },
  {
    file: 'HarmonyOS_Sans_SC_Bold.woff2',
    weight: 'bold',
    local: ['HarmonyOS_Sans_SC_Bold', 'HarmonyOS Sans SC Bold']
  }
]

async function streamToString(stream) {
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

// 不剔标签：属性与内联样式里的中文同样会渲染
async function collectChars() {
  const routes = hexo.route.list().filter(p => /\.(html|md)$/i.test(p))
  const chars = new Set()
  for (const route of routes) {
    const text = await streamToString(hexo.route.get(route))
    for (const ch of text) if (!'\n\r\t'.includes(ch)) chars.add(ch)
  }
  return [...chars].join('')
}

function faceCss(face, url) {
  const local = face.local.map(name => `local('${name}')`).join(', ')
  return `@font-face {
  font-family: 'HarmonyOS Sans SC';
  font-style: normal;
  font-weight: ${face.weight};
  font-display: swap;
  src: ${local}, url('${url}') format('woff2');
}`
}

hexo.extend.filter.register('after_generate', async () => {
  try {
    const subsetFont = require('subset-font')
    const text = await collectChars()
    const css = []

    for (const face of FACES) {
      const subset = await subsetFont(fs.readFileSync(path.join(FONT_DIR, face.file)), text, {
        targetFormat: 'woff2'
      })
      const route = `fonts/${face.file}`
      hexo.route.set(route, subset)
      css.push(faceCss(face, hexo.config.root + route))
    }

    hexo.route.set(CSS_ROUTE, css.join('\n'))
    hexo.log.info(`已裁剪中文 webfont 至 ${[...text].length} 个字符 → ${CSS_ROUTE}`)
  } catch (e) {
    hexo.route.set(CSS_ROUTE, `@import url("${CDN_CSS}");`)
    hexo.log.warn(`中文 webfont 裁剪失败，回退 CDN 完整字库：${e.message}`)
  }
}, 15)
