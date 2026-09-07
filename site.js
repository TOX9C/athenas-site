/* Athena's Core - landing site, v4
   Vanilla JS only. IntersectionObserver reveals, film overlay,
   crypto copy, live release notes. No GSAP. Reduced motion ->
   everything simply visible; reveal transitions are transform-
   and opacity-only via CSS class. */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll reveals ───────────────────────────────────────── */
  function initReveals() {
    const els = document.querySelectorAll('.block-head, .plate, .feature, .tenets li, .release, .early, .support-row');
    if (REDUCED || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    els.forEach(function (el) { el.classList.add('pre'); io.observe(el); });
  }

  /* ── Film play overlay ────────────────────────────────────── */
  function initFilm() {
    const film = document.getElementById('product-film');
    const play = document.getElementById('film-play');
    if (!film || !play) return;
    const wrap = film.parentElement;
    let userPlayed = false;
    play.addEventListener('click', function () {
      userPlayed = true;
      film.muted = false;
      film.play().catch(function () {});
      wrap.classList.add('is-playing');
    });
    film.addEventListener('play', function () { wrap.classList.add('is-playing'); });
    film.addEventListener('pause', function () { if (userPlayed) wrap.classList.remove('is-playing'); });
    film.addEventListener('ended', function () { wrap.classList.remove('is-playing'); userPlayed = false; });
  }

  /* ── Crypto copy-to-clipboard ─────────────────────────────── */
  function initCrypto() {
    document.querySelectorAll('.crypto-code').forEach(function (code) {
      function copy() {
        const text = code.textContent.trim();
        const label = code.querySelector('span');
        const address = label ? text.replace(label.textContent.trim(), '').trim() : text;
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(address).then(function () {
          code.classList.add('is-copied');
          setTimeout(function () { code.classList.remove('is-copied'); }, 1400);
        }).catch(function () {});
      }
      code.addEventListener('click', copy);
      code.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          copy();
        }
      });
    });
  }

  /* Release notes are static — source repo is private. */

})();
