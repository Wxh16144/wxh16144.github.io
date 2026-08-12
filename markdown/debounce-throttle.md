---
title: 手写防抖和节流
date: 2019-08-19 17:54:59
tags: ['JavaScript']
---

记录手写防抖和节流

<!--more-->

### 防抖(debounce)

> 当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次;
> 如果设定的时间到来之前，又一次触发了事件，就重新开始延时;

```javascript
const debounce = (fn, t) => {
  let time;
  return function (...arg) {
    clearTimeout(time);
    let that = this;
    time = setTimeout(function (...arg) {
      fn.apply(that, arg);
    }, t);
  };
};
```

### 节流(throttle)

> 当持续触发事件时，保证一定时间段内只调用一次事件处理函数;

```javascript
const throttle = (fn, t) => {
  let now = Date.now();
  return function (...arg) {
    if (Date.now() - now > t) {
      fn.apply(this, arg);
      now = Date.now();
    }
  };
};
```
