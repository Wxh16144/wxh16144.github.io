---
title: 从我觉得可以到社区说不行 antd 贡献踩坑过程
date: 2025-05-15 10:32:05
---

主要是记录一下自己在 antd 参与贡献过程中遇到的一些问题和解决方案，顺便给自己留个纪念。

<!-- more -->

## 第一趴

源起 issue [#53759](https://github.com/ant-design/ant-design/issues/53759) 反馈 [ant.design](https://ant.design) 官方文档会有一个每隔 7 天强制弹窗提示可以前往中国镜像站点问题。
可以看到这个问题已经被人反感了，通过 [这里的代码](https://github.com/ant-design/ant-design/blob/5.25.1/.dumi/scripts/mirror-modal.js#L7) 可以了解到控制弹窗的具体逻辑。

```js
(function createMirrorModal() {
  if (
    (navigator.languages.includes('zh') || navigator.languages.includes('zh-CN')) &&
    /-cn\/?$/.test(window.location.pathname) &&
    !['ant-design.gitee.io', 'ant-design.antgroup.com'].includes(window.location.hostname) &&
    !window.location.host.includes('surge') &&
    window.location.hostname !== 'localhost'
  ) {
    const ANTD_DOT_NOT_SHOW_MIRROR_MODAL = 'ANT_DESIGN_DO_NOT_OPEN_MIRROR_MODAL';
    const lastShowTime = window.localStorage.getItem(ANTD_DOT_NOT_SHOW_MIRROR_MODAL);
    if (
      lastShowTime &&
      lastShowTime !== 'true' &&
      Date.now() - new Date(lastShowTime).getTime() < 7 * 24 * 60 * 60 * 1000
    ) {
      return;
    }

    // ... 省略
```

大概意思是如果浏览器语言是中文，并且当前访问的地址是 `-cn` 结尾，并且不是国内镜像的话就进入弹窗逻辑。

其中 `ant-design.gitee.io` 和 `ant-design.antgroup.com` 是国内的镜像站点。

有意思的是对于 `localhost` 和 `surge` 的地址是不会进入逻辑的，说明自己人开发过程中也不喜欢这个弹窗。（`surge` 是 PR preview 的地址）

> 这种逻辑性简单代码，混个 PR 贡献也不算难

### 解决方案 - 判断网站打开速度

一开始脑子没转过弯，提交了一个 PR [#53760](https://github.com/ant-design/ant-design/pull/53760) 试图将 localStorage 的值设置理解成 nextShowTime，允许设置一个未来的日期以达到不弹窗的目的。

> 其实这里可以直接设置 `ANT_DESIGN_DO_NOT_OPEN_MIRROR_MODAL` 为未来的时间字符串就好了，使得 ` Date.now() - new Date(lastShowTime).getTime()` 的值永远小于 7 天。

后面在 [#53759](https://github.com/ant-design/ant-design/issues/53759#issuecomment-2861386907) 评论区提到可以在加入网站打开速度的条件判断来展示是否需要进行提示。

所以继续在 #53760 push 代码，这里了解到了 [MDN - Performance_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance_API) 使用 [domContentLoadedEventEnd](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/) 方法判断 DOM 准备时间。超过 3秒, 则表示需要切换到国内镜像。

随后闲夕大佬提出建议，七天无理由的切源提示可以换成新版本发布提示。
![image.png](https://s2.loli.net/2025/05/15/RaygzM74rdTXKQu.png)

并且评论区也建议改成[新版本发布提示](https://github.com/ant-design/ant-design/pull/53760#issuecomment-2861836417)。

想着新版本提示和切源提示是两个不同的功能，所以选择关闭 #53760，对这次讨论进行归档。

### 解决方案 - 使用新版提示代替

从这里开始我就开始自由发挥了，因为没人告知我应该怎么做。

参考一些软件新提示弹窗，比如 iTerm2 的，他会将最后一次更新说明放在弹窗中，所以我也按照这个思路进行 PR。

![image.png](https://s2.loli.net/2025/05/15/rBwsWL6GIY9xHAF.png)

写了一个 [node 脚本](https://github.com/ant-design/ant-design/pull/53777/files#diff-8649a16e7694838bed97ae2dc92de1f76f96b0b9be006ea95b797548666cca2e)，直接截取 [CHANGELOG.zh-CN.md](https://github.com/ant-design/ant-design/blob/master/CHANGELOG.zh-CN.md) 最后一次更新说明的内容为新的 `.md` 文件，作为弹窗的提示信息。

```tsx
import EN from '../../preset/latest-changelog.en-US.md';
import CN from '../../preset/latest-changelog.zh-CN.md';

function Change(){
  return len=== 'cn' ? <CN /> : <EN />;
}
```

这里修改 dumi 主题，直接插入一个 antd 的 Modal 弹窗组件即可。但是 markdown 语法不支持直接插入组件，所以需要使用自定义 loader 进行处理。

后面想到 dumi 本身就是一个文档生成工具，有一个 [markdown-loader](https://github.com/umijs/dumi/blob/v2.4.21/src/loaders/markdown/index.ts) 可以直接使用了。

最后发现 dumi 提供的 loader 只能处理页面级别的 markdown 文件，却无法处理组件级导入的 markdown 文件，遂即需要给 dumi 提交一个 [PR #2281](https://github.com/umijs/dumi/pull/2281) 进行支持。

经历 dumi 的 review 和 release 后，终于可以在 antd 中使用了。

![image.png](https://s2.loli.net/2025/05/15/EqhWZBHwPplTYuo.png)

- PR [#53777](https://github.com/ant-design/ant-design/pull/53777) 有各种 case 截图。
- 给弹窗 mask 加了一个毛玻璃效果，我觉得更好看了 😂。
- 还自以为的给过长的 changelog 部分进行渐变隐藏，诱导用户点击底部的 “查看完整日志” 按钮。

从提出新版本发布弹窗方案开始到 dumi markdown-loader 改进发版，期间持续了一周， 在社区的的 review 和讨论中，最终完成了这个功能。

并且我还高兴的发了一个 [X (原 twitter)](https://x.com/Wxh16144/status/1920724243605537047)~，不过最后 owner 可能觉得太重了，给了最早在换源弹窗中改进建议

既然又切换为换源方式，当前 PR 也就没有意义了，遂即进行关闭归档。

## 第二趴

源起 issue [#53806](https://github.com/ant-design/ant-design/issues/53806)、[#53764](https://github.com/ant-design/ant-design/issues/53764) 以及 [#53782](https://github.com/ant-design/ant-design/issues/53782) 等一系列问题反馈最新版本出现了 break change 的问题。

既然存在 break change 那肯定是要修复的，遂即在 [#53767](https://github.com/ant-design/ant-design/pull/53767) 进行了修复，并且更新了 [BUG_VERSION.json](https://github.com/ant-design/ant-design/blob/master/BUG_VERSIONS.json) 文件。

早在很早以前，我尝试用油猴脚本的方式在 ant.design/changelog 中对存在 break change 的版本进行标记。具体可以参考: [Ant Design 版本控，更新日志清爽利器 - 掘金](https://juejin.cn/post/7321164229545377831)

所以这次又让我有了提交 PR 的冲动，使其功能作为 antd 网站的一部分，具体思路还是通过 dumi 的自定义 markdown 插件方式修改 changelog 。最终  [PR #53811](https://github.com/ant-design/ant-design/pull/53811) 完成了这个功能。

大概效果预览：

![image.png](https://s2.loli.net/2025/05/15/R274n1YPufQTI5M.png)

但是经过大家一次次 review 后，我感觉到这个功能做的不是很明显。但是社区说声音可能是出去更多的考虑，一方面太多 break change 警告与其它正常 log 对比起来会有些唐突，另一方面让开发者觉得 antd 不够稳定，损害了 antd 的形象吧 /doge

这次更新只是在版本后面添加了一个图标，点击后可以查看具体的 break change 的原因。

所以，我又自以为的觉得还不错的功能，又发了一条 [X (原 twitter)](https://x.com/Wxh16144/status/1922183971435122920) 推荐大家可以使用的油猴脚本。油猴可以同时支持 v4 和 v5， 甚至还有 v3 和 npm 版本列表的支持。

以下是油猴效果截图：

| antd v5 | antd v4 | antd v3 |
| --- | --- | --- |
| [![antd5](https://github.com/Wxh16144/refined-antd-changelog/assets/32004925/c269e70e-e8c0-4815-b5ef-0c502d2f2600)](https://ant.design/changelog-cn) | [![antd4](https://github.com/Wxh16144/refined-antd-changelog/assets/32004925/44eefee9-fe5a-4159-9f9f-da99f01078f4)](https://4x.ant.design/changelog-cn)    |  [![antd3](https://github.com/user-attachments/assets/caaa0f0c-e013-4c5d-81a2-c7630201176a)](https://3x.ant.design/changelog-cn)  |

## End

以上两件事都是近期参与 antd 贡献的过程，真的是经历坎坷
