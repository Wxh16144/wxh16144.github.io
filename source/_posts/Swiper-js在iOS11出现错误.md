---
layout: vue.js
title: 使用 Swiper.js 在 iOS < 11 时出现错误
date: 2018-09-13 01:52:38
tags: ['Bug', 'Webpack']
---

使用 Swiper.js 在 iOS < 11 时出现下列错误
SyntaxError: Unexpected keyword 'const'. Const declarations are not supported in strict mode.

<!--more-->

### 前言

在 H5 项目中，需要用到翻页效果，通过安装 **Swiper** 来实现

```bash
    npm i swiper -S
```

但是实际使用中，发现 **IOS** 低版本(iOS < 11)会出现下面这个错误：
SyntaxError: Unexpected keyword 'const'. Const declarations are not supported in strict mode.

### 原因

**Swiper.js** 这个 `Npm` 包里面还使用了 `dom7` 和 `ssr-window`，所以需要对这两个插件进行 **Babel** 转 **ES5**;

### 解决方案

**Vue CLI 2.x** 下，在 `build/webpack.base.config.js` 文件中修改

```diff
modules: {
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [
        resolve('src'),
        resolve('test'),
        resolve('node_modules/swiper/dist/js/'),
        resolve('node_modules/webpack-dev-server/client'),
        // 新增
+       resolve('node_modules/swiper'),
+       resolve('node_modules/dom7'),
+       resolve('node_modules/ssr-window')
      ]
    }
  ];
}
```

**Vue CLI 3.x**
在 `vue.config.js` 中增加 `transpileDependencies` 配置;

```diff
module.exports = {
+ transpileDependencies: ['swiper', 'dom7', 'ssr-window']
};
```

### 参考文档

- [http://idangero.us/swiper/get-started/](http://idangero.us/swiper/get-started/)
