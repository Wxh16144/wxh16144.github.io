---
title: 关于IOS一系列适配问题
date: 2018-09-25 16:02:12
tags: ['JavaScript', 'CSS']
---

总结与归纳在开发过程中遇到的**IOS**问题

<!--more-->

### 防止用户放大和缩小网页

- 将 virwport 更改为

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0"
/>
```

### 调用 IOS 的拨号功能

- HTML 5 提供了自动调用拨号的标签, , 只需要在 a 标签的 href 中添加 Tel : 即可

```html
<a href="tel:13116886815">点击拨打 13116886815</a>
```

### 禁止复制、选中文本

- 有时候我们需要禁止用户的某些复制操作, 可以给指定的元素加上如下的 class

```css
-webkit-user-select: none;
-moz-user-select: none;
-khtml-user-select: none;
user-select: none;
```

### ihone 上 clip 动画没有效果的问题

- ios 下要设置一个默认的裁剪样式，不然会失效

### 去除 iphone 及 ipad 下输入框默认内阴影

- Iphone 手机下 Input 输入框会出现内阴影, 在现在的扁平化审美看来,十分的丑, 那如何去除呢

```css
-webkit-appearance: none;
```

### 去除 Retina 屏的 1px 边框

- 比如: ipone

```css
border-width: thin;
```

### 消除 transition 闪屏

```css
-webkit-transform-style: preserve-3d; /*设置内嵌的元素在 3D 空间如何呈现：保留 3D*/
-webkit-backface-visibility: hidden; /*(设置进行转换的元素的背面在面对用户时是否可见：隐藏)*/
```

### 解决 ios Input 光标太大的问题

- ios 下 Input 获取焦点时, 光标会撑满整个 Input , 不管设置了字号大小, 行高 等等手段,都无法撼动, 那如何解决呢
- 将用 `line-height` 撑高 input 的方法 转为 使用 `padding` 即可, 而且兼容十分的好

```css
input {
  font-size: 20px;
  padding: 10px 0;
}
```

### vw 移动端适配 与 Ipone 图片消失

- VUE 的 vw 适配会影响到 图片的 `content` 属性在全局的 CSS 下, 将其强制调回默认即可

```css
img {
  content: normal !important;
}
```

### animate.css 的动画与 ihone 图片消失

- animate 动画库中, 有很多动画是 基于 X, Y 轴的 3D 动画, 在开发过程中应尽量避免使用此类动画可能引起消失的动画 如: `flipInX`, `flipInY` 等

### ios 下取消 input 在输入的时候英文首字母的默认大写

```html
<input autocapitalize="off" autocorrect="off" />
```

### 解决移动端下 输入法破坏布局, 顶起输入框等问题

- 找到你的 index.html , 加入如下 js , 在网页加载完时写死 body 的高度, 这样就可以避免输入法使 100%计算结果变小的问题

```javascript
<script>
  // 写死浏览器视口高度 var height = document.body.clientHeight + 'px'
  document.querySelector('body').style.height = height
</script>
```

### 判断是否为 ios

```javascript
isIOS () {
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      return isiOS
  }
```

### 针对 Ihone 6 及 Ihone X 高度问题的媒体查询

```css
// iPhone X
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .wrap {
    .main {
      padding-top: 490px;
    }
  }
}
// iPhone 6
@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (width: 667px) and (height: 375px) and (orientation: landscape) and (color: 8) and (device-aspect-ratio: 375/667) and (aspect-ratio: 667/375) and (device-pixel-ratio: 2) and (-webkit-min-device-pixel-ratio: 2) {
  .wrap {
    .main {
      padding-top: 300px;
    }
  }
}
```

### 针对 iphone 自动播放背景音乐

相关文章：[ 针对微信 H5 在 IOS 中自动播放背景音乐问题](http://blog.wxhboy.cn/2018/09/03/针对微信H5在IOS中自动播放背景音乐问题/)
