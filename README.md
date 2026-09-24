<p align="center">
  <a href="https://wxhboy.cn" target="_blank" rel="noopener noreferrer">
    <img src="https://glitch-art.vercel.app/wxhboy.cn?f=Arizonia&fs=128" alt="wxhboy.cn">
  </a>
</p>

# EN

Source of [wxhboy.cn](https://wxhboy.cn), split across branches:

| Branch | Content |
| --- | --- |
| `posts` (default) | One `.md` per article; the file name is the URL |
| `notes` | The `/notes/` page, a single running `index.md` |
| `website` | The `/web/` pages |
| `hexo` | Site config, `themes/lite`, `scripts/`; content branches are mounted as submodules under `source/` |
| `gh-pages` | Build output, pushed by Actions |

Pushing to `posts`, `notes` or `hexo` rebuilds the site — see `.github/workflows/deploy-site.yml`.

# 中文

[wxhboy.cn](https://wxhboy.cn) 的源码，按分支拆分：

| 分支 | 内容 |
| --- | --- |
| `posts`（默认） | 一篇文章一个 `.md`，文件名就是 URL |
| `notes` | `/notes/` 页面，单篇持续累积的 `index.md` |
| `website` | `/web/` 页面 |
| `hexo` | 站点配置、`themes/lite`、`scripts/`；各内容分支以子模块形式挂载在 `source/` 下 |
| `gh-pages` | 构建产物，由 Actions 推送 |

推送到 `posts`、`notes` 或 `hexo` 都会重新构建站点，见 `.github/workflows/deploy-site.yml`。
