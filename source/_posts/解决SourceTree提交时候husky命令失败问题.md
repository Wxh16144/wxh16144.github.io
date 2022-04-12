---
title: 解决SourceTree提交时候husky命令失败问题
date: 2022-04-12 10:24:36
tags: ["GIT"]
---

团队项目中使用了 [husky](https://github.com/typicode/husky) 进行 code lint, 使用 terminal 执行 git commit 时一切正常。

但是使用 [sourcetree](https://www.sourcetreeapp.com/) 使用 GUI 进行提交就如图错误

<!-- more -->

![bug](https://s2.loli.net/2022/04/12/Qsfrt2ScBn51dwl.jpg)

### 解决方法

> 可以使用 `--no-verify` 选择绕过 git hooks，本文不介绍这个方法。

#### 修正 PTAH

```bash
echo "export PATH=\"$(dirname $(which node)):\$PATH\"" > ~/.huskyrc
```

#### 最终解决方法

如果你使用了 zsh 和 nvm, 建议在 `$ZSH_CUSTOM` 目录下添加一个自定义 zsh 脚本。
这个脚本会在你进入包含了 `.nvmrc` 文件目录中自动切换 node 版本，切换版本后修正 `~/.huskyrc` 的 path 内容。

_$ZSH_CUSTOM/nvm_custom.zsh_

```bash
# https://github.com/nvm-sh/nvm#manual-install
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# https://github.com/nvm-sh/nvm#deeper-shell-integration
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi

  # fix husky hook
  # ref: https://github.com/typicode/husky/issues/390#issuecomment-762213421
  echo "export PATH=\"$(dirname $(which node)):\$PATH\"" > ~/.huskyrc
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc

# https://github.com/nvm-sh/nvm#use-a-mirror-of-node-binaries
export NVM_NODEJS_ORG_MIRROR=https://mirrors.ustc.edu.cn/node/
```

### 一个示例

![一个示例.png](https://s2.loli.net/2022/04/12/qJYoGUX1y9tRbAk.png)

### 参考文档

- [https://github.com/typicode/husky/issues/390#issuecomment-762213421](https://github.com/typicode/husky/issues/390#issuecomment-762213421)
- [https://github.com/typicode/husky/issues/904#issuecomment-862184954](https://github.com/typicode/husky/issues/904#issuecomment-862184954)
- [https://github.com/nvm-sh/nvm#deeper-shell-integration](https://github.com/nvm-sh/nvm#deeper-shell-integration)
