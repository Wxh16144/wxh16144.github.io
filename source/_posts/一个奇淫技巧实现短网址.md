---
title: 一个奇淫技巧实现短网址
date: 2025-01-17 14:10:26
tags: [Git]
---

这个方案只是出于学习和分享的目的，肯定是不建议在生产环境中使用的。并且不是最优的方案，只是一个简单的实现。

<!-- more -->

### 问题

很早以前在玩域名的时候，我就想做一个二级域名启动一个短网址的服务，但是一直没有实现。那个时候入行，只会写js，没多久也没有太多的经验，所以一直没有实现。

2022 年的时候还用 Google 的 Firebase Dynamic Links 做了一个短网址的服务。用 API 生成短网址，然后通过 Firebase 的服务跳转到原始网址。

然后就搁置了, 一直没去使用，也没去看

最近我看到我的某些个文件中有提到我的短网址服务。

![历史短网址使用截图](https://s2.loli.net/2025/01/17/zyF4OVq87gUpsJv.png)

### 实现

1. 使用 [GitHub Pages 自定义子域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain)，然后通过 404 页面实现跳转。
2. 本地使用 `git commit --allow-empty -m` 将每一个真实网址作为一个 commit message 提交到 GitHub 仓库。
3. 由于每一个提交都会生成一个唯一的 SHA-1 值，然后通过这个 SHA-1 值作为短网址的路径。
4. 最后在 404 页面中通过 [GitHub commits api](https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#get-a-commit) 用 SHA-1 值获取到 commit message，然后跳转到真实网址。

比如: [https://link.wxhboy.cn/22bb](https://link.wxhboy.cn/22bb) (22bb 是一个 SHA-1 值)

以上就是整个实现的思路。[源码在这里, Wxh16144/links/blob/gh-pages/404.html](https://github.com/Wxh16144/links/blob/gh-pages/404.html)

### Firebase Dynamic Links 迁移

> [Firebase Dynamic Links 已被弃用，不应该在新项目中使用。该服务将于 2025 年 8 月 25 日关停。](https://firebase.google.com/support/dynamic-links-faq?hl=zh&authuser=0)

由于以前使用的 Firebase Dynamic Links 服务，并且最近登录后发现弃用提示。发现提供了数据导出的功能，所以就导出了历史数据。

![Firebase Dynamic links 导出截图](https://s2.loli.net/2025/01/17/oWXI4Bt6e9hECwL.png)

这里可以用脚本将导出的数据的真实地址一条条的转换成 commit message，然后提交到 GitHub 仓库中。

但是之前的路径是不一样，所以我们可以痛过 tag 来实现一一对应。就像这样:

![使用 tag 迁移历史短网址](https://s2.loli.net/2025/01/17/hdqXm7LC84lV5Wj.png)

如上操作后，我们就可以通过 tag 或分支名来实现语义化的路径

### 总结

用 SHA-1 值作为路径，虽然不是最短的短网址，但是可以保证唯一性。

加上之前网络上出现过一篇名为 [《Anyone can Access Deleted and Private Repository Data on GitHub》](https://trufflesecurity.com/blog/anyone-can-access-deleted-and-private-repo-data-github) 的文章，说的是即便删除了有关分支和 tag 依然可以通过 api 获取到提交的信息。微软回应这是设计如此。

所以我们在仓库只要有 push 过的提交，都可以通过 SHA-1 值来获取到提交信息。也就是说，这个基于 SHA-1 值的短网址服务是可以永久保留的。

### 缺点

说完我们的骚操作，也要说说缺点。

1. 由于每一个真实网址都是一个提交，所以会导致仓库的提交记录非常多，不利于查看。 (可以通过 tag 或分支名来实现语义化的路径)
2. 因为 GitHub 仓库是公开的，所以短网址也是公开的，不适合敏感信息。
3. 由于是通过 404 页面实现跳转，所以会有一定的延迟。
4. 404 页使用了 GitHub api，所以会存在一定的请求次数限制。

以上，这是一个玩具~

### 试试看文中提到的短网址

- https://link.wxhboy.cn/9QEF
- https://link.wxhboy.cn/UCPuD93mY99vfntK8
- https://link.wxhboy.cn/TtnJ