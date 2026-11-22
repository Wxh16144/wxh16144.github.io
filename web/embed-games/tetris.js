// Standalone, embeddable Tetris.
// Registers globalThis.embedGames.GameTetris = { name, start }.
// start({ container? }) -> { destroy }.
// No container = fixed fullscreen behind the page content (404 background mode).
(() => {
  'use strict';

  const COLS = 10;
  const ROWS = 20;
  const PREVIEW = 4; // preview strip width, in cells

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
  `;

  const GAME_CSS = `
    .egtetris-canvas { display: block; }
  `;

  const ensureStyles = () => {
    if (!document.getElementById('eg-base-style')) {
      const base = document.createElement('style');
      base.id = 'eg-base-style';
      base.textContent = BASE_CSS;
      document.head.appendChild(base);
    }
    if (!document.getElementById('egtetris-style')) {
      const game = document.createElement('style');
      game.id = 'egtetris-style';
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

  // Hues must be non-zero: 0 marks an empty cell on the board.
  const PIECES = {
    I: { hue: 190, matrix: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
    J: { hue: 225, matrix: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
    L: { hue: 35, matrix: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] },
    O: { hue: 50, matrix: [[1, 1], [1, 1]] },
    S: { hue: 140, matrix: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
    T: { hue: 280, matrix: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
    Z: { hue: 340, matrix: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
  };
  const TYPES = Object.keys(PIECES);
  const LINE_SCORE = { 1: 40, 2: 100, 3: 300, 4: 1200 };

  // Rotate a square matrix; dir > 0 = clockwise.
  const rotate = (matrix, dir) => {
    const n = matrix.length;
    const out = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        out[r][c] = dir > 0 ? matrix[n - 1 - c][r] : matrix[c][n - 1 - r];
      }
    }
    return out;
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

    const stage = el('div', 'eg-stage');
    stage.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    canvas.className = 'egtetris-canvas';
    stage.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const titleButton = el('button', 'eg-action', 'Tetris');
    titleButton.type = 'button';
    const scoreText = el('span', 'eg-score');
    const restartButton = el('button', 'eg-action', '重新开始');
    restartButton.type = 'button';
    restartButton.hidden = true;
    const bar = el('div', 'eg-bar');
    bar.append(titleButton, scoreText, restartButton);

    const panel = el('div', 'eg-panel');
    panel.hidden = true;
    panel.append(el('p', undefined, '←→ 移动 · ↓ 软降 · ↑ 旋转 · 空格 硬降 · P 暂停'));

    scope.append(stage, bar, panel);

    let cell = 18;
    let board = [];
    let current = null;
    let next = null;
    let score = 0;
    let lines = 0;
    let over = false;
    let paused = false;
    let timer = 0;

    const level = () => 1 + Math.floor(lines / 10);
    const dropDelay = () => Math.max(90, 800 - (level() - 1) * 70);

    const makePiece = (type) => {
      const piece = PIECES[type];
      return {
        type,
        hue: piece.hue,
        matrix: piece.matrix.map((row) => [...row]),
        x: Math.floor((COLS - piece.matrix.length) / 2),
        y: 0,
      };
    };

    const randomPiece = () => makePiece(TYPES[Math.floor(Math.random() * TYPES.length)]);

    const collides = (matrix, px, py) => {
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix.length; c++) {
          if (!matrix[r][c]) continue;
          const x = px + c;
          const y = py + r;
          if (x < 0 || x >= COLS || y >= ROWS) return true;
          if (y >= 0 && board[y][x]) return true;
        }
      }
      return false;
    };

    const drawBlock = (col, row, hue, alpha) => {
      const inset = cell * 0.08;
      ctx.fillStyle = `hsla(${hue} 80% 55% / ${alpha})`;
      ctx.beginPath();
      ctx.roundRect(col * cell + inset, row * cell + inset, cell - inset * 2, cell - inset * 2, Math.min(cell * 0.22, 8));
      ctx.fill();
    };

    const draw = () => {
      const boardW = COLS * cell;
      const boardH = ROWS * cell;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'hsla(0 0% 50% / 0.08)';
      ctx.lineWidth = 1;
      for (let c = 1; c < COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cell, 0);
        ctx.lineTo(c * cell, boardH);
        ctx.stroke();
      }
      for (let r = 1; r < ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cell);
        ctx.lineTo(boardW, r * cell);
        ctx.stroke();
      }

      board.forEach((row, r) => {
        row.forEach((hue, c) => {
          if (hue) drawBlock(c, r, hue, 0.5);
        });
      });

      if (current) {
        current.matrix.forEach((row, r) => {
          row.forEach((filled, c) => {
            if (filled) drawBlock(current.x + c, current.y + r, current.hue, 0.62);
          });
        });
      }

      // Next-piece preview in a strip to the right of the board.
      const px = boardW + cell;
      const box = PREVIEW * cell;
      ctx.strokeStyle = 'hsla(128 128% 50% / 0.28)';
      ctx.beginPath();
      ctx.roundRect(px, 0, box, box, 8);
      ctx.stroke();

      if (next) {
        const n = next.matrix.length;
        const offset = (PREVIEW - n) / 2;
        next.matrix.forEach((row, r) => {
          row.forEach((filled, c) => {
            if (!filled) return;
            const inset = cell * 0.08;
            ctx.fillStyle = `hsla(${next.hue} 80% 55% / 0.5)`;
            ctx.beginPath();
            ctx.roundRect(
              px + (offset + c) * cell + inset,
              (offset + r) * cell + inset,
              cell - inset * 2,
              cell - inset * 2,
              Math.min(cell * 0.22, 8)
            );
            ctx.fill();
          });
        });
      }
    };

    const setScore = () => {
      if (over) scoreText.textContent = `游戏结束 · 得分 ${score}`;
      else if (paused) scoreText.textContent = `已暂停 · 得分 ${score}`;
      else scoreText.textContent = `得分 ${score} · 行 ${lines} · Lv${level()}`;
      restartButton.hidden = !over;
    };

    const schedule = () => {
      clearTimeout(timer);
      if (over || paused) return;
      timer = setTimeout(tick, dropDelay());
    };

    const clearLines = () => {
      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every((value) => value)) {
          board.splice(r, 1);
          board.unshift(new Array(COLS).fill(0));
          cleared += 1;
          r++;
        }
      }
      if (cleared) {
        lines += cleared;
        score += (LINE_SCORE[cleared] || 0) * level();
      }
    };

    const lockPiece = () => {
      current.matrix.forEach((row, r) => {
        row.forEach((filled, c) => {
          if (!filled) return;
          const y = current.y + r;
          const x = current.x + c;
          if (y >= 0) board[y][x] = current.hue;
        });
      });

      clearLines();
      current = next;
      current.x = Math.floor((COLS - current.matrix.length) / 2);
      current.y = 0;
      next = randomPiece();

      if (collides(current.matrix, current.x, current.y)) {
        over = true;
        setScore();
        draw();
        return;
      }

      setScore();
      draw();
      schedule();
    };

    const tick = () => {
      if (over || paused) return;
      if (collides(current.matrix, current.x, current.y + 1)) {
        lockPiece();
        return;
      }
      current.y += 1;
      draw();
      schedule();
    };

    const move = (dx) => {
      if (over || paused) return;
      if (!collides(current.matrix, current.x + dx, current.y)) {
        current.x += dx;
        draw();
      }
    };

    const softDrop = () => {
      if (over || paused) return;
      if (!collides(current.matrix, current.x, current.y + 1)) {
        current.y += 1;
        score += 1;
        setScore();
        draw();
        schedule();
      } else {
        lockPiece();
      }
    };

    const hardDrop = () => {
      if (over || paused) return;
      while (!collides(current.matrix, current.x, current.y + 1)) {
        current.y += 1;
        score += 2;
      }
      lockPiece();
    };

    const rotatePiece = (dir) => {
      if (over || paused) return;
      const rotated = rotate(current.matrix, dir);
      // Simple wall kicks: try in place, then nudge off the walls.
      for (const dx of [0, -1, 1, -2, 2]) {
        if (!collides(rotated, current.x + dx, current.y)) {
          current.matrix = rotated;
          current.x += dx;
          draw();
          return;
        }
      }
    };

    const reset = () => {
      board = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
      score = 0;
      lines = 0;
      over = false;
      paused = false;
      current = randomPiece();
      next = randomPiece();
      setScore();
      draw();
      schedule();
    };

    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const availW = stage.clientWidth * 0.94;
      const availH = stage.clientHeight * 0.94;
      cell = Math.max(8, Math.floor(Math.min(availW / (COLS + PREVIEW + 1), availH / ROWS)));
      const width = (COLS + PREVIEW + 1) * cell;
      const height = ROWS * cell;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
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

      const key = event.key.toLowerCase();
      if (key === 'r') {
        reset();
        return;
      }
      if (key === 'p') {
        paused = !paused;
        setScore();
        if (paused) clearTimeout(timer);
        else schedule();
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return;

      switch (key) {
        case 'arrowleft':
        case 'a':
          event.preventDefault();
          move(-1);
          break;
        case 'arrowright':
        case 'd':
          event.preventDefault();
          move(1);
          break;
        case 'arrowdown':
        case 's':
          event.preventDefault();
          softDrop();
          break;
        case 'arrowup':
        case 'w':
        case 'x':
          event.preventDefault();
          rotatePiece(1);
          break;
        case 'z':
          event.preventDefault();
          rotatePiece(-1);
          break;
        case ' ':
          event.preventDefault();
          hardDrop();
          break;
        default:
          break;
      }
    }, { signal });

    // Touch: tap rotates, swipe left/right moves, swipe down soft-drops, swipe up hard-drops.
    const SWIPE_THRESHOLD = 24;
    let swipeOrigin = null;
    let swiped = false;

    window.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      swipeOrigin = { x: touch.clientX, y: touch.clientY };
      swiped = false;
    }, { passive: true, signal });

    window.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      if (!touch || !swipeOrigin || !panel.hidden) return;

      const dx = touch.clientX - swipeOrigin.x;
      const dy = touch.clientY - swipeOrigin.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;

      event.preventDefault();
      swiped = true;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1);
      else if (dy > 0) softDrop();
      else hardDrop();
      swipeOrigin = { x: touch.clientX, y: touch.clientY };
    }, { passive: false, signal });

    window.addEventListener('touchend', () => {
      if (!swiped && panel.hidden) rotatePiece(1);
      swipeOrigin = null;
    }, { signal });

    titleButton.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
    }, { signal });

    restartButton.addEventListener('click', reset, { signal });

    document.addEventListener('pointerdown', (event) => {
      if (!panel.hidden && !panel.contains(event.target) && !titleButton.contains(event.target)) {
        panel.hidden = true;
      }
    }, { signal });

    fit();
    reset();

    return {
      name: 'Tetris',
      destroy() {
        ac.abort();
        clearTimeout(timer);
        observer.disconnect();
        [stage, bar, panel].forEach((node) => node.remove());
      },
    };
  };

  globalThis.embedGames = globalThis.embedGames || {};
  globalThis.embedGames.GameTetris = { name: 'Tetris', start };

  // Loaded as a classic <script>? Embed automatically; add data-manual to opt out.
  // currentScript is null under a bundler/ESM, so programmatic use stays explicit.
  const script = document.currentScript;
  if (script && !script.hasAttribute('data-manual')) {
    const boot = () => globalThis.embedGames.GameTetris.start();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
      boot();
    }
  }
})();
