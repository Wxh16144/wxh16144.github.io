---
title: 使用ohmyposh美化终端
date: 2022-04-16 17:51:52
tags: ["Note"]
---

之前一直使用 `iterm2` + `zsh` 配置的终端和主题，今天折腾了一下 [Oh My Posh](https://ohmyposh.dev/)。记录一下

<!-- more -->

### 安装 Oh My Posh

```bash
brew tap jandedobbeleer/oh-my-posh
brew install jandedobbeleer/oh-my-posh/oh-my-posh
```
#### 使用
> 因为我使用了 zsh ，所以直接配置就好了。其他的具体配置可以看[官方文档](https://ohmyposh.dev/docs/customize)

_~/.zshrc_
```bash
eval "$(oh-my-posh init zsh)"
```

#### 安装字体
posh 主题使用了大量的图标, 因此需要使用 [Nerd Fron](https://www.nerdfonts.com/)字体，官方推荐安装 [Meslo LGM NF](https://github.com/ryanoasis/nerd-fonts/releases/download/v2.1.0/Meslo.zip), 我这里也是直接使用官方推荐。

在 iterm2 中添加字体配置 `Preferences` > `Profiles` > `Text` > `Font` = 'MesloLGM NF'

如果还使用了 VSCode 编辑器的话也需要配置字体: 

```json
{
  "terminal.integrated.fontFamily": "MesloLGM NF",
}
```

#### 配置主题

> [官方文档](https://ohmyposh.dev/docs/prompt)

这里贴一个自己的配置，利用 `zsh hooks` 对于不同目录使用不同的主题

```bash
# Oh My Posh
export POSH="$HOME/.oh-my-posh"
# https://ohmyposh.dev/docs/prompt
# eval "$(oh-my-posh init zsh)"

isContain() {
    local path=$1
    local str=$2
    if [[ $path == *$str* ]]; then
        return 0
    else
        return 1
    fi
}

loadTheme() {
  eval "$(oh-my-posh init zsh --config ${POSH}/themes/$1.omp.json)"
}

# https://ohmyposh.dev/docs/customize
autoload -U add-zsh-hook
toggerTheme(){
  if isContain $(pwd) $COMPANY; then
    loadTheme star
  elif isContain $(pwd) $STUDY; then
    loadTheme space
  elif isContain $(pwd) $MY; then
    loadTheme the-unnamed
  elif isContain $(pwd) $PLAY; then
    loadTheme zash
  else
    loadTheme default
  fi
}
add-zsh-hook chpwd toggerTheme
toggerTheme
```

### 参考文档
- [Oh My Posh](https://ohmyposh.dev/)
- [Oh My Posh：全平台终端提示符个性化工具](https://sspai.com/post/69911)
- [zsh hooks](https://stephencharlesweiss.com/zsh-hooks)