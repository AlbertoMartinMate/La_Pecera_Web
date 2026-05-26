export function initNovedades() {
  const container = document.getElementById('novedades-carousel');
  if (!container) return;

  const modules = import.meta.glob(
    '/src/assets/images/novedades/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}',
    { eager: true }
  );
  const images = Object.values(modules).map(m => m.default);

  if (images.length === 0) {
    container.innerHTML = '<p class="nov-empty">Próximamente...</p>';
    return;
  }

  // ── Track ──────────────────────────────────────────────────────────────────
  const track = document.createElement('div');
  track.className = 'nov-track';

  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'nov-slide';
    slide.setAttribute('role', 'button');
    slide.setAttribute('tabindex', '0');
    slide.setAttribute('aria-label', `Ver imagen ${i + 1} a pantalla completa`);
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Novedad ${i + 1}`;
    img.loading = 'lazy';
    img.draggable = false;
    slide.appendChild(img);
    track.appendChild(slide);
  });
  container.appendChild(track);

  // ── Arrows ─────────────────────────────────────────────────────────────────
  const prevBtn = document.createElement('button');
  prevBtn.className = 'nov-arrow nov-arrow--prev';
  prevBtn.setAttribute('aria-label', 'Anterior');
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'nov-arrow nov-arrow--next';
  nextBtn.setAttribute('aria-label', 'Siguiente');
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

  container.appendChild(prevBtn);
  container.appendChild(nextBtn);

  // ── Dots ───────────────────────────────────────────────────────────────────
  const dotsEl = document.createElement('div');
  dotsEl.className = 'nov-dots';
  images.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'nov-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Imagen ${i + 1}`);
    dotsEl.appendChild(d);
  });
  container.appendChild(dotsEl);

  // ── State & navigation ─────────────────────────────────────────────────────
  let current = 0;
  const total = images.length;

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.nov-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dotsEl.querySelectorAll('.nov-dot').forEach((d, i) =>
    d.addEventListener('click', () => goTo(i))
  );

  // Autoplay
  let timer = setInterval(() => goTo(current + 1), 4500);
  container.addEventListener('mouseenter', () => clearInterval(timer));
  container.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 4500);
  });

  // Touch / swipe
  let touchStartX = 0;
  container.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  container.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) goTo(current + (delta < 0 ? 1 : -1));
  });

  // ── Lightbox ───────────────────────────────────────────────────────────────
  const lb = document.createElement('div');
  lb.className = 'nov-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `
    <div class="nov-lightbox__overlay"></div>
    <div class="nov-lightbox__stage">
      <img class="nov-lightbox__img" src="" alt="" />
      <button class="nov-lightbox__close" aria-label="Cerrar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <button class="nov-lightbox__prev" aria-label="Anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button class="nov-lightbox__next" aria-label="Siguiente">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <span class="nov-lightbox__counter"></span>
    </div>
  `;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.nov-lightbox__img');
  const lbCounter = lb.querySelector('.nov-lightbox__counter');
  let lbIndex = 0;

  function lbOpen(index) {
    lbIndex = ((index % total) + total) % total;
    lbImg.src = images[lbIndex];
    lbCounter.textContent = `${lbIndex + 1} / ${total}`;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function lbClose() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function lbGo(index) {
    lbIndex = ((index % total) + total) % total;
    lbImg.src = images[lbIndex];
    lbCounter.textContent = `${lbIndex + 1} / ${total}`;
  }

  track.querySelectorAll('.nov-slide').forEach((slide, i) => {
    slide.addEventListener('click', () => lbOpen(i));
    slide.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') lbOpen(i); });
  });

  lb.querySelector('.nov-lightbox__overlay').addEventListener('click', lbClose);
  lb.querySelector('.nov-lightbox__close').addEventListener('click', lbClose);
  lb.querySelector('.nov-lightbox__prev').addEventListener('click', () => lbGo(lbIndex - 1));
  lb.querySelector('.nov-lightbox__next').addEventListener('click', () => lbGo(lbIndex + 1));

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')      lbClose();
    if (e.key === 'ArrowLeft')   lbGo(lbIndex - 1);
    if (e.key === 'ArrowRight')  lbGo(lbIndex + 1);
  });
}
