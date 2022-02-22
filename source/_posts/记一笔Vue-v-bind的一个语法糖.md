---
title: 记一笔Vue v-bind的一些语法糖
date: 2022-02-23 01:47:56
tags: ['Vue']
---

今天偶然看到 Vue3 的一个 [issues#5462](https://github.com/vuejs/core/issues/5462) 大概意思是设置 DOM 属性 `translate` 为字符串 `"no"` 时不符合预期。
Vue 核心成员给出的解决方案是使用 `<div ^translate="no"></div>` 解决。

### 什么是 v-bind

直接查看[官方文档](https://vuejs.org/api/built-in-directives.html#v-bind)

### v-bind 修饰符

#### .camel

将 kebab-case 变成 camelCase。（平时都是使用字符串模版渲染，所以基本上不需要使用这个api）

```html
<svg :view-box.camel="`0 0 100 100`">
  <rect x="0" y="0" width="10%" height="10%" />
</svg>
<!-- 渲染后html  -->
<svg viewBox="0 0 100 100">
  <rect x="0" y="0" width="10%" height="10%" />
</svg>
```

#### .prop

**强制**设置为 DOM property. (Vue@3.2+ 支持)

```html
<div :test.prop="`name`"></div>
<!-- 等价于 -->
<div .test="`name`"></div>
<!-- 渲染后html，没有 attribute-->
<div></div> 
```

![Property属性属于DOM对象](https://s2.loli.net/2022/02/23/yO4Cm6hIZirsfzl.png)

可以理解为使用 `.prop` 修饰符，就是直接在 DOM 对象上添加属性。 也就是 JavaScript 中的对象。

#### .attr

**强制**设置为 DOM attribute. (Vue@3.2+ 支持)

```html
<div :translate.attr="`no`"></div>
<!-- 等价于 -->
<div :^translate="`no`"></div>
<!-- 渲染后html -->
<div translate="no"></div>
```

对于某些 HTML 元素来说，他们的 attribute 都有可选值。当我们像强制渲染成某些自定义值时这个api的作用就出现了。

比如 `<button>` 元素的 `disabled` 设置为非空字符串时，就会添加一个 disabled attribute。

```html
<!-- 渲染后html -->
<button disabled>click</button>
```

如果使用 `.attr` 修饰符后则可以渲染成。

```html
<!-- 渲染后html -->
<button disabled="false">click</button>
```

### 动态属性

以上就是我对 v-bind 的一些语法糖的输出，一些奇奇怪怪的感觉。

<div style="display:flex">
  <img src="https://s2.loli.net/2022/02/23/HD5MwNr1Pzgl4cy.png">
  <img src="https://s2.loli.net/2022/02/23/VydtqXYL8Wskb71.png">
</div>

### 参考文档

+ [directives#v-bind](https://vuejs.org/api/built-in-directives.html#v-bind)
+ [What's the difference between HTML attribute and DOM property?](https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html)