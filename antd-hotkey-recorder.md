---
title: antd 快捷键录制组件来了（社区版）
date: 2024-02-25
---

一切始于公司 Electron 项目对用户自定义快捷键功能的需求。

<!-- more -->

起初，UI 端的快捷键逻辑采用的是裸写方式实现，随后交由另一位同事重构，并利用 [react-hotkeys-hook](https://github.com/JohannesKlauss/react-hotkeys-hook) 进行快捷键记录和功能绑定。

然而，在实际操作过程中，接手的同事反馈快捷键记录编写颇为棘手。出于兴趣，我在业余时间也着手研究并开发了这一组件。

## 核心功能

1. **预设快捷键组合**：至少包含一个修饰键与一个常规按键，例如：`Ctrl + C`, `Shift + Enter`, `Ctrl + Shift + Del`
   1. 常规按键支持 a-z、F1-F12 及一些特殊键，详细列表参见 [github/useRecordHotkey.ts](https://github.com/Wxh16144/react-record-hotkey/blob/master/packages/react-use-record-hotkey/src/useRecordHotkey.ts)
2. **确认快捷键**: 按下回车键确认当前录入的快捷键组合并停止录制
3. **取消录制**: 按下 ESC 键可随时取消快捷键的录制过程

## 基本使用方法

### 集成 antd 样式的组件

若您的项目已引入 antd 组件库，可以直接安装 `antd-record-hotkey-input`, 以便快速应用：

```tsx
import RecordShortcutInput from 'antd-record-hotkey-input';

export default () => <RecordShortcutInput />;
```

如果默认 UI 交互不完全满足业务需求，可以从 `antd-record-hotkey-input` 中导入 `useRecordHotkey` hook 实现自定义。

### hook 版本

上述 `antd-record-hotkey-input` 所导出的 `useRecordHotkey` hook 同样可通过安装 `react-use-record-hotkey` 进行直接导入。以下是一个 hook 使用示例：

```tsx
import { useRecordHotkey } from 'react-use-record-hotkey';

const App = () => {
  const [inputRef, keys, { start, stop, isRecording }] = useRecordHotkey({
    onClean: () => {
      console.log('Clean');
    },
    onConfirm: (hotkey) => {
      console.log(`Hotkey: ${Array.from(hotkey).join('+')}`);
    },
  });

  const hotkey = Array.from(keys).join('+');

  return (
    <div>
      <input ref={inputRef} autoFocus readOnly value={hotkey} />
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <p>Recording: {isRecording ? 'Yes' : 'No'}</p>
      <p>Hotkey: {hotkey}</p>
    </div>
  );
};

export default App;
```

### 应用快捷键

通过组件或 hook 录制到的快捷键，可以方便地结合 react-hotkeys-hook 来实现相应的快捷键功能。以下是一个简单示例：

```tsx
import { useState } from 'react';
import { Empty, message } from 'antd';
import RecordShortcutInput from 'antd-record-hotkey-input';
import { useHotkeys } from 'react-hotkeys-hook';

const App = () => {
  const [shortcut, setShortcut] = useState('Shift + F5');

  const shortRef = useHotkeys<HTMLDivElement>(
    shortcut,
    () => {
      message.success('快捷键触发');
    },
    { preventDefault: true},
  );

  return (
    <>
      <RecordShortcutInput
        allowClear
        style={{ width: 500 }}
        defaultValue={shortcut}
        onConfirm={setShortcut}
      />

      <div tabIndex={-1} ref={shortRef}>
        {shortcut ? <span>点击聚焦，测试快捷键：{shortcut}</span> : <Empty />}
      </div>
    </>
  );
};
```

以上即为该组件的基本使用方法。如您对此感兴趣，请移步至 [GitHub - react-record-hotkey](https://github.com/Wxh16144/react-record-hotkey#readme)。如果可以帮助到你，可以点个 star 😘。

### 组件库开发小技巧

#### monorepo 实践

1. 在此类项目中，由于需要同时维护一个 hook 版本和一个 UI 组件版本，monorepo 架构无疑是最优选择，同时还能方便地添加 example 测试项目等。
2. 利用 GitHub Action 和 [semantic-release](https://github.com/Wxh16144/react-record-hotkey/blob/master/.releaserc.js) 实现自动化的包发布流程。

#### 巧妙运用软链接

鉴于 `antd-record-hotkey-input` 基础上仅采用了 antd 的 input 组件，理论上应同时支持 antd4 和 antd5。因此，我们只需在 antd example 中编写一遍代码，然后通过 [脚本创建软连接同步](https://github.com/Wxh16144/react-record-hotkey/blob/master/scripts/setupLink.ts) 即可。

#### 文档引用

文档部分采用 dumi 编写，针对代码示例部分，我们借助了 [dumi-plugin-code-snippets](https://github.com/Wxh16144/dumi-plugin-code-snippets#readme) 插件实现在本地插入代码片段的功能，避免了重复编写示例片段的繁琐步骤。
