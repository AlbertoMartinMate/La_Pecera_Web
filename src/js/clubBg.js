export function initClubBg() {
  const track = document.querySelector('.carousel__track');
  const dots = document.querySelectorAll('.carousel__dot');
  if (!track || !dots.length) return;

  let current = 0;
  const total = dots.length;

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${100 * current}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  setInterval(() => goTo((current + 1) % total), 4000);
}
