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

### 编译 less

我选择使用打包编译的方式对`less`文件进行编译,然后使用`postcss`压缩
把之前项目中 3000 行代码`200kb`使用[`cssnano`](https://github.com/cssnano/cssnano)进行压缩,使其`60kb`;

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
