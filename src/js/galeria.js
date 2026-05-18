import galeriaData from '../data/galeria.json';

// ── Tarjeta de mes ─────────────────────────────────────────────────────────────

function buildMonthCard(mes) {
  const preview = mes.fotos.slice(0, 6);
  const collageImgs = preview
    .map(url => `<img src="${url}" alt="" loading="lazy" />`)
    .join('');

  const card = document.createElement('div');
  card.className = 'ganadores__month-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Ver fotos de ${mes.nombre}`);
  card.innerHTML = `
    <div class="ganadores__collage">${collageImgs}</div>
    <div class="ganadores__month-overlay">
      <span class="ganadores__month-name">${mes.nombre}</span>
      <span class="ganadores__month-count">${mes.fotos.length} fotos</span>
      <span class="ganadores__month-cta">
        Ver galería
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </span>
    </div>
  `;
  return card;
}

// ── Modal ──────────────────────────────────────────────────────────────────────

function buildModal() {
  const el = document.createElement('div');
  el.className = 'ganadores__modal';
  el.id = 'ganadores-modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML = `
    <div class="ganadores__modal-backdrop"></div>
    <div class="ganadores__modal-box">

      <!-- Topbar -->
      <div class="ganadores__modal-topbar">
        <div class="ganadores__modal-left">
          <button class="ganadores__back-btn" hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Volver al mosaico
          </button>
          <span class="ganadores__modal-title"></span>
        </div>
        <div class="ganadores__modal-right">
          <span class="ganadores__modal-counter"></span>
          <a class="ganadores__modal-download" href="#" download aria-label="Descargar foto" hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar
          </a>
          <button class="ganadores__modal-close" aria-label="Cerrar">&times;</button>
        </div>
      </div>

      <!-- Vista 1: cuadrícula de miniaturas -->
      <div class="ganadores__thumb-grid"></div>

      <!-- Vista 2: carrusel -->
      <div class="ganadores__carousel" hidden>
        <button class="ganadores__carousel-prev" aria-label="Foto anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="ganadores__carousel-track">
          <img class="ganadores__carousel-img" src="" alt="" />
        </div>
        <button class="ganadores__carousel-next" aria-label="Foto siguiente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

    </div>
  `;
  document.body.appendChild(el);
  return el;
}

// ── Estado ─────────────────────────────────────────────────────────────────────

let modalEl = null;
let currentMes = null;
let currentIndex = 0;

// ── Abrir / cerrar modal ───────────────────────────────────────────────────────

function openModal(mes) {
  currentMes = mes;
  modalEl.querySelector('.ganadores__modal-title').textContent = mes.nombre;
  document.body.style.overflow = 'hidden';
  modalEl.classList.add('is-open');
  showGrid();
}

function closeModal() {
  modalEl.classList.remove('is-open');
  document.body.style.overflow = '';
}

// ── Vista cuadrícula ───────────────────────────────────────────────────────────

function showGrid() {
  const grid      = modalEl.querySelector('.ganadores__thumb-grid');
  const carousel  = modalEl.querySelector('.ganadores__carousel');
  const backBtn   = modalEl.querySelector('.ganadores__back-btn');
  const download  = modalEl.querySelector('.ganadores__modal-download');
  const counter   = modalEl.querySelector('.ganadores__modal-counter');

  carousel.hidden = true;
  grid.hidden = false;
  backBtn.hidden = true;
  download.hidden = true;
  counter.textContent = `${currentMes.fotos.length} fotos`;

  if (grid.childElementCount === 0) {
    currentMes.fotos.forEach((url, i) => {
      const thumb = document.createElement('button');
      thumb.className = 'ganadores__thumb';
      thumb.setAttribute('aria-label', `Ver foto ${i + 1}`);
      thumb.innerHTML = `<img src="${url}" alt="Foto ${i + 1}" loading="lazy" />`;
      thumb.addEventListener('click', () => showCarousel(i));
      grid.appendChild(thumb);
    });
  }
}

// ── Vista carrusel ─────────────────────────────────────────────────────────────

function showCarousel(index) {
  currentIndex = index;

  const grid     = modalEl.querySelector('.ganadores__thumb-grid');
  const carousel = modalEl.querySelector('.ganadores__carousel');
  const backBtn  = modalEl.querySelector('.ganadores__back-btn');
  const download = modalEl.querySelector('.ganadores__modal-download');

  grid.hidden = true;
  carousel.hidden = false;
  backBtn.hidden = false;
  download.hidden = false;

  updateCarousel();
}

function updateCarousel() {
  const img     = modalEl.querySelector('.ganadores__carousel-img');
  const counter = modalEl.querySelector('.ganadores__modal-counter');
  const download = modalEl.querySelector('.ganadores__modal-download');
  const prev    = modalEl.querySelector('.ganadores__carousel-prev');
  const next    = modalEl.querySelector('.ganadores__carousel-next');

  const url = currentMes.fotos[currentIndex];
  img.src = url;
  img.alt = `Foto ${currentIndex + 1}`;
  counter.textContent = `${currentIndex + 1} / ${currentMes.fotos.length}`;

  const filename = url.split('/').pop() || `foto-${currentIndex + 1}`;
  download.href = url;
  download.setAttribute('download', filename);

  prev.disabled = currentIndex === 0;
  next.disabled = currentIndex === currentMes.fotos.length - 1;
}

function navigate(dir) {
  const next = currentIndex + dir;
  if (next < 0 || next >= currentMes.fotos.length) return;

  const img = modalEl.querySelector('.ganadores__carousel-img');
  img.classList.add('is-transitioning');
  setTimeout(() => {
    currentIndex = next;
    updateCarousel();
    img.classList.remove('is-transitioning');
  }, 130);
}

// ── Init ───────────────────────────────────────────────────────────────────────

export function initGaleria() {
  const section = document.getElementById('ganadores');
  if (!section) return;

  const monthsGrid = section.querySelector('.ganadores__months');
  if (!monthsGrid) return;

  const { meses } = galeriaData;
  if (!meses || meses.length === 0) return;

  meses.forEach(mes => {
    if (!mes.fotos.length) return;
    const card = buildMonthCard(mes);
    const open = () => openModal(mes);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') open();
    });
    monthsGrid.appendChild(card);
  });

  modalEl = buildModal();

  // Eventos fijos del modal
  modalEl.querySelector('.ganadores__modal-backdrop').addEventListener('click', closeModal);
  modalEl.querySelector('.ganadores__modal-close').addEventListener('click', closeModal);
  modalEl.querySelector('.ganadores__back-btn').addEventListener('click', showGrid);
  modalEl.querySelector('.ganadores__carousel-prev').addEventListener('click', () => navigate(-1));
  modalEl.querySelector('.ganadores__carousel-next').addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', e => {
    if (!modalEl.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      const carousel = modalEl.querySelector('.ganadores__carousel');
      carousel.hidden ? closeModal() : showGrid();
    }
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}
