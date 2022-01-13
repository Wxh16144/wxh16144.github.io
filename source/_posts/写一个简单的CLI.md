---
title: 写一个简单的CLI
date: 2022-01-13 19:29:01
tags: ["Node"]
---

[zipjson](https://www.npmjs.com/package/zipjson) 这个 CLI 就是使用 JSON.stringify(code, null, 0) 方法把 `.json` 文件压缩成一行。 完...

<!-- more -->

### 写在前面

起因是因为白嫖了 [My JSON Server](https://my-json-server.typicode.com/) 服务，简单点就是说使用 Github 仓库，存储一个 `db.json` 文件就可以模拟 REST 服务器了。
对此我创建了一个仓库 [wxh16144/i](https://github.com/wxh16144/i) 并创建了一个 [db.json](https://github.com/Wxh16144/i/blob/raw/db.json);
但是 raw/da.json 文件是格式化后的，编辑的时候也比较方便，我需要把 `.json` 文件夹压缩成一行(并没有什么好处...,无非就去掉几个换行和空格文件大小减少 1% 罢了)

### 实现

1. 仓库 `raw` 分支直接存放原始 [db.json](https://github.com/Wxh16144/i/blob/raw/db.json) 文件和 [github workflow](https://github.com/Wxh16144/i/blob/raw/.github/workflows/compressed.yml) 文件。
2. 使用 [Github Action](https://docs.github.com/en/actions) 监听 raw 分支的 push 事件, 处理 `db.json` 文件
3. 提交处理后的 `db.json` 到当前仓库的 `main` 分支
4. 打开 [wxh16144/i/db](https://my-json-server.typicode.com/wxh16144/i/db) 检查 REST 是否运行起来了。

在整个 CI 过程中，我需要对 'db.json' 文件进行 ~~压缩~~，所以把这个工具写成 CLI, 方便在 github action 中运行。

实现工具基本用法 `zipjson input.json output.json`

**编辑 `index.js`**

```javascript
#!/usr/bin/env node
// 获取输入输出
const entry = process.argv.slice(2)[0] || 'index.json'
const output = process.argv.slice(2)[1] || 'output.json'

// 读取输入并写入到输出
const json = await readFileSync(entry, 'utf8')
await writeFileSync(output, JSON.stringify(json, null, 0), 'utf8')

console.log('SUCCESS');
```

**编辑 `package.json`**

```json
{
  "name":"zipjson",
  "version": "1.0.0",
  "description": "compressed JSON file",
  "bin": {
    "zipjson": "index.js"
  }
}
```

发布你的 npm 包

```bash
npm publish
```

然后在 github action 中运行 `npx zipjson db.json db.json` 就好了...

### 最后

本着包越小越好，并不考虑添加其他依赖包，对包加些容错处理, 最后我发布了一个最小可用的工具到 npm 上。

```bash
npx zipjson [input] [output] --debug
```

+ **input**: file or path. default `./index.json`
+ **output**: file or path. default `./dist/index.json`
+ **--debug**: console log. defaule `false`, alias `--log`,`-l`,`-d`
+ **--yes**: Agree to all interactions. defaule `false`, alias `--ci`,`-y`
