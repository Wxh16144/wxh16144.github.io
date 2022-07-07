---
title: Notes
date: 2020-12-27 19:23:24
tags: ['notes']
---

一些快速记录的笔记

## Shell字符串拼接（连接、合并）

_2022/07/07_

在写一个 shell 脚本的时候，经常需要对变量字符串进行拼接，记录几种拼接方法；

```bash
#!/bin/bash

name="Shell"
url="https://wxhboy.cn/"

str1=$name$url  #中间不能有空格
str2="$name $url"  #如果被双引号包围，那么中间可以有空格
str3=$name": "$url  #中间可以出现别的字符串
str4="$name: $url"  #这样写也可以
str5="${name}Script: ${url}index.html"  #这个时候需要给变量名加上大括号

echo $str1  # Shellhttps://wxhboy.cn/
echo $str2  # Shell https://wxhboy.cn/
echo $str3  # Shell: https://wxhboy.cn/
echo $str4  # Shell: https://wxhboy.cn/
echo $str5  # ShellScript: https://wxhboy.cn/index.html
```

ref:

+ [Shell字符串拼接（连接、合并）](http://c.biancheng.net/view/1114.html)

## /dev/null

_2022/05/19_

在 Linux 命令中，经常见到 `xxx 2>/dev/null`, 如为防止 Docker 容器退出使用 `tail -f /dev/null`。关于这个命令，我的理解是：

+ `0` 标准输入 stdin，`1` 标准输出 stdout， `2` 错误输出 stderr, `>` 是重定向, `/dev/null` 是个只进不出的地方;

+ 如果只关心**正常输出**，可以在命令后面这样重定向：`commaned 2> /dev/null`, 这样一来，我们看到的所有输出，都是命令正常执行的输出，忽略所有错误输出。
+ 如果只关心**报错内容**，可以在命令后面这样重定向 `command > /dev/null`

ref:

+ [shell程序中 2> /dev/null 代表什么意思](https://www.zhihu.com/question/53295083)
+ [什么是 Bash 中的标准输入、标准错误和标准输出](https://linuxhint.com/bash_stdin_stderr_stdout/)

## copy & paste

_2022/03/19_

在 Mac OS 可以使用 `pbcopy` 和 `pbpaste` 在命令行中进行复制和粘贴操作:

+ `pbcopy < ~/.ssh/public_key` 复制 public_key 内容到剪贴板。
+ `curl baidu.com | pbcopy` 复制 baidu.com 站点内容到剪贴板。
+ `pbpaste > baidu.html` 粘贴剪贴板内容到 baidu.html 文件中。

## Jest unit testing

_2022/03/18_

在阅读 AntD 测试用例时，需要单独运行某个组件 case，或者某个组件的一条 case.

+ 仅运行 components/button 目录下测试用例: `npm run test -- components/button`
+ 仅运行 button 用例名称为 'mount correctly' 的 case : `npm run test -- components/button -t "mount correctly"`
+ 接上条, 使用 [Jest api](https://jestjs.io/docs/api#testonlyname-fn-timeout) (test.only、test.skip) 暂时运行/跳过某些 case:

```diff
-  it('renders correctly', () => {
+  it.only('renders correctly', () => {  /* 仅运行这条 case */
     expect(mount(<Button>Follow</Button>).render()).toMatchSnapshot();
   });
 
-  it('mount correctly', () => {
+  it.skip('mount correctly', () => { /* 跳过这条 case */
     expect(() => mount(<Button>Follow</Button>)).not.toThrow();
   });

```

其中 npm run test --, `--` 是指将后面的参数传递给 script; [Passing args into run-scripts](https://github.com/npm/npm/pull/5518).

## Snapshot Testing

_2022/03/09_

antfu 开源的 [unconfig Repo](https://github.com/antfu/unconfig) 其作用是加载通用配置文件。在仓库的单元测试中发现了快照测试。比如:
[Jest snapshot testing](https://jestjs.io/docs/snapshot-testing), 使用 `jest --updateSnapshot` 或 `jest -u` 来更新所有快照。
[vitest snapshot testing](https://vitest.dev/api/#tothrowerror), 使用 `vitest --update` 或 `vitest -u` 来更新所有快照。
[ava snapshot testing](https://github.com/avajs/ava/blob/main/docs/04-snapshot-testing.md), 使用 `ava --update-snapshots` 或 `ava -u` 来更新所有快照。

顺便补充一个 [ava + puppeteer.test](https://gist.githubusercontent.com/Wxh16144/e61f87de20ed1ce534edf0ff8258ea56/raw/b28c48054e18ced5e0c500b15210d3cea935252e/ava_puppeteer.js) 测试示列。

## import-maps

_2022/02/24_

在阅读 [New React Docs](https://beta.reactjs.org) 时发现文中有交互式调试功能。点击 Download 按钮还可以下载 `sandbox.html` 文件。直接在浏览器中运行示例代码。
阅读了 [reactjs.org repo](https://github.com/reactjs/reactjs.org/blob/main/beta/src/components/MDX/Sandpack/DownloadButton.tsx#L43-L50) 后发现是 html 模版中使用了 [@babel/standalone](https://babel.dev/docs/en/babel-standalone) 和 `<script type="importmap">`。

```html
<script type="importmap">
{
  "imports": {
    "react": "https://cdn.skypack.dev/react",
    "react-dom": "https://cdn.skypack.dev/react-dom"
  }
}
</script>
```

+ [Javascript Import maps(中文)](https://www.jianshu.com/p/b23d823a183a)
+ [Github WICG/import-maps](https://github.com/WICG/import-maps)

## markdown-it 和 feed

_2022/02/24_

笔记这栏是参考 [antfu.me/notes](https://antfu.me/notes) 而写的。看到有 `rss` 订阅,想着自己的笔记也实现一下。使用 hexo 的自动生成 rss 插件无法生成自己想要的。
阅读 [antfu.me repo](https://github.com/antfu/antfu.me) 后才发现，作者是使用 [markdown-it](https://github.com/markdown-it/markdown-it) 和 [feed](https://github.com/jpmonette/feed) 自己写脚本实现的。[scripts/rss.ts](https://github.com/antfu/antfu.me/blob/main/scripts/rss.ts)  

## Vite 插件 unplugin-auto-import

_2022/02/16_

写 `TypeScript` 时，使用 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) 实现按需自动导入API。

插件 [vite-auto-import-resolvers](https://github.com/dishait/vite-auto-import-resolvers) 使用了 `unplugin-auto-import` 的自定义 `resolvers`, see [github 实现](https://github.com/dishait/vite-auto-import-resolvers/blob/main/src/dir.ts#L94-L118)。

## 位运算符速记

_2022/02/09_

+ `x ** y` => `Math.pow(x, y)`
+ `x << y` => `x * 2 ** y`
+ `x >> 1` => `x >>> 1` => `Math.floor(x / 2)`
+ `~x` => `-(x + 1)`

## git submodule

_2022/02/09_

+ 项目中添加子仓库 `git submodule add -b 分支 地址 目录`
+ 克隆带子模块仓库 `git clone --recursive -j8 地址`
+ 更新已克隆仓库的子仓库 `git submodule update --init --recursive`
+ 更新子仓库 `git submodule update --remote`
+ 推送所有子仓库而不push主仓库 `git push --recurse-submodules=only`

## git

_2022/02/09_

+ 使用 `git -C` 来指定工作目录, e.g. `-c $PWD` 指当前目录
+ `git commit --amend --no-edit --no-verify`
  + **--amend** 创建一个新的提交来替换当前分支的顶端
  + **--no-edit** 不调用编辑器，使用当前分支顶端提交信息
  + **--no-verify** 绕过 [githooks](https://git-scm.com/docs/githooks) 缩写`-n`
  