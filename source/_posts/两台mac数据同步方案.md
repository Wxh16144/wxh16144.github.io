---
title: 两台mac数据同步方案
date: 2025-06-07 14:53:06
tags: ["Mac"]
---

最近购入了一台 Mac mini，放在家里写写代码用。之前的 MacBook Pro 主要是用来公司工作和出差使用。两台 Mac 的数据同步一直是个问题。

介绍今天的方案，主要是基于 SSH 和 rsync 的数据同步方案。

<!-- more -->

### 方案概括

1. 确保两台 Mac 都安装了 SSH 服务。并且在系统偏好设置中开启远程登录。
2. 生成 SSH 密钥对（两台电脑可以复用同一个密钥对）。
3. 使用 rsync 命令进行文件同步。

### 具体步骤

1. **开启 SSH 服务**：
   - 在两台 Mac 上，打开“系统偏好设置” -> “共享”，勾选“远程登录”。这将允许其他计算机通过 SSH 连接到你的 Mac。

2. **生成 SSH 密钥对**：
  
   - 在终端中运行以下命令生成 SSH 密钥对（如果已经有密钥对，可以跳过这一步）：

   ```bash
   ssh-keygen -t ed25519 -C "mac-mini"
   ```

3. **将公钥复制到另一台 Mac**：
  
  使用 `ssh-copy-id` 命令将公钥复制到另一台 Mac 上（假设目标 Mac 的用户名为 `wuxh`，IP 地址为 `192.168.1.2`）：

  ```bash
  ssh-copy-id wuxh@192.168.1.2
  ```

  这个时候会提示你输入目标 Mac 的密码。输入密码后，公钥将被添加到目标 Mac 的 `~/.ssh/authorized_keys` 文件中。

  如果 `ssh-copy-id` 命令不可用，也可以手动复制公钥到目标 Mac：

  ```bash
  scp ~/.ssh/id_ed25519.pub wuxh@192.168.1.2:~/.ssh/authorized_keys
  ```

4. **配置 ～/.ssh/config 文件**（可选）：

  通常我们在使用 SSH 时需要输入用户名和 IP 地址。为了简化操作，可以在 `~/.ssh/config` 文件中添加配置。

   ```plaintext
   Host mini
       HostName 192.168.1.2
       User wuxh
       IdentityFile ~/.ssh/id_ed25519
   ```

  这样，你就可以通过 `ssh mini` 来连接到目标 Mac。

5. **使用 rsync 同步文件**：

   使用 `rsync` 命令进行文件同步。以下是一个将 mini 上的 `~/Code/test` 目录同步到 MacBook Pro 上的 `~/Code/test` 目录的示例命令：

   ```bash
   rsync -avz -e ssh mini:~/Code/test/ ~/Code/test/
   ```

### 另外一台 Mac 上的操作

在另一台 Mac 上，你需要执行相似的步骤来配置 SSH 和 rsync。确保你已经在目标 Mac 上开启了 SSH 服务，并且将公钥复制到目标 Mac 的 `~/.ssh/authorized_keys` 文件中。

### 注意事项

- 确保两台 Mac 在同一局域网内，或者可以通过公网 IP 访问。
- 使用 `rsync` 时，注意源路径和目标路径的斜杠 `/`。如果源路径以斜杠结尾，表示同步目录内容；如果不以斜杠结尾，则表示同步整个目录。
- 可以使用 `rsync` 的 `--dry-run` 或者 `-n` 选项来测试同步操作，而不实际执行：

  ```bash
  rsync -avz -n -e ssh mini:~/Code/test/ ~/Code/test/
  ```

### 定期同步

如果你希望定期同步两台 Mac 之间的数据，可以使用 `cron` 定时任务来自动执行 `rsync` 命令。

1. 打开终端，输入以下命令编辑 `cron` 任务：

   ```bash
   crontab -e
   ```

2. 在打开的编辑器中，添加一行来设置定时任务。例如，每天凌晨 1 点同步一次：

```plaintext
0 1 * * * rsync -avz -e ssh mini:~/Code/test/ ~/Code/test/
```

   保存并退出编辑器, 这样，每天凌晨 1 点，`rsync` 命令将自动执行，将 `~/Code/test/` 目录的内容从当前 Mac 同步到目标 Mac 的 `~/Code/test/` 目录。

> 对于不熟悉 rsync 的用户，可以参考 [rsync 用法教程](https://www.ruanyifeng.com/blog/2020/08/rsync.html) 来了解更多细节。
> 也可以试试 [rsyncUI](https://github.com/rsyncOSX/RsyncUI)，这是一个图形化的 rsync 工具，可以更方便地进行文件同步。(我没用过，感兴趣的可以试试)

### 总结

通过以上步骤，你可以轻松地在两台 Mac 之间同步数据。使用 SSH 和 rsync 的组合，不仅安全可靠，而且效率高。

你可以根据自己的需求调整同步的目录和频率，实现灵活的数据管理。

### 参考文档

- [rsync 用法教程 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2020/08/rsync.html)
- [科技爱好者周刊（第 351 期）- rsyncUI](https://www.ruanyifeng.com/blog/2025/06/weekly-issue-351.html)
