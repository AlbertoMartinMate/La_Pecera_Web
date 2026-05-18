import galeriaData from '../data/galeria.json';

// ── Tarjeta de mes ─────────────────────────────────────────────────────────────

function buildMonthCard(mes) {
  const preview = mes.fotos.slice(0, 6);
  const card = document.createElement('div');
  card.className = 'ganadores__month-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Ver fotos de ${mes.nombre}`);
  card.innerHTML = `
    <div class="ganadores__collage">
      ${preview.map(url => `<div class="ganadores__collage-cell"><img src="${url}" alt="" loading="lazy" /></div>`).join('')}
    </div>
    <div class="ganadores__month-overlay">
      <span class="ganadores__month-name">${mes.nombre}</span>
      <span class="ganadores__month-count">${mes.fotos.length} fotos</span>
    </div>
  `;
  return card;
}

// ── Modal ──────────────────────────────────────────────────────────────────────

function buildModal() {
  const el = document.createElement('div');
  el.className = 'ganadores__modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML = `
    <div class="ganadores__modal-backdrop"></div>
    <div class="ganadores__modal-box">

      <!-- Cabecera grid -->
      <div class="ganadores__modal-header">
        <span class="ganadores__modal-title"></span>
        <button class="ganadores__modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Grid de fotos (estilo galería móvil) -->
      <div class="ganadores__photo-grid"></div>

    </div>

    <!-- Visor pantalla completa (encima de todo) -->
    <div class="ganadores__viewer" hidden>
      <button class="ganadores__viewer-close" aria-label="Cerrar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="ganadores__viewer-img-wrap">
        <img class="ganadores__viewer-img" src="" alt="" />
      </div>
      <div class="ganadores__viewer-bar">
        <button class="ganadores__viewer-prev" aria-label="Anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="ganadores__viewer-center">
          <span class="ganadores__viewer-counter"></span>
          <a class="ganadores__viewer-download" href="#" download aria-label="Descargar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar
          </a>
        </div>
        <button class="ganadores__viewer-next" aria-label="Siguiente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
let currentFotos = [];
let currentIndex = 0;

// ── Modal galería ──────────────────────────────────────────────────────────────

function openGallery(mes) {
  currentFotos = mes.fotos;
  modalEl.querySelector('.ganadores__modal-title').textContent = mes.nombre;

  const grid = modalEl.querySelector('.ganadores__photo-grid');
  grid.innerHTML = '';
  mes.fotos.forEach((url, i) => {
    const btn = document.createElement('button');
    btn.className = 'ganadores__photo-thumb';
    btn.setAttribute('aria-label', `Ver foto ${i + 1}`);
    btn.innerHTML = `<img src="${url}" alt="Foto ${i + 1}" loading="lazy" />`;
    btn.addEventListener('click', () => openViewer(i));
    grid.appendChild(btn);
  });

  document.body.style.overflow = 'hidden';
  modalEl.classList.add('is-open');
}

function closeGallery() {
  modalEl.classList.remove('is-open');
  document.body.style.overflow = '';
}

// ── Visor pantalla completa ────────────────────────────────────────────────────

function openViewer(index) {
  currentIndex = index;
  const viewer = modalEl.querySelector('.ganadores__viewer');
  viewer.hidden = false;
  updateViewer();
}

function closeViewer() {
  const viewer = modalEl.querySelector('.ganadores__viewer');
  viewer.hidden = true;
}

function updateViewer() {
  const url = currentFotos[currentIndex];
  const img = modalEl.querySelector('.ganadores__viewer-img');
  const counter = modalEl.querySelector('.ganadores__viewer-counter');
  const download = modalEl.querySelector('.ganadores__viewer-download');
  const prev = modalEl.querySelector('.ganadores__viewer-prev');
  const next = modalEl.querySelector('.ganadores__viewer-next');

  img.src = url;
  img.alt = `Foto ${currentIndex + 1}`;
  counter.textContent = `${currentIndex + 1} / ${currentFotos.length}`;
  download.href = url;
  download.setAttribute('download', url.split('/').pop() || `foto-${currentIndex + 1}`);

  prev.disabled = currentIndex === 0;
  next.disabled = currentIndex === currentFotos.length - 1;
}

function navigate(dir) {
  const next = currentIndex + dir;
  if (next < 0 || next >= currentFotos.length) return;
  const img = modalEl.querySelector('.ganadores__viewer-img');
  img.style.opacity = '0';
  setTimeout(() => {
    currentIndex = next;
    updateViewer();
    img.style.opacity = '1';
  }, 120);
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
    const open = () => openGallery(mes);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
    monthsGrid.appendChild(card);
  });

  modalEl = buildModal();

  modalEl.querySelector('.ganadores__modal-backdrop').addEventListener('click', closeGallery);
  modalEl.querySelector('.ganadores__modal-close').addEventListener('click', closeGallery);
  modalEl.querySelector('.ganadores__viewer-close').addEventListener('click', () => {
    closeViewer();
    closeGallery();
  });
  modalEl.querySelector('.ganadores__viewer-prev').addEventListener('click', () => navigate(-1));
  modalEl.querySelector('.ganadores__viewer-next').addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', e => {
    if (!modalEl.classList.contains('is-open')) return;
    const viewerOpen = !modalEl.querySelector('.ganadores__viewer').hidden;
    if (e.key === 'Escape') { closeViewer(); closeGallery(); }
    if (viewerOpen && e.key === 'ArrowLeft')  navigate(-1);
    if (viewerOpen && e.key === 'ArrowRight') navigate(1);
  });
}
