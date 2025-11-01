;(function() {
  var c = document.getElementById('canvas')
  var ctx = c.getContext('2d')
  var w = (c.width = window.innerWidth)
  var h = (c.height = window.innerHeight)
  var cx = w / 2
  var cy = h / 2
  var P = function(x, y) {
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.r = 1 + Math.random() * 10
    this.sa = Math.random() * Math.PI * 2
    this.ea = Math.random() * Math.PI * 2
    this.rt = Math.random() * Math.PI * 2
    this.vrt = 0
    this.h = 0
  }
  P.prototype = {
    constructor: P,
    update: function() {
      this.vx += Math.random() * 0.1 - 0.05
      this.vy += Math.random() * 0.1 - 0.05
      this.vrt += Math.random() * 0.02 - 0.01
      this.x += this.vx
      this.y += this.vy
      this.rt += this.vrt

      var dx = cx - this.x
      var dy = cy - this.y
      var d = Math.sqrt(dx * dx + dy * dy)

      this.h = (dx / d) * 360

      if (this.x < 0) {
        this.x = 0
        this.vx *= -1
      }
      if (this.x > w) {
        this.x = w
        this.vx *= -1
      }
      if (this.y < 0) {
        this.y = 0
        this.vy *= -1
      }
      if (this.y > h) {
        this.y = h
        this.vy *= -1
      }
    },
    render: function(ctx) {
      ctx.save()
      ctx.strokeStyle = 'black'
      ctx.fillStyle = 'hsla(' + this.h + ', 100%, 50%, 0.5)'
      ctx.translate(this.x, this.y)
      ctx.rotate(this.rt)
      ctx.beginPath()
      ctx.arc(0, 0, this.r, this.sa, this.ea)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }
  }

  var ps = []
  var p
  var ctr = Math.floor((w * h) / 10000)

  for (var i = 0; i < ctr; i++) {
    p = new P(Math.random() * w, Math.random() * h)
    ps.push(p)
  }

  requestAnimationFrame(function loop() {
    requestAnimationFrame(loop)
    ctx.clearRect(0, 0, w, h)
    for (var i = 0; i < ctr; i++) {
      p = ps[i]
      p.update()
      p.render(ctx)
    }
    for (var i = 0; i < ctr; i++) {
      var p1 = ps[i]
      for (var j = i + 1; j < ctr; j++) {
        var p2 = ps[j]
        var dx = p1.x - p2.x
        var dy = p1.y - p2.y
        var d = Math.sqrt(dx * dx + dy * dy)
        if (d < 50) {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }
  })
  var debounce = (fn, t) => {
    var time
    return function(...arg) {
      clearTimeout(time)
      var that = this
      time = setTimeout(function(...arg) {
        fn.apply(that, arg)
      }, t)
    }
  }
  window.addEventListener(
    'resize',
    debounce(function() {
      window.location.reload()
    }, 300)
  )
})()
