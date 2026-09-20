function loadContact() {
  try {
    return require('wxh16144/contact').default
  } catch (e) {
    hexo.log.warn('未安装 wxh16144 依赖: npm install wxh16144')
    return {}
  }
}

let cache
hexo.extend.helper.register('contact_links', function () {
  if (!cache) {
    cache = Object.entries(loadContact()).map(([name, url]) => ({ name, url }))
  }
  return cache
})
