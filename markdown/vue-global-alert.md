---
title: 用Vue.extend写一个全局使用的Alert
date: 2019-07-26 12:58:45
tags: ['Vue']
---

由于项目中经常会用到 alert 这种组件，平常都是全局注册标签，使用时引入，比较繁琐；

<!--more-->

借鉴别人这种组件一般是在 js 中被调用，vue 中组件主要是使用了标签的形式，
现记录通过 [Vue.extend](https://cn.vuejs.org/v2/api/#Vue-extend) 实现的动态组件;

### 项目预览

<iframe src="https://codesandbox.io/embed/vue-template-hnp64?fontsize=14" title="弹窗组件" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### 实现代码

```tree
├── components
│   ├── HelloWord.vue
│   └── alert
│       ├── alert.vue
│       └── index.js
└── main.js
```

### alert.vue

- template 部分

```pug
template(lang="pug")
  .shade
    .mian
      .content
        span {{ message }}
      .btns
        .btn(
          v-for="(btn,index) in btns"
          :key="index"
          @click="(e)=>clickFn(e,btn)"
        ) {{btn.text}}
```

- JavaScript 部分

```javascript
export default {
  name: 'alert',
  data() {
    return {
      message: 'this a alert',
      btns: [
        { text: 'yes', click: () => console.log('yes') },
        { text: 'no', click: () => console.log('yes') }
      ]
    };
  },
  methods: {
    clickFn(event, btn) {
      this.$el.remove(); // 移除DOM
      const { click = () => console.warn('请传入回调函数') } = btn;
      click(event, btn); // 传递回去
    }
  }
};
```

<details>
    <summary>点击查看 CSS 部分</summary>

```css
.shade {
  user-select: none;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.03);
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
}
.shade .mian {
  background: white;
  width: 80%;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  animation: open 0.1s;
}
.shade .mian .content {
  box-sizing: border-box;
  width: 100%;
  padding: 30px 20px;
}
.shade .mian .btns {
  height: 45px;
  box-sizing: border-box;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.shade .mian .btns .btn {
  flex: 1 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
.shade .mian .btns .btn:last-child {
  border-right: none;
}
.shade .mian .btns .btn:active {
  color: white;
  background-color: rgb(64, 169, 243);
}
@keyframes open {
  0%,
  100% {
    transform: scale(1);
  }
  25%,
  75% {
    transform: scale(1.04);
  }
  50% {
    transform: scale(1.06);
  }
}
```

</details>

### index.js

```javascript
import Vue from 'vue';
import alert from './alert.vue';
let MyAlertConstructor = Vue.extend(alert);
let instance;
const MyAlert = option => {
  // 创建实例并且过滤参数
  instance = new MyAlertConstructor({
    data: { ...option }
  });
  // 挂载实例
  instance.$mount();
  document.body.appendChild(instance.$el);
  return instance;
};
// 挂载到Vue原型上
Vue.prototype.$alert = MyAlert;
```

### main.js

```javascript
import './components/alert'; // 引入注册一下
```

到这里我们的 Alert 组件就配置完成了；

### 组件中使用

这里我在 Helloword.vue 中测试使用;

```javascript
export default {
  name: 'HelloWorld',
  props: ['msg'],
  methods: {
    Alert() {
      //  使用直之前绑定到原型上的方法
      this.$alert({
        message: '你今天开心吗?',
        btns: [
          {
            text: '开心',
            click: () => {
              // 测试是否可以拿到这边的this
              console.log(this.msg);
            }
          },
          {
            text: '不开心',
            click: (e, btn) => {
              // 这里的event target 可能没用 因为已经移除DOM了 返回btn原来本身
              console.log('不开心', e, btn);
            }
          },
          { text: '无回调' /* 测试一下没有回调函数的时候 */ },
          { text: '帮助', click: this.isOK }
        ]
      });
    },
    isOK() {
      console.log('输出帮助');
    }
  }
};
```

### 参考文档

- [Vue.extend 构造函数的使用--实现 alert 方法](https://www.jianshu.com/p/b183f93a4aa2)
