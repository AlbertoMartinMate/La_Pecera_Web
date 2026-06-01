import fotosData from '../data/fotos-club.json';

let filtered = [];
let currentIndex = 0;
let viewerEl = null;

// ── Filtro por mes ─────────────────────────────────────────────────────────────

function buildFilter(meses) {
  const filterEl = document.querySelector('.fotos-filter');
  if (!filterEl) return;

  const allBtn = document.createElement('button');
  allBtn.className = 'fotos-filter__btn fotos-filter__btn--active';
  allBtn.textContent = 'Todos';
  allBtn.addEventListener('click', () => {
    applyFilter(null, allBtn);
  });
  filterEl.appendChild(allBtn);

  meses.forEach(mes => {
    if (!mes.fotos.length) return;
    const btn = document.createElement('button');
    btn.className = 'fotos-filter__btn';
    btn.textContent = mes.nombre;
    btn.addEventListener('click', () => applyFilter(mes.slug, btn));
    filterEl.appendChild(btn);
  });
}

function applyFilter(slug, activeBtn) {
  document.querySelectorAll('.fotos-filter__btn').forEach(b =>
    b.classList.remove('fotos-filter__btn--active')
  );
  activeBtn.classList.add('fotos-filter__btn--active');

  const fotos = slug
    ? (fotosData.meses.find(m => m.slug === slug)?.fotos ?? [])
    : fotosData.meses.flatMap(m => m.fotos);

  renderGrid(fotos);
}

// ── Grid de fotos ──────────────────────────────────────────────────────────────

function renderGrid(fotos) {
  filtered = fotos;
  const grid = document.getElementById('fotos-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!fotos.length) {
    grid.innerHTML = '<p class="fotos-empty">Aún no hay fotos en esta sección. ¡Pronto!</p>';
    return;
  }

  fotos.forEach((url, i) => {
    const btn = document.createElement('button');
    btn.className = 'fotos-grid__thumb';
    btn.setAttribute('aria-label', `Ver foto ${i + 1}`);
    btn.innerHTML = `<img src="${url}" alt="Foto ${i + 1}" loading="lazy" />`;
    btn.addEventListener('click', () => openViewer(i));
    grid.appendChild(btn);
  });
}

// ── Visor / lightbox ───────────────────────────────────────────────────────────

function buildViewer() {
  const el = document.createElement('div');
  el.className = 'ganadores__viewer';
  el.hidden = true;
  el.innerHTML = `
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
  `;
  document.body.appendChild(el);
  return el;
}

function openViewer(index) {
  currentIndex = index;
  viewerEl.hidden = false;
  document.body.style.overflow = 'hidden';
  updateViewer();
}

function closeViewer() {
  viewerEl.hidden = true;
  document.body.style.overflow = '';
}

function updateViewer() {
  const url = filtered[currentIndex];
  viewerEl.querySelector('.ganadores__viewer-img').src = url;
  viewerEl.querySelector('.ganadores__viewer-counter').textContent =
    `${currentIndex + 1} / ${filtered.length}`;
  const dl = viewerEl.querySelector('.ganadores__viewer-download');
  dl.href = url;
  dl.setAttribute('download', url.split('/').pop() || `foto-${currentIndex + 1}`);
  viewerEl.querySelector('.ganadores__viewer-prev').disabled = currentIndex === 0;
  viewerEl.querySelector('.ganadores__viewer-next').disabled = currentIndex === filtered.length - 1;
}

function navigate(dir) {
  const next = currentIndex + dir;
  if (next < 0 || next >= filtered.length) return;
  const img = viewerEl.querySelector('.ganadores__viewer-img');
  img.style.opacity = '0';
  setTimeout(() => {
    currentIndex = next;
    updateViewer();
    img.style.opacity = '1';
  }, 120);
}

// ── Init ───────────────────────────────────────────────────────────────────────

export function initFotos() {
  const section = document.getElementById('fotos-club');
  if (!section) return;

  const { meses } = fotosData;
  const allFotos = meses.flatMap(m => m.fotos);

  buildFilter(meses);
  renderGrid(allFotos);

  viewerEl = buildViewer();

  viewerEl.querySelector('.ganadores__viewer-close').addEventListener('click', closeViewer);
  viewerEl.querySelector('.ganadores__viewer-prev').addEventListener('click', () => navigate(-1));
  viewerEl.querySelector('.ganadores__viewer-next').addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', e => {
    if (viewerEl.hidden) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}
