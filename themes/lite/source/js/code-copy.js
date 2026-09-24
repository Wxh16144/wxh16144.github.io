(() => {
  // <pre> is the horizontal scroll container, so the button lives in a wrapper
  // next to it — inside, it would scroll out of view.
  document.querySelectorAll('.markdown-body pre > code').forEach((code) => {
    const pre = code.parentElement;
    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.textContent = 'copy';

    let timer;
    btn.addEventListener('click', () => {
      // Highlight output always ends with a newline; drop it so pasting into a
      // shell does not run an extra empty command.
      const text = code.textContent.replace(/\n$/, '');
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'copied';
        btn.classList.add('copied');
        clearTimeout(timer);
        timer = setTimeout(() => {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 1200);
      });
    });

    wrap.appendChild(btn);
  });
})();
