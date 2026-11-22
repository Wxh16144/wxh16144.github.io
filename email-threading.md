---
title: 从 GitHub 通知学到的邮件体验
date: 2026-11-13
description: 改了几个邮件头，让日报、周报、月报在邮箱里各自聚成一条会话，攒着不看也不会把收件箱刷屏。
---

给自己的记账服务加了日报、周报、月报邮件后，收件箱很快就被刷屏了。改了几个邮件头，让它们像 GitHub 通知一样按主题折叠成会话。

<!-- more -->

### 起因

我自己部署了一个记账小服务[「迹栈」](https://ts.wxhboy.cn/)，每天会用 nodemailer 发一封日报，每周、每月再各发一封汇总。

问题是我懒，不会每天去翻邮箱。偶尔想起来看一眼，收件箱里已经是一排平铺的邮件：`XX日报 11-08`、`XX日报 11-09`、`XX日报 11-10`……主题每天都不一样，邮箱就当成不相干的邮件，一封占一行...

![改动前：日报在收件箱里平铺](https://files.seeusercontent.com/2026/11/13/2xEq/before-inbox.png)

这时候想起平时混迹 GitHub 开源时收到的通知邮件。同一个 PR 或 issue 下的所有回复，在邮箱里都折叠成一条会话，点开就是完整的讨论过程，从来不会刷屏。

![GitHub 通知：同一个 PR 的回复折叠在一条会话里](https://files.seeusercontent.com/2026/11/13/Xzn9/github-thread.png)

那我的报表能不能也这样？

### 邮箱是怎么决定「同一个会话」的

我先问了 AI，让它把相关文档翻了一遍，再结合我的代码和使用场景一看，发现能做，那就直接让它开工。

客户端归并会话大致有两条路：

1. **看主题**。去掉 `Re:`、`Fwd:` 这类前缀后主题一样，就算同一个会话。163 网页版、手机自带的邮件 App 基本走这条路。
2. **看邮件头**。[RFC 5322 §3.6.4](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.4) 规定每封邮件应该有一个唯一的 `Message-ID`，回复时用 `In-Reply-To` 和 `References` 指向被回复的邮件。Gmail、Apple Mail 会顺着这串 ID 把邮件串起来。

GitHub 通知两条路都占了：主题固定是 PR / issue 的标题，邮件头里也带着线程 ID。在邮箱里「显示原始邮件」就能看到。

![GitHub 通知邮件的原始邮件头](https://files.seeusercontent.com/2026/11/13/0jUc/github-headers.png)

顺带一提，[Gmail 帮助文档](https://support.google.com/mail/answer/5900?hl=zh-Hans)里说，自动发送的邮件要和上一封间隔不到一周才会归到一起，周报、月报在 Gmail 里能不能聚上，我还没验证。

### 改动

照着 GitHub 的做法，改了三处：

- **主题固定**：去掉日期，日报就叫 `XX日报`，周报、月报同理，各是一条会话。
- **日期挪到发件人名上**：主题不带日期了，就放进发件人显示名，收件箱列表里照样分得清是哪天。
- **固定线程根**：`In-Reply-To` 和 `References` 都指向同一个固定 ID，`Message-ID` 带上日期保证唯一。这封「根邮件」其实从来没发过，但不影响客户端把它们串起来。

nodemailer 直接支持这几个字段：

```js
await transporter.sendMail({
  from: 'XX日报 11-10 <bot@163.com>',
  to: 'me@example.com',
  subject: 'XX日报',
  messageId: '<ts-report-daily-20261110@163.com>',
  inReplyTo: '<ts-report-daily@163.com>',
  references: '<ts-report-daily@163.com>',
  html,
});
```

最后的效果：

![改动后：日报聚成一条会话，发件人名带日期](https://files.seeusercontent.com/2026/11/13/omL1/after-thread.png)

以上，就我个人体感来说，改成按会话归并的邮件体验比平铺的好很多：反正不是每个人都会天天查邮箱，邮件也没必要一封封刷存在感。归到一条会话里，哪天想看了再翻就好。

### 参考文档

- [RFC 5322 §3.6.4 Identification Fields](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.4)
- [Gmail 帮助：将电子邮件汇总为会话](https://support.google.com/mail/answer/5900?hl=zh-Hans)
- [Nodemailer: Message configuration](https://nodemailer.com/message)
