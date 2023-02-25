---
title: TS的一些特殊示例 (持续更新)
date: 2099-12-01 23:24:33
tags: ["TypeScript"]
---

该文章记录一些平时工作中一些特殊场景类型推导, 归纳总结一下。

<!-- more -->

### 定义一个不包括某些 Key 的对象

```typescript
interface Options {
  name: string;
  age?: number;
}

type Valid = Record<string, any> & Partial<Record<keyof Options, never>>;

const foo: Valid = { name: "foo" }; // error
const bar: Valid = { age: 1 }; // error
const baz: Valid = { other: "baz" }; // okay
```

- [TypeScript function that takes an object without certain keys](https://stackoverflow.com/questions/52618362/typescript-function-that-takes-an-object-without-certain-keys)

### 为 Object.defineProperty 添加类型推导

```typescript
type InferValue<Prop extends PropertyKey, Desc> = Desc extends {
  get(): any;
  value: any;
}
  ? never
  : Desc extends { value: infer T }
  ? Record<Prop, T>
  : Desc extends { get(): infer T }
  ? Record<Prop, T>
  : never;

type DefineProperty<
  Prop extends PropertyKey,
  Desc extends PropertyDescriptor
> = Desc extends {
  writable: any;
  set(val: any): any;
}
  ? never
  : Desc extends { writable: any; get(): any }
  ? never
  : Desc extends { writable: false }
  ? Readonly<InferValue<Prop, Desc>>
  : Desc extends { writable: true }
  ? InferValue<Prop, Desc>
  : Readonly<InferValue<Prop, Desc>>;

function defineProperty<
  Obj extends object,
  Key extends PropertyKey,
  PDesc extends PropertyDescriptor
>(
  obj: Obj,
  prop: Key,
  val: PDesc
): asserts obj is Obj & DefineProperty<Key, PDesc> {
  Object.defineProperty(obj, prop, val);
}

const storage = {
  currentValue: 0,
};

defineProperty(storage, "maxValue", {
  value: 9001,
  writable: false,
});

storage.maxValue = 100; // error
```

- [TypeScript: Assertion signatures and Object.defineProperty](https://fettblog.eu/typescript-assertion-signatures/)

### 美化交叉类型

```ts
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Intersected = {
  a: string;
} & {
  b: number;
} & {
  c: boolean;
};

type Foo = Prettify<Intersected>;

export const foo: Foo = {
  a: "a",
  b: 1,
  c: true,
};
```

- [Here's a quick thread on a super useful type helper you've probably never heard of (nope, not even advanced folks).](https://twitter.com/mattpocockuk/status/1622730173446557697?s=20)
