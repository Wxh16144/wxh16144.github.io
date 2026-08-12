---
title: 'node-js获取本机ip'
date: 2019-06-17 17:18:25
tags: ['Node']
---

使用 node.js 获取本地 IPv4 地址

<!--more-->

### 起因

在公司开发项目过程中, 使用`Vue`项目配置本地 host 的时候;
每个人从`SVN`仓库 pull 下来的代码, 安装依赖后, 无法正常运行, 需要修改 ip 为自己本地 IP;
索性每次都要改, 每个开发者都麻烦, 所以自己写了一个方法来获取 IP 地址;

### 解决方法

```javascript
const os = require('os');
const getLocalIP = () => {
  //所有的网卡
  const ifaces = os.networkInterfaces();
  let network = [];
  //移除loopback,没多大意义
  Reflect.ownKeys(ifaces).forEach(key => {
    if (!/loopback/gi.test(key)) {
      network = [...network, ...ifaces[key]];
    }
  });
  return network.reduce((arr, { address, family }) => {
    const ip = /^IPv4$/gi.test(family) ? [address] : [];
    return [...arr, ...ip];
  }, []);
};

// exports.getLocalIP = getLocalIP
const a = getLocalIP();
console.log(a);
```

### 参考文档

1. [Nodejs 获取本机地址](https://blog.csdn.net/spy19881201/article/details/13394933)
2. [Nodejs 中 os.networkInterfaces()](http://nodejs.cn/api/os.html#os_os_networkinterfaces)
