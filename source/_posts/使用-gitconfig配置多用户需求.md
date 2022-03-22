---
title: 使用.gitconfig配置多用户需求
date: 2022-03-22 10:16:57
tags: ['Git']
---

`~/.gitconfig` 配置用来存储用户相关的配置，当执行 Git 相关操作时，依次读取 `.git/config` > `~/.gitconfig`

<!-- more -->

### 需求场景

在工作中公司都会分配一个工作邮箱，在提交代码时需要使用工作名和工作邮箱。
在维护自己的Github项目时，则想使用个人邮箱。或者另外其他项目需要使用特定邮箱。
另外一个对于 SSH 密钥、GPG 签名，可以分别配置，区分开避免泄露风险。

### 常用配置

平时配置 用户名 和 邮箱 常见的配置方式是

```bash
git config user.name "Wuxh" # 如果需要全局则添加 --global
git config user.email "wxh16144@qq.com" # 如果需要全局则添加 --global
```

### 区分配置

使用 [includeIf](https://git-scm.com/docs/git-config#_includes) 来区分不同用户配置，场景配置如下：

```txt
# ~/.gitconfig
[user]
  name = wuxh
  email = wxh1220@gmail.com
  # GPG 签名
  signingkey = wuxh

[core]
  # SSH 密钥地址
  sshCommand = "ssh -i ~/.ssh/github"

# 在 ~/Code/CompanyProject/ 目录下的项目使用工作配置
[includeIf "gitdir:~/Code/CompanyProject/"]
  path = ~/.gitconfig_work
```

```txt
# ~/.gitconfig_work
[user]
  name = wuxh(Red)
  email = wuxh@company.com

[core]
  sshCommand = "ssh -i ~/.ssh/work"

```

### 参考文档

- [git config](https://git-scm.com/docs/git-config#_includes)
- [8 Easy Steps to Set Up Multiple GitHub Accounts](https://blog.gitguardian.com/8-easy-steps-to-set-up-multiple-git-accounts/)
