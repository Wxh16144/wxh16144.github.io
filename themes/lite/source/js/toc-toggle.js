(() => {
  // Mobile TOC: collapse to a single "目录" button; tap to expand/collapse.
  var nav = document.getElementById('page-toc')
  var toggle = nav && nav.querySelector('.toc-toggle')
  if (!toggle) return

  var setOpen = function (open) {
    nav.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
  }

  toggle.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-open'))
  })

  // Tapping a TOC link collapses the list again (jump to section, reclaim space).
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false)
  })
})()
