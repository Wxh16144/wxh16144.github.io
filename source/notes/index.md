---
title: Notes
date: 2020-12-27 19:23:24
tags: ["notes"]
---

一些快速记录的笔记

## Bash `which` vs `type` vs `where`

_2025/01/20_

我有一个命令，我想知道它是从哪里来的。我可以使用 `which` 或 `type` 命令来查找。

- `which`
  - 在 `$PATH` 中查找可执行文件。
  - 位于 `/usr/bin/which`。
- `type`
  - 确定命令是别名、函数、内置命令、缓存的可执行文件（散列）、`$PATH` 中的二进制文件等
  - shell 内置
- `where`
  - 与 `which` 类似，但是可以列出所有匹配的命令。
  - 不仅适用于 Unix, 也适用于 Windows。
  
ref:

- [Bash `which` vs `type`](https://gist.github.com/miguelmota/bb7f8587047c7dcb5fe38b41ba2d357d)
- [What is the difference between which and where](https://unix.stackexchange.com/a/757150)

```bash

## Web Search

_2024/07/22_

1.在浏览器地址栏输入 `?` 可以快速搜索，输入 `?` 后再输入关键词，然后回车，就会跳转到搜索引擎搜索结果页面。[Copilot 自动生成]

如题，如果需要在 web 端实现搜索功能可以：

1. [FlexSearch](https://github.com/nextapps-de/flexsearch) 实现全文搜索
2. CMD K , https://cmdk.paco.me or https://react-cmdk.com
3. 命令行模糊查找 [fzf](https://github.com/junegunn/fzf)

read more:
1. [How MDN’s autocomplete search works](https://hacks.mozilla.org/2021/08/mdns-autocomplete-search/)
2. [How MDN’s site-search works](https://hacks.mozilla.org/2021/03/how-mdns-site-search-works/)
3. [mdn/yari search.tsx](https://github.com/mdn/yari/blob/main/client/src/search.tsx)
4. [Nextra FlexSearch](https://github.com/shuding/nextra/blob/main/packages/nextra-theme-docs/src/components/flexsearch.tsx)

## ZWSP

_2024/07/13_

ZWSP(Zero Width Space) [wiki](https://en.wikipedia.org/wiki/Zero-width_space) 是一种 Unicode 字符. 可以用来做一些很骚的操作，它通常很难被察觉到。

将 `\u200b`、`\u200c`、`\u200d`、`\u200e`、`\u200f`、`\ufeff` 进行一个排列组合，来达很多有趣的效果。

<details>
  <summary>排列组合代码</summary>
  
  ```javascript
  import 'lodash.permutations';
  import _ from 'lodash';

  function getAllCombinations(...strings) {
    const allPermutations = _.flatMap(
      _.range(1, strings.length + 1),
      (length) => _.permutations(strings, length)
    );

    return _.map(
      allPermutations,
      (permutation) => permutation.join('')
    );
  }

  const result = getAllCombinations(
    '\u200b',
    '\u200c',
    '\u200d',
    '\u200e',
    '\u200f',
    '\ufeff'
  );

  globalThis.console.log({ ...result }); // 发挥你的想象力
  ```

</details>

1. 为 git commit 做一个幽灵提交，利用它来重新触发 GitHub Actions，也可以蛊惑同事。[就像这样](https://x.com/Wxh16144/status/1811819418433061291)
2. [Zero Width Space on SYMBL (◕‿◕)](https://symbl.cc/200B/)
3. [codepoint U+200B ZERO WIDTH SPACE in Unicode](https://codepoints.net/U+200B)

## Library 实践

_2024/06/24_

1. 使用 [debug](https://github.com/debug-js/debug) 库，可以在开发环境中输出调试信息，生产环境中不输出。
2. 或者参考 [backup-cli#da278e8](https://github.com/Wxh16144/backup-cli/commit/da278e8a8076e319d5be705cd08f2f63f1ac768a) 使用 `console.log` 输出调试信息。
3. TBD: 有想到再补充。

## 优化 React 重新渲染技巧

_2024/02/29_

1. 将昂贵的组件 **"提升"** 到父级，在父级中渲染频率较低。
2. 然后将昂贵的组件作为 **props** 传递下来。
3. [useMemoizedFn vs useEvent vs useLatestFunc ?? vs useEffectEvent](https://github.com/Wxh16144/wxh16144.github.io/issues/5)

ref:

- [One simple trick to optimize React re-renders](https://kentcdodds.com/blog/optimize-react-re-renders)
- [Before You memo()](https://overreacted.io/before-you-memo/)

## Symbolic link

_2024/02/08_

包含有一条以绝对路径或者相对路径的形式指向其它文件或者目录的引用 `ls -s 实际目标 链接名称`

examples:

<details>
  <summary><code>ln -s $TMPDIR $ICLOUD/Temporary</code></summary>

```bash
~ via ⬢ v18.19.0
➜ echo $TMPDIR
/var/folders/9d/8kq_tcb12dsdb9qz1m_h12g00000gn/T/

~ via ⬢ v18.19.0
➜ echo $ICLOUD
/Users/wuxh/Library/Mobile Documents/com~apple~CloudDocs

~ via ⬢ v18.19.0
➜ ln -s $TMPDIR $ICLOUD/Temporary
```
  
</details>

## LGTM

_2023/11/30_

looks good to me

## TL;DR

_2023/10/27_

经常在一些文章中看到 TL;DR，一开始以为是某个技术的缩写，后来才知道是 [Too long; didn't read](https://en.wikipedia.org/wiki/TL;DR) 的缩写，意思是**太长不看**。

ref:

- [TL;DR - Wikipedia](https://en.wikipedia.org/wiki/TL;DR)

## pull_request vs pull_request_target

_2023/10/16_

在给 antd 修改 GitHub Actions 时，发现 preview.yml 有三个文件，于是乎提交了一个 [PR#45276](https://github.com/ant-design/ant-design/pull/45276) 合并，结果导致后续一系列错误。

**pull_request** 在 PR 创建的时候拉取**源分支**代码。但是**不具备写**操作（可以理解为，PR 作者是一个攻击者，他可以更改源代码修改脚本，以至于破坏仓库。

**pull_request_target** 在 PR 创建的时候拉取**目标分支**代码。具备**读写**操作。

ref:

- [Github Actions and the threat of malicious pull requests](https://nathandavison.com/blog/github-actions-and-the-threat-of-malicious-pull-requests)
- [Keeping your GitHub Actions and workflows secure Part 1: Preventing pwn requests](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/)

## tsconfig.json moduleResolution

_2023/6/20_

起初上游包导致 antd CI 挂了，[#41715](https://github.com/ant-design/ant-design/pull/41715#discussion_r1161199605)。 发现上游将包改成了 Pure ESM，但是引用的 js 还是 `mjs`。

最新的 typescript v5.1， moduleResolution 选项支持 5 个值：`classic`、`node`、`node16`、`nodenext`、`bundler`。
其中 `nodenext` 表示最新的 node 版本，也就是说它兼容 `node16`。

ref:

- [moduleResolution 总结 - 余腾靖的文章 - 知乎](https://zhuanlan.zhihu.com/p/621795173)

## 认识 Unified 和 Remark

_2023/04/17_

参与了一段时间的 dumi 开发，认识了 [Unified](https://unifiedjs.com/) 和 [Remark](https://remark.js.org/)。Unified 是一个用于构建插件化的工具链的框架，而 Remark 是 Unified 的一个插件，用于将 markdown 转换成 [AST(抽象语法树)](https://astexplorer.net/)，然后对 AST 进行操作。

## Node ESM

_2023/03/24_

最近建了一个 [快速开始 Cli](https://github.com/template-pro/start-cli) 的脚手架, 记一笔 node 的操作

1. 获取整个屏幕大小, 可以使用 `process.stdout?.columns` 或 [term-size - npm](https://www.npmjs.com/package/term-size)。
2. 同构 `__dirname` 可以参考 [stack overflow](https://stackoverflow.com/a/50052194)

<details>
<summary>__filename & __dirname</summary>
```javascript
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```
</details>
<details>
<summary>require & require.resolve</summary>
```javascript
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
```
</details>

3. 清空终端输出 `process.stdout.write('\x1B[2J\x1B[3J\x1B[H\x1Bc')` 或 [console-clear - npm](https://www.npmjs.com/package/console-clear);

## Github 合作者

_2023/03/10_

![GitHub合作者效果图](https://s2.loli.net/2023/03/10/q3xV27GpdUL1JDP.png)

如上图，除非他们对你的 PR 进行 review 的时候提出了建议，并且在 GitHub 点击采纳，否则不会出现[合作者标识](https://docs.github.com/en/github/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors)。另外一种方式是，手动添加合作者。给予我帮助的人都应该出现在合作者一栏中。最简单方法就是在 `git commit` 的 message body 中加入如下注释：

```txt
Co-authored-by: wxh16144 <wxh16144@users.noreply.github.com>
```

注意将 ID 替换为合作者的 GitHub ID。

- [GitHub Co-authors](https://antfu.me/posts/github-co-authors)

## GitHub Merge 三种方式速记

_2023/02/27_

**Merge:** (创建 m 个提交节点引用 a、b、c，m 在父节点中有 Init、c)
![Merge](https://s2.loli.net/2023/02/27/uwRgE8IKvDaxTiY.png)

**Squash and merge**(合并 a、b、c 以创建一个新的提交并将其添加到目标分支。'a、b、c' 提交只有父 Init)
![Squash and merge](https://s2.loli.net/2023/02/27/GJCiN1v7noAuMhW.png)

**Rebase and merge**(将 a、b、c 无缝添加到合并分支，每个提交都有一个父级)
![Rebase and merge](https://s2.loli.net/2023/02/27/WcxdVzHjguhK69I.png)

[GitHubのMerge、Squash and Merge、Rebase and Mergeを理解する](https://meetup-jp.toast.com/439)

## remove vs removeChild

_2022/11/16_

- remove: 把对象从它所属的 DOM 树中删除。
- removeChild: 方法从 DOM 中删除一个子节点。并返回删除的节点

大多数时候使用 remove 就好了

## innerText vs textContent vs innerHTML

_2022/11/16_

```html
<body>
  <div>
    <span>hello</span>
    <span style="display: none;">world</span>
  </div>
</body>

<script>
  const div = document.querySelector("div");
  console.log(div.innerText);
  console.log(div.textContent);
  console.log(div.innerHTML);
</script>
```

```code
hello                     // div.innerText

    hello                 // div.textContent
    world

    <span>hello</span>    // div.innerHTML
    <span style="display: none;">world</span>
```

结论

- innerText 是浏览器渲染后的可见内容
- textContent 准确的内容和缩进格式内容
- innerHtml 同 <标签> + textContent

## append vs appendChild

_2022/11/16_

都是在 Elenent 最后一个节点之后插入 Node, 推荐使用 **append**

**append**: `append(param1, param2, /* … ,*/ paramN)`
**appendChild**: `appendChild(aChild)`

- append 可以追加任何 DOMString 对象， appendChild 只接受 Node 对象；
- append 没有返回值，appendChild 返回追加的 Node 对象
- append 支持多个参数，appendChild 只支持一个

## Shell 字符串截取

_2022/09/02_

在使用电脑对某些文件批量重命名，或者批量截取前缀等场景时

- `${string: start: length}` : 从 string 字符串的左边第 start 个字符开始，向右截取 length 个字符。
- `${string: start}` : 从 string 字符串的左边第 start 个字符开始截取，直到最后。
- `${string: 0-start :length}` : 从 string 字符串的右边第 start 个字符开始，向右截取 length 个字符。
- `${string: 0-start}`: 从 string 字符串的右边第 start 个字符开始截取，直到最后。
- `${string#*chars}`: 从 string 字符串第一次出现 *chars 的位置开始，截取 *chars 右边的所有字符。
- `${string##*chars}`: 从 string 字符串最后一次出现 *chars 的位置开始，截取 *chars 右边的所有字符。
- `${string%*chars}`: 从 string 字符串第一次出现 *chars 的位置开始，截取 *chars 左边的所有字符。
- `${string%%*chars}`: string 字符串最后一次出现 *chars 的位置开始，截取 *chars 左边的所有字符。

## Shell 字符串拼接（连接、合并）

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

- [Shell 字符串拼接（连接、合并）](http://c.biancheng.net/view/1114.html)

## /dev/null

_2022/05/19_

在 Linux 命令中，经常见到 `xxx 2>/dev/null`, 如为防止 Docker 容器退出使用 `tail -f /dev/null`。关于这个命令，我的理解是：

- `0` 标准输入 stdin，`1` 标准输出 stdout， `2` 错误输出 stderr, `>` 是重定向, `/dev/null` 是个只进不出的地方;

- 如果只关心**正常输出**，可以在命令后面这样重定向：`commaned 2> /dev/null`, 这样一来，我们看到的所有输出，都是命令正常执行的输出，忽略所有错误输出。
- 如果只关心**报错内容**，可以在命令后面这样重定向 `command > /dev/null`

ref:

- [shell 程序中 2> /dev/null 代表什么意思](https://www.zhihu.com/question/53295083)
- [什么是 Bash 中的标准输入、标准错误和标准输出](https://linuxhint.com/bash_stdin_stderr_stdout/)

## copy & paste

_2022/03/19_

在 Mac OS 可以使用 `pbcopy` 和 `pbpaste` 在命令行中进行复制和粘贴操作:

- `pbcopy < ~/.ssh/public_key` 复制 public_key 内容到剪贴板。
- `curl baidu.com | pbcopy` 复制 baidu.com 站点内容到剪贴板。
- `pbpaste > baidu.html` 粘贴剪贴板内容到 baidu.html 文件中。

## Jest unit testing

_2022/03/18_

在阅读 AntD 测试用例时，需要单独运行某个组件 case，或者某个组件的一条 case.

- 仅运行 components/button 目录下测试用例: `npm run test -- components/button`
- 仅运行 button 用例名称为 'mount correctly' 的 case : `npm run test -- components/button -t "mount correctly"`
- 接上条, 使用 [Jest api](https://jestjs.io/docs/api#testonlyname-fn-timeout) (test.only、test.skip) 暂时运行/跳过某些 case:

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

- [Javascript Import maps(中文)](https://www.jianshu.com/p/b23d823a183a)
- [Github WICG/import-maps](https://github.com/WICG/import-maps)

## markdown-it 和 feed

_2022/02/24_

笔记这栏是参考 [antfu.me/notes](https://antfu.me/notes) 而写的。看到有 `rss` 订阅,想着自己的笔记也实现一下。使用 hexo 的自动生成 rss 插件无法生成自己想要的。
阅读 [antfu.me repo](https://github.com/antfu/antfu.me) 后才发现，作者是使用 [markdown-it](https://github.com/markdown-it/markdown-it) 和 [feed](https://github.com/jpmonette/feed) 自己写脚本实现的。[scripts/rss.ts](https://github.com/antfu/antfu.me/blob/main/scripts/rss.ts)

## Vite 插件 unplugin-auto-import

_2022/02/16_

写 `TypeScript` 时，使用 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) 实现按需自动导入 API。

插件 [vite-auto-import-resolvers](https://github.com/dishait/vite-auto-import-resolvers) 使用了 `unplugin-auto-import` 的自定义 `resolvers`, see [github 实现](https://github.com/dishait/vite-auto-import-resolvers/blob/main/src/dir.ts#L94-L118)。

## 位运算符速记

_2022/02/09_

- `x ** y` => `Math.pow(x, y)`
- `x << y` => `x * 2 ** y`
- `x >> 1` => `x >>> 1` => `Math.floor(x / 2)`
- `~x` => `-(x + 1)`

## git submodule

_2022/02/09_

- 项目中添加子仓库 `git submodule add -b 分支 地址 目录`
- 克隆带子模块仓库 `git clone --recursive -j8 地址`
- 更新已克隆仓库的子仓库 `git submodule update --init --recursive`
- 更新子仓库 `git submodule update --remote`
- 推送所有子仓库而不 push 主仓库 `git push --recurse-submodules=only`

## git

_2022/02/09_

- 使用 `git -C` 来指定工作目录, e.g. `-c $PWD` 指当前目录
- `git commit --amend --no-edit --no-verify`
  - **--amend** 创建一个新的提交来替换当前分支的顶端
  - **--no-edit** 不调用编辑器，使用当前分支顶端提交信息
  - **--no-verify** 绕过 [githooks](https://git-scm.com/docs/githooks) 缩写`-n`
