import galeriaData from '../data/galeria.json';

// ── Construye la tarjeta de cada mes con collage ──────────────────────────────

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
      <span class="ganadores__month-count">${mes.fotos.length} foto${mes.fotos.length !== 1 ? 's' : ''}</span>
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

// ── Modal carrusel ────────────────────────────────────────────────────────────

function buildModal() {
  const el = document.createElement('div');
  el.className = 'ganadores__modal';
  el.id = 'ganadores-modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML = `
    <div class="ganadores__modal-backdrop"></div>
    <div class="ganadores__modal-box">
      <div class="ganadores__modal-topbar">
        <div class="ganadores__modal-meta">
          <span class="ganadores__modal-title"></span>
          <span class="ganadores__modal-counter"></span>
        </div>
        <div class="ganadores__modal-actions">
          <a class="ganadores__modal-download btn-primary" href="#" download aria-label="Descargar foto">
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
      <div class="ganadores__carousel">
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

// ── Lógica del carrusel ───────────────────────────────────────────────────────

let modalEl = null;
let currentFotos = [];
let currentIndex = 0;

function openModal(mes, startIndex = 0) {
  currentFotos = mes.fotos;
  currentIndex = startIndex;

  const title   = modalEl.querySelector('.ganadores__modal-title');
  title.textContent = mes.nombre;

  document.body.style.overflow = 'hidden';
  modalEl.classList.add('is-open');
  updateCarousel();
}

function closeModal() {
  modalEl.classList.remove('is-open');
  document.body.style.overflow = '';
}

function updateCarousel() {
  const img      = modalEl.querySelector('.ganadores__carousel-img');
  const counter  = modalEl.querySelector('.ganadores__modal-counter');
  const download = modalEl.querySelector('.ganadores__modal-download');
  const prev     = modalEl.querySelector('.ganadores__carousel-prev');
  const next     = modalEl.querySelector('.ganadores__carousel-next');

  const url = currentFotos[currentIndex];
  img.src = url;
  img.alt = `Foto ${currentIndex + 1}`;
  counter.textContent = `${currentIndex + 1} / ${currentFotos.length}`;

  const filename = url.split('/').pop().split('?')[0] || `foto-${currentIndex + 1}`;
  download.href = url;
  download.setAttribute('download', filename);

  prev.disabled = currentIndex === 0;
  next.disabled = currentIndex === currentFotos.length - 1;
}

function navigate(dir) {
  const next = currentIndex + dir;
  if (next < 0 || next >= currentFotos.length) return;
  currentIndex = next;
  const img = modalEl.querySelector('.ganadores__carousel-img');
  img.classList.add('is-transitioning');
  setTimeout(() => {
    updateCarousel();
    img.classList.remove('is-transitioning');
  }, 150);
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initGaleria() {
  const section = document.getElementById('ganadores');
  if (!section) return;

  const monthsGrid = section.querySelector('.ganadores__months');
  if (!monthsGrid) return;

  const { meses } = galeriaData;
  if (!meses || meses.length === 0) return;

  // Construye tarjetas de mes
  meses.forEach(mes => {
    if (mes.fotos.length === 0) return;
    const card = buildMonthCard(mes);

    const open = () => openModal(mes, 0);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });

    monthsGrid.appendChild(card);
  });

  // Construye modal una sola vez
  modalEl = buildModal();

  // Eventos del modal
  modalEl.querySelector('.ganadores__modal-backdrop').addEventListener('click', closeModal);
  modalEl.querySelector('.ganadores__modal-close').addEventListener('click', closeModal);
  modalEl.querySelector('.ganadores__carousel-prev').addEventListener('click', () => navigate(-1));
  modalEl.querySelector('.ganadores__carousel-next').addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', e => {
    if (!modalEl.classList.contains('is-open')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}
