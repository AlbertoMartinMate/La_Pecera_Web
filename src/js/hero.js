export function initHero() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');

  if (!slides.length) return;

  let current = 0;

  function goSlide(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  setInterval(() => goSlide(current + 1), 3500);
  window.goSlide = goSlide;
}
