// 读取 npm 包 wxh16144 的 contact.js 生成 header 的 links 列表。
// package.json 是 type:module，require 会当成 ESM 拿到空对象，用 vm 沙箱绕开。
const fs = require('fs')
const vm = require('vm')

function loadContact() {
  let file
  try {
    file = require.resolve('wxh16144/contact')
  } catch (e) {
    hexo.log.warn('未安装 wxh16144 依赖: npm install wxh16144')
    return {}
  }

  const sandbox = { exports: {}, module: {} }
  vm.createContext(sandbox)
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file })
  return sandbox.exports
}

let cache
hexo.extend.helper.register('contact_links', function () {
  if (!cache) {
    cache = Object.entries(loadContact()).map(([name, url]) => ({ name, url }))
  }
  return cache
})
