'use strict';
(() => {
  const galleries = [...document.querySelectorAll('[data-va="carousel"]')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
    gallery.style.setProperty('--va-duration', Math.max(8, distance / (innerWidth < 768 ? 76 : 110)) + 's');
    slides.slice(half).forEach(slide => slide.setAttribute('aria-hidden', 'true'));
  };
  const prepare = async gallery => {
    if (gallery.dataset.preparing) return;
    gallery.dataset.preparing = 'true';
    measure(gallery);
    const images = [...gallery.querySelectorAll('img')];
    const firstSlide = gallery.querySelector('.va-slide');
    const visibleCount = Math.max(1, Math.ceil(gallery.clientWidth / Math.max(1, firstSlide.getBoundingClientRect().width)) + 1);
    // Warm the loop nearby, but do not let one distant image hold up autoplay.
    const decoded = images.map((img, i) => {
      img.loading = 'eager';
      if (img.fetchPriority !== 'high') img.fetchPriority = i < visibleCount ? 'auto' : 'low';
      return img.decode().catch(() => {});
    });
    await Promise.race([
      Promise.allSettled(decoded.slice(0, visibleCount)),
      new Promise(resolve => setTimeout(resolve, 1800))
    ]);
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
    const track = gallery.querySelector('[data-va="track"]');
    let resumeTimer, gesture = null, fallbackOffset = 0;
    gallery.style.touchAction = 'pan-y pinch-zoom';
    gallery.style.overflowX = 'hidden';
    gallery.style.cursor = 'grab';
    if (!gallery.hasAttribute('tabindex')) gallery.tabIndex = 0;
    if (!gallery.hasAttribute('role')) gallery.setAttribute('role', 'region');
    const geometry = () => ({
      distance: Math.abs(parseFloat(gallery.style.getPropertyValue('--va-loop-x'))) || 1,
      duration: (parseFloat(gallery.style.getPropertyValue('--va-duration')) || 40) * 1000
    });
    const phase = () => {
      const { distance, duration } = geometry();
      const animation = track.getAnimations()[0];
      return animation ? Number(animation.currentTime || 0) / duration * distance : fallbackOffset;
    };
    const moveTo = position => {
      const { distance, duration } = geometry();
      const wrapped = ((position % distance) + distance) % distance;
      const animation = track.getAnimations()[0];
      if (animation) {
        track.style.removeProperty('transform');
        animation.currentTime = wrapped / distance * duration;
      } else {
        fallbackOffset = wrapped;
        track.style.transform = `translate3d(${-wrapped}px,0,0)`;
      }
    };
    const pause = () => { clearTimeout(resumeTimer); gallery.classList.add('va-paused'); };
    const resume = (delay = 1800) => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        if (!gesture) gallery.classList.remove('va-paused');
      }, delay);
    };
    const finish = event => {
      if (!gesture || (event && event.pointerId !== undefined && event.pointerId !== gesture.id)) return;
      const id = gesture.id;
      gesture = null;
      gallery.style.cursor = 'grab';
      if (gallery.hasPointerCapture(id)) gallery.releasePointerCapture(id);
      resume();
    };
    gallery.addEventListener('dragstart', event => event.preventDefault());
    gallery.addEventListener('pointerdown', event => {
      if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0) || gesture) return;
      if (event.target.closest('a,button,input,select,textarea')) return;
      pause();
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, phase: phase(), axis: null };
    });
    gallery.addEventListener('pointermove', event => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
      if (!gesture.axis) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) { finish(event); return; }
        gesture.axis = 'x';
        gallery.setPointerCapture(gesture.id);
        gallery.style.cursor = 'grabbing';
      }
      event.preventDefault();
      moveTo(gesture.phase - dx);
    }, { passive: false });
    gallery.addEventListener('pointerup', finish);
    gallery.addEventListener('pointercancel', finish);
    gallery.addEventListener('lostpointercapture', event => { if (event.target === gallery) finish(event); });
    window.addEventListener('pointerup', finish);
    window.addEventListener('blur', () => finish());
    gallery.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      pause();
      const slide = track.querySelector('.va-slide');
      const step = slide.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 0);
      moveTo(phase() + (event.key === 'ArrowRight' ? step : -step));
      resume();
    });
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
