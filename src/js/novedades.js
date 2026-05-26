export function initNovedades() {
  const bgContainer = document.getElementById('novedades-bg');
  const circlesEl   = document.getElementById('novedades-circles');
  const masBtn      = document.getElementById('novedades-mas');

  if (!bgContainer) return;

  const modules = import.meta.glob(
    '/src/assets/images/novedades/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}',
    { eager: true }
  );
  const images = Object.values(modules).map(m => m.default);

  if (images.length === 0) return;

  // ── Fondo con crossfade si hay varias imágenes ─────────────────────────────
  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'novedades__bg-slide' + (i === 0 ? ' active' : '');
    slide.style.backgroundImage = `url(${src})`;
    bgContainer.appendChild(slide);
  });

  if (images.length > 1) {
    let bgCurrent = 0;
    const bgSlides = bgContainer.querySelectorAll('.novedades__bg-slide');
    setInterval(() => {
      bgSlides[bgCurrent].classList.remove('active');
      bgCurrent = (bgCurrent + 1) % images.length;
      bgSlides[bgCurrent].classList.add('active');
    }, 5000);
  }

  // ── Círculos ───────────────────────────────────────────────────────────────
  images.forEach((src, i) => {
    const btn = document.createElement('button');
    btn.className = 'nov-circle';
    btn.setAttribute('aria-label', `Ver imagen ${i + 1} a pantalla completa`);
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Novedad ${i + 1}`;
    img.loading = 'lazy';
    img.draggable = false;
    btn.appendChild(img);
    circlesEl.appendChild(btn);
    btn.addEventListener('click', () => lbOpen(i));
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <button class="nov-lightbox__prev" aria-label="Anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button class="nov-lightbox__next" aria-label="Siguiente">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <span class="nov-lightbox__counter"></span>
    </div>
  `;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.nov-lightbox__img');
  const lbCounter = lb.querySelector('.nov-lightbox__counter');
  const total     = images.length;
  let lbIndex     = 0;

  if (total === 1) {
    lb.querySelector('.nov-lightbox__prev').style.display = 'none';
    lb.querySelector('.nov-lightbox__next').style.display = 'none';
  }

  function lbOpen(index) {
    lbIndex = ((index % total) + total) % total;
    lbImg.src = images[lbIndex];
    lbCounter.textContent = total > 1 ? `${lbIndex + 1} / ${total}` : '';
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
    lbCounter.textContent = total > 1 ? `${lbIndex + 1} / ${total}` : '';
  }

  masBtn?.addEventListener('click', () => lbOpen(0));
  lb.querySelector('.nov-lightbox__overlay').addEventListener('click', lbClose);
  lb.querySelector('.nov-lightbox__close').addEventListener('click', lbClose);
  lb.querySelector('.nov-lightbox__prev').addEventListener('click', () => lbGo(lbIndex - 1));
  lb.querySelector('.nov-lightbox__next').addEventListener('click', () => lbGo(lbIndex + 1));

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')     lbClose();
    if (e.key === 'ArrowLeft')  lbGo(lbIndex - 1);
    if (e.key === 'ArrowRight') lbGo(lbIndex + 1);
  });

  let lbTouchStart = 0;
  lb.addEventListener('touchstart', e => { lbTouchStart = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - lbTouchStart;
    if (Math.abs(delta) > 40) lbGo(lbIndex + (delta < 0 ? 1 : -1));
  });
}
