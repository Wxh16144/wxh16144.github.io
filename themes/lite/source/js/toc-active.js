(() => {
  // Highlight the TOC entry of the section currently in view.
  var links = Array.prototype.slice.call(document.querySelectorAll('#page-toc a'))
  if (!links.length || !('IntersectionObserver' in window)) return

  var linkByTarget = {}
  links.forEach(function (a) { linkByTarget[a.dataset.target] = a })

  var setActive = function (link) {
    links.forEach(function (a) { a.classList.remove('active') })
    if (link) link.classList.add('active')
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
