// 把主题 source/js 下的所有 JS 合并压缩成一个 js/bundle.js,挂在 after_generate。
// 开发时按 feature 拆分文件(links-toggle.js / toc-active.js …),产物只有一个请求。
//
// 安全策略(防止 minify/拼接引入 bug):
//  1. 每个文件在构建时自动包一层 IIFE —— 强制作用域隔离。即使某个文件忘了写
//     IIFE、在顶层声明了 var/function,也不会泄漏到全局,更不会与其它文件互相污染。
//  2. 每个文件前加分号 —— 防止前一个文件结尾没有分号时,后一个文件开头的 ( [ `
//     被 ASI 合并进上一个表达式(经典的 bundle 串联 bug)。
//  3. 保留 /*! 文件标记注释,压缩后仍能定位到具体 feature。
const fs = require('fs')
const path = require('path')
const { minify } = require('terser')

const BUNDLE_NAME = 'js/bundle.js'

hexo.extend.filter.register('after_generate', async () => {
  const jsDir = path.join(hexo.theme_dir, 'source', 'js')
  if (!fs.existsSync(jsDir)) return

  const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'))
  if (!files.length) return

  // 每个文件:分号 + 独立 IIFE 包装,文件标记放在 IIFE 内部,
  // 避免 terser 用逗号合并相邻表达式语句时丢弃第二个文件的注释
  const bundle = files
    .map(f => `;(() => {\n/*! ${f} */\n` + fs.readFileSync(path.join(jsDir, f), 'utf8') + '\n})()')
    .join('\n')

  const { code: minified, error } = await minify(bundle, { format: { comments: 'some' } })
  if (error) throw error

  // 移除单个文件的 route,只保留 bundle
  hexo.route.list()
    .filter(p => p.startsWith('js/') && p.endsWith('.js') && p !== BUNDLE_NAME)
    .forEach(p => hexo.route.remove(p))

  hexo.route.set(BUNDLE_NAME, minified)
  hexo.log.info(`已打包 ${files.join(', ')} → ${BUNDLE_NAME}`)
}, 10) // 在 minify.js(20)之前执行
