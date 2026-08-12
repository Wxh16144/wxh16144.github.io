---
title: node.js 获取控制台中命令行参数
date: 2019-03-27 09:52:22
tags: ['Node']
---

postcss style.css -r viewportWidth=750; 如何获取到 viewportWidth=750 这个参数呢

<!--more-->

### 场景需要

公司之前的项目使用的是`*.less`样式文件,然后在浏览器直接引入;

使用`less.js`文件在浏览器中解析运行;[如何在浏览器中使用`less`](http://lesscss.cn/usage/#using-less-in-the-browser)

- 引入`*.less`和`less.js`文件

```html
<link rel="stylesheet/less" type="text/css" href="styles.less" />
<script src="less.js"></script>
```

我选择使用打包编译的方式对`less`文件进行编译,然后使用`postcss`压缩
把之前项目中 3000 行代码`200kb`使用[`cssnano`](https://github.com/cssnano/cssnano)进行压缩,使其`60kb`;

### 方法一

```javascript
const arguments = process.argv.reduce((a, b, index) => {
  if (/^[^=]*=[^=]*$/.test(b)) {
    const arr = b.split('=');
    a[arr[0]] = arr[1];
  }
  return a;
}, {});
console.log(arguments);
```

这样我就可以获取到所有命令行中的参数了, 在后面的代码中我可以这样去使用;

```javascript
// ...
minPixelValue: arguments.minPixelValue || 2;
viewportWidth: arguments.viewportWidth || 1024;
// ....
```

### 方法二

在 `Vue` 项目中，使用 jenkins 构建部署，需要修改 [publicPath](https://cli.vuejs.org/zh/config/#publicpath) 和 vue-router.[base](https://router.vuejs.org/zh/api/#base)

```javascript
module.exports.npmConfigArgv = {};
let idx = 2;
const {
  cooked,
  cooked: { length }
} = JSON.parse(process.env.npm_config_argv);

while ((idx += 2) <= length) {
  module.exports.npmConfigArgv[cooked[idx - 2]] = cooked[idx - 1];
}

process.env.VUE_APP_DEPLOY_PATH = module.exports.npmConfigArgv['--deploypath'];
```

在项目中就可以使用环境变量了;
你可以在 `vue.config.js` 文件中计算环境变量。它们仍然需要以 `VUE_APP_` 前缀开头。
在 Vue-cli 官方文档中提到了这一点 [在客户端侧代码中使用环境变量](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E5%9C%A8%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%BE%A7%E4%BB%A3%E7%A0%81%E4%B8%AD%E4%BD%BF%E7%94%A8%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)

```diff
# vue.config.js
module.exports = {
+ publicPath: isPro ? process.env.VUE_APP_DEPLOY_PATH : "/",
  devServer: {

# router.js
const router = new VueRouter({
  mode: "hash",
+ base: isPro ? process.env.VUE_APP_DEPLOY_PATH : "/",
```

### 参考文档

- [Vue CLI 命令行打包配置自定义参数](https://blog.csdn.net/lkr_lkr/article/details/105210190)
- [在客户端侧代码中使用环境变量](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E5%9C%A8%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%BE%A7%E4%BB%A3%E7%A0%81%E4%B8%AD%E4%BD%BF%E7%94%A8%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)
