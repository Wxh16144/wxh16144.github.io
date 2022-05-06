---
title: Linux 命令之 grep xargs awk
date: 2022-05-07 00:09:37
tags: ["Linux"]
---

使用了很久的 MacOS 系统，越来越依赖终端了，关于很多 `Linux` 命可以直接阅读 [菜鸟教程-Linux 命令大全](https://www.runoob.com/linux/linux-command-manual.html)，本文记录一下我自己使用比较高频的命令；

<!-- more -->

### grep

Linux grep 命令用于查找文件里符合条件的字符串 [菜鸟教程-Linux grep 命令](https://www.runoob.com/linux/linux-comm-grep.html)

```bash
cat ~/.zshrc | grep -ni -C 3 -E "git"
```

+ **-n**: 标示出符合规则的行的列数编号
+ **-i**: 忽略字符大小写的差别
+ **-C**: 显示前后行数
+ **-E**: 将样式为延伸的正则表达式来使用 (**一定要注意几种正则表达式区别**)[linux shell 正则表达式(BREs,EREs,PREs)差异比较](https://www.cnblogs.com/chengmo/archive/2010/10/10/1847287.html)

### xargs

xargs 将管道或标准输入（stdin）数据转换成命令行参数 [菜鸟教程-Linux xargs 命令](https://www.runoob.com/linux/linux-comm-xargs.html)

```bash
wuxh ~/test_dir
❯ echo {1..10} | xargs mkdir # 创建 100 个文件夹，文件夹名从 1 到 100
wuxh ~/test_dir
❯ ls | xargs -tI {} rm -rf {}
rm -rf 1
rm -rf 10
rm -rf 2
rm -rf 3
rm -rf 4
rm -rf 5
rm -rf 6
rm -rf 7
rm -rf 8
rm -rf 9
```

+ **-t**: 先打印命令，然后再执行
+ **-I**: 占位符

### awk

AWK 是一种处理文本文件的语言，是一个强大的文本分析工具 [菜鸟教程-Linux awk 命令](https://www.runoob.com/linux/linux-comm-awk.html)

```bash
wuxh ~/test_dir
❯ echo {1..100} | xargs mkdir
wuxh ~/test_dir
❯ ll | awk '$9 ~ /^[0-9]{1}$/'
drwxr-xr-x  2 wuxh  staff    64B May  7 00:24 1
drwxr-xr-x  2 wuxh  staff    64B May  7 00:24 2
drwxr-xr-x  2 wuxh  staff    64B May  7 00:24 3
drwxr-xr-x  2 wuxh  staff    64B May  7 00:24 4
drwxr-xr-x  2 wuxh  staff    64B May  7 00:24 5
drwxr-xr-x  2 wuxh  staff    64B May  7 00:24 6
drwxr-xr-x  2 wuxh  staff    64B May  7 00:24 7
drwxr-xr-x  2 wuxh  staff    64B May  7 00:24 8
drwxr-xr-x  2 wuxh  staff    64B May  7 00:24 9
```

+ `echo {1..100} | xargs mkdir`: 创建 100 个文件夹，文件夹名从 1 到 100
+ `ll | awk '$9 ~ /^[0-9]{1}$/'`: 使用 awk 分析 第 9 列中只有个位数的文件夹并输出
+ `ll | awk '$9 ~ /^[0-9]{1}$/' | xargs rm -rf`: 找出并删除

### wc

wc命令用于计算字数 [菜鸟教程-Linux wc 命令](https://www.runoob.com/linux/linux-comm-wc.html)

```bash
ls | ws -l
```

+ **l**: 显示行数

### 参考文档

- [linux shell 正则表达式(BREs,EREs,PREs)差异比较](https://www.cnblogs.com/chengmo/archive/2010/10/10/1847287.html)
  <details>
    <summary>点击查看(BREs,EREs,PREs)差异比较表格</summary>
    <img src="https://s2.loli.net/2022/05/07/uYOtUBL29mQSC1k.png" >
  </details>

- [awk 入门教程](https://www.ruanyifeng.com/blog/2018/11/awk.html)
