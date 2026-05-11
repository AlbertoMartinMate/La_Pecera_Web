export function initHero() {
  const slides = document.querySelectorAll('.hero-slide');

  if (!slides.length) return;

  let current = 0;

  function goSlide(n) {
    slides[current].classList.remove('active');
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  setInterval(() => goSlide(current + 1), 3500);
}
