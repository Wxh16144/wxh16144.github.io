// Standalone, embeddable 2048.
// Registers globalThis.embedGames.Game2048 = { name, start }.
// start({ container?, size? }) -> { destroy }.
// No container = fixed fullscreen behind the page content (404 background mode).
(() => {
  'use strict';

  const SIZES = [3, 4, 5, 6, 7, 8];
  const DEFAULT_SIZE = 4;
  const SIZE_KEY = 'eg:2048:size';

  const BASE_CSS = `
    .eg-stage { position: var(--eg-pos, fixed); inset: 0; z-index: var(--eg-z, -1); display: flex; align-items: center; justify-content: center; padding: clamp(4px, 0.8vmin, 12px); pointer-events: none; user-select: none; }
    .eg-bar { position: var(--eg-pos, fixed); top: clamp(8px, 1.6vmin, 20px); left: clamp(8px, 1.6vmin, 20px); z-index: 2; display: flex; align-items: center; gap: 0.9em; color: currentColor; font: 500 clamp(10px, 1.4vmin, 13px) / 1.5 ui-monospace, SFMono-Regular, Menlo, monospace; user-select: none; }
    .eg-action { all: unset; cursor: pointer; pointer-events: auto; opacity: 0.55; text-decoration: underline dotted; text-underline-offset: 3px; }
    .eg-action:hover { opacity: 1; }
    .eg-action[hidden] { display: none; }
    .eg-score { opacity: 0.45; white-space: nowrap; }
    .eg-panel { position: var(--eg-pos, fixed); top: clamp(28px, 4.6vmin, 48px); left: clamp(8px, 1.6vmin, 20px); z-index: 3; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border-radius: 10px; color: currentColor; font: 500 clamp(11px, 1.4vmin, 13px) / 1.6 ui-monospace, SFMono-Regular, Menlo, monospace; background: rgba(128, 128, 128, 0.14); border: 1px solid rgba(128, 128, 128, 0.28); backdrop-filter: blur(8px); box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12); user-select: none; }
    .eg-panel[hidden] { display: none; }
    .eg-panel p { margin: 0; opacity: 0.6; }
    .eg-opts { display: flex; flex-wrap: wrap; gap: 6px; }
    .eg-opts button { all: unset; cursor: pointer; padding: 3px 10px; border-radius: 999px; border: 1px solid rgba(128, 128, 128, 0.4); opacity: 0.6; }
    .eg-opts button:hover { opacity: 1; }
    .eg-opts button[data-active] { opacity: 1; font-weight: 700; border-color: currentColor; background: rgba(128, 128, 128, 0.28); }
  `;

  const GAME_CSS = `
    .eg2048-board { display: grid; align-items: stretch; justify-content: normal; grid-template-columns: repeat(var(--n), 1fr); grid-template-rows: repeat(var(--n), 1fr); gap: clamp(4px, 0.8vmin, 12px); }
    .eg2048-cell { display: flex; align-items: center; justify-content: center; border-radius: clamp(4px, 1.6vmin, 18px); font-size: clamp(8px, calc(30vmin / var(--n)), 40px); font-weight: 700; line-height: 1; color: currentColor; opacity: 0.5; transition: background-color 0.12s ease; }
  `;

  const ensureStyles = () => {
    if (!document.getElementById('eg-base-style')) {
      const base = document.createElement('style');
      base.id = 'eg-base-style';
      base.textContent = BASE_CSS;
      document.head.appendChild(base);
    }
    if (!document.getElementById('eg2048-style')) {
      const game = document.createElement('style');
      game.id = 'eg2048-style';
      game.textContent = GAME_CSS;
      document.head.appendChild(game);
    }
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  // Soft, theme-agnostic tints: cool for small tiles, warm as they grow.
  const tint = (level) => {
    const hue = Math.max(210 - (level - 1) * 18, 24);
    const alpha = Math.min(0.05 + (level - 1) * 0.018, 0.24);
    return `hsla(${hue} 90% 55% / ${alpha.toFixed(3)})`;
  };

  const DIRECTIONS = {
    arrowleft: 'left',
    arrowright: 'right',
    arrowup: 'up',
    arrowdown: 'down',
    a: 'left',
    d: 'right',
    w: 'up',
    s: 'down',
  };

  const start = (options = {}) => {
    ensureStyles();

    const scope = options.container || document.body;
    if (options.container) {
      if (getComputedStyle(scope).position === 'static') scope.style.position = 'relative';
      scope.style.setProperty('--eg-pos', 'absolute');
      scope.style.setProperty('--eg-z', 'auto');
    }

    const ac = new AbortController();
    const { signal } = ac;

    const readSize = () => {
      try {
        const saved = Number(localStorage.getItem(SIZE_KEY));
        if (SIZES.includes(saved)) return saved;
      } catch {
        /* storage may be blocked in private mode */
      }
      return SIZES.includes(options.size) ? options.size : DEFAULT_SIZE;
    };

    let SIZE = readSize();

    const stage = el('div', 'eg-stage eg2048-board');
    stage.setAttribute('aria-hidden', 'true');
    let cells = [];

    // Rebuild the cell grid whenever SIZE changes.
    const buildBoard = () => {
      stage.style.setProperty('--n', String(SIZE));
      stage.textContent = '';
      cells = Array.from({ length: SIZE * SIZE }, () => {
        const cell = el('div', 'eg2048-cell');
        stage.appendChild(cell);
        return cell;
      });
    };

    const titleButton = el('button', 'eg-action', '2048');
    titleButton.type = 'button';
    const scoreText = el('span', 'eg-score');
    const restartButton = el('button', 'eg-action', '重新开始');
    restartButton.type = 'button';
    restartButton.hidden = true;
    const bar = el('div', 'eg-bar');
    bar.append(titleButton, scoreText, restartButton);

    const sizeOptions = el('div', 'eg-opts');
    SIZES.forEach((n) => {
      const option = el('button', undefined, `${n}×${n}`);
      option.type = 'button';
      option.dataset.size = String(n);
      sizeOptions.appendChild(option);
    });
    const panel = el('div', 'eg-panel');
    panel.hidden = true;
    panel.append(el('p', undefined, '↑↓←→ / WASD / 滑动 移动'), sizeOptions);

    scope.append(stage, bar, panel);

    let grid = [];
    let score = 0;
    let over = false;

    const at = (r, c) => grid[r * SIZE + c];

    const empties = () => {
      const list = [];
      grid.forEach((value, index) => {
        if (!value) list.push(index);
      });
      return list;
    };

    const spawn = () => {
      const free = empties();
      if (!free.length) return;
      grid[free[Math.floor(Math.random() * free.length)]] = Math.random() < 0.9 ? 2 : 4;
    };

    const render = () => {
      grid.forEach((value, index) => {
        cells[index].textContent = value ? String(value) : '';
        cells[index].style.backgroundColor = value ? tint(Math.log2(value)) : 'transparent';
      });
      scoreText.textContent = over ? `游戏结束 · 得分 ${score}` : `得分 ${score}`;
      restartButton.hidden = !over;
    };

    // Collapse one line toward index 0: slide then merge adjacent equals once.
    const collapse = (line) => {
      const values = line.filter(Boolean);
      const out = [];
      let gained = 0;
      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          out.push(values[i] * 2);
          gained += values[i] * 2;
          i++;
        } else {
          out.push(values[i]);
        }
      }
      while (out.length < SIZE) out.push(0);
      return [out, gained];
    };

    const lines = (horizontal) =>
      Array.from({ length: SIZE }, (_, a) =>
        Array.from({ length: SIZE }, (_, b) => (horizontal ? at(a, b) : at(b, a)))
      );

    const canMove = () => {
      if (empties().length) return true;
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (c + 1 < SIZE && at(r, c) === at(r, c + 1)) return true;
          if (r + 1 < SIZE && at(r, c) === at(r + 1, c)) return true;
        }
      }
      return false;
    };

    const move = (dir) => {
      if (over || !panel.hidden) return;

      const horizontal = dir === 'left' || dir === 'right';
      const reverse = dir === 'right' || dir === 'down';
      let moved = false;
      let gained = 0;

      const next = lines(horizontal).map((line) => {
        const [collapsed, scored] = collapse(reverse ? [...line].reverse() : line);
        gained += scored;
        const result = reverse ? collapsed.reverse() : collapsed;
        if (!moved && result.some((value, i) => value !== line[i])) moved = true;
        return result;
      });

      if (!moved) return;

      next.forEach((line, a) =>
        line.forEach((value, b) => {
          if (horizontal) grid[a * SIZE + b] = value;
          else grid[b * SIZE + a] = value;
        })
      );

      score += gained;
      spawn();
      if (!canMove()) over = true;
      render();
    };

    const reset = () => {
      grid = new Array(SIZE * SIZE).fill(0);
      score = 0;
      over = false;
      spawn();
      spawn();
      render();
    };

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        panel.hidden = true;
        return;
      }
      if (!panel.hidden) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();
      if (key === 'r') {
        reset();
        return;
      }

      const dir = DIRECTIONS[key];
      if (!dir) return;

      event.preventDefault();
      move(dir);
    }, { signal });

    // Swipe: remember where the finger went down, fire a move per threshold
    // crossed, then reset the origin so a long drag keeps stepping.
    const SWIPE_THRESHOLD = 24;
    let swipeOrigin = null;

    window.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      if (touch) swipeOrigin = { x: touch.clientX, y: touch.clientY };
    }, { passive: true, signal });

    window.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      if (!touch || !swipeOrigin || !panel.hidden) return;

      const dx = touch.clientX - swipeOrigin.x;
      const dy = touch.clientY - swipeOrigin.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;

      event.preventDefault();
      move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
      swipeOrigin = { x: touch.clientX, y: touch.clientY };
    }, { passive: false, signal });

    const applySize = (size) => {
      SIZE = size;
      try {
        localStorage.setItem(SIZE_KEY, String(size));
      } catch {
        /* storage may be blocked; the game still works for this session */
      }
      [...sizeOptions.children].forEach((option) => {
        option.toggleAttribute('data-active', Number(option.dataset.size) === size);
      });
      buildBoard();
      reset();
    };

    titleButton.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
    }, { signal });

    restartButton.addEventListener('click', reset, { signal });

    sizeOptions.addEventListener('click', (event) => {
      const option = event.target.closest('button');
      if (option) applySize(Number(option.dataset.size));
    }, { signal });

    // Close the panel when clicking anywhere outside of it.
    document.addEventListener('pointerdown', (event) => {
      if (!panel.hidden && !panel.contains(event.target) && !titleButton.contains(event.target)) {
        panel.hidden = true;
      }
    }, { signal });

    applySize(SIZE);

    return {
      name: '2048',
      destroy() {
        ac.abort();
        [stage, bar, panel].forEach((node) => node.remove());
      },
    };
  };

  globalThis.embedGames = globalThis.embedGames || {};
  globalThis.embedGames.Game2048 = { name: '2048', start };

  // Loaded as a classic <script>? Embed automatically; add data-manual to opt out.
  // currentScript is null under a bundler/ESM, so programmatic use stays explicit.
  const script = document.currentScript;
  if (script && !script.hasAttribute('data-manual')) {
    const boot = () => globalThis.embedGames.Game2048.start();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
      boot();
    }
  }
})();
