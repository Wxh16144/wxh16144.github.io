---
title: 我觉得 antd 模态框不好用，所以选择了二开
date: 2023-08-11
---

2022 年我从 Vue 切换到 React 开发，在这过去的一年多时间，我待过 2 个团队，毫无意外的都是 React + Ant Design。我相信这是国内绝大多数团队都有使用过的 UI 框架。当然国外的 MUI 也很棒。

<!-- more -->

### modal 有哪些痛点

1. 在没有统一使用 Provider 管理 Modal 的情况下， 我以及我的同事使用最多的方法就是在组件中导入antd Modal，然后使用 React.useState 定义一个 state 传递给 modal 的 ~~visible~~ open 属性。以受控的形式管理弹窗的显隐。并且还需要在 `onCancel` 和  `onOk` 回调中修改 state 来关闭弹窗。

2. 通常打开一个弹窗都伴随着用户点击操作，开发者需要手动对触发器添加 onClick 事件。

3. antd Modal 提供了 `footer` 属性，假设我们的业务代码比较复杂，一股脑塞入 Modal children 会很臃肿，开发者不得不将其抽离出来。但是 footer 又和业务分离，不够内聚。导致我们需要将控制弹窗的开关透传下去。

4. 接第 3 点，antd Modal 提供了 `destroyOnClose` 属性，表示关闭时销毁子元素。这里经常遇到一个问题是，即使我加了这个属性，但是封装的组件包含的 state，然后直接在 children 里直接消费，这个属性的作用就不大了。

5. antd 提供的输入组件都提供了受控和非受控能力，但是 Modal 的显隐却没有非受控设计。以至于开发者想 mount 组件时默认打开弹窗。这样的操作需要开发者二次封装或者设计。

6. 拖拽弹窗，一般情况下 Modal 打开都是固定位置，但是有时候输入时遮挡了用户观察，虽然我们可以使用 Drawer 代替，但有时候我们还是希望有一个可拖动的 Modal，尽管 antd 提供了可拖拽 Demo，但是我阅读起来还是有些难理解。（这条可能是一个 feature。不属于痛点。

### 怎么解决呢

1. 第一种方式是去 antd 官方 仓库创建一个 RFC 进行讨论，如果被采纳则可以发起一个 PR。

2. 第二种方式就是二次开发， 所以有了这篇文章。

### easy-antd-modal

它来了，我又重复造轮子了， github 仓库地址：https://github.com/Wxh16144/easy-antd-modal

**使用方式**

```tsx
import { Button } from 'antd';
import Modal from 'easy-antd-modal';

export default () => (
  <Modal 
    title="easy-antd-modal"
    trigger={<Button type="primary">Click Me</Button>}
  >
    I ❤️ antd
  </Modal>
);
```

#### hook

为了解决上诉痛点 1，2，3，4，5 我封装了 [useModalEnhanced](https://github.com/Wxh16144/easy-antd-modal/blob/master/src/hooks/useModalEnhanced.ts) hook 对弹窗的 props 进行了 HOC

这个 hook 不仅仅可以对 Modal 进行增强，还可以对 antd Drawer 封装同样的能力，以及 antd mobile 的 Mask, Modal, Popup, Dialog 组件都适用。我都进行了二次开发。

#### components

至于可拖动的弹窗，我依赖了 @dnd-kit/core 库实现了可拖拽功能组件 [DragModal](https://github.com/Wxh16144/easy-antd-modal/blob/master/src/drag-modal/index.tsx)

社区好多组件都有一个 Provider 😅，我也不例外，也加入了 [EasyAntdModalProvider](https://github.com/Wxh16144/easy-antd-modal/blob/master/src/context/index.tsx) 组件。可以根据开发者喜好进行自定义 props 约定。

### feature

1.  所有 antd 支持的 props 都进行了透传，所以它支持 antd4 和 antd5
2.  对 trigger 自动绑定 onClick 事件，open state 由内部维护。
3.  content(children) 增强，支持调用 close 关闭弹窗。
4.  保留以上功能的情况下支持拖拽，类似 Windows 弹窗。
5.  同样的能力可以应用在 antd-mobile 组件上。
6.  长期维护，有足够的单元测试支撑。欢迎 PR。

具体文档/示例可以移步：https://wxh16144.github.io/easy-antd-modal/

### 最后

欢迎大家进行讨论，分享大家在开发过程中遇到的问题以及对 antd 的吐槽。万一哪天被就被 antd 团队采纳了呢。

也希望大家可以尝试并讨论我二开的组件，`npm install easy-antd-modal`。
