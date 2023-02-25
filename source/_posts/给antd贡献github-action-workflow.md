---
title: 给antd贡献github-action-workflow
date: 2022-12-08 23:49:41
tags: ['Github']
---

之前自己的项目一直都有在用 Github Action, 比如我的 [my-blog](https://github.com/Wxh16144/wxh16144.github.io/actions) 仓库就有在用。

最近一段时间活跃在 Ant Design 社区, 看到偏右大佬创建了一个 [issus #39303](https://github.com/ant-design/ant-design/issues/39303), 希望添加一个 workflow, 自己比较感兴趣，于是接手这个需求。

下面将我如何解决问题，以及遇到的一些问题记录分享一下

<!-- more -->

### 参与开源

前几天我做了我的第一支视频 [如何给 Ant Design 开源项目贡献 PR](https://www.bilibili.com/video/BV138411j7TK), 感兴趣的可以看看。

### 需求分析

参考 ant-design-mobile, 每次发布新版本后，都在提交记录上评论一条具体版本的文档站点.

![效果图](https://s2.loli.net/2022/12/09/aIv9CH2DUd13Efr.png)

具体沟通都在 issue 里面评论了

### Github Action

Github Action 可以理解成 和 Gitlab 的 CI/CD 功能一样。设置一些自定义触发事件，自动运行一些工作流程。（比如构建、打包）

详细文档可以阅读 [Github Action 官方文档](https://docs.github.com/en/actions)

本次仅记录我遇到的一些问题

#### 监听事件

监听 [release](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#release) 事件, types: [published] 则表示成功发布了 Release 操作 (进入工作流)
  1. 这里 [workflow_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch) 是方便我们手动触发建 (调试用的)

```yml
on:
  release:
    types: [published]
  workflow_dispatch: 
``` 

#### Setup Job

setup 表示一个 job, `runs-on` 表示运行的宿主机，通常默认 ubuntu-latest 就好了, `if` 则是判断我们是否需要执行 setup 这个 job; [startsWith、contains](https://docs.github.com/en/actions/learn-github-actions/expressions#functions) 方法都是内置的。 这里的逻辑是判断触发的引用用是一个 tag 并且 tab中不包括 `-` (e.g 5.0.0-beta.0, 5.0.1-rc.0), [github.ref、github.ref_name](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context) 都是 github.context;

```yml
jobs:
  setup:
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/') && (contains(github.ref_name, '-') == false)
```

中间未修改部分略过～，主要有 node_modules 依赖缓存相关

#### Build Job

[needs:{job_name}](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idneeds) 表示前面一个 job 执行完成后再执行当前 job

```yml
  # more ...
  build-and-deploy:
    runs-on: ubuntu-latest
    needs: setup
```

#### step get version

这里这表示把版本号里面的 `.` 替换为 `-` 方便 url 阅读。

```yml
      - name: Get version
        id: publish-version
        run: echo "VERSION=$(echo ${{ github.ref_name }} | sed 's/\./-/g')" >> $GITHUB_OUTPUT
```

遇到不会的地方，我们可以借助 Github Copilot, 比如上面的 sed 命令就是 Copilot 帮助我写的。[我的提效助手 Github Copilot](https://bilibili.com/video/BV1LW4y1M7FJ)

#### Deploy

Ant Design 中使用了 [Surge](https://surge.sh/) 部署静态站点，其中 PR Preview 也是。所以至今参考 PR action 部署网站到 surge。

`steps.publish-version.outputs.VERSION` 表示上一个步骤中输出的内容(处理后的版本号)

```yml
    - name: Deploy to Surge (with TAG)
      run: |
        export DEPLOY_DOMAIN=ant-design-${{ steps.publish-version.outputs.VERSION }}.surge.sh
        npx surge --project ./_site --domain $DEPLOY_DOMAIN --token ${{ secrets.SURGE_TOKEN }}
```

#### Comment

上一个步骤成功后，最后我们对发布操作进行一个评论，将部署成功后的站点添加到评论区。

```yml
    - name: Create Commit Comment
      uses: peter-evans/commit-comment@v1
      with:
        body: |
          Doc site for this release: https://ant-design-${{ steps.publish-version.outputs.VERSION }}.surge.sh
```

至此，我们一整个功能就补充完成了。可以看一下具体的效果图：

![部署成功-评论效果图](https://s2.loli.net/2023/02/26/GOCimcSP7hjk9zp.png)
