---
title: Docker 创建 npm 私服
date: 2021-11-27 14:40:13
tags: ['Docker']
---

 记录一下如何使用 Docker 和 verdaccio 部署 NPM 私服。

<!-- more -->

### docker-compose.yml

```yml
version: '3.4'
services:
  verdaccio:
    image: verdaccio/verdaccio:5.1 # 建议使用指定版本号。
    container_name: 'my_npm'
    environment:
      - VERDACCIO_PORT=4873
    ports:
      - '80:4873'
    volumes:
      - './storage:/verdaccio/storage'
      - './config:/verdaccio/conf'
      - './plugins:/verdaccio/plugins'
```

使用 `docker-compose up -d` 创建容器。稍候打开 [http://localhose:80](http://localhost) 即可访问,

### 修改配置

修改 `./config/config.yaml` 文件

```yml
storage: /verdaccio/storage
auth:
  htpasswd:
    file: /verdaccio/conf/htpasswd
    max_users: -1 # 设置为-1 表示禁止注册 (建议一开始不设置，自己注册一个账号后再进行设置)
uplinks:
  npmjs:
    url: https://registry.npm.taobao.org/ # 如果安装包找不到时使用 taobao 源
packages:
  # 指定组织的权限
  '@company/*':
    access: $authenticated # 登录用户可查看该组织的 package
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs # 前面设置的源文件地址
  '@wuxh/*':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs
  '**':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs
logs:
  - { type: stdout, format: pretty, level: http }
web:
  enable: true
  title: Wuxh-npm
i18n:
  web: zh-CN
publish:
  allow_offline: false
```


### 参考文档
+ [Verdaccio Docker 官方文档](https://verdaccio.org/zh-cn/docs/docker/)
+ [Verdaccio 使用 Docker 安装及迁移教程](https://segmentfault.com/a/1190000020684605)
