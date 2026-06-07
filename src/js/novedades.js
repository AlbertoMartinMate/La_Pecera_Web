import novedadesData from '../data/novedades.json';

export function initNovedades() {
  const bgContainer = document.getElementById('novedades-bg');
  const circlesEl   = document.getElementById('novedades-circles');
  const masBtn      = document.getElementById('novedades-mas');

  if (!bgContainer) return;

  // Resolve image URLs via Vite glob, keyed by filename
  const modules = import.meta.glob(
    '/src/assets/images/novedades/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}',
    { eager: true }
  );
  const imageMap = {};
  for (const [path, mod] of Object.entries(modules)) {
    const filename = path.split('/').pop();
    imageMap[filename] = mod.default;
  }

  // Build items merging JSON metadata with resolved image URLs
  const items = novedadesData
    .map(item => ({ ...item, src: imageMap[item.imagen] }))
    .filter(item => item.src);

  if (items.length === 0) return;

  // ── Fondo con crossfade si hay varias imágenes ─────────────────────────────
  items.forEach(({ src }, i) => {
    const slide = document.createElement('div');
    slide.className = 'novedades__bg-slide' + (i === 0 ? ' active' : '');
    slide.style.backgroundImage = `url(${src})`;
    bgContainer.appendChild(slide);
  });

  if (items.length > 1) {
    let bgCurrent = 0;
    const bgSlides = bgContainer.querySelectorAll('.novedades__bg-slide');
    setInterval(() => {
      bgSlides[bgCurrent].classList.remove('active');
      bgCurrent = (bgCurrent + 1) % items.length;
      bgSlides[bgCurrent].classList.add('active');
    }, 5000);
  }

  // ── Círculos ───────────────────────────────────────────────────────────────
  items.forEach(({ src, titulo }, i) => {
    const btn = document.createElement('button');
    btn.className = 'nov-circle';
    btn.setAttribute('aria-label', titulo ? `Ver: ${titulo}` : `Ver imagen ${i + 1}`);
    const img = document.createElement('img');
    img.src = src;
    img.alt = titulo || `Novedad ${i + 1}`;
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
      <div class="nov-lightbox__info">
        <h3 class="nov-lightbox__titulo"></h3>
        <p class="nov-lightbox__descripcion"></p>
        <a class="nov-lightbox__boton" href="" target="_blank" rel="noopener noreferrer"></a>
      </div>
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

  const lbImg         = lb.querySelector('.nov-lightbox__img');
  const lbInfo        = lb.querySelector('.nov-lightbox__info');
  const lbTitulo      = lb.querySelector('.nov-lightbox__titulo');
  const lbDescripcion = lb.querySelector('.nov-lightbox__descripcion');
  const lbBoton       = lb.querySelector('.nov-lightbox__boton');
  const lbCounter     = lb.querySelector('.nov-lightbox__counter');
  const total         = items.length;
  let lbIndex         = 0;

  if (total === 1) {
    lb.querySelector('.nov-lightbox__prev').style.display = 'none';
    lb.querySelector('.nov-lightbox__next').style.display = 'none';
  }

  function buildBotonHref(boton) {
    if (!boton) return '';
    if (boton.tipo === 'whatsapp') {
      return `https://wa.me/${boton.valor}?text=Hola%2C%20me%20interesa%20esta%20novedad`;
    }
    return boton.valor;
  }

  function lbRender(index) {
    const item = items[index];
    lbImg.src = item.src;
    lbImg.alt = item.titulo || `Novedad ${index + 1}`;
    lbCounter.textContent = total > 1 ? `${index + 1} / ${total}` : '';

    lbTitulo.textContent = item.titulo || '';
    lbDescripcion.textContent = item.descripcion || '';

    if (item.boton) {
      lbBoton.textContent = item.boton.texto;
      lbBoton.href = buildBotonHref(item.boton);
      lbBoton.style.display = '';
    } else {
      lbBoton.style.display = 'none';
    }

    const hasInfo = item.titulo || item.descripcion || item.boton;
    lbInfo.style.display = hasInfo ? '' : 'none';
  }

  function lbOpen(index) {
    lbIndex = ((index % total) + total) % total;
    lbRender(lbIndex);
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
    lbRender(lbIndex);
  }

  masBtn?.addEventListener('click', () => lbOpen(0));

  const verBtn = document.getElementById('news-bar-ver');
  verBtn?.addEventListener('click', e => { e.preventDefault(); lbOpen(0); });
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
