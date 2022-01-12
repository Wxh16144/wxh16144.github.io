const path = require('path')
const hfs = require('hexo-fs')

const { public_dir, source_dir } = hexo.config

const resolve = (...args) => path.resolve(process.cwd(), ...args)

const templatePath = resolve('./template/redirect.swig')
const files = [
  {
    templatePath,
    outPath: resolve(public_dir, `./bookmarks/index.html`),
    data: { URL: './README' },
  },
  {
    templatePath,
    outPath: resolve(source_dir, './bookmarks/index.html'),
    data: { URL: './README' },
  },
];

hexo.extend.generator.register('archive', async function (locals) {
  for (const { templatePath, outPath, data } of files) {
    const code = await hexo.render.render({ path: templatePath }, data)
    await hfs.writeFileSync(outPath, code, { encoding: 'utf-8' })
  }
});
