---
title: Notes
date: 2020-12-27 19:23:24
tags: ['notes']
---

一些快速记录的笔记

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
  