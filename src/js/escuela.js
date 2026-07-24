// ── Carrusel de clases ────────────────────────────────────────────────────────

function initCarousel() {
  const carousel = document.querySelector('.escuela-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.escuela-carousel__slide');
  const dots = carousel.querySelectorAll('.escuela-carousel__dot');
  const prevBtn = carousel.querySelector('.escuela-carousel__btn--prev');
  const nextBtn = carousel.querySelector('.escuela-carousel__btn--next');

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  function startAutoplay() {
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  prevBtn.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
  nextBtn.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); });
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

initCarousel();

// ── Modales ───────────────────────────────────────────────────────────────────

function bindModal(btnId, modalId) {
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

bindModal('btn-docs', 'modal-docs');
bindModal('btn-tarifas', 'modal-tarifas');
bindModal('btn-matricula', 'modal-matricula');
