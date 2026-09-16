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

  /* ドロワーサブメニュー */
  document.querySelectorAll('.drawer-sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var li = this.closest('.drawer-has-sub');
      li.classList.toggle('is-open');
    });
  });

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

  /* スライドショー */
  function initSlideshow(containerId, trackId, dotsId, peekAmount, prevId, nextId) {
    var track       = document.getElementById(trackId);
    var dots        = dotsId ? document.querySelectorAll('#' + dotsId + ' .dot') : [];
    var prevBtn     = prevId ? document.getElementById(prevId) : null;
    var nextBtn     = nextId ? document.getElementById(nextId) : null;
    var containerEl = document.getElementById(containerId);
    var total       = track ? track.children.length : 0;
    var current     = 0;
    var timer;
    var slideW      = 0;
    var peek        = typeof peekAmount === 'number' ? peekAmount : 40;
    var gap         = 10;
    var listenersAdded = false;
    var touchStartX = 0;

    function goTo(index) {
      current = (index + total) % total;
      var offset = peek - current * (slideW + gap);
      track.style.transform = 'translateX(' + offset + 'px)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function next() { goTo(current + 1); }

    function updateSlideshow() {
      if (!track || total === 0 || !containerEl) return;

      if (window.innerWidth < 1024) {
        slideW = containerEl.offsetWidth - peek * 2;
        Array.from(track.children).forEach(function (slide) {
          slide.style.width = slideW + 'px';
        });
        goTo(current);

        if (!listenersAdded) {
          dots.forEach(function (d, i) {
            d.addEventListener('click', function () {
              clearInterval(timer);
              goTo(i);
              timer = setInterval(next, 5000);
            });
          });
          if (prevBtn) {
            prevBtn.addEventListener('click', function () {
              clearInterval(timer);
              goTo(current - 1);
              timer = setInterval(next, 5000);
            });
          }
          if (nextBtn) {
            nextBtn.addEventListener('click', function () {
              clearInterval(timer);
              goTo(current + 1);
              timer = setInterval(next, 5000);
            });
          }
          track.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
          }, { passive: true });
          track.addEventListener('touchend', function (e) {
            var diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 30) {
              clearInterval(timer);
              goTo(diff > 0 ? current + 1 : current - 1);
              timer = setInterval(next, 5000);
            }
          }, { passive: true });
          listenersAdded = true;
        }

        clearInterval(timer);
        timer = setInterval(next, 5000);

      } else {
        clearInterval(timer);
        Array.from(track.children).forEach(function (slide) {
          slide.style.width = '';
        });
        track.style.transform = '';
        dots.forEach(function (d) { d.classList.remove('active'); });
      }
    }

    updateSlideshow();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSlideshow, 200);
    });
  }

  initSlideshow('seasonalSlideshow', 'slideshowTrack', 'slideshowDots');
  initSlideshow('materialSlideshow', 'materialTrack', null, 64, 'materialPrev', 'materialNext');

})();

/* =====================
   TOP PCヒーロー画像スライドショー
   ===================== */
(function () {
  var wrap = document.getElementById('heroPcSlideshow');
  if (!wrap) return;

  var slides = wrap.querySelectorAll('.hero-pc-slide');
  if (slides.length < 2) return;

  var current = 2;
  setInterval(function () {
    slides[current].classList.remove('is-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-active');
  }, 5000);
})();
