const path = require('path')

const resolve = (...args) => path.resolve(hexo.base_dir, ...args)

const templatePath = resolve('./template/redirect.swig')

const files = [
  {
    templatePath,
    routePath: 'bookmarks/index.html',
    data: { URL: './README' },
  },
];

hexo.extend.filter.register('after_generate',async () => {
  for (const { templatePath, routePath, data } of files) {
    const code = await hexo.render.render({ path: templatePath }, data)
    hexo.route.set(routePath, `${code}`)
  }
})
