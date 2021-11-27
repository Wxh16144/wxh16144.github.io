---
title: JS宏任务和微任务
date: 2019-08-13 01:01:53
tags: ['JavaScript']
---

JS 事件循环机制之宏任务/微任务;

<!--more-->

执行打印顺序:

```javascript
console.log('script start');
setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise1');
  })
  .then(() => {
    console.log('promise2');
  });

console.log('script end');
```

<span style="font-weight:600;color:red">我的错误答案是</span>：~~script start , promise1 , promise2 , script end , setTimeout~~

<span style="font-weight:600;color:green">正确答案是</span>：script start, script end, promise1, promise2, setTimeout;

因为**Promise**是微任务，主线程会在同步任务做完后先清空微任务队列，再执行宏任务队列的**setTimeout**;

### 宏任务(macro-task)

![macro-task](https://i.loli.net/2021/11/27/yWzFdxT4uBkR2e5.png)

浏览器为了能够使得 JS 内部 task 与 DOM 任务能够有序的执行，会在一个 `task` 执行结束后，在下一个 `task` 执行开始前，对页面进行重新渲染 (task->渲染->task->...)
鼠标点击会触发一个事件回调，需要执行一个宏任务，然后解析 HTMl。

**setTimeout**的作用是等待给定的时间后为它的回调产生一个新的宏任务。
这就是为什么打印 `setTimeout` 在 `script end` 之后。因为打印 `script end` 是第一个宏任务里面的事情，而 `setTimeout` 是另一个独立的任务里面打印的。

<br />

### 微任务(micro-task)

![micro-task](https://i.loli.net/2021/11/27/rBHbYGskXCujxzI.png)

微任务通常来说就是需要在当前 `task` 执行结束后立即执行的任务，比如对一系列动作做出反馈，
或或者是需要异步的执行任务而又不需要分配一个新的 `task`，这样便可以减小一点性能的开销。

只要执行栈中没有其他的 js 代码正在执行且每个宏任务执行完，微任务队列会立即执行。

如果在微任务执行期间微任务队列加入了新的微任务，会将新的微任务加入队列尾部，之后也会被执行。

微任务包括了**mutation** 和 **observe**的回调还有接下来的例子**promise**的回调。

一旦一个**pormise**有了结果，或者早已有了结果（有了结果是指这个**promise**到了 `fulfilled` 或` rejected` 状态），
他就会为它的回调产生一个微任务，这就保证了回调异步的执行即使这个**promise**早已有了结果。
所以对一个已经有了结果的**promise**调用.then(yey, nay)会立即产生一个微任务。
这就是为什么 `promise1` , `promise2` 会打印在 `script end` 之后，因为所有微任务执行的时候，当前执行栈的代码必须已经执行完毕。

`promise1` , `promise2` 会打印在 `setTimeout`之前是因为所有微任务总会在下一个宏任务之前全部执行完毕。

### 参考文档

- [译文：JS 事件循环机制（event loop）之宏任务、微任务](https://segmentfault.com/a/1190000014940904)
- [【第 1405 期】浏览器的 Event Loop](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651229977&idx=1&sn=e74d2564a25ade60323ee03f098b9f49&chksm=bd49569d8a3edf8bff6e67a1eff689d1ca26e8289ece27b6cca213250875924a18b3c8abdcd0&mpshare=1&scene=1&srcid=0813PX7fZJwLr13Ov7Tp3I3g&sharer_sharetime=1565631263800&sharer_shareid=c8544bd524fe5961efc31247bc0f6855&key=e569ae84dd481d076674c08ddcdb05d9fd646256656a88f583c6832792a7e536785533abd02aa3402e9c31c8ce577b94d05f1f01fdbd082bca0f795875bbbcfc3f15dc667ff313758e7612d516f04879&ascene=1&uin=Nzg4NTEwNDc4&devicetype=Windows+10&version=62060833&lang=zh_CN&pass_ticket=CjhEB0kWCw6ZuANW0atMEXhV5JXJxBMKEC4Q6IVTI01hXxgnAZ6TGqLsQYV5v%2FSL)
- [【第 993 期】总是一知半解的 Event Loop](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651226694&idx=1&sn=01908e1c5089010733e723c99947b311&chksm=bd495bc28a3ed2d4d92c024910eb2b0367d0b22ee8e2587fee9253a359ebf99dba63338f3ccb&scene=21#wechat_redirect)
