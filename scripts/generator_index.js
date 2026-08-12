/**
 * 根据 redirect-map.json 生成静态跳转页
 * 挂在 hexo 构建流程里（after_generate），复用 template/redirect.swig
 */
const fs = require('fs')
const path = require('path')

const mapFile     = path.resolve(hexo.base_dir, 'redirect-map.json')
const templatePath = path.resolve(hexo.base_dir, 'template/redirect.swig')

hexo.extend.filter.register('after_generate', async () => {
  let map
  try {
    map = JSON.parse(fs.readFileSync(mapFile, 'utf8'))
  } catch (e) {
    hexo.log.warn('未找到 redirect-map.json，跳过重定向生成')
    return
  }

  for (const item of map) {
    if (!item.new) continue // new 还没填的跳过
    const routePath = item.old.replace(/^\/+/, '') + 'index.html'
    const code = await hexo.render.render({ path: templatePath }, { URL: item.new })
    hexo.route.set(routePath, code)
    hexo.log.info(`重定向: ${item.old} → ${item.new}`)
  }
})