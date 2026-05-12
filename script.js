/* =====================
   ドロワーメニュー制御
   ===================== */
(function () {
  var menuBtn      = document.getElementById('menuBtn');
  var drawer       = document.getElementById('drawer');
  var drawerClose  = document.getElementById('drawerClose');
  var overlay      = document.getElementById('drawerOverlay');

  function openDrawer() {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    menuBtn.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  /* ヘッダースクロール制御 */
  var header     = document.getElementById('header');
  var lastScroll = 0;

  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScroll && currentScroll > 80) {
      /* 下スクロール時：ヘッダーを隠す */
      header.style.transform = 'translateY(-100%)';
    } else {
      /* 上スクロール時：ヘッダーを表示 */
      header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  }, { passive: true });

  /* スムーススクロール（ページ内リンク） */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        closeDrawer();
        var headerHeight = document.getElementById('header').offsetHeight;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

})();
