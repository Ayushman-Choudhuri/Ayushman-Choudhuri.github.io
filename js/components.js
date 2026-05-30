(function () {
  var path = window.location.pathname;

  var navItems = [
    { href: '/',             label: 'Home' },
    { href: '/about.html',   label: 'About' },
    { href: '/projects.html',label: 'Projects' },
    { href: '/blog.html',    label: 'Blog' },
    { href: '/resume.html',  label: 'Resume' },
  ];

  function isActive(href) {
    if (href === '/') return path === '/' || path === '/index.html';
    return path.replace('.html', '') === href.replace('.html', '');
  }

  var navHTML = '<nav class="nav"><div class="nav-inner">' +
    '<a href="/" class="nav-logo"><img src="/assets/images/logo.png" alt="Ayushman Choudhuri" class="nav-logo-img"></a>' +
    '<button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">' +
    '<span></span><span></span><span></span></button>' +
    '<ul class="nav-links" id="nav-links">' +
    navItems.map(function (item) {
      return '<li><a href="' + item.href + '"' +
        (isActive(item.href) ? ' class="active"' : '') +
        '>' + item.label + '</a></li>';
    }).join('') +
    '</ul></div></nav>';

  var year = new Date().getFullYear();
  var footerHTML = '<footer class="footer"><div class="footer-inner">' +
    '<div class="footer-links">' +
    '<a href="https://github.com/Ayushman-Choudhuri" target="_blank" rel="noopener">GitHub</a>' +
    '<a href="https://linkedin.com/in/ayushmanchoudhuri/" target="_blank" rel="noopener">LinkedIn</a>' +
    '<a href="mailto:ayushc205@gmail.com">Email</a>' +
    '</div>' +
    '<p class="footer-copy">&copy; ' + year + ' Ayushman Choudhuri.</p>' +
    '</div></footer>';

  var navEl = document.getElementById('nav-placeholder');
  if (navEl) navEl.innerHTML = navHTML;

  var footerEl = document.getElementById('footer-placeholder');
  if (footerEl) footerEl.innerHTML = footerHTML;

  document.addEventListener('click', function (e) {
    var toggle = document.getElementById('nav-toggle');
    var links  = document.getElementById('nav-links');
    if (!toggle || !links) return;
    if (toggle === e.target || toggle.contains(e.target)) {
      links.classList.toggle('open');
    } else if (!links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
})();
