---
title: 用 AI 搓了一套简单的 hexo 个人博客主题
date: 2026-09-21
description: 换掉 hexo-theme-next，用 AI 搓了一套简单的 hexo 个人博客主题。
---

这次把 hexo-theme-next 换掉了。用别人的主题，改起来总得迁就它的结构，自己从头写又太贵，直到 AI 把这部分成本压下来。

一开始想完全自己重写，连 Hexo 都不打算用了，把之前的 markdown 转成 HTML，再套上 Github 的样式就够了。

后来发现用 [remark](https://github.com/remarkjs/remark) 加插件解析 markdown，跟 Hexo 干的是同一件事，有点重复造轮子。所以 Hexo 留下了，主题从头搓，用 AI 边聊边改。

### URL 优化与历史链接重定向

之前的博客没处理过 url，默认是日期加中文标题，这事我自己诟病很久了，但一直懒得动。

重构的第一件事，就是把历史文章都改成英文路径。这样分享出去干净多了，也不会出现一长串编码后的地址。比如这篇：

[https://wxhboy.cn/2022/03/22/%E4%BD%BF%E7%94%A8-gitconfig%E9%85%8D%E7%BD%AE%E5%A4%9A%E7%94%A8%E6%88%B7%E9%9C%80%E6%B1%82/](https://wxhboy.cn/2022/03/22/%E4%BD%BF%E7%94%A8-gitconfig%E9%85%8D%E7%BD%AE%E5%A4%9A%E7%94%A8%E6%88%B7%E9%9C%80%E6%B1%82/)

为了不让旧地址失效，我做了重定向，把历史文章路径都归档到仓库里。

另外，我很喜欢在同一个仓库中存放不同的内容，用分支名语义化区分。比如前面说的归档，我放在了 [legacy-blog-redirects 分支](https://github.com/Wxh16144/wxh16144.github.io/tree/legacy-blog-redirects)。比如 [Wxh16144/wxh16144](https://github.com/Wxh16144/wxh16144) 仓库的 `npm`、`resume` 等分支。

博客这边，我习惯用 Git submodule 把这些仓库拼起来，组成一个完整的个人站点。

比如 [wxh16144.github.io](https://github.com/Wxh16144/wxh16144.github.io) 仓库，放的都是和个人网站相关的东西。`website` 是纯静态页面，不做工程化构建，也是我早期手写的 HTML。

前面提到的 `legacy-blog-redirects` 本来也想当 submodule 挂在 `gh-pages` 分支上做重定向，后来发现 Hexo 自己就能生成，就只留了 `redirect-map.json`，每次构建时重新生成一遍。

### 新主题：快速、简单

**快速**

整个主题尽量精简，静态资源全部走 [npmmirror](https://npmmirror.com/) 镜像源当 CDN，少发几个请求，HTML 也顺手压一压。

[![PageSpeed 桌面端性能评分](https://files.seeusercontent.com/2026/09/21/bq0O/pagespeedwebdev-analysis-https-w.png)](https://pagespeed.web.dev/analysis/https-wxhboy-cn/9mkxb74m9v?form_factor=desktop)

博客默认部署在 GitHub Pages，不过国内访问不太稳定。所以我又接了 Vercel，绑了二级域名 [blog.wxhboy.cn](https://blog.wxhboy.cn)，多一个能打开的地址。

腾讯云 EdgeOne 的免费套餐也用上了，搭了 [cn.wxhboy.cn](https://cn.wxhboy.cn) 镜像站点。三套全是免费资源，页面基本能做到 1 秒内打开，哪个能通走哪个。

![blog-accessibility-screenshot](https://files.seeusercontent.com/2026/09/21/6soR/wwwbocecom-http-20260921_c3ee093.png)

**简单**

简单不只是少做功能，样式上我也不想自己设计。主题沿用 [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) 的 markdown 风格，高亮直接套 [highlight.js](https://github.com/highlightjs/highlight.js) 的官方主题，色值抄它的 token（`--fg`、`--muted`、`--accent`、`--border`、`--bg`），这样导航、页脚这些自己写的部件，看起来就跟正文是一套的。

只有一个地方得改配置：hexo 默认的高亮输出带行号列的 table 结构，套不上现成主题，关掉包装和行号（`hljs: true`、`wrap: false`、`line_number: false`）之后，它才会输出裸的 `<pre><code class="hljs">`，CDN 上的主题就能直接生效。

我平时自己习惯用亮色界面，不过这次重构不想堆复杂功能。博客直接跟随系统主题偏好，不做手动切换按钮。我一直觉得，用户系统已经设置好明暗模式，打开网站直接 Follow System 就好，没必要多一步手动操作。

跟随系统这件事靠 CSS 的 `prefers-color-scheme` 就够了，不过我还在 head 里补了一行：

```html
<meta name="color-scheme" content="light dark">
```

它的作用是提前告诉浏览器这个站亮色深色都支持，滚动条、表单控件这些原生 UI 会跟着一起变；顺带也避免了样式还没加载时先闪一下白底（FOUC）。

最开始没打算加评论，但还是希望看完文章的人可以留点反馈。所以简单接入了 GitHub Discussions，没有选择单独部署评论服务。

### 三个域名的副作用

上面三套部署解决了可访问性，也带了个新问题：同一篇文章现在有三个地址。对搜索引擎来说这算重复内容，得分清楚哪份是正主，所以我又在 head 里补了几个标签。

```html
<link rel="canonical" href="https://example.com/page">
<meta property="og:url" content="https://example.com/page">
```

canonical 固定指向 `wxhboy.cn`，所以哪怕你是从 `blog.wxhboy.cn` 或者 `cn.wxhboy.cn` 打开的，爬虫也知道该认哪一份。文章如果是自己首发的，这两个标签也是在声明权威来源。

```html
<meta name="description" content="Description of this page.">
```

页面描述，给 SEO 用。

```html
<meta name="author" content="Wuxh">
```

标识页面作者。博客这种以人为主体的站点，加上比较合适。

```html
<script type="application/ld+json"></script>
```

结构化数据，把页面内容用 JSON 再描述一遍，给搜索引擎和爬虫读。现在 AI 抓页面的场景也越来越多，顺手加上了。

文章底部我也放了个 `.md`，把源文件原样复制一份出去，点开是带 front-matter 的原文，可以直接让 AI 读取和理解文章内容。

最后还有 `og:image` 这些，决定链接贴到社交平台或聊天窗口里的时候卡片长什么样——上面刚把 URL 收拾干净，分享出去的样子就是靠它们。
