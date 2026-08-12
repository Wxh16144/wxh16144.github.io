---
title: Ant Design 自定义组件空状态速记
date: 2024-06-27 01:37:36
---

最近在 antd 社区看到一个关于 Table fitler 查询条件下拉框的空状态有关 PR

发现 antd 的很多逻辑并没有在文档详细说明，索性写一个速记笔记方便自己日后 CV。

<!-- more -->

笔记具有一定时效性，请注意当前笔记记录时 antd 最新版本是 `5.18.x`

### 前排先总结

1. 自定义要求不高，仅仅只是为空状态做一个静态展示，没有任何交互。可以使用 `<ConfigProvider />` 的 `renderEmpty` 全局修改。（⚠️ 没办法具体细分到是否是 `<Select />` 还是 `<TreeSelect />`

2. 强自定义需求，空状态需要交互按钮等操作，不建议使用 `<ConfigProvider />` 就近套组件，而是通过组件本身的 props 去实现


通过 [defaultRenderEmpty](https://github.com/ant-design/ant-design/commits/master/components/config-provider/defaultRenderEmpty.tsx) 文件的历史记录不难发现目前支持自定义组件空状态的组件有 `Table`、`List`、`Select`、`TreeSelect`、`Cascader`、`Transfer`、`Mentions`。

### 带误区方案一

以往我自己的做法是通过为当前组件就近套 `<ConfigProvider />` 组件用 `renderEmpty` 以实现自定义空状态

```tsx
import React from 'react';
import { ConfigProvider, Table } from 'antd';
import type { TableProps } from 'antd';

interface MyTableProps<T> extends TableProps<T> {
  empty?: React.ReactNode;
}

const MyTable = <T extends Record<any, any>,>(props: MyTableProps<T>) => {
  const { empty, ...restProps } = props;
  return (
    <ConfigProvider renderEmpty={() => empty}>
      <Table<T> {...restProps} />
    </ConfigProvider>
  )
};

export { MyTable, type MyTableProps };
```

上面这个例子看起来没太大问题，但其实埋了一个坑，因为 `<ConfigProvider/>` 是一个配置上下文，如果在 Table 中有一个声明式的 `<Select />` 或者 `<Cascader />` 则也会一同被修改。

😰示例代码

```tsx
function App() {
  const data = [
    { name: 'Tom', age: 20 },
    { name: 'Jerry', age: 22 },
  ];
  const columns = [
    { title: 'Name', key: 'name' },
    {
      title: 'Age',
      key: 'age',
      render: () => <Select style={{ width: 180 }} options={[]} /> // 这里的空状态会被 CP 的 renderEmpty 覆盖
    },
  ]
  return <MyTable columns={columns} dataSource={data} empty={<div>Custom Empty</div>} />
}
```

解决上面这个问题也很简单，通过 `renderEmpty` 提供的 入参来判断。（这里我们还是用了 CP组件 ）

```diff
   const { empty, ...restProps } = props;
   return (
-    <ConfigProvider renderEmpty={() => empty}>
+    <ConfigProvider renderEmpty={(components) => components === 'Table' ? empty : void 0}>
       <Table<T> {...restProps} />
     </ConfigProvider>
```


举一反三，如果我们需要自定义 `<Select />` 的空状态其实也可以用就近套 `<ConfigProvider />` 用 `renderEmpty` 的方式解决。

你以为这就结束了吗，继续往下看...

据我审查了 antd 代码，支持自定义 Empty 的组件中的 `TreeSelect`、`Mentions` 这两个组件的 `renderEmpty`  入参是不符合预期的(不知道是否有意如此)，从 4.0.0 其就是这样，没有完全根据   [defaultRenderEmpty](https://github.com/ant-design/ant-design/blob/master/components/config-provider/defaultRenderEmpty.tsx) 逻辑的 Switch Case 入参。

- [4.0.0 TreeSelect CP.renderEmpty 源代码处](https://github.com/ant-design/ant-design/blob/4.0.0/components/tree-select/index.tsx#L123)
- [4.0.0 Mentions CP.renderEmpty 源代码处](https://github.com/ant-design/ant-design/blob/4.0.0/components/mentions/index.tsx#L105)

所以通过就近为组件套 `<ConfigProvider />` **不是一个很好的方案**。

但是想全局设置或许只有这一个解决方案，在 App 入口处全局配置一遍。

另外这里顺带提一句 `<ConfigProvider />` 的 `renderEmpty` 可能不需要兜底，我们默认交给 antd 去兜底即可（因为当前 api 实现，我们的兜底行为，可能会导致 antd 上游添加 feature 时不好抉择，会出现 BREAKCHANGE）

```tsx
function App() {
  const columns = [
    { title: 'Name', key: 'name' },
  ]

  return (
    <ConfigProvider
      renderEmpty={(components) => {
        if (components === 'Table') {
          return 'foo'
        }
        if (components === 'List') {
          return 'bar'
        }
        // 以下兜底行为推荐不写，交由 antd 默认处理
        return 'baz'
      }}
    >
      <MyTable columns={columns} dataSource={[]}/>
    </ConfigProvider>
  )
}
```



### 方案二

> 单独使用组件的 props 实现自定义， 但是失去全局统一配置的便捷

#### Table/List

审查代码发现 `<Table />` 其实还可以通 [locale.emptyText](https://github.com/ant-design/ant-design/blob/8890eff05e0cb7596a702c51e658682e1757fc67/components/table/InternalTable.tsx#L551-L553) 去自定义空状态， [其类型定义](https://github.com/ant-design/ant-design/blob/8890eff05e0cb7596a702c51e658682e1757fc67/components/table/interface.ts#L46) 为 `emptyText?: React.ReactNode | (() => React.ReactNode);`

所以 `<Table />` 可以通过这样去实现空状态

```tsx
function App() {
  const columns = [
    { title: 'Name', key: 'name' },
  ]

  const openFormAddData = () => {
    // some code
  }

  return (
    <Table
      columns={columns}
      dataSource={[]}
      locale={{
        emptyText: (
          <>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null}/>
            <Button type="primary" onClick={openFormAddData}>
              Add Data
            </Button>
          </>
        )
      }}
    />
  )
}
```

注意 `<List />` 的  [locale.emptyText](https://github.com/ant-design/ant-design/blob/8890eff05e0cb7596a702c51e658682e1757fc67/components/list/index.tsx#L274) [类型定义](https://github.com/ant-design/ant-design/blob/8890eff05e0cb7596a702c51e658682e1757fc67/components/list/index.tsx#L67-L69) 为 `emptyText: React.ReactNode;`，同样也能很方便的自定义。

```tsx
function App() {
  return (
    <List
      locale={{
        emptyText: <Empty description="No data" />
      }}
    />
  )
}
```

#### Select/TreeSelect/Mentions/Cascader

这几个组件都提供了 `notFoundContent` props 来实现自定义空状态

```tsx
function App() {
  return (
    <Component
      notFoundContent={<Empty description="No data" />}
    />
  )
}
```

#### Transfer

`<Transfer />` 和 `<Table />` 差不多，支持通过  [locale.notFoundContent](https://github.com/ant-design/ant-design/blob/8890eff05e0cb7596a702c51e658682e1757fc67/components/transfer/index.tsx#L398-L402)  [其类型定义](https://github.com/ant-design/ant-design/blob/8890eff05e0cb7596a702c51e658682e1757fc67/components/transfer/index.tsx#L64) 为 `  notFoundContent?: React.ReactNode | React.ReactNode[];`。

```tsx
function App() {
  return (
    <Transfer
      locale={{
        notFoundContent:[
          <Empty description="Not Source"/>,
          <Empty description="Not Target"/>,
        ]
      }}
    />
  )
}
```

另外 `<Transfer />` 在通过 `<ConfigProvider />` 的 `renderEmpty` 全局修改时也可以 return 一个 `React.ReactNode[]` 支持自定义穿梭框左右两侧不同的空状态😬

```tsx
function App() {
  return (
    <ConfigProvider
      renderEmpty={(components) => {
        if (components === 'Transfer') {
          return [
            <Empty description="Not Source" />,
            <Empty description="Not Target" />,
          ]
        }
      }}
    >
      <Transfer />
    </ConfigProvider>
  )
}
```

### 最后

其中提到的 `<Table />`、`<List />`、`<Transfer />` 虽然都可以通过 `locale.XXX` 方式自定义。但是我们不能全局 `<ConfigProvider locale={{ xxx: xxx}} />` 方式来实现全局配置 (虽然 TS 类型推导有提升..

比如这样的代码是不行的 ❌❌❌

```tsx
function App() {

  return (
    <ConfigProvider
      locale={{
        ...enUS,
        Table: {
          ...enUS.Table,
          emptyText: 'No data'
        },
        Transfer: {
          ...enUS.Transfer!,
          notFoundContent: 'No data'
        }
      }}
    >
      {/*...*/}
    </ConfigProvider>
  )
}
```

上面提到的几个组件自定义空状态方式都有些不同，所以我们只能自行二次开发用自己的 context 实现，来抹平 props 差异。

OK，再会～
