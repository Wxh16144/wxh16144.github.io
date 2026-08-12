---
title: create.js使用分享
date: 2019-04-20 10:15:56
tags: ['JavaScript']
---

使用 `create.js` 包的时, 在浏览器直接使用会报错

<!--more-->

使用 `npm i create -D` 安装的包, 不经过打包无法使用, 在浏览器是不能直接运行的;
如果你直接下载 `create.min.js` 引入 js 的方式也报错, 那就对了;
你需要使用 `npm i createjs-npm -D`;

### 安装使用

我在项目中使用了 `parcle` 打包工具;
具体如何使用大家可以去看[官方文档](https://parceljs.org/getting_started.html)

- 安装

```bash
npm i createjs-npm -D
```

- 引入

```bash
import createjs from 'createjs-npm'
```

这样你就可以在全局使用 `create.js` 了

### 具体用法

在我的项目中,我只用到了 `EaselJS`模块和 `TweenJS` 模块

- 使用 EaselJs 创建项目

```javascript
let stage = new createjs.Stage(canvas); // 舞台
let gameView = new createjs.Container(); // 创建容器
let bitmap = new createjs.Bitmap(backgroundImage); // 填充背景
```

项目中我只用到了矩形和圆形
大家可以参考[文档 1](https://www.cnblogs.com/libin-1/p/6944584.html)[文档 2](https://www.cnblogs.com/beidan/p/7055422.html)

- 绘制图形

```javascript
let Table = new createjs.Shape(); // 桌子
createjs.Tween.get(Table, {
  loop: true
}).to(
  {
    alpha: 0.08,
    scaleX: 2, // 移动到指定X坐标
    scaleY: 2 // 移动到指定Y坐标
  },
  1500,
  createjs.Ease.quadOut
);
Table.graphics.beginFill(tableColorActive).drawCircle(0, 0, tableSize / 4);
```

- 绘制图片

```javascript
// 绘制门
function drawDoor(x, y) {
  const door = new createjs.Bitmap(require('./door.png')); // 填充背景
  door.x = x || doorConfig[0].posX;
  door.y = y || doorConfig[0].posY;
  return door;
}
```

- 绘制矩形

```javascript
// 绘制障碍物
const tailor = new createjs.Graphics().drawRect(
  posX || 0,
  posY || 0,
  width || 100,
  height || 100
);
```

- 添加到整个舞台

```javascript
stage.addChild(drawDoor()); // 绘制门
stage.addChild(drawBarrier()); // 绘障碍物
stage.addChild(lines); // 路线
createjs.Ticker.addEventListener('tick', stage);
```

整个项目中用到的东西不多;
反而是引入包报错这个问题对我印象比较深刻;
我把我遇到的问题记录了一遍,并贴出了常考文档;
