---
title: Chrome 标签页分组重复的清理
date: 2026-10-08
---

Chrome 浏览器标签页分组重复问题的解决方案分享（macOS 27 + Chrome 155）

<!-- more -->

早在 2023 年我就开始用 Chrome tab groups 功能了，并且安装了 [Auto-Group Tabs 扩展](https://chromewebstore.google.com/detail/auto-group-tabs/danncghahncanipdoajmakdbeaophenb?hl=zh-CN)，实现同类型的页签合并到一个组中统一管理。过去几年我一直在参与 antd OSS，经常要同时开好几个 issue 页面，就用正则按域名把"公司"和"开源"分成两组。

后来各类 AI 网页工具多了，各种豆包、DeepSeek、ChatGPT 等提供了网页对话，所以自然也用到 Group 整理，用得更顺手了。

后面慢慢地没有时间参与开源了，但是习惯没变所以一直用着。在这期间也发现 GitHub 页签组名后有一个 `<conflict xxxx>` 标识。不过好像也没影响使用，一直没 care。

这不 2026 年十一国庆上班第一天，终于看它不顺眼了，手动把冲突标识删除，结果发现有被标记回来了。

家里 MBP、公司 mini 两台电脑，所以 Chrome 登的也是同一个账号。职业使然，看见冲突也差不多意识到可能就是两台设备同步导致的。

### 定位问题

上网找了一圈后，发现社区还是有人和我遇到了同样的问题。大概意思是如果用了扩展或者多个设备同步就会导致冲突，并且冲突的原因是 GUID 重复。

- [FIX THE DUPLICATE TAB GROUPS SYNCING](https://support.google.com/chrome/thread/432475384/fix-the-duplicate-tab-groups-syncing?hl=en)
- [[TabGroupSync] Multi-device active tab sessions cause unlinking & duplicate group fork](https://issues.chromium.org/issues/562108917)

上面看完后也没找到解决方案。有一个评论说的是前往 `https://chrome.google.com/sync` 底部的删除数据按钮进行删除。但是这个在我之前解决另外一个问题的时候操作过，当时丢失了好多数据。得亏我做了各种数据备份，才将数据找回一部分（密码本和书签导入）。

### 尝试删除

遇到问题还是要删除掉已经存在的标签，所以我尝试删除，但是发现页签组有点太多了。手动删除一个一个点击过去太复杂了。

<video src="https://github.com/Wxh16144/wxh16144.github.io/releases/download/assets/chrome-tab-groups-too-many.mp4" controls preload="metadata" style="width: 100%"></video>

所以简单地问了问豆包，给我的答案是可以自己写 Chrome 扩展批量管理，也推荐了 Tab Group Cleaner 扩展。

想着先用现有的扩展，所以安装后发现无法读取到已经存在的，只是读取当前打开的页面的页签组。随后卸载了。

然后还是想尝试批量管理，所以想自己用 AI 写一个扩展本地解决。这个时候隐约感觉和上一个扩展一样，扩展应该没有 API 去批量读取和删除。用 AI 也就十来分钟写了一个，发现果然和自己想的一样。

后来才弄明白，Chrome 的分组分两种。正在打开的扩展能读能改，保存下来的（标签页关了还在书签栏和菜单里）扩展碰不到。保存的那份是跟着同步走的数据，跟书签没关系，只能从菜单里一个一个点。

### 模拟点击

本来是想着干脆把本地数据删掉，但那数据是跟着同步走的。就算本地删对了，只要同步还开着，重启一下又会被同步回来。

所以就想到 E2E 冒烟那套了，直接模拟人去点鼠标、敲键盘。苹果上就用 AppleScript 让脚本替我操作菜单。

AI 写脚本期间也卡了一下。脚本没走 OCR，是让系统告诉它界面上有什么。可 Chrome 自己画出来的界面，系统默认看不见，得先打开一个开关。

菜单按钮也不是普通按钮那一类，按普通按钮去找，一个都找不到，一开始还以为这条路也不通。好在能读到它的位置，点哪里就不用写死，窗口挪了也不影响。

菜单弹出来之后也一样，里面只能靠方向键盲走：

```applescript
-- 点一次菜单按钮，剩下全靠键盘
click at menuButton
repeat 9 times
	key code 125        -- 下 ×9 到“标签页分组”
end repeat
key code 124            -- 右：展开
key code 125            -- 下 ×1，跳过“新建标签页分组”
key code 124            -- 右：展开第一个分组
repeat 3 times
	key code 125        -- 下 ×3 到“删除分组”
end repeat
key code 36             -- 回车
```

方向键不依赖像素，也不管分组叫啥。而且**永远只删第一个**就够了：分组子菜单的顺序是固定的，删掉第一个，新的第一个还在同一个位置，同一套按键能一直重复。跑起来就是这么个笨办法，但确实好使。

脚本在这里：[delete-saved-tab-groups.applescript](https://gist.github.com/Wxh16144/be65d5b059ad4405dbcfc454a5c150d0)

<video src="https://github.com/Wxh16144/wxh16144.github.io/releases/download/assets/chrome-tab-groups-auto-delete.mp4" controls preload="metadata" style="width: 100%"></video>

### 使用注意

- 跑之前先手动删一个分组，确认框里勾上“不再询问”，后面就不会再弹了。
- 删之前也得想清楚，分组要是正开着，里面的标签页会一起关掉，也撤不回来。
- 数量别一次给太多，全删完之后方向键会停在菜单最后一项，再回车就可能点到别的，我是 10 20 50 一批一批跑的。
- 跑的时候尽可能的别碰键盘鼠标。

以上，就是这次清理重复页签分组的分享。

### 参考文档

- [FIX THE DUPLICATE TAB GROUPS SYNCING](https://support.google.com/chrome/thread/432475384/fix-the-duplicate-tab-groups-syncing?hl=en)
- [Tab groups duplicating themselves when reopening](https://www.reddit.com/r/chrome/comments/1g8kmz1/tab_groups_duplicating_themselves_when_reopening/)
- [[TabGroupSync] Multi-device active tab sessions cause unlinking & duplicate group fork](https://issues.chromium.org/issues/562108917)
- [FIX Chrome Saved Tab Groups Disappearing: 5 Tested Fixes (2026)](https://www.superchargebrowser.com/library/fix-chrome-saved-tab-groups-disappearing)
