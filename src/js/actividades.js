import galeriaData from '../data/galeria.json';

// Rellena la tira de stories con las últimas fotos
const storiesContainer = document.getElementById('acti-hero-stories');
if (storiesContainer) {
  const allFotos = galeriaData.meses.flatMap(m => m.fotos);
  allFotos.slice(-5).forEach(url => {
    const avatar = document.createElement('div');
    avatar.className = 'acti-hero__story';
    avatar.innerHTML = `<img src="${url}" alt="" loading="lazy" />`;
    storiesContainer.appendChild(avatar);
  });
}

function setupZoomModal(btnId, modalId) {
  const btn = document.getElementById(btnId);
  const modal = document.getElementById(modalId);
  if (!btn || !modal) return;

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

setupZoomModal('btn-zoom', 'modal-zoom');
setupZoomModal('btn-zoom-2', 'modal-zoom-2');
