'use strict';

(function () {
  const carousels = Array.from(document.querySelectorAll('[data-va="carousel"]'));
  if (!carousels.length) return;
  function applyOne(carousel) {
    const track = carousel.querySelector('[data-va="track"]');
    if (!track) return;
    const slides = Array.from(track.querySelectorAll('.va-slide'));
    if (!slides.length) return;
    const half = Math.floor(slides.length / 2);
    if (half < 1) return;
    const gap = parseFloat(getComputedStyle(track).gap || '0');
    let halfWidth = 0;
    for (let i = 0; i < half; i++) {
      halfWidth += slides[i].getBoundingClientRect().width;
      if (i < half - 1) halfWidth += gap;
    }
    carousel.style.setProperty('--va-loop-x', (-halfWidth) + 'px');
    // velocidade constante (px/s) pra nao ficar rapido no mobile; menor = mais lento
    var SPEED = 70;
    var dur = Math.max(40, Math.round(halfWidth / SPEED));
    carousel.style.setProperty('--va-duration', dur + 's');
  }
  function scheduleAll() {
    requestAnimationFrame(() => { requestAnimationFrame(() => { carousels.forEach(applyOne); }); });
  }
  carousels.forEach(carousel => {
    const imgs = Array.from(carousel.querySelectorAll('img'));
    imgs.forEach(img => {
      if (img.complete) return;
      img.addEventListener('load', scheduleAll, { once: true });
      img.addEventListener('error', scheduleAll, { once: true });
    });
    let holding = false;
    function pause(){ holding = true; carousel.classList.add('va-paused'); }
    function resume(){ holding = false; carousel.classList.remove('va-paused'); }
    carousel.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' && e.button !== 0) return; pause(); });
    carousel.addEventListener('pointerup', resume);
    carousel.addEventListener('pointercancel', resume);
    carousel.addEventListener('pointerleave', () => { if (holding) resume(); });
    carousel.addEventListener('mouseenter', () => { if (window.matchMedia('(pointer:fine)').matches) pause(); });
    carousel.addEventListener('mouseleave', () => { if (window.matchMedia('(pointer:fine)').matches) resume(); });
  });
  window.addEventListener('load', scheduleAll);
  window.addEventListener('resize', () => { clearTimeout(window.__vaResizeAllT); window.__vaResizeAllT = setTimeout(scheduleAll, 140); });
  scheduleAll();
})();


(function(){
  var fm = document.getElementById('floatMenu');
  document.getElementById('floatToggle').addEventListener('click', function(){ fm.classList.toggle('open'); });
  var sticky = document.getElementById('stickyCta');
  var oferta = document.getElementById('oferta');
  var seen = false;
  window.addEventListener('scroll', function(){
    if (window.scrollY > 600) { if(!ofertaVisivel()) sticky.classList.add('show'); else sticky.classList.remove('show'); }
    else sticky.classList.remove('show');
  }, {passive:true});
  function ofertaVisivel(){
    var r = oferta.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
})();
