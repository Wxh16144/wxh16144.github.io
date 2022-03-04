---
title: 分享一个关于我自己的命令行工具
date: 2022-03-04 14:23:20
tags: ['Npm', 'Node']
---

![demo.gif](https://s2.loli.net/2022/03/04/OXrWo6MncQDks5N.gif)

<!-- more -->

### 是干嘛的

本质就是使用 `consloe.log` 在控制台输出关于我的个人社交账号链接。比如 github, zhihu, weibo, twitter...
通过命令行得到想要的输出。将其封装为工具，或许以后可以在其他 npm 项目中使用。通过 [postinstall](https://docs.npmjs.com/cli/v8/using-npm/scripts) 输出关于自己的信息(不推荐这样做，自己项目、或者学习目的无所谓)

### 有什么用

我个人觉得就一个学习用途，或许在和前端朋友沟通中。我可以告诉他使用 `npx wxh16144` 这个命令快速了解我。其主要目的还是学习为主，比如:

- 使用 [mri](https://www.npmjs.com/package/mri) 快速分析命令行参数。
- 使用 [chalk](https://www.npmjs.com/package/chalk) 美化控制台输出内容。
- 使用 [open](https://www.npmjs.com/package/open) 实现使用浏览器打开我的联系链接。
- 使用 VSCode 的 [github copilot](https://copilot.github.com/) 辅助我编写代码。

这些都平时进收藏夹吃灰的包工具，通过写一个小工具进行一个初体验。本次项目依赖也仅是以上3个NPM包。下面将一下具体细节：

### 目录结构

```tree
├── README.md
├── Wxh16144
├── bin
│   └── index.js
├── index.js
└── package.json
```

**Wxh16144** 这是一个纯文本文件，存放一个 logo 信息，使用 [Text to ASCII Art Generator (TAAG)](https://patorjk.com/software/taag/#p=display&h=0&f=ANSI%20Shadow&t=Wxh16144) 生成
**index.js** 输出方法的主要实现
**bin/index.js** 主要提供给命令行使用

### 实现终端输出

> 这里仅展示 version 和 help 信息的输出实现。其实代码也比较简单，详细实现可以查看[GitHub#L34-L89](https://github.com/Wxh16144/Wxh16144/blob/main/index.js#L34-L89)

```javascript
if (args.version) {
  console.log(`${chalk.bold(package.name)}: ${chalk.blue('v' + package.version)}`);
  return;
}
if (args.help || Object.keys(links).length === 0) {
  console.log(`
  ${chalk.green(`${package.name} [options]`)}
    -p, --pick [${Object.keys(contactList).join('|')}]
    -o, --open: use default browser to open the link.
    -h, --hidelogo: hide auther logo.
    -s, --speed: set the speed of animation.
    -H, --help: show help.
    -v, --version: show version. ${chalk.blue('v' + package.version)}
    ----------------------------------------
    ${chalk.bold('e.g.')} ${chalk.green(`${package.name} -hop ${Object.keys(contactList)[0]}`)}
  `)
  return;
}
```

对于 logo 的输出则更为简单，直接使用 `fs` 模块对文件进行读取，然后输出即可。

### 实现格式化命令行参数

> 使用 mri 工具可快速分析命令行参数, 详细实现[GitHub#L28-L32](https://github.com/Wxh16144/Wxh16144/blob/main/index.js#L28-L32)

```javascript
const mri = require('mri');
const argv = mri(process.argv.slice(2), {
  alias: { H: 'help', v: 'version', o: 'open', p: 'pick', h: 'hidelogo', s: 'speed' },
  boolean: [...Object.keys(contactList)],
  default: { pick: Object.keys(contactList), speed: Math.floor(1000 / 60) }
});
```

### 实现命令行功能

> 在 package.json 文件中添加 [bin](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin) 字段即可

_package.json_

```json
{
  "name": "wxh16144",
  "version": "0.0.0",
  "bin": "./bin/index.js",
}
```

_bin/index.js_

```javascript
#!/usr/bin/env node
require('../index')()
```

至此，实现了一个关于自己的命令行工具。具体效果 [issues#1](https://github.com/Wxh16144/Wxh16144/issues/1)：

### 拓展使用

对于前面我们提到的如何在其他NPM包中通过 `npm install` 时输出关于自己的信息功能也很简单。

**方式一**

```json
{
  "script":{
    "postinstall":"wxh16144 -hp github"
  }
}
```

**方式二**

因为在前面 `index.js` 中对方法和联系列表进行了模块导出，所以也可以直接引入 `wxh16144` 进行调用。我在这里提供了注释 [bin/index.js#L4-L6](https://github.com/Wxh16144/Wxh16144/blob/main/bin/index.js#L4-L6)

_script/install.js_

```javascript
require('wxh16144')({ hidelogo: true, pick: ['github'] });

// do something
```

```json
{
  "script":{
    "postinstall":"node script/install.js"
  }
}
```

### 写在后面

以上代码仅提供思路，具体完整代码可以查看 [Github Repo](https://github.com/Wxh16144/Wxh16144)。相信代码阅读起来还是挺轻松的。

自己强迫症太严重了，会使用 [Docker 创建 npm 私服](https://wxhboy.cn/2021/11/27/Docker-%E5%88%9B%E5%BB%BA-npm-%E7%A7%81%E6%9C%8D/) 进行发包测试后再推送到 npmjs 官方市场。这样可以减少坏的 npm 包出现。
