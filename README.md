<p align="center">
  <a href="https://wxhboy.cn" target="_blank" rel="noopener noreferrer">
    <img src="https://glitch-art.vercel.app/wxhboy.cn?f=Arizonia&fs=128" alt="wxhboy.cn">
  </a>
</p>

# EN

Source of [wxhboy.cn](https://wxhboy.cn), split across three branches:

| Branch | Content |
| --- | --- |
| `posts` (default) | One `.md` per article; the file name is the URL |
| `hexo` | Site config, `themes/lite`, `scripts/`; `source/_posts` is a submodule of `posts` |
| `gh-pages` | Build output, pushed by Actions |

Pushing to `posts` or `hexo` rebuilds the site — see `.github/workflows/deploy-site.yml`.

# 中文

[wxhboy.cn](https://wxhboy.cn) 的源码，按三个分支拆分：

| 分支 | 内容 |
| --- | --- |
| `posts`（默认） | 一篇文章一个 `.md`，文件名就是 URL |
| `hexo` | 站点配置、`themes/lite`、`scripts/`；`source/_posts` 是 `posts` 的子模块 |
| `gh-pages` | 构建产物，由 Actions 推送 |

推送到 `posts` 或 `hexo` 都会重新构建站点，见 `.github/workflows/deploy-site.yml`。
