import './sass/main.scss';
import { initNav } from './js/nav.js';
import { initHero } from './js/hero.js';
import { initClubBg } from './js/clubBg.js';

initNav();
initHero();
initClubBg();

// Slideshow fondo card equipos
(function () {
  const slides = document.querySelectorAll('.col-card__slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
})();
