---
title: 元素固定宽度文本不换行并且全部展示
date: 2019-05-28 10:33:57
tags: ['JavaScript']
---

前几天遇到一个需求, 用户名过长的时, 不允许换行使其文本全部显示在一行框内;

<!--more-->

### 实现效果

具体项目中实现效果图

<div style="display:flex;flex-wrap:wrap;">
  <img style="width:50%;height:auto;font-size:0" src="https://i.loli.net/2021/02/22/7gFZ3ljzAXqxNab.png" title="短文本" />
  <img style="width:50%;height:auto;font-size:0" src="https://i.loli.net/2021/02/22/xCfQPDWcjmUh2K9.png" title="长文本" />
  <img style="width:50%;height:auto;font-size:0" src="https://i.loli.net/2021/02/22/u68RE9niDferMgQ.png" title="长长文本" />
  <img style="width:50%;height:auto;font-size:0" src="https://i.loli.net/2021/02/22/aAK5m2riVudWEwl.png" title="长长长文本" />
</div>

### 解决方法

创建 `resetFontSize` 方法

```javascript
const resetFontSize = function (el, minFontSize, maxFontSize) {
  // 可见区域宽度
  var maxWidth = document.documentElement.clientWidth;
  // 初始化默认大小
  $(el).css({
    'font-size': 12,
    width: 'max-content'
  });
  for (let i = minFontSize; i < maxFontSize; i++) {
    // 如果内容可以显示, 则字体大小取上上个;
    if ($(el).width() > maxWidth) {
      $(el).css('font-size', i - 2);
      break;
    } else {
      $(el).css('font-size', i);
    }
  }
  $(el).css('width', '100%');
};
```

### 如何使用

因为公司项目使用的 `Vue` + `Jquery`, 我在这里用监听用户名改变的时候触发方法 `Vue.watch`

```javascript
watch: {
  userName: {
    handler(val, old) {
      console.log('userName change');
      this.$nextTick(()=> {
          var el = $('.loginDivContent-username');
          resetFontSize(el, 10, 300)
      });
    },
    immediate: true
  }
}
```
