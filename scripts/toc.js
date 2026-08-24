// 侧边栏 TOC：用 hexo-util 的 tocObj 解析标题，显示范围走 themes/lite/_config.yml 的 toc 配置
const { tocObj } = require('hexo-util')

function globToRegExp(glob) {
  const pattern = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '\u0000')
    .replace(/\*/g, '[^/]*')
    .replace(/\u0000/g, '.*')
  return new RegExp(`^${pattern}$`)
}

hexo.extend.helper.register('page_toc', function (page) {
  const cfg = (this.theme && this.theme.toc) || {}
  if (cfg.enable === false) return []

  const source = page.source || ''
  const groups = cfg.groups || []
  const group = groups.find(g => (g.paths || []).some(p => globToRegExp(p).test(source)))

  const minDepth = (group && group.min_depth) || cfg.min_depth || 2
  const maxDepth = (group && group.max_depth) || cfg.max_depth || 2
  const minItems = group && group.min_items != null
    ? group.min_items
    : (cfg.min_items == null ? 2 : cfg.min_items)

  const items = tocObj(page.content, { min_depth: minDepth, max_depth: maxDepth })
  return items.length >= minItems ? items : []
})
