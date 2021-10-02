---
title: 使用config文件来维护SSH密钥
date: 2021-10-02 15:02:18
tags: ['Note','GIT']
---

记录一次如何管理多个 SSH 密钥, GitHub 多个账号多个密钥如何区分管理问题。

### 为什么需要

经常需要通过 SSH 连接到多个远程系统，需要记住所有远程 IP 地址、不同的用户名、非标准端口...

+ 公司需要用到 GitHub 进行开发。并且使用公司邮箱和账号。
+ 另外自己也有一个个人的 GitHub 账号。
+ 自己的 NAS 服务器也需要使用 SSH 密钥的方式登录。

### 创建 SSH 密钥

进入目录 `cd ~/.ssh`

```bash
ssh-keygen
```

接下来会提示你输入一个文件名来保存你的SSH key, 如果不输入直接回车, 则会保存在默认的文件里 `id_rsa.pub`
然后会提示你输入 passphrases 连续输入两次，这里我默认选择空。(直接两个回车就好了)

### 添加 config 文件

```code
Host nas
  HostName 192.168.31.10  # 这里输入 SSH 地址
  Port 1234               # 输入自定义端口号
  User root               # 用户名
  IdentityFile ~/.ssh/nas # 密钥 (*.pub 文件是公钥)

# 公司账号
Host company
    HostName github.com
    User conpany-account
    IdentityFile ~/.ssh/company

# 个人账号
Host myself
    HostName github.com
    User myself-account
    IdentityFile ~/.ssh/myself

```

注意一定要设置 config 文件的权限, 否则使用 SSH 时会提示安全错误。

```bash
sudo chmod 700 config
```

可以通过下面命令进行测试, 观察日志中是否出现 You've successfully authenticated, 字段。

```bash
ssh -T git@company # 测试公司账号
ssh -T git@myself # 测试公司账号
```

### 使如何用

使用 SSH 克隆 github 项目 `git@github.com:Wxh16144/img.git`, 需要修改 `git@github` 为 `git@myself`;

```bash
git clone git@github.com:Wxh16144/img.git # github 复制过来的命令

# 修改为个人项目地址
git clone git@myself:Wxh16144/img.git
```

```bash
ssh nas # 连接 NAS 终端
```

### 参考文档

+ [Using the SSH Config File](https://linuxize.com/post/using-the-ssh-config-file/)
+ [Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
