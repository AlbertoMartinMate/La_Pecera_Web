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

  // Lightbox al hacer clic en la imagen activa
  const lightbox = document.getElementById('carousel-lightbox');
  const lightboxImg = document.getElementById('carousel-lightbox-img');
  const lightboxClose = lightbox.querySelector('.carousel-lightbox__close');
  const lightboxBackdrop = lightbox.querySelector('.carousel-lightbox__backdrop');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    img.addEventListener('click', () => {
      if (slide.classList.contains('is-active')) openLightbox(img.src, img.alt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

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

bindModal('btn-normativa', 'modal-normativa');
bindModal('btn-calendario', 'modal-calendario');
bindModal('btn-tarifas', 'modal-tarifas');
bindModal('btn-matricula', 'modal-matricula');
