// Standalone, embeddable Snake.
// Registers globalThis.embedGames.GameSnake = { name, start }.
// start({ container?, grid? }) -> { destroy }.
// No container = fixed fullscreen behind the page content (404 background mode).
(() => {
  'use strict';

  const GRIDS = [12, 16, 20, 24];
  const DEFAULT_GRID = 20;
  const GRID_KEY = 'eg:snake:grid';

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
    .egsnake-canvas { display: block; width: 100%; height: 100%; }
  `;

  const ensureStyles = () => {
    if (!document.getElementById('eg-base-style')) {
      const base = document.createElement('style');
      base.id = 'eg-base-style';
      base.textContent = BASE_CSS;
      document.head.appendChild(base);
    }
    if (!document.getElementById('egsnake-style')) {
      const game = document.createElement('style');
      game.id = 'egsnake-style';
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

  const DIRECTIONS = {
    arrowleft: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    arrowup: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
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

    const readGrid = () => {
      try {
        const saved = Number(localStorage.getItem(GRID_KEY));
        if (GRIDS.includes(saved)) return saved;
      } catch {
        /* storage may be blocked in private mode */
      }
      return GRIDS.includes(options.grid) ? options.grid : DEFAULT_GRID;
    };

    const stage = el('div', 'eg-stage');
    stage.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    canvas.className = 'egsnake-canvas';
    stage.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const titleButton = el('button', 'eg-action', 'Snake');
    titleButton.type = 'button';
    const scoreText = el('span', 'eg-score');
    const restartButton = el('button', 'eg-action', '重新开始');
    restartButton.type = 'button';
    restartButton.hidden = true;
    const bar = el('div', 'eg-bar');
    bar.append(titleButton, scoreText, restartButton);

    const gridOptions = el('div', 'eg-opts');
    GRIDS.forEach((n) => {
      const option = el('button', undefined, `${n}×${n}`);
      option.type = 'button';
      option.dataset.grid = String(n);
      gridOptions.appendChild(option);
    });
    const panel = el('div', 'eg-panel');
    panel.hidden = true;
    panel.append(el('p', undefined, '↑↓←→ / WASD / 滑动 移动 · 空格暂停'), gridOptions);

    scope.append(stage, bar, panel);

    let GRID = readGrid();
    let cell = 16;
    const snakeColor = 'hsla(150 65% 45% / 0.55)';
    const headColor = 'hsla(150 65% 45% / 0.75)';
    const foodColor = 'hsla(0 75% 55% / 0.6)';

    let snake = [];
    let dir = { x: 1, y: 0 };
    let nextDir = dir;
    let food = { x: 0, y: 0 };
    let score = 0;
    let over = false;
    let paused = false;
    let timer = 0;

    const speed = () => Math.max(70, 130 - score * 2);

    const spawnFood = () => {
      const taken = new Set(snake.map((s) => `${s.x},${s.y}`));
      const free = [];
      for (let y = 0; y < GRID; y++) {
        for (let x = 0; x < GRID; x++) {
          if (!taken.has(`${x},${y}`)) free.push({ x, y });
        }
      }
      food = free.length ? free[Math.floor(Math.random() * free.length)] : { x: -1, y: -1 };
    };

    const draw = () => {
      const size = GRID * cell;
      ctx.clearRect(0, 0, size, size);

      // Faint grid lines give the board a texture without being loud.
      ctx.strokeStyle = 'hsla(0 0% 50% / 0.08)';
      ctx.lineWidth = 1;
      for (let i = 1; i < GRID; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell, 0);
        ctx.lineTo(i * cell, size);
        ctx.moveTo(0, i * cell);
        ctx.lineTo(size, i * cell);
        ctx.stroke();
      }

      if (food.x >= 0) {
        ctx.fillStyle = foodColor;
        ctx.beginPath();
        ctx.arc((food.x + 0.5) * cell, (food.y + 0.5) * cell, cell * 0.32, 0, Math.PI * 2);
        ctx.fill();
      }

      snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? headColor : snakeColor;
        const inset = cell * 0.08;
        ctx.beginPath();
        ctx.roundRect(
          segment.x * cell + inset,
          segment.y * cell + inset,
          cell - inset * 2,
          cell - inset * 2,
          Math.min(cell * 0.24, 8)
        );
        ctx.fill();
      });
    };

    const setScore = () => {
      scoreText.textContent = over ? `游戏结束 · 得分 ${score}` : paused ? `已暂停 · 得分 ${score}` : `得分 ${score}`;
      restartButton.hidden = !over;
    };

    const schedule = () => {
      clearTimeout(timer);
      if (over || paused) return;
      timer = setTimeout(tick, speed());
    };

    const tick = () => {
      dir = nextDir;
      // Wrap around the edges so the snake passes through walls.
      const head = {
        x: (snake[0].x + dir.x + GRID) % GRID,
        y: (snake[0].y + dir.y + GRID) % GRID,
      };

      const eating = head.x === food.x && head.y === food.y;
      // The tail moves away this tick unless the snake is growing.
      const body = eating ? snake : snake.slice(0, -1);
      const hitSelf = body.some((s) => s.x === head.x && s.y === head.y);

      if (hitSelf) {
        over = true;
        setScore();
        draw();
        return;
      }

      snake.unshift(head);
      if (eating) {
        score += 1;
        spawnFood();
      } else {
        snake.pop();
      }

      setScore();
      draw();
      schedule();
    };

    const reset = () => {
      GRID = readGrid();
      const mid = Math.floor(GRID / 2);
      snake = [
        { x: mid, y: mid },
        { x: mid - 1, y: mid },
        { x: mid - 2, y: mid },
      ];
      dir = { x: 1, y: 0 };
      nextDir = dir;
      score = 0;
      over = false;
      paused = false;
      spawnFood();
      setScore();
      draw();
      schedule();
    };

    const turn = (vector) => {
      if (!vector) return;
      // Reject reversing straight back onto the neck.
      if (vector.x === -dir.x && vector.y === -dir.y) return;
      if (vector.x === dir.x && vector.y === dir.y) return;
      nextDir = vector;
    };

    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const size = Math.max(120, Math.floor(Math.min(stage.clientWidth, stage.clientHeight) * 0.94));
      cell = size / GRID;
      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const observer = new ResizeObserver(fit);
    observer.observe(stage);

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        panel.hidden = true;
        return;
      }
      if (!panel.hidden) return;

      if (event.key === ' ') {
        event.preventDefault();
        if (!over) {
          paused = !paused;
          setScore();
          if (paused) clearTimeout(timer);
          else schedule();
        }
        return;
      }

      const key = event.key.toLowerCase();
      if (key === 'r') {
        reset();
        return;
      }

      const vector = DIRECTIONS[key];
      if (!vector) return;

      event.preventDefault();
      turn(vector);
    }, { signal });

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
      if (Math.abs(dx) > Math.abs(dy)) turn({ x: dx > 0 ? 1 : -1, y: 0 });
      else turn({ x: 0, y: dy > 0 ? 1 : -1 });
      swipeOrigin = { x: touch.clientX, y: touch.clientY };
    }, { passive: false, signal });

    const applyGrid = (value) => {
      try {
        localStorage.setItem(GRID_KEY, String(value));
      } catch {
        /* storage may be blocked; the game still works for this session */
      }
      [...gridOptions.children].forEach((option) => {
        option.toggleAttribute('data-active', Number(option.dataset.grid) === value);
      });
      reset();
      fit();
    };

    titleButton.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
    }, { signal });

    restartButton.addEventListener('click', reset, { signal });

    gridOptions.addEventListener('click', (event) => {
      const option = event.target.closest('button');
      if (option) applyGrid(Number(option.dataset.grid));
    }, { signal });

    document.addEventListener('pointerdown', (event) => {
      if (!panel.hidden && !panel.contains(event.target) && !titleButton.contains(event.target)) {
        panel.hidden = true;
      }
    }, { signal });

    applyGrid(GRID);
    fit();

    return {
      name: 'Snake',
      destroy() {
        ac.abort();
        clearTimeout(timer);
        observer.disconnect();
        [stage, bar, panel].forEach((node) => node.remove());
      },
    };
  };

  globalThis.embedGames = globalThis.embedGames || {};
  globalThis.embedGames.GameSnake = { name: 'Snake', start };

  // Loaded as a classic <script>? Embed automatically; add data-manual to opt out.
  // currentScript is null under a bundler/ESM, so programmatic use stays explicit.
  const script = document.currentScript;
  if (script && !script.hasAttribute('data-manual')) {
    const boot = () => globalThis.embedGames.GameSnake.start();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
      boot();
    }
  }
})();
