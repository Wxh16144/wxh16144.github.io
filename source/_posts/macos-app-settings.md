---
title: 备份和分享你的 MacOS 应用程序配置文件
date: 2023-08-15
---

在2022年，我购买了一台MBP，并开始关注各位开源社区的大佬们分享的各种配置方法。我从中选取了一些适合自己的配置。

<!-- more -->

### 缘起

在2022年，我购买了一台MBP，并开始关注各位开源社区的大佬们分享的各种配置方法。我从中选取了一些适合自己的配置。

起初，我使用苹果的 Time Machine 进行配置文件的备份。但后来，我也想与大家分享我的配置，并将其存储在 GitHub 上以供参考。

于是，我开始寻找备份应用程序的工具，最终我找到了 [Mackup](https://github.com/lra/mackup) ， 这个工具可以将绝大多数主流软件的配置文件备份到云端。

它的备份原理很简单：将所有配置文件移动到指定的备份目录，并通过**软连接**来重新定位配置文件的位置。

### 问题

刚刚提到，Mackup 的工作原理是将默认配置文件移动到备份目录，然后建立软连接。

随后，我决定将备份的目录设为一个Git仓库，并将代码推送上去。但问题随之而来。

假设我不想让某个配置文件出现在Git仓库中，我可能会不小心将它删除（实际上删除的是实际文件，而默认位置的软连接仍然存在）。这时，配置就会丢失，应用程序可能崩溃。

幸运的是，Mackup提供了"restore"命令，每次在同步Git仓库时，我都会先执行备份，然后再执行还原操作。这样，Git仓库就能随意操作了。

为了简化这些步骤，我特地编写了一个 [shell 脚本](https://github.com/Wxh16144/dotfiles/blob/mackup/update.sh) 代替我的工作，至此我的 [第一版 dotfiles](https://github.com/Wxh16144/dotfiles/tree/mackup) 分享到了GitHub上。

### 问题的进一步升级

虽然前面的步骤有点繁琐，但因为有Shell脚本的帮助，我一直在稳定使用。然而，一段时间后，出现了一些麻烦的事情。

有一段时间，我喜欢使用OBS进行直播或录制视频，但我发现每次打开OBS时电脑都会异常卡顿（ 我的电脑配置是 M1 Pro 10-12-14吋-32G

我排查了许多原因，向 OBS 的 Discord 社区寻求帮助，甚至将 MacOS 从 12 升级到 13，但问题仍然存在。经过长时间的排查，我终于在 OB S社区找到了一个解决方案[将 OBS 的场景文件删除](https://obsproject.com/forum/threads/please-help-obs-not-responding-mac-os-11-1-obs-ver-26-1.136092/post-605055)，我发现我的场景文件达到惊人的 12w 个，很纳闷为什么会有这么多文件。

直到我开始怀疑是之前分享的dotfiles工具出了问题。 每次执行  restore 命令的时候都会进行一次文件备份，这导致文件数量呈指数级增长。这个问题不仅出现在 OBS 的配置文件上，其他使用 Mackup 备份的应用程序配置文件中也出现了数万个文件。

### 新的尝试

考虑到备份和重复生成多个文件，再加上[Mackup 只能软连接](https://github.com/lra/mackup/issues/1849#issuecomment-1369963734)的缺陷，我选择放弃 Mackup 工具。

我打算自己对 Mackup 进行修改，只有一个核心需求：我希望将我认为重要的文件复制到备份目录中，然后将备份目录推送到远程，而**不需要使用软连接**。我可以每周手动执行一次同步操作。

然而，当我 fork 了 Mackup 的仓库代码后，发现它是用 Python 写的，而我对 Python 不太熟悉。所以，我决定用 Node.js 编写一个类似 Mackup 的命令行工具，并将其开源出来。（当然，我还是要感谢 Mackup，我完全借鉴了它的配置方法，并且保持了与 Mackup 配置的兼容性）

### 工具介绍

**前置条件** [Nodejs.14.x+](https://nodejs.org) 

如果你只是想尝试一下，可以运行以下命令：

```bash
npx @wuxh/backup-cli@latest
```
> 请放心，命令行工具会将你的配置文件拷贝到执行命令的目录下的"backup"文件夹中，不会导致文件丢失！！！

如果你需要更多功能，你可以尝试以下步骤：


**全局安装：**

```bash
npm i @wuxh/backup-cli -g
```

**执行备份：**

```bash
backup-cli
```

**执行还原：**

```bash
backup-cli -r
```

**获取帮助：**

```bash
backup-cli -h
```

更详细的使用说明请参阅：https://github.com/Wxh16144/backup-cli#wuxhbackup-cli

另外工具和 Mackup 一样，支持[自定义应用程序](https://github.com/Wxh16144/backup-cli#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F)

大家可以参考我的 [dotfiles 仓库](https://github.com/Wxh16144/dotfiles)，了解如何使用`@wuxh/backup-cli` 工具来分享应用程序配置并托管在GitHub上。

### 总结

最后，我希望大家能尝试使用一下这个工具，并提出宝贵的建议。同时，也欢迎大家讨论如何分享和管理自己的 dotfiles。
