---
title: 记录一下npm源的一些配置
date: 2021-11-17 23:51:40
tags: ["Npm", "Note"]
---

对于设置 npm 源的内容网上已经有很多了, 这次主要记录一下对于多个私有源地址如何进行设置。

偶然在群里看到某个朋友说到, 他的项目中依赖了多个私有包, 每次删除 node_modules 后需要设置私有源并安装后, 再安装外网依赖。

<!-- more -->

### 一键设置源
使用 `nrm` 进行设置。

```bash
# npm --registry=https://registry.npmmirror.com
# or
npx nrm use taobao # 设置淘宝源
```

### 多个不同源

当前项目根目录下新建 `.npmrc` 文件, 可以参考我的示例:

```bash
# registry=https://registry.npmjs.org/ # npm(默认)
@vue:registry=https://registry.npmmirror.com # 淘宝
@wuxh:registry=http://nas.wxhboy.cn:98/ # 私人
```

你可以使用 `npm config ls` 来确认你的配置文件是否正确。

![npm config ls](https://i.loli.net/2021/11/18/API39SapfUCYMVG.png)


最后测试一下配置是否生效:

```bash
npm info @wuxh/resource
```

![npm info @wuxh/resource](https://i.loli.net/2021/11/18/dBwAKt2MzuRJrCL.png)

```bash
npm info @vue/composition-api
```

![npm info @vue/composition-api](https://i.loli.net/2021/11/18/bL71hevoOF3S2Yd.png)

### 参考文档
+ [Associating a scope with a registry](https://docs.npmjs.com/cli/v6/using-npm/scope#associating-a-scope-with-a-registry)
+ [淘宝 NPM 镜像](https://npmmirror.com/)



