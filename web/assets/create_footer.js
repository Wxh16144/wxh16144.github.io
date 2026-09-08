; (function (win) {
  var option = Object.assign({
    copyright_start: '©2018',
    record: {
      url: 'https://beian.miit.gov.cn/',
      number: '浙ICP备17045739号-2'
    },
    fixed: false
  }, win.footer_option)

  var setStyle = function (el, obj) {
    var el = document.createElement(el)
    Object.keys(obj).forEach(function (key) {
      el.style[key] = obj[key]
    })
    return el
  };

  var setAttr = function (el, attr) {
    Object.keys(attr).forEach(function (key) {
      var value = attr[key];
      el.setAttribute(key, value);
    })
    return el
  };

  var footer_style = {
    margin: '10px 0',
    width: '100%',
    textAlign: 'center',
    color: '#999',
    fontSize: '12px',
    zIndex: 996
  }

  if (option.fixed)
    footer_style = {
      ...footer_style,
      position: 'fixed',
      bottom: 0,
      height: '32px',
    }

  var footer_el = setStyle('footer', footer_style);


  var p_el = setStyle('p', {});

  var a_el = setStyle('a', {
    color: '#999',
    fontSize: '12px'
  });

  setAttr(a_el, {
    href: option.record.url,
    target: '_blank',
    title: option.record.number,
  })

  p_el.innerHTML = `${option.copyright_start}-${(new Date()).getFullYear()} ${document.domain.split('.').slice(-2).join('.')}  `;
  a_el.innerHTML = option.record.number;

  p_el.appendChild(a_el);
  footer_el.appendChild(p_el);
  document.body.insertAdjacentElement('beforeend', footer_el)
}(window));
