---
title: 记录Git别名的一些玩法
date: 2020-07-14 10:07:53
tags: ['GIT']
---

个人还是经常使用 [SourceTree](https://www.sourcetreeapp.com/) 工具进行 Git 管理, 其次是 [VsCode Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) 插件, 嗷~ 在其次就是命令行工具了.

<!-- more -->

### 写在前面

有些工作进行了一些小修改，但是每次打开 SourceTree 软件又会很慢, 使用命令行可以快速进行仓库操作,
但是繁琐的命令有比较麻烦, 手残党还会经常输入单词. 于是乎得用 Git Aliases 拯救我, 少敲点命令.

### 添加别名

推荐一个网站 [30 seconds of code](https://www.30secondsofcode.org/) 上面可以摘选代码片段, Git 常用别名也在这里 [https://www.30secondsofcode.org/articles/s/git-aliases](https://www.30secondsofcode.org/articles/s/git-aliases).

**编辑配置文件**

```bash
git config --global -e
```

**在配置文件中添加**

```bash
[alias]
  co = checkout
  cob = checkout -b
  coo = !git fetch && git checkout
  br = branch
  brd = branch -d
  st = status
  aa = add -A .
  unstage = reset --soft HEAD^
  cm = commit -m
  amend = commit --amend -m
  fix = commit --fixup
  undo = reset HEAD~1
  rv = revert
  cp = cherry-pick
  pu = !git push origin `git branch --show-current`
  fush = push -f
  mg = merge --no-ff
  rb = rebase
  rbc = rebase --continue
  rba = rebase --abort
  rbs = rebase --skip
  rom = !git fetch && git rebase -i origin/master --autosquash
  save = stash push
  pop = stash pop
  apply = stash apply
  rl = reflog
```

**保存就好了**

顺便提一下, 我还添加了一个在终端中美观 git log 的别名, 对上面的 `amend` 也进行了修改,因为平时使用 `git amend` 都不需要修改 commit message.

```diff
-  amend = commit --amend -m
+  amend = commit --amend --no-edit
+  lg = log --graph --pretty=format:'%Cred%h%Creset - %C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative
```

### 其他玩法

经常使用命令 `code .` 把当前目录在 VsCode 中打开. 之前在知乎提过这个问题 [VS Code 如何打开一个没有安装任何扩展到窗口？](https://www.zhihu.com/question/466601835/answer/1992460613), 得到的答案是使用 `code --disable-extensions` 来启动 **暂时禁用扩展** 功能来启动窗口.

可惜 windows 电脑不像 mac 终端, 输入命令行没有历史记录, 在考虑有没有 windows 有没有 terminal alias 的管理工具时, 突然想起 `Git Bash` 不就有这个功能吗, 尝试一下.

在别名中添加

```bash
[alias]
  code = !code --disable-extensions
```

使用命令行 `git code .`

ohhhhhhhhhhhhhhhhhhh

### 参考文档

- [2.7 Git Basics - Git Aliases](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases)
- [Increase your productivity by creating aliases for many common git operations.](https://www.30secondsofcode.org/articles/s/git-aliases)
- [个性化你的 Git Log 的输出格式](https://ruby-china.org/topics/939)
