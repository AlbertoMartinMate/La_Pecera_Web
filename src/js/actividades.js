import galeriaData from '../data/galeria.json';

// Rellena el grid del hero con las 6 últimas fotos
const heroPhotos = document.getElementById('acti-hero-photos');
if (heroPhotos) {
  const allFotos = galeriaData.meses.flatMap(m => m.fotos);
  allFotos.slice(-5).forEach(url => {
    const cell = document.createElement('div');
    cell.className = 'acti-hero__photo';
    cell.innerHTML = `<img src="${url}" alt="" loading="lazy" />`;
    heroPhotos.appendChild(cell);
  });
}

const btn = document.getElementById('btn-zoom');
const modal = document.getElementById('modal-zoom');
if (btn && modal) {
  const closeBtn = modal.querySelector('.modal__close');
  const backdrop = modal.querySelector('.modal__backdrop');

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}
