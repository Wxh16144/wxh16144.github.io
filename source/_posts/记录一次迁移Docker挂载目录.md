---
title: 记录一次迁移Docker挂载目录
date: 2021-10-02 14:15:31
tags: ['Docker','NAS','Note']
---

把原先在 Mac 上用 Docker 运行的 Jenkins 服务，迁移到 NAS 上用 Docker 运行。

<!--more-->

### 迁移挂载的目录

使用 `rsync` 把 Mac 上的 jenkins 目录上传至 NAS 服务器上。 具体命令可参考 [rsync 用法教程](http://www.ruanyifeng.com/blog/2020/08/rsync.html)

```bash
rsync -avz -e ssh jenkins/ nas:/volume3/docker/jenkins
```

上面命令中:
  `-a`  除了可以递归同步以外，还可以同步元信息（比如修改时间、权限等。
  `-v`  参数则是将结果输出到终端，这样就可以看到哪些内容会被同步。
  `-e`  参数指定使用 SSH 协议传输数据.
  `nas` 这里指的是我本地 `~/.ssh/config` 配置, 你应该替换成 `用户名@IP`, 冒号后面则是你远端的目录

### 启动服务

 使用 **docker-compose.yml** 方式

```yml
version: '3.4'

services:
  jenkins:
    image: jenkinsci/blueocean:1.25.0 # 1.24.4
    container_name: my_jenkins
    restart: always
    ports:
      - '10086:8080'
    volumes:
      - './jenkins:/var/jenkins_home'
      - '/var/run/docker.sock:/var/run/docker.sock'
```

补充好 docker-compose.yml 文件后，运行 `docker-compose up -d` 即可。

使用 **docker run** 方式

```bash
docker run -d \
  --name my_jenkins \
  -p 10086:8080 \
  -v ./jenkins:/var/jenkins_home  \
  -v /var/run/docker.sock:/var/run/docker.sock  \
  --restart=always  \
  jenkinsci/blueocean:1.25.0
```

### 遇到的问题

#### 镜像版本问题

补充一下，因为我之前使用 docker-run 运行时, 没有指定 `jenkinsci/blueocean` 版本, 所以默认使用的是 `latest`. 所以大家尽量以后添加镜像时都固定版本号。

之前在网上有看到过一篇文章是查看镜像信息的，不过我试了试貌似没有找到版本信息

```bash
docker image inspect jenkinsci/blueocean:latest | grep -i version
```

#### 上传后权限问题

从 Mac 上传文件后, 用 Docker 运行后一直重启, 切换镜像版本也无法启动

检查日志文件后发现权限错误:
touch: cannot touch '/var/jenkins_home/copy_reference_file.log': Permission denied
Can not write to /var/jenkins_home/copy_reference_file.log. Wrong volume permissions?

使用如下命令查看 Jenkins 容器的所有者:

```bash
docker run -ti --rm --entrypoint="/bin/bash" jenkinsci/blueocean:latest -c "whoami && id"
```

得到结果: `uid=1000(jenkins) gid=1000(jenkins) groups=1000(jenkins)`

解决方法就是, 把当前目录的拥有者赋值给 uid=1000 用户, 再重新启动容器.

```bash
sudo chown -R 1000 ./jenkins
```

### 参考文档

+ [rsync 用法教程](http://www.ruanyifeng.com/blog/2020/08/rsync.html)
+ [Docker创建容器时目录权限踩坑](https://www.jb51.net/article/181985.htm)
