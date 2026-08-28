(() => {
  // Highlight the TOC entry of the section currently in view.
  var links = Array.prototype.slice.call(document.querySelectorAll('#page-toc a'))
  if (!links.length || !('IntersectionObserver' in window)) return

  var linkByTarget = {}
  links.forEach(function (a) { linkByTarget[a.dataset.target] = a })

  var setActive = function (link) {
    links.forEach(function (a) { a.classList.remove('active') })
    if (!link) return
    link.classList.add('active')

    // Keep the active pill in view when the TOC scrolls horizontally (mobile):
    // auto-scroll the nav so the highlighted entry follows the page scroll.
    var nav = link.parentElement
    if (!nav || nav.scrollWidth <= nav.clientWidth) return

    var linkLeft = link.offsetLeft
    var linkRight = linkLeft + link.offsetWidth
    var pad = 12
    if (linkLeft < nav.scrollLeft) {
      nav.scrollLeft = linkLeft - pad
    } else if (linkRight > nav.scrollLeft + nav.clientWidth) {
      nav.scrollLeft = linkRight - nav.clientWidth + pad
    }
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(linkByTarget[entry.target.id])
    })
  }, { rootMargin: '0px 0px -70% 0px', threshold: 0 })

  Object.keys(linkByTarget).forEach(function (id) {
    var el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})()
