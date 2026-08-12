---
title: 解决微信H5在IOS中无法自动播放音乐问题
date: 2018-09-03 13:53:21
tags: ['JavaScript']
---

记录在开发微信公众号 h5 时，遇到 ios 设备无法自动播放音乐问题

<!--more-->

### 标签部分

```html
<audio
  id="bgmusic"
  autoplay
  controls
  preload
  src="/static/music.mp3"
  style="display: none;"
/>
```

### 问题原因

1. 可以自动播放时正确的事件顺序是:
   loadstart -> loadedmetadata -> loadeddata -> canplay -> play -> playing

**不能自动播放时触发的事件是**

- iPhone5(iOS7.0.6) loadstart

- iPhone6s(IOS9.1) loadstart -> loadedmetadata -> loadeddata -> canplay

**执行播放时需要注意**

- **iOS 9** 还需要额外的 `load` 一下, 否则直接 `play` 无效
- **iOS 7/8** 仅需要 `play` 一下

**注意点**

- 由于 iOS Safari 限制不允许 audio autoplay, 必须用户主动交互(例如 click)后才能播放 audio, 因此我们通过一个用户交互事件来主动 `play` 一下 audio.

### 解决方案

```javascript
// data中定义变量
this.audioEl = null

// methods中定义方法
forceSafariPlayAudio() {
  this.audioEl.load(); // iOS 9   还需要额外的 load 一下, 否则直接 play 无效
  this.audioEl.play(); // iOS 7/8 仅需要 play 一下
}
// mounted中调用

let that = this;
this.$nextTick(()=>{
  this.audioEl = document.getElementById('bgmusic');
      document.addEventListener('WeixinJSBridgeReady', that.forceSafariPlayAudio, false)
      this.audioEl.addEventListener('play', function() {
      // 当 audio 能够播放后, 移除这个事件
      window.removeEventListener('touchstart', that.forceSafariPlayAudio, false);
  }, false);

  // 过一个用户交互事件来主动 play 一下 audio.
  window.addEventListener('touchstart',  that.forceSafariPlayAudio, false);

  this.audioEl.src = './static/music.mp3';
})
```
