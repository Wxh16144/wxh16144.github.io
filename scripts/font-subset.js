// 中文 webfont 按用字裁剪后内联（完整鸿蒙字库 8.4 MiB，裁后约 300 KiB）。
// 出错则退回 CDN 完整字库，构建不中断。
const fs = require('fs')
const path = require('path')

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

// 扫全部文本路由(页面本体 + 同一内容的 .md 原文)。不剔标签：属性与内联样式里的中文同样会渲染。
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

// @font-face 对布局没有影响，做成外链只是白搭一次阻塞渲染的往返、并推后字体开始下载，
// 所以内联到 head 末尾。用 lastIndexOf：注释里也可能出现字面量 </head>，真正的闭合标签在最后。
function injectStyle(pages, css) {
  const tag = `<style>${css}</style>`
  for (const [route, body] of pages) {
    const end = body.lastIndexOf('</head>')
    hexo.route.set(route, body.slice(0, end) + tag + body.slice(end))
  }
}

hexo.extend.filter.register('after_generate', async () => {
  // 跳转页只有 <meta refresh> 和一个 script，没有 </head> 也不需要字体，这里一并排除
  const pages = new Map()
  for (const route of hexo.route.list().filter(p => /\.html$/i.test(p))) {
    const body = await streamToString(hexo.route.get(route))
    if (body.includes('</head>')) pages.set(route, body)
  }
  if (!pages.size) return

  let css
  try {
    const subsetFont = require('subset-font')
    const text = await collectChars()
    css = FACES.map(face => faceCss(face, hexo.config.root + `fonts/${face.file}`)).join('\n')

    for (const face of FACES) {
      const subset = await subsetFont(fs.readFileSync(path.join(FONT_DIR, face.file)), text, {
        targetFormat: 'woff2'
      })
      hexo.route.set(`fonts/${face.file}`, subset)
    }
    hexo.log.info(`已裁剪中文 webfont 至 ${[...text].length} 个字符 → ${pages.size} 个页面`)
  } catch (e) {
    css = `@import url("${CDN_CSS}");`
    hexo.log.warn(`中文 webfont 裁剪失败，回退 CDN 完整字库：${e.message}`)
  }

  injectStyle(pages, css)

}, 15)
