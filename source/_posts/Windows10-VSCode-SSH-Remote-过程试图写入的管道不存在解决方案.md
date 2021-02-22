---
title: Windows10 VSCode SSH Remote 过程试图写入的管道不存在解决方案
date: 2021-02-22 23:40:25
tags: ['Note']
---

在家里搭建了 **NAS** 为了直接在远端快速编辑配置文件，于是想到 VSCode SSH Remote 开发

<!-- more -->

因为比较爱折腾，家里搞了一个 NAS。顺便跑一些 Docker 脚本，难免会修改多次 config 文件；

前期都是通过 sftp 下载配置然后上传比较繁琐，想着一些脚本用 VSCode 直接编辑会方便许多

在公司办公时用公司电脑(win10)、家里电脑(win10);使用 VSCode ssh 连接就会出现下列错误:

**错误截图**

![错误截图](https://i.loli.net/2021/02/23/VN34znq6rCGeXZT.png)

### 解决方案

- 打开 Git Bash 看看 SSH 的可执行文件路径

```bash
where ssh
```

![where ssh](https://i.loli.net/2021/02/23/179iwHs3aBdNjvT.png)

- 修改 VSCode 设置

```diff
{
+  "remote.SSH.path": "C:\\Program Files\\Git\\usr\\bin\\ssh.exe",
}
```

### 参考文档

- [Windows10 VSCode SSH Remote 过程试图写入的管道不存在解决方案](http://elitedj.me/2020/12/14/Windows10-VSCode-SSH-Remote-%E8%BF%87%E7%A8%8B%E8%AF%95%E5%9B%BE%E5%86%99%E5%85%A5%E7%9A%84%E7%AE%A1%E9%81%93%E4%B8%8D%E5%AD%98%E5%9C%A8-%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/#more)
