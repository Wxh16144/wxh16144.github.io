---
title: 'NPM PLUGIN vue-photo-preview'
date: 2018-11-06 17:14:53
tags: ['Npm']
---

在开发项目过程中,遇到一个需求,能不能像微信朋友圈图片一样点击查看原图,并且放大查看

百度了解了一下 诸如此类的插件有 vue-photo-preview 、PhotoSwipe.js 、PinchZoom.js

<!-- more -->

我在 vue 项目中选择使用 **vue-photo-preview**
vue-photo-preview [npm 地址](https://www.npmjs.com/package/vue-photo-preview)

### 安装

```shell
npm i vue-photo-preview
```

### 项目中注册

```javascript
// 移动端Vue.js图片预览插件
import preview from 'vue-photo-preview';
import 'vue-photo-preview/dist/skin.css';

Vue.use(preview, {
  fullscreenEl: false // 关闭全屏按钮
});
```

### 示例代码

- 在 **img** 标签添加 `preview` 属性; `preview` 值相同即表示为同一组

```html
<img src="xxx.jpg" preview="0" preview-text="描述文字" />
<img src="xxx.jpg" preview="1" preview-text="描述文字" />
<img src="xxx.jpg" preview="1" preview-text="描述文字" />
<img src="xxx.jpg" preview="2" preview-text="描述文字" />
<img src="xxx.jpg" preview="2" preview-text="描述文字" />
```

- 添加对原插件 **photoswipe** 的事件响应，示例：

```javascript
//close 只是众多事件名的其中一个，更多请查看文档
this.$preview.on('close',())=>{
console.log('图片查看器被关闭')
})
```

- 添加图片查看器实例 **this.$preview.self**; 注意：此实例仅在图片查看器被打开时生效

```javascript
this.$preview.on('imageLoadComplete', (e, item) => {
  // 此时this.$preview.self 拥有原插件 photoswipe 文档中的所有方法和属性
  console.log(this.$preview.self);
});
```

- 本次更新后继承了原插件的所有事件、方法和属性，如需复杂使用请多多查看[原插件文档](http://photoswipe.com/documentation/api.html)

- 应性能要求,新增大图查看 `large` 标签填写大图路径（插件的思路是 **img** 的 `src` 默认为缩略图），如不填写 `large`, 则展示 `src`

```html
<img src="xxx.jpg" large="xxx_3x.jpg" preview="2" preview-text="描述文字" />
```

- 如果图片是异步生成的，在图片数据更新后调用：

```javascript
this.$previewRefresh();
```

### 总结

在移动端项目通常不会用到复杂的 api 我也粗略的过了一下, 根据个人的需求进行文档阅读

```javascript
sync mounted () {
    await this.$store.dispatch("getVoteList", this); // 获取图片列表
    this.$previewRefresh() ; // 图片更新后使用图片查看器
}
```
