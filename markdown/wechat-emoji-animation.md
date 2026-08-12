---
title: 仿微信关键字触发表情包动画效果
date: 2019-05-21 10:50:14
tags: ['CSS','JavaSript']
---

❤521到了, 码农翻身;
模仿微信聊天发送关键字 `么么哒` 触发表情包雨`😘`的效果;

<!--more-->

### 520遇见你

![520Demo](https://raw.githubusercontent.com/Wxh16144/love/master/love.gif)

### 开始

使用了[parcel](https://parceljs.org);

其实不要也可以,并没有用到什么,主要是自己想使用`sass`预编译语法,嵌套使用;

这次分享主要是如何实现这个动画效果的;

+ html部分

```html
<body>
    <div id="root">
      <div id="phone">
        <div id="header">宝贝❤</div>
        <div id="main">
          <div id="keyword">
            <p class="myself" style="--name:'我'">在吗?</p>
            <br>
            <p class="myself" style="--name:'我'">在干嘛?</p>
            <p class="opposite" style="--name:'宝贝'">多喝烫水!</p>
          </div>
          <div class="bg theme"></div>
          <!--表情包动画雨容器-->
          <div id="animation"></div>
        </div>
        <div id="footer">
          <input type="text" id="message" maxlength="255" />
          <button id="send">发送</button>
        </div>
      </div>
    </div>
  </body>
```

+ 获取每个部分的容器

```javascript
  const $ = str => document.querySelector(str);
  const myRandom = (min = 0, max = min + 1) => Math.random() * (max - min + 1) + min;
  const elObj = {
    // ... 其他省略
    root: $('#root'), // 根目录
    animation: $('#animation'), // 动画容器
    message: $('#message'), // 输入框
    send: $('#send') // 发送按钮
  }
```
### 实现动画 `createAnimation`方法

+ 判断表情包

```javascript
const createAnimation = icon => {
  let logo = icon;
  // 如果表情包传入的是数组,随机取一个;
  if (Array.isArray(icon)) {
    const index = myRandom(0, icon.length - 1)
    logo = icon[Math.floor(index)];
  }
}
```

+ 获取元素的位置

```javascript
  const { width, height, top, bottom } = elObj.main.getBoundingClientRect();
  const count = Math.round(width * height / 5000); // 表情包数量
  const averageCount = Math.round(width / 65); // 每个表情包占一行的65px (这里计算一行有几个)
  const fw = width / averageCount; // 范围像素 (因为上面写死65px) 可能有小数;
```

+ 循环创建元素

```javascript
[...Array(count).keys()].forEach(index => {
    let childEl = document.createElement('i');
    //计算定位left左边距
    const left = (myRandom(1, fw) + fw) * (index % averageCount) + 'px';
    // ...
})
```
+ 给元素添加属性和动画

```javascript
  childEl.classList = 'icon-itme'; // 添加class
  childEl.innerText = logo || '😘' // 添加表情包
  childEl.style.left = left // 左边距
  childEl.style.position = 'absolute' // 添加定位
  childEl.style.fontSize = '32px'; // 设置字体大小
  childEl.style.transform = `translate(${left},${-50}px)`; // 位移
  // 为每一个动画添加过渡时间和过渡延迟,随机生成;
  childEl.style.transition = `transform ${myRandom(3, 6)}s linear ${myRandom(1, 2)}s`;
```

+ 添加位移到指定位置动画

```javascript
  //  这里使用setTimeout是因为js的 event loop;
  setTimeout(() => {
   // 移动到底部 并随机修改元的X轴大小,随机对元素旋转
   childEl.style.transform = `translate(${myRandom(1, fw)}px,${height + 50}px) rotate(${myRandom(-90, 90)}deg)`
  }, 0)
```

这里不用`setTimeout` 浏览器会默认使用第二个动画,使用就不会有动画效果实现;
大家可以先去了解浏览器`event-loop`;
这里有一篇文章可以参考一下[【第1405期】浏览器的 Event Loop](https://mp.weixin.qq.com/s/r9hJmsK9oprn5f1CbhAHNQ)

+ 动画执行完毕后删除元素

```javascript
  // 过渡结束后执行
  childEl.addEventListener('transitionend', ({ target }) => {
    target.parentNode.removeChild(target); // 删除执行完动画的元素
  }) 
  elObj.animation.appendChild(childEl); // 添加元素到动画容器中
```

到这里,我的整个创建表情包雨的效果已近完成了;
至于如何通过发送消息匹配关键字我使用了正则表达式;

### 触发关键字
+ 新建一个keyword.js专门维护关键字

```javascript
export default {
  '么么哒': '😘',
  '猪': ['🐖', '🐽', '🐷', '🐗'],
  '爱|love': ['❤', '💕'],
  '大便|粑粑': '💩',
}
```

+ 实现发送消息方法

```javascript
//HTML转义
const HTMLEncode = html => {
  const el = document.createElement("div");
  el.textContent ? el.textContent = html : el.innerText = html
  return el.innerHTML;
}
// 追加聊天记录
const pushMessage = (str, name, ismyself) => {
  if (!str) return false;
  var html = `
    <p class="${ismyself ? 'myself' : 'opposite'}"
       style="--name:'${name}'">${HTMLEncode(str)}
    </p>
  `
  elObj.keyword.innerHTML += html;  // 添加聊天内容
  elObj.main.scrollTop = elObj.keyword.scrollHeight
  // 判断聊天内容有没有关键字
  const find = Object.keys(keyword).find(key => new RegExp(key, 'ig').test(str))
  const icon = keyword[find]; // 找到匹配的表情包
  icon && createAnimation(icon) // 创建动画
}
```

+ 添加发送按钮点击事件

```javascript
elObj.send.addEventListener('click', () => {
  const inputval = elObj.message.value; // 输入框内容
  inputval && pushMessage(inputval, '我', true); // 发送消息
  elObj.message.value = ''; //清空输入
})
```

到这里整个项目的代码就完成了;有一些样式我偷懒了还有些问题;
但今天我和大家分享的是动画效果的实现;
明年520在修复;
代码我放到了GitHub上了[项目代码](https://github.com/Wxh16144/love);

我建立了第一个`issues` 欢迎大家帮助我;
很多关键字匹配表情包没有完成,欢迎大家`Fork`和`pull requests`完善我们的项目;
在[这里](https://github.com/Wxh16144/love/blob/master/keyword.js)你可以添加你的代码;

### 🌰example
> 我需要添加一个 `男人` 和 `man`
> `key` 是关键字,多个可以用 `|` 区分
> `value` 是匹配的表情包,多个可以用 `Array` 类型,如果就一个可以直接添加Emoji

```javascript
export default {
  // old code
  '男人|man': '👨',
  '女人|girl': ['👧', '👧🏻']
}
```
