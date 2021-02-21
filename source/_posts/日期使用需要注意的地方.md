---
title: 'new Date 使用需要注意的地方'
date: 2018-11-19 14:12:48
tags: ['Bug']
---

使用 **new Date()** 方法时在测试的时候可能没有问题；可是在真机运行的时候就会出现 **NAN**

<!--more-->

### 遇到的问题

1. 制作活动倒计时 **ios** 设备显示错误 **android** 显示正常

```javascript
formatDuring (date) {
    // 这里传入的 date 参数需要注意 年月日分隔符 2018/11/26 23:59:59
    const mss = new Date(date).getTime() - new Date().getTime()
    if (mss > 0) {
        const days = parseInt(mss / (1000 * 60 * 60 * 24));
        const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = (mss % (1000 * 60)) / 1000;
        this.timeRemaining = `活动剩余时间:${this.mynumber(days)}天${this.mynumber(hours)}时${this.mynumber(minutes)}分${this.mynumber(Math.floor(seconds))}秒`;
        // this.timeRemaining = `活动剩余时间:${days}天${hours}时${minutes}分${Math.floor(seconds)}秒`;
      } else {
        this.timeRemaining = '哎呀~你来晚了，活动已结束'
      }
 }
```

1. 调用方法 **formatDuring** 传入的形参需要注意

```javascript
formatDuring('2018/11/26 23:59:59'); // 错误参数 2018-11-26 23:59:59
```

我之前在调用时 传入的参数是 `2018-11-26 23:59:59`, 所以在真机 IOS 上就出现 `NAN`

### 总结

注意到日期 **年月日分隔符** 在 ios 移动端会报错 需要用 `/` 来作为分隔符 切记不能使用 `-`

在**Android**和 **微信开发者工具** 和 **chrome 浏览器** 中测试用`-` 都不会出现问题 唯独**ios**
