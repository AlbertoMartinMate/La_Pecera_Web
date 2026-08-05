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

// ── Carrusel de carteles ──────────────────────────────────────────────────────
// Para añadir una imagen: añadir el nombre de archivo al array.
// Para borrar: eliminar del array y borrar el archivo de src/assets/images/actividades/.

const carteles = [
  'actividades-hero.jpeg',
  'actividades-hero-2.jpeg',
];

// Resuelve rutas con hash de Vite en producción
const cartelesModules = import.meta.glob(
  '/src/assets/images/actividades/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}',
  { eager: true }
);
const cartelesMap = {};
for (const [path, mod] of Object.entries(cartelesModules)) {
  cartelesMap[path.split('/').pop()] = mod.default;
}

function initCarousel() {
  const section = document.getElementById('acti-carousel');
  if (!section || carteles.length === 0) return;

  const srcs = carteles.map(f => cartelesMap[f]).filter(Boolean);
  if (srcs.length === 0) return;

  const arrow = (dir) => `
    <button class="acti-carousel__arrow acti-carousel__arrow--${dir}" aria-label="${dir === 'prev' ? 'Imagen anterior' : 'Imagen siguiente'}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="${dir === 'prev' ? '15 18 9 12 15 6' : '9 6 15 12 9 18'}"/>
      </svg>
    </button>`;

  section.innerHTML = `
    <div class="acti-carousel__viewport">
      <div class="acti-carousel__track">
        ${srcs.map((src, i) => `
          <div class="acti-carousel__slide" aria-hidden="${i !== 0}">
            <img src="${src}" alt="Actividades en La Pecera Pádel Club" loading="${i === 0 ? 'eager' : 'lazy'}" />
          </div>`).join('')}
      </div>
      ${arrow('prev')}
      ${arrow('next')}
    </div>
    <div class="acti-carousel__dots">
      ${srcs.map((_, i) => `<button class="acti-carousel__dot${i === 0 ? ' is-active' : ''}" aria-label="Ir a imagen ${i + 1}"></button>`).join('')}
    </div>`;

  let current = 0;
  let timer = null;
  const track = section.querySelector('.acti-carousel__track');
  const slides = [...section.querySelectorAll('.acti-carousel__slide')];
  const dots = [...section.querySelectorAll('.acti-carousel__dot')];

  function goTo(index) {
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('is-active');
    current = (index + srcs.length) % srcs.length;
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('is-active');
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  const start = () => { timer = setInterval(() => goTo(current + 1), 5000); };
  const stop = () => clearInterval(timer);

  section.querySelector('.acti-carousel__arrow--prev').addEventListener('click', () => { stop(); goTo(current - 1); start(); });
  section.querySelector('.acti-carousel__arrow--next').addEventListener('click', () => { stop(); goTo(current + 1); start(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stop(); goTo(i); start(); }));
  section.addEventListener('mouseenter', stop);
  section.addEventListener('mouseleave', start);

  // Lightbox al hacer clic en la imagen
  const lightbox = document.getElementById('carousel-lightbox');
  const lightboxImg = document.getElementById('carousel-lightbox-img');

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

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  lightbox.querySelector('.carousel-lightbox__close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.carousel-lightbox__backdrop').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  start();
}

initCarousel();
