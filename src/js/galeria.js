import galeriaData from '../data/galeria.json';

function renderFilters(container, meses, activeSlug, onSelect) {
  container.innerHTML = '';
  meses.forEach(({ nombre, slug }) => {
    const btn = document.createElement('button');
    btn.className = 'ganadores__filter-btn' + (slug === activeSlug ? ' is-active' : '');
    btn.textContent = nombre;
    btn.addEventListener('click', () => onSelect(slug));
    container.appendChild(btn);
  });
}

function renderGrid(grid, fotos) {
  grid.innerHTML = '';

  if (!fotos || fotos.length === 0) {
    grid.innerHTML = '<p class="ganadores__empty">No hay fotos disponibles para este mes.</p>';
    return;
  }

  fotos.forEach((url, i) => {
    const filename = url.split('/').pop().split('?')[0] || `foto-${i + 1}`;

    const card = document.createElement('div');
    card.className = 'ganadores__card';
    card.innerHTML = `
      <img src="${url}" alt="Foto ganadores mes ${i + 1}" loading="lazy" />
      <div class="ganadores__card-overlay">
        <a
          class="ganadores__download"
          href="${url}"
          download="${filename}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Descargar foto"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Descargar
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

export function initGaleria() {
  const section = document.getElementById('ganadores');
  if (!section) return;

  const filtersContainer = section.querySelector('.ganadores__filters');
  const grid = section.querySelector('.ganadores__grid');

  const { meses } = galeriaData;

  if (!meses || meses.length === 0) {
    grid.innerHTML = '<p class="ganadores__empty">No hay meses disponibles.</p>';
    return;
  }

  let activeSlug = meses[0].slug;

  function showMes(slug) {
    activeSlug = slug;
    renderFilters(filtersContainer, meses, activeSlug, showMes);
    const mes = meses.find(m => m.slug === slug);
    renderGrid(grid, mes ? mes.fotos : []);
  }

  showMes(activeSlug);
}
