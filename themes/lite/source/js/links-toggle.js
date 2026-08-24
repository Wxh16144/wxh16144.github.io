(() => {
  // Close .links-toggle dropdowns when clicking outside, pressing Esc,
  // or clicking a link inside them.
  const toggles = document.querySelectorAll('.links-toggle');

  if (!toggles.length) return;

  const close = (toggle) => { toggle.removeAttribute('open'); };

  // Click a link inside the dropdown (e.g. a hash link that does not
  // navigate away) → close it.
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      if (e.target.closest('a')) close(toggle);
    });
  });

  // Click anywhere outside the dropdown → close it.
  document.addEventListener('click', (e) => {
    toggles.forEach((toggle) => {
      if (!toggle.contains(e.target)) close(toggle);
    });
  });

  // Esc closes the open dropdown and returns focus to its summary.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    toggles.forEach((toggle) => {
      if (toggle.hasAttribute('open')) {
        close(toggle);
        toggle.querySelector('summary')?.focus();
      }
    });
  });
})();
