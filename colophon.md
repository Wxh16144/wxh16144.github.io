---
title: Colophon
---

这个站点由几个分支和仓库共同组成。`hexo` 分支存放配置、主题和脚本，文章和其他内容则各自维护，最后通过 git submodule 组合到一起。它们之间的关系大致如下。

```mermaid
flowchart LR
  root["<b>hexo</b> 分支<br/>config · themes/lite · scripts"]

  subgraph same["wxh16144.github.io · 同一仓库的不同分支"]
    direction TB
    posts["source/_posts<br/>posts 分支"]
    notes["source/notes<br/>notes 分支"]
    web["source/web<br/>website 分支"]
    about["source/about<br/>main 分支"]
  end

  subgraph other["独立仓库"]
    direction TB
    bookmarks["source/bookmarks<br/>bookmarks"]
    blogroll["source/blogroll<br/>blogroll"]
    gist["gist-viewer<br/>gist-viewer"]
  end

  root --> same
  root --> other

  click posts href "https://github.com/Wxh16144/wxh16144.github.io/tree/posts" "posts 分支" _blank
  click notes href "https://github.com/Wxh16144/wxh16144.github.io/tree/notes" "notes 分支" _blank
  click web href "https://github.com/Wxh16144/wxh16144.github.io/tree/website" "website 分支" _blank
  click about href "https://github.com/Wxh16144/wxh16144.github.io/tree/main" "main 分支" _blank
  click bookmarks href "https://github.com/Wxh16144/bookmarks" "bookmarks" _blank
  click blogroll href "https://github.com/Wxh16144/blogroll" "blogroll" _blank
  click gist href "https://github.com/Wxh16144/gist-viewer" "gist-viewer" _blank
```

> 如果你也想这样组织自己的站点，可以看看 [《用 AI 搓了一套简单的 Hexo 个人博客主题》](/rewrite-blog-theme/)。里面记录了这次重构的过程和取舍，或许能提供一些参考。

## 特性

- **AI 友好**：同一份内容既出 HTML 也出纯文本，机器不用解析页面结构就能拿到正文。
- **llms.txt**：[`/llms.txt`](/llms.txt) 是全站索引，链接一律指向 `.md` 原文。
- **Markdown 原文**：任意页面加 `.md` 就是带 front-matter 的原始 Markdown，比如 [`/debounce-throttle.md`](/debounce-throttle.md)。
- **RSS**：[`/feed.xml`](/feed.xml) 订阅文章，[`/notes.xml`](/notes.xml) 订阅速记；日期在未来的常青文章不进订阅流。
- **单一请求**：主题的 JS 合并成一个 `bundle.js`，字体按中文子集裁剪后自托管。
