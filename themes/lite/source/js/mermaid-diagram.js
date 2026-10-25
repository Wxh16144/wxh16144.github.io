(() => {
  // 图表只在 /colophon/ 出现，所以整段在没有图时直接退出，
  // mermaid 本体走 CDN 动态 import，滚到可见处才开始下载。
  const blocks = document.querySelectorAll('.markdown-body pre > code.mermaid')
  if (!blocks.length) return;

  const CDN = 'https://registry.npmmirror.com/mermaid/12.2.0/files/dist/mermaid.esm.min.mjs';
  const scheme = matchMedia('(prefers-color-scheme: dark)');
  let mermaid;

  const load = () => {
    if (!mermaid) mermaid = import(CDN).then((mod) => mod.default);
    return mermaid;
  };

  // 把 <pre><code> 换成容器 + 裸 div：SVG 不该继承代码块的内边距和背景
  const items = [...blocks].map((code) => {
    const src = code.textContent;
    const wrap = document.createElement('div');
    const target = document.createElement('div');
    wrap.className = 'mermaid-wrap';
    target.className = 'mermaid';
    target.textContent = src;
    wrap.appendChild(target);
    code.parentElement.replaceWith(wrap);
    return { wrap, target, src };
  });

  const render = async () => {
    const m = await load();
    m.initialize({
      startOnLoad: false,
      // 节点上的 click 需要 loose；图内容写死在仓库里，不接收外部输入
      securityLevel: 'loose',
      theme: scheme.matches ? 'dark' : 'default',
      // 关掉自适应宽度，窄屏靠容器横向滚动，文字才不至于缩成一团
      flowchart: { useMaxWidth: false }
    });
    await Promise.all(items.map(async ({ target, src }) => {
      // 重渲染前恢复源码：mermaid 靠 data-processed 判断是否已处理过
      target.removeAttribute('data-processed');
      target.textContent = src;
      await m.run({ nodes: [target] });
    }));
  };

  // 渲染失败就把源码留在原地（样式已按代码块兜底），不要留一块空白
  const fail = (err) => console.warn('[mermaid]', err);

  let started = false;
  const start = async () => {
    if (started) return;
    started = true;
    io.disconnect();
    try {
      await render();
    } catch (err) {
      fail(err);
      return;
    }
    // 图渲染后 SVG 颜色就固化了，跟随系统深浅色重画一次
    scheme.addEventListener('change', () => {
      render().catch(fail);
    });
  };

  const io = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) start();
  }, { rootMargin: '200px' });

  items.forEach(({ wrap }) => io.observe(wrap));
})();
