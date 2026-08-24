---
title: Ant Design 版本控，更新日志清爽利器
date: 2024-01-08
---

我又来活跃账号了，这次分享一个我自己写的油猴脚本。

<!-- more -->

## 太长不看版

- 如果期望依赖的 antd 一直保持稳定，又不缺失日常维护，可直接使用 `@conch-v5` or `@conch` 版本，若要使用 semver(数字) 版本，推荐 `^` 前缀。
- 自荐脚本，使用 [Refined Ant Design Changelog](https://greasyfork.org/en/scripts/484164-refined-ant-design-changelog) 油猴脚本(**本文主角**)，标记/折叠不推荐版本，并提供最佳版本推荐。
- 以上两个都不想看，可通过 antd 仓库提供的 [BUG_VERSIONS.json](https://registry.npmmirror.com/antd/latest/files/BUG_VERSIONS.json)  文件自检项目依赖。

## 缘起

在参与贡献时阅读了一部分脚本，发现 [post-script.ts#L14-L57](https://github.com/ant-design/ant-design/blob/3fc65a0865865ef1c1f058d7758d52698c723bc2/scripts/post-script.ts#L14-L57) 脚本一直在维护一个 deprecated 的版本范围，每次发布 npm 后都会将 `conch` 版本更新到特定版本。确保用户不会因为升级 antd 而导致项目报错。

但是这个变量一直属于脚本内部变量，并没有暴露出来，文档也没有提及。所以我在 [antd#46746](https://github.com/ant-design/ant-design/pull/46746) PR 中将其独立出来，作为一个单独的文件，并添加到 npm files 中。方便开发者做一些自定义的检查。

## BUG_VERSIONS.json

这个文件是通过 npm api 获取的，所以只有在发布后才会更新。如果你想要获取最新的 BUG_VERSIONS，可以通过以下命令获取。

```bash
curl -L -o BUG_VERSIONS.json https://registry.npmmirror.com/antd/latest/files/BUG_VERSIONS.json
```

内容如下：

> key 为 antd 版本范围，value 为该范围内的 BUG 链接。

```json
{
  ">= 4.21.6 < 4.22.0": ["https://github.com/ant-design/ant-design/pull/36682"],
  "5.1.0": ["https://github.com/react-component/drawer/pull/370"]
}
```

## Refined Ant Design Changelog

这个油猴脚本是我自己写的，主要功能是将 changelog 页中的不推荐版本标记出来，并提供最佳版本推荐，并且发布到了 [Greasy Fork](https://greasyfork.org/en/scripts/484164-refined-ant-design-changelog) 上。

### 脚本功能

- 通过 npm api 获取最新 BUG_VERSIONS 和 antd 版本历史。
- 支持仅显示有 BUG 的版本。（默认关闭）
- 支持折叠不推荐版本的更新日志。（默认关闭）

### 什么是不推荐版本？

1. 有严重 bug，这些版本可能会导致你的项目报错，无法正常运行。
2. 样式有严重问题，这些版本可能会导致你的项目样式错乱，线上项目不可用。

### 解决方案

针对上面不推荐的版本问题 antd 推荐开发者使用 `^` 作为 semver 的前缀。但是往往很多时候，项目都存在包管理器锁文件，这些锁文件会锁定依赖的版本。所以我们需要自己从 changelog 中找到最佳版本。

### 如何找到最佳版本？

在 [antd#46746](https://github.com/ant-design/ant-design/pull/46746#issuecomment-1873837066) PR 评论中，@afc163 提供了一个建议，将 bug 版本提交到 [cnpm/bug-versions](https://github.com/cnpm/bug-versions/) 仓库，使用 `cnpm` 作为包管理器时，可以通过 `cnpm install antd --fix-bug-versions` 来安装最佳版本。

随即发起了 [antd#46755](https://github.com/ant-design/ant-design/pull/46755) PR，将 BUG_VERSIONS.json 转换为 `cnpm` 可识别的格式，利用 CI 向 cnpm/bug-versions 仓库提交 PR。

计算逻辑大致如下：

1. **排序已发布版本**: 通过 [npm api](https://registry.npmjs.org/antd) 获取 antd 已发布版本, 并通过 semver 排序。
2. **创建链表**: 将前面排序的版本转换为链表结构。
3. **获取 BUG 版本**: 通过 [BUG_VERSIONS.json](https://registry.npmmirror.com/antd/latest/files/BUG_VERSIONS.json) 获取 BUG 版本。
4. **匹配不推荐版本**: 遍历链表, 通过 semver.satisfies 判断是否为不推荐版本。
5. **计算最佳版本**: 在版本链表中，向下遍历，直到找到最佳版本。
6. **构建结果集**: 将不推荐版本和最佳版本构建为结果集，方便后续使用。

具体计算逻辑可参考 [src/bug-versions.ts](https://github.com/Wxh16144/refined-antd-changelog/blob/master/src/bug-versions.ts)

## 如何开发油猴

有了上面的铺垫，我们就可以开始开发油猴脚本了。

> 油猴脚本本身就是一个 iife 的 js 文件，理论上可以直接用油猴编辑器编写。可以先看看 [油猴脚本开发文档](https://www.tampermonkey.net/documentation.php)。

但是我的脚本依赖的 [node-semver](https://github.com/npm/node-semver) 并没有浏览器版本，二来我也想用 ts 来写，所以我使用了 [vite](https://vitejs.dev/) 来进行构建。

~~起初计划用宣传零配置的 parcel 进行构建，但是 parcel 会将 import 的包打包进去，导致还是不能在浏览器中运行。~~

### 使用 vite 构建

vite 生态中也有社区维护的专门用于构建油猴脚本的插件，但看了一眼 vite 的 [build library](https://vitejs.dev/config/build-options.html#build-lib) 文档，vite 本身就支持构建 library，所以我直接使用 vite 进行构建。

工作逻辑就是将构建产物作为 npm 的 files，发布到 npm 上，然后在油猴中通过 npm 的 unpkg cdn 进行引用即可

所以直接拆分一个 `src/meta.user.js` 作为油猴脚本的入口。并且在本地开发的时候利用 `vite-plugin-banner` 将 `src/meta.user.js` 作为描述头文件，生成 `index.user.js`。

为了解决油猴脚本使用 `@require` 引入会有缓存问题，还需要写了一个发布前替换版本号的脚本 [bump.js](https://github.com/Wxh16144/refined-antd-changelog/blob/master/bump.js)。

最终只需要将 `src/meta.user.js` 作为油猴脚本发布 Greasy Fork 即可。本地调试 track `index.user.js` 即可。

**注意**

1. 由于 vite 构建 library 时，不会 watch 变动，需要自己配置一下，可直接参考 [vite.config.ts](https://github.com/Wxh16144/refined-antd-changelog/blob/master/vite.config.ts)。
2. 油猴会自动识别 `*.user.js` 作为油猴脚本，为了提高本地调试体验，务必遵循这个规范。

### 使用效果截图

**antd5.x**
<img width="854" alt="antd5" src="https://github.com/Wxh16144/refined-antd-changelog/assets/32004925/c3695c04-191f-4a39-bc44-cea2776213ad">

**antd4.x**

<img width="854" alt="antd4" src="https://github.com/Wxh16144/refined-antd-changelog/assets/32004925/332aee4e-58a0-41f4-982a-2753ac1ba102">

### 问题

**todo fix：**

antd 的 changelog 页需要等待 react ssr 水合完成后才能用过 js 操作 dom，所以需要等待一段时间才能执行脚本。

先用 `setTimeOut` 等待 10s 后执行脚本。或者插入了一个悬浮按钮，点击后执行脚本。（期待更好的解决方案）

### 最后

如果你觉得这个脚本还不错，可以给我点个 star。如果你有更好的建议，也可以提 issue 或者 PR。
