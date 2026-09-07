document.addEventListener('DOMContentLoaded', function() {

  /* ── Mobile hamburger menu ── */
  const menuBtn = document.getElementById('mobileMenuBtn');
  const menuOverlay = document.getElementById('mobileMenuOverlay');

  if (menuBtn && menuOverlay) {
    const openMenu = () => {
      menuOverlay.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      menuOverlay.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuOverlay.classList.contains('open') ? closeMenu() : openMenu();
    });

    menuOverlay.addEventListener('click', (e) => {
      if (e.target === menuOverlay) closeMenu();
    });

    menuOverlay.querySelectorAll('.mobile-menu-case-link, .mobile-menu-contact-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ── Banner scroll animation ── */
  const bannerStrip = document.querySelector('.banner-strip');
  const bannerContent = document.querySelector('.banner-content');
  if (!bannerStrip || !bannerContent) return;

  let lastScrollY = window.scrollY;
  let targetDirection = 1; // 1 = left, -1 = right
  let currentDirection = 1;
  let lastDirectionChange = performance.now();
  let lastTime = performance.now();
  let offset = 0;
  let halfWidth = 0;

  const isBannerVisible = () => {
    const rect = bannerStrip.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  const updateWidths = () => {
    // banner-content has two identical groups; half width is one group
    halfWidth = bannerContent.scrollWidth / 2;
  };

  const step = (time) => {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    const speed = 120; // px/sec
    // Smoothly ease direction changes to avoid jumps
    currentDirection += (targetDirection - currentDirection) * 0.08;
    offset -= currentDirection * speed * dt;

    if (offset <= -halfWidth) offset += halfWidth;
    if (offset >= 0) offset -= halfWidth;

    bannerContent.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(step);
  };

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    const scrollingDown = delta > 0;

    const now = performance.now();
    const canChange = now - lastDirectionChange > 220;
    const bannerVisible = isBannerVisible();

    if (Math.abs(delta) < 2 || !bannerVisible) {
      lastScrollY = currentScrollY;
      return;
    }

    if (scrollingDown && canChange) {
      targetDirection = 1;
      bannerStrip.classList.add('is-reversed');
      lastDirectionChange = now;
    } else if (!scrollingDown && canChange) {
      targetDirection = -1;
      bannerStrip.classList.remove('is-reversed');
      lastDirectionChange = now;
    }

    lastScrollY = currentScrollY;
  };

  updateWidths();
  window.addEventListener('resize', updateWidths);
  window.addEventListener('scroll', onScroll, { passive: true });
  requestAnimationFrame(step);
});
