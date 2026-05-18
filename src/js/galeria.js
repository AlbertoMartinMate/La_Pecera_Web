const CLOUD_NAME = 'deymoyy1z';
const MONTHS = [
  { id: 'mayo-2025', label: 'Mayo 2025' },
];

function buildThumbUrl(publicId) {
  return `https://res.cloudinary.com/deymoyy1z/image/upload/q_auto,f_auto,w_600/${publicId}`;
}

function buildOriginalUrl(publicId) {
  return `https://res.cloudinary.com/deymoyy1z/image/upload/${publicId}`;
}

async function fetchPhotos(monthId) {
  const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${monthId}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.resources || [];
}

function renderFilters(container, activeMonth, onSelect) {
  container.innerHTML = '';
  MONTHS.forEach(({ id, label }) => {
    const btn = document.createElement('button');
    btn.className = 'ganadores__filter-btn' + (id === activeMonth ? ' is-active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => onSelect(id));
    container.appendChild(btn);
  });
}

function renderGrid(grid, photos) {
  grid.innerHTML = '';

  if (photos.length === 0) {
    grid.innerHTML = '<p class="ganadores__empty">No hay fotos disponibles para este mes.</p>';
    return;
  }

  photos.forEach((photo) => {
    const thumb = buildThumbUrl(photo.public_id);
    const original = buildOriginalUrl(photo.public_id);
    const filename = photo.public_id.split('/').pop();

    const card = document.createElement('div');
    card.className = 'ganadores__card';
    card.innerHTML = `
      <img src="${thumb}" alt="Ganador del mes" loading="lazy" />
      <div class="ganadores__card-overlay">
        <a
          class="ganadores__download"
          href="${original}"
          download="${filename}.jpg"
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

function renderSkeleton(grid, count = 6) {
  grid.innerHTML = Array.from({ length: count })
    .map(() => '<div class="ganadores__card ganadores__card--skeleton"></div>')
    .join('');
}

export function initGaleria() {
  const section = document.getElementById('ganadores');
  if (!section) return;

  const filtersContainer = section.querySelector('.ganadores__filters');
  const grid = section.querySelector('.ganadores__grid');
  const errorMsg = section.querySelector('.ganadores__error');

  let activeMonth = MONTHS[0].id;

  async function loadMonth(monthId) {
    activeMonth = monthId;
    renderFilters(filtersContainer, activeMonth, loadMonth);
    renderSkeleton(grid);
    if (errorMsg) errorMsg.hidden = true;

    try {
      const photos = await fetchPhotos(monthId);
      renderGrid(grid, photos);
    } catch (err) {
      grid.innerHTML = '';
      if (errorMsg) {
        errorMsg.hidden = false;
        errorMsg.textContent = 'No se pudieron cargar las fotos. Inténtalo de nuevo.';
      }
      console.error('[Galería]', err);
    }
  }

  renderFilters(filtersContainer, activeMonth, loadMonth);
  loadMonth(activeMonth);
}
