---
title: node-socket.io
date: 2018/08/16
tags: ['Node']
---

一个 node.js + socket.io 示例

<!--more-->

### 添加依赖

```shell
np init -y
npm i express socket.io body-parser -S -D
npm start
```

### 目录结构

```tree
├── app.js
├── public
│   ├── css
│   │   └── style.css
│   └── js
│       ├── index.js
│       └── vue.js
└── views
    └── index.html
```

### 配置服务 app.js

```javascript
const http = require("http"); //引入http模块
const fs = require("fs"); //引入fs模块
const path = require("path"); //引入path模块
const express = require('express'); //引入express模块
const app = express();
const server = require('http').createServer(app); //开启服务
const io = require('socket.io')(server); //引入socket.io

.... // 配置路由 下面讲到

.... // 这里写socket.io  下面会讲到

const port = 3000; //端口号
server.listen(port, err => {
    console.log(err ? 'Server Error' : `http://localhost:${port}`); //开启服务
});

```

### 路由配置

```javascript
//读取文件的方法
const readFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, filePath), 'utf-8', (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

app.use(express.static(path.join(__dirname, '/'))); //开启公共路径
//配置根路径
app.get('/', (req, res) => {
  readFile('./views/index.html').then(data => {
    res.send(data);
  });
});
//配置404
app.use((req, res, next) => {
  res.send("<h1>页面找不到了!<a href='/'>点我</a>回家!</h1>");
});
```

### 主角 socket.io (服务端)

```javascript
//用户连接触发事件
io.on('connection', socket => {
  console.log('用户连接', socket.request.headers.cookie); //打印出连接用户id
});

//用户向服务器发送数据
socket.on('hi', data => {
  console.log(`用户发送:${data}`); //输出用户发送过来的内容
});

//服务器向用户发送数据
socket.emit('back_hi', `服务器:${Date.now()}!`);

//服务器向所有用户发送数据
socket.broadcast.emit('back_hi', data);

//用户断开连接发送数据
socket.on('disconnect', data => {
  console.log('断开', data);
});
```

### index.html (客户端)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script src="./socket.io/socket.io.js"></script>
    <title>node_demo</title>
  </head>
  <body></body>
  <script src="./public/js/index.js "></script>
</html>
```

### index.js

```javascript
socket = io.connect(); //创建连接

ocket.emit('hi', '你好'); //发送数据

//收到服务器返回的事件
socket.on('back_hi', msg => {
  console.log(msg);
});
```

### 注意事项

- 配置 app.js 的顺序不要错
- 一定要开启公共路径
- 配置根路径一定要读取文件发送客户端响应
