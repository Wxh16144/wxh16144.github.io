---
title: Docker 创建 gitlab ce 服务
date: 2021-11-27 12:33:46
tags: [Docker]
---

去年使用自己的 NAS 安装了 gitlab-ce 服务, 有些细节总是隐隐约约的, 用文章总结记录一下, 方便以后查阅。

之前使用 `docker run` 进行安装, 每次启动或者重新安装都需手动输入配置, 后续我都是用 `docker-compose` 进行管理。

<!-- more -->

### docker-compose 配置

```yml
version: '3.4'
services:
  gitlab:
    image: gitlab/gitlab-ce:13.12.12-ce.0 # 建议指定固定版本, 而不是 latest, 避免麻烦。
    container_name: 'my_gitlab'
    restart: always
    ports:
      - '80:80'
    volumes:
      - ./gitlabce/config:/etc/gitlab # 配置文件
      - ./gitlabce/logs:/var/log/gitlab # 日志文件
      - ./gitlabce/data:/var/opt/gitlab # 数据保存
```

使用 `docker-compose up -d` 启动, 稍候检查运行状态

```bash
docker exec -it my_gitlab gitlab-ctl status
```

稍候打开 [http://localhose:80](http://localhost) 即可访问, 第一次会让你输入 root 密码。

### 修改 clone 域名

进入系统后，选择仓库进行 clone 。或许会发现地址和自己期望不一致。比如下图:
![image.png](https://i.loli.net/2021/11/27/2claIwABb97Vp1O.png)

#### 方式 1:

修改 `docker-compose.yml`, 添加 `hostname` 属性。使用 `docker-compose up -d` 重新创建容器。

```diff
version: '3.4'
services:
    container_name: 'my_gitlab'
+   hostname: 'my-gitlab.com'
    restart: always
    ports:
      - '80:80'
```

![image.png](https://i.loli.net/2021/11/27/uBiqQ41djHTepGc.png)

#### 方式 2 (推荐)

当没有在配置文件 `config/gitlab.rb` 中配置 `external_url` 时, GitLab 会读取系统的 `hostname` 作为域名。

```rb
  # 配置大约在 32 行
  external_url 'http://my-test-test.com'
```

修改配置后重启 gitlab, 无需重启容器。

```bash
docker exec -it my_gitlab gitlab-ctl reconfigure
```

![image.png](https://i.loli.net/2021/11/27/Zx6AhI3dTgrKeGM.png)

#### 方式 2 (补充)

如果 Docker 容器指定非 80 端口, 可能希望在 clone 的 url 上也显示具体端口号？

1. 修改 config/gitlab.rb

```rb
  external_url 'http://my-gitlab.com:999'
```

2. 修改 docker-compose.yml

```diff
    ports:
-    - '80:80'
+    - '999:999'
```

使用 `docker-compose up -d` 

![image.png](https://i.loli.net/2021/11/27/yIXVNvqJE3RBcxT.png)
