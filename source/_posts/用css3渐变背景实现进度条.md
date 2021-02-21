---
title: 用CSS3渐变背景实现进度条
date: 2019-08-01 12:02:35
tags: ['CSS']
---

在开发中, 时不时会遇到写进度条的功能, 比如投票比例, 视频播放进度, 文件上传进度...

<!--more-->

### 需求分析

如果需要考虑兼容性的话，使用 `CSS3 radial-gradient` 并不是最好的方案;
具体兼容大家可以自行查看 [Can i use radial-gradient](https://www.caniuse.com/#search=radial-gradient);

### 实现代码

**HTML**部分

```html
<div class="progress"></div>
```

**CSS**部分

```css
.progress {
  --color: green;
  --percentage: 50;
  height: 50px;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  background-image: radial-gradient(
      closest-side circle at calc(var(--percentage) * 1%),
      var(--color),
      var(--color) 100%,
      transparent
    ), linear-gradient(var(--color), var(--color));
  background-size: 100%, calc(var(--percentage) * 1%);
  background-repeat: no-repeat;
}
```

### 属性介绍

#### radial-gradient [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/radial-gradient);

```css
background: radial-gradient(center, shape, size, start-color, ..., last-color);
```

**center**: 渐变起点的位置，可以为百分比，默认是图形的正中心。

**shape**: 渐变的形状，`ellipse` 表示椭圆形，`circle` 表示圆形。默认为 `ellipse`，如果元素形状为正方形的元素，则 `ellipse` 和`circle` 显示一样。

**size**: 渐变的大小，即渐变到哪里停止，它有四个值。

**closest-side**

- 最近边: closest-side
- 最远边: farthest-side
- 最近角: closest-corner
- 最远角: farthest-corner

#### linear-gradient [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient);

```css
background: linear-gradient(angle, side-or-corner, color-stop);
```

**angle**: 角度

**side-or-corner**: 描述渐变线的起始点位置 left / right / top / bottom

**color-stop**: 结束颜色;

### 第二种实现方法

> 比较简单, 贴出来方便自己以后复制 (使用两个 `div` 实现)

**HTML**部分

```html
<div class="progress-container">
  <div class="progress"></div>
</div>
```

**CSS**部分

```css
.progress-container,
.progress-container .progress {
  width: 100%;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
}

.progress-container {
  background-color: rgba(0, 0, 0, 0.1);
}

.progress-container .progress {
  width: 30%;
  background-color: red;
}
```
