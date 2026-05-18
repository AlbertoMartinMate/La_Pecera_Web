import galeriaData from '../data/galeria.json';

// Rellena la tira de stories con las últimas fotos
const storiesContainer = document.getElementById('acti-hero-stories');
if (storiesContainer) {
  const allFotos = galeriaData.meses.flatMap(m => m.fotos);
  allFotos.slice(-6).forEach(url => {
    const avatar = document.createElement('div');
    avatar.className = 'acti-hero__story';
    avatar.innerHTML = `<img src="${url}" alt="" loading="lazy" />`;
    storiesContainer.appendChild(avatar);
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
