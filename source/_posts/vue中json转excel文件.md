---
title: Json生成Excel文件并下载到本地
date: 2018-10-26 20:26:07
tags: ['javascript', 'npm']
summary: 项目中后端返回JSON数据，我们前端需要生成Excel文件并保存
---

项目中后端返回 JSON 数据，我们前端需要生成 Excel 文件并保存

<!--more-->

## 第一种方法

### 安装

- 我这里使用了 vue-cli. 安装依赖包

```bash
npm i  file-saver xlsx  script-loader -S
```

### 使用

1.  在项目中创建一个文件夹（比如 vendor，一般是在 src 目录下创建）

2.  把 [Blob.js](https://github.com/eligrey/Blob.js/blob/master/Blob.js) 和  [Export2Excel.js](https://www.baidu.com/s?wd=export2excel.js) 这两个文件夹放到新建的文件夹内

3.  由于这几个文件不支持 import 引入，所以我们需要 script-loader 来将他们挂载到全局环境下

4.  **添加到 export2Excel.js**

```javascript
require('script-loader!file-saver'); //保存文件用
require('script-loader!vendor/Blob'); //转二进制用
require('script-loader!xlsx/dist/xlsx.core.min'); //xlsx核心
```

5. 注意 Bolb 的引入 上面的引入需要修改成这样

```javascript
require('script-loader!@/vendor/Blob'); //引入之前下载的Bolo.js
```

### 使用方法

在 vue 的 methods 钩子中新增方法

**代码如下**

```javascript
handleDownload() {
   require.ensure([], () = {
     const { export_json_to_excel } = require("@/vendor/Export2Excel");
     const tHeader = ["日期", "姓名", "地址"];
     const data = ["111",'456','666'];
     export_json_to_excel(tHeader, data, "列表excel");
   });
 }
```

### 参考文档

- 不是官方的,网上的 [参考文档](https://www.cnblogs.com/qiu-Ann/p/7743897.html)

---

## 第二种方法

```shell
npm i js-export-excel -S
```

### 使用

```javascript
const option = {};
option.fileName = 'excel';
option.datas = [
  {
    sheetData: [
      { one: '一行一列', two: '一行二列' },
      { one: '二行一列', two: '二行二列' }
    ],
    sheetName: 'sheet',
    sheetFilter: ['two', 'one'],
    sheetHeader: ['第一列', '第二列'],
    columnWidths: [20, 20]
  },
  {
    sheetHeader: ['姓名', '性别'],
    sheetData: [
      ['wxh', '男'],
      ['xh', '女']
    ]
  }
];
const toExcel = new ExportJsonExcel(option); //new
toExcel.saveExcel(); //保存
```

### 选项

- 数据数据

```javascript
/*多个sheet*/
/*每个sheet为一个object */
[{
sheetData:[], // 数据
sheetName:'', // sheet名字
sheetFilter:[], //列过滤
sheetHeader:[] // 第一行
columnWidths: [] //列宽 需与列顺序对应
}]
```

  - **fileName** 下载文件名（默认：下载）

- 表格选项

1.  **sheetName** sheet 名字（可有可无）（默认 sheet1）
2.  **sheetHeader **标题（excel 第一行数据）

```javascript
 sheetHeader: ["姓名", "性别"],
```

3.  **columnWidths**列宽非必须

```javascript
// number 屏幕宽度为100 20即为 1/5屏幕大小
columnWidths = [20, ''];
```

4.  **sheetData**数据源（必须）

```javascript
//第一种方式 Object
sheetData: [
  { one: '一行一列', two: '一行二列' },
  { one: '二行一列', two: '二行二列' }
];
//第二种方法 Array
sheetData: [
  ['wxh', '男'],
  ['xh', '女']
];
```

5.  **sheetFilter** 列过滤（只有在数据为对象下起作用）（可有可无）

```javascript
sheetFilter = ['two', 'one'];
```

### 参考文档

- npm 地址 [js-export-excel](https://www.npmjs.com/package/js-export-excel)
- 使用参考文档 [参考文档](https://coding.cuikangjie.com/content/26/%E7%BA%AFJS%E5%AF%BC%E5%87%BAexcel%EF%BC%88%E6%94%AF%E6%8C%81%E4%B8%AD%E6%96%87%EF%BC%89)
- 安装
