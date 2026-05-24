// ── Carrusel de equipos ────────────────────────────────────────────────────────

(function initCarousel() {
  const track = document.getElementById('equipos-track');
  const dotsContainer = document.getElementById('equipos-dots');
  if (!track || !dotsContainer) return;

  const slides = track.querySelectorAll('.equipos-carousel__slide');
  const total = slides.length;
  if (total === 0) return;

  let current = 0;

  // Crear dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'equipos-carousel__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir a foto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getDots() {
    return dotsContainer.querySelectorAll('.equipos-carousel__dot');
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.querySelector('.equipos-carousel__btn--prev')
    ?.addEventListener('click', () => goTo(current - 1));

  document.querySelector('.equipos-carousel__btn--next')
    ?.addEventListener('click', () => goTo(current + 1));

  // Swipe táctil
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });
})();
