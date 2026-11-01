# embed-games

可嵌入的小游戏：一个 `<script>` 标签即用，各自独立、零依赖。

## Install

```html
<script src="/embed-games/tetris.js" defer></script>
```

经典 `<script>` 加载会自动嵌入；加 `data-manual` 只注册不启动，改用 API 手动控制。

```js
embedGames.GameTetris.start({ container: document.querySelector('#slot') });
```

`start(options)` 返回 `{ destroy }`，可卸载；不传 `container` 时铺满窗口、垫在页面内容之后。

## 2048

方向键 / WASD / 滑动移动，同值合并。内置格子数量选择，记忆在本地。

## Snake

穿墙、吃食变长、撞到自己结束。方向键 / WASD / 滑动，空格暂停。

## Tetris

七种方块，消行升级。←→ 移动、↓ 软降、↑/X 旋转、Z 反向旋转、空格硬降、P 暂停。
