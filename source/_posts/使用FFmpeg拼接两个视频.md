---
title: 使用FFmpeg拼接两个视频
date: 2022-11-10 14:08:51
tags: ['Docker']
---

有些视频经常进行分段发布，尤其是某些短视频。最近在学习 React 性能优化，视频主进行了上、下两个章节进行讲解。

为了更好的学习，我把视频下载本地，进行学习交流。之前倒腾过 [FFmpeg](https://ffmpeg.org/)，今天小记一下。

<!-- more -->

### 写在前面

1. React 新能优化视频 [「上集」React性能优化，你需要知道的一切](https://www.bilibili.com/video/BV1Yr4y1J7oc)、[「下集」React性能优化，你需要知道的一切
](https://www.bilibili.com/video/BV1j44y1g74m);
2. Docker 20.10.13 和 Docker Image [jrottenberg/ffmpeg](https://hub.docker.com/r/jrottenberg/ffmpeg/);

### 操作

1. 文件准备

```
➜ ll
total 132968
-rw-r--r--@ 1 wuxh  staff    28M Sep 14 17:47 react-performance-optimization_01.mp4
-rw-r--r--@ 1 wuxh  staff    37M Sep 14 17:48 react-performance-optimization_02.mp4
```

2. 将需要拼接的视频列表写入一个文本文件

```bash
for f in *.mp4; do echo "file '$f'" >> mylist.txt; done
```
```
➜ cat mylist.txt
file 'react-performance-optimization_01.mp4'
file 'react-performance-optimization_02.mp4'
```

3. 使用 Docker 运行 jrottenberg/ffmpeg 镜像，将文件拼接起来

```bash
docker run --rm -v $(pwd):$(pwd) -w $(pwd) jrottenberg/ffmpeg \
  -f concat \
  -safe 0 \
  -i mylist.txt \
  -c copy output.mp4
```

4. 等待拼接完成，最后目录中会多出一个 `output.mp4` 文件就是拼接完成的文件内容

### 参考文档

- [FFmpeg Wiki: How to concatenate (join, merge) media files](https://trac.ffmpeg.org/wiki/Concatenate)
- [FFmpeg FAQ: How can I join video files?](https://ffmpeg.org/faq.html#How-can-I-join-video-files_003f)
