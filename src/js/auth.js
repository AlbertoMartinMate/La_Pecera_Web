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

    ['', '-m'].forEach(suffix => {
      const btnLogin = document.getElementById('btn-login' + suffix);
      const navUser = document.getElementById('nav-user' + suffix);
      const avatar = document.getElementById('nav-avatar' + suffix);
      const navNombre = document.getElementById('nav-nombre' + suffix);

      if (token) {
        if (btnLogin) btnLogin.style.display = 'none';
        if (navUser) navUser.classList.add('nav__user--visible');
        if (avatar) avatar.src = foto || '';
        if (navNombre) navNombre.textContent = nombre || '';
      } else {
        if (btnLogin) btnLogin.style.display = '';
        if (navUser) navUser.classList.remove('nav__user--visible');
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

  // Wire up desktop and mobile login/logout buttons
  ['', '-m'].forEach(suffix => {
    const btnLogin = document.getElementById('btn-login' + suffix);
    if (btnLogin) btnLogin.addEventListener('click', abrirModal);

    const navUserBtn = document.getElementById('nav-user-btn' + suffix);
    const navUser = document.getElementById('nav-user' + suffix);
    if (navUserBtn && navUser) {
      navUserBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navUser.classList.toggle('nav__user--open');
      });
    }

    const btnLogout = document.getElementById('btn-logout' + suffix);
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        localStorage.removeItem('lp_token');
        localStorage.removeItem('lp_nombre');
        localStorage.removeItem('lp_foto');
        location.reload();
      });
    }
  });

  if (btnClose) btnClose.addEventListener('click', cerrarModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-login__overlay')) cerrarModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
  });

  // Close desktop dropdown on outside click
  document.addEventListener('click', (e) => {
    const navUser = document.getElementById('nav-user');
    if (navUser && !navUser.contains(e.target)) {
      navUser.classList.remove('nav__user--open');
    }
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
