// 根据 redirect-map.json 生成静态跳转页（未装 hexo-renderer-swig，直接拼 HTML）
const fs = require('fs')
const path = require('path')

const mapFile = path.resolve(hexo.base_dir, 'redirect-map.json')

const redirectHtml = url =>
  `<!DOCTYPE html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${url}"><script>location.replace('${url}')</script>`

hexo.extend.filter.register('after_generate', () => {
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
    hexo.route.set(routePath, redirectHtml(item.new))
    hexo.log.info(`重定向: ${item.old} → ${item.new}`)
  }
})