export function initAuth() {
  const modal = document.getElementById('modal-login');
  if (!modal) return;

  const btnClose = document.getElementById('modal-login-close');
  const formLogin = document.getElementById('form-login');
  const loginError = document.getElementById('login-error');

  function actualizarNav() {
    const token = localStorage.getItem('lp_token');
    const nombre = localStorage.getItem('lp_nombre');
    const foto = localStorage.getItem('lp_foto');

    // Ocultar/mostrar todos los botones de login (desktop + móvil)
    document.querySelectorAll('.nav__login').forEach(btn => {
      btn.style.display = token ? 'none' : '';
    });

    // Mostrar/ocultar todos los bloques de usuario (desktop + móvil)
    // Usamos style.display para garantizar prioridad sobre cualquier CSS
    document.querySelectorAll('.nav__user').forEach(navUser => {
      navUser.style.display = token ? 'block' : 'none';
      if (token) {
        const avatar = navUser.querySelector('.nav__avatar');
        const nombreEl = navUser.querySelector('.nav__user-btn span');
        if (avatar) avatar.src = foto || '';
        if (nombreEl) nombreEl.textContent = nombre || '';
      }
    });
  }

  function abrirModal() {
    modal.classList.add('modal-login--open');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    modal.classList.remove('modal-login--open');
    document.body.style.overflow = '';
    if (loginError) loginError.textContent = '';
  }

  // Botones "Iniciar sesión" (desktop + móvil)
  document.querySelectorAll('.nav__login').forEach(btn => {
    btn.addEventListener('click', abrirModal);
  });

  // Botones "Cerrar sesión" (desktop + móvil)
  document.querySelectorAll('[id^="btn-logout"]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('lp_token');
      localStorage.removeItem('lp_nombre');
      localStorage.removeItem('lp_foto');
      location.reload();
    });
  });

  if (btnClose) btnClose.addEventListener('click', cerrarModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-login__overlay')) cerrarModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
  });

  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = formLogin.email.value;
      const password = formLogin.password.value;

      if (loginError) loginError.textContent = '';
      const submitBtn = formLogin.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch('https://app.lapecerapadelclub.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('lp_token', data.token);
          localStorage.setItem('lp_nombre', data.nombre || data.name || '');
          localStorage.setItem('lp_foto', data.foto || data.avatar || '');
          actualizarNav();
          cerrarModal();
        } else {
          if (loginError) loginError.textContent = 'Email o contraseña incorrectos';
        }
      } catch {
        if (loginError) loginError.textContent = 'Email o contraseña incorrectos';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  actualizarNav();
}
