---
title: 使用 rsync 增量备份远端文件
date: 2021-12-16 21:39:42
tags: ['NAS', 'Note']
---

记录一下使用 rsync 进行文件增量备份，把 nas 上的 docker 挂载的文件同步到本地计算机进行一个备份

<!-- more -->

### 创建 shell 脚本

> backup.sh

```bash
#!/bin/bash

#  对 NAS 上的 docker 目录进行增量备份

set -o errexit
set -o nounset
set -o pipefail

readonly SOURCE_DIR="/volume3/docker" # nas 目录
readonly BACKUP_DIR="./" # 本地备份目录(当前目录)
readonly DATETIME="$(date '+%Y-%m-%d_%H:%M:%S')"
readonly BACKUP_PATH="${BACKUP_DIR}/${DATETIME}"
readonly LATEST_LINK="${BACKUP_DIR}/latest"

mkdir -p "${BACKUP_DIR}"

rsync -av --delete \
  -e ssh \
  "nas:${SOURCE_DIR}/" \ # 这里的 nas 是之前使用 config 文件进行配置的 ~/.ssh/config
  --link-dest "${LATEST_LINK}" \
  "${BACKUP_PATH}"

rm -rf "${LATEST_LINK}"
ln -s "${BACKUP_PATH}" "${LATEST_LINK}"

```

上面脚本中，每一次同步都会生成一个新目录 `${BACKUP_DIR}/${DATETIME}`，并将软链接 `${BACKUP_DIR}/latest` 指向这个目录。
下一次备份时，就将 `${BACKUP_DIR}/latest` 作为基准目录，生成新的备份目录。
最后，再将软链接 `${BACKUP_DIR}/latest` 指向新的备份目录。

**参数介绍**

- `-a、--archive` 参数表示存档模式，保存所有的元数据，比如修改时间（modification time）、权限、所有者等，并且软链接也会同步过去。
- `-v` 参数表示输出细节。`-vv` 表示输出更详细的信息，`-vvv` 表示输出最详细的信息。
- `--delete` 参数删除只存在于目标目录、不存在于源目标的文件，即保证目标目录是源目标的镜像。
- `-e` 参数指定使用 SSH 协议传输数据。
- `--link-dest` 参数指定增量备份的基准目录。

### 压缩备份文件夹

```bash
zip -r -e -o NAS_Docker_Backup_20211216.zip ./2021-12-16_20:55:49
```

**参数介绍**

- `-r` 表示子目录子文件全部压缩为 zip。这部比较重要，不然的话只有 something 这个文件夹被压缩，里面的没有被压缩进去
- `-e` 表示你的压缩文件需要加密，终端会提示你输入密码。还有种加密方法，这种是直接在命令行里做的，比如 zip -r -P Password01! modudu.zip SomeDir, 就直接用 Password01!来加密 modudu.zip 了。
- `-o` 表示设置所有被压缩文件的最后修改时间为当前压缩时间

### 参考资料

- [rsync 用法教程](http://www.ruanyifeng.com/blog/2020/08/rsync.html)
- [Linux zip 命令](https://www.runoob.com/linux/linux-comm-zip.html)
