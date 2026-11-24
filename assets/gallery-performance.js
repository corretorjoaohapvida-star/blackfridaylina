'use strict';
(() => {
  const galleries = [...document.querySelectorAll('[data-va="carousel"]')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer:fine)');
  const toggle = document.getElementById('gallery-motion-toggle');
  let userPaused = false;
  const updatePlayback = gallery => {
    const play = gallery.classList.contains('va-ready') && gallery.classList.contains('va-visible') && !userPaused && !document.hidden && !motion.matches;
    gallery.classList.toggle('va-playing', play);
  };
  const measure = gallery => {
    const track = gallery.querySelector('[data-va="track"]');
    const slides = [...track.querySelectorAll('.va-slide')];
    const half = Math.floor(slides.length / 2);
    if (!half) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const distance = (slides[0].getBoundingClientRect().width + gap) * half;
    gallery.style.setProperty('--va-loop-x', -distance + 'px');
    gallery.style.setProperty('--va-duration', Math.max(40, distance / (innerWidth < 768 ? 38 : 55)) + 's');
    slides.slice(half).forEach(slide => slide.setAttribute('aria-hidden', 'true'));
  };
  const prepare = async gallery => {
    if (gallery.dataset.preparing) return;
    gallery.dataset.preparing = 'true';
    const images = [...gallery.querySelectorAll('img')];
    // Warm the whole loop before it moves; transformed lazy images otherwise stay blank.
    images.forEach((img, i) => { img.loading = 'eager'; if (i > 3) img.fetchPriority = 'low'; });
    await Promise.allSettled(images.map(img => img.decode()));
    measure(gallery);
    gallery.classList.add('va-ready');
    updatePlayback(gallery);
  };
  if ('IntersectionObserver' in window) {
    const near = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { prepare(entry.target); near.unobserve(entry.target); }
    }), { rootMargin: '700px 0px' });
    const visible = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('va-visible', entry.isIntersecting);
      updatePlayback(entry.target);
    }));
    galleries.forEach(gallery => { measure(gallery); near.observe(gallery); visible.observe(gallery); });
  } else {
    galleries.forEach(gallery => { gallery.classList.add('va-visible'); prepare(gallery); });
  }
  galleries.forEach(gallery => {
    let resumeTimer;
    const pause = () => { clearTimeout(resumeTimer); gallery.classList.add('va-paused'); };
    const resume = () => { clearTimeout(resumeTimer); resumeTimer = setTimeout(() => gallery.classList.remove('va-paused'), 1000); };
    gallery.addEventListener('pointerdown', pause, { passive: true });
    gallery.addEventListener('pointerup', resume, { passive: true });
    gallery.addEventListener('pointercancel', resume, { passive: true });
    gallery.addEventListener('pointerleave', () => { if (finePointer.matches) resume(); });
    gallery.addEventListener('mouseenter', () => { if (finePointer.matches) pause(); });
    gallery.addEventListener('mouseleave', () => { if (finePointer.matches) resume(); });
  });
  if (toggle) toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.textContent = userPaused ? 'Retomar movimento' : 'Pausar movimento';
    galleries.forEach(updatePlayback);
  });
  document.addEventListener('visibilitychange', () => galleries.forEach(updatePlayback));
  motion.addEventListener('change', () => galleries.forEach(updatePlayback));
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => requestAnimationFrame(() => galleries.forEach(measure)), 150); }, { passive: true });

  const sticky = document.getElementById('stickyCta');
  const offer = document.getElementById('oferta');
  const hero = document.querySelector('.hero');
  if (!sticky || !offer || !hero) return;
  if ('IntersectionObserver' in window) {
    let heroVisible = true, offerVisible = false;
    const update = () => sticky.classList.toggle('show', !heroVisible && !offerVisible);
    new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(entries => { offerVisible = entries[0].isIntersecting; update(); }).observe(offer);
  } else {
    let pending = false;
    window.addEventListener('scroll', () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { const r = offer.getBoundingClientRect(); sticky.classList.toggle('show', scrollY > 600 && !(r.top < innerHeight && r.bottom > 0)); pending = false; });
    }, { passive: true });
  }
})();
