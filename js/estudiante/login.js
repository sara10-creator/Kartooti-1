// Kartooti — Login de estudiante
(function () {
  var DOMINIO = '@unimilitar.edu.co';
  var form = document.getElementById('form-login');
  var error = document.getElementById('error');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var correo = form.correo.value.trim().toLowerCase();
    var clave = form.clave.value;

    if (correo.slice(-DOMINIO.length) !== DOMINIO) {
      error.textContent = 'Usa tu correo institucional (' + DOMINIO + ').';
      return;
    }
    if (clave.length < 6) {
      error.textContent = 'La contraseña debe tener mínimo 6 caracteres.';
      return;
    }

    error.textContent = '';
    var boton = form.querySelector('button[type="submit"]');
    boton.disabled = true;
    boton.textContent = 'Iniciando sesión…';
    try {
      var modulo = await import('../supabase.js');
      var supabase = modulo.supabase;
      var resultado = await supabase.auth.signInWithPassword({ email: correo, password: clave });
      if (resultado.error) throw resultado.error;
      var usuario = resultado.data.user;
      var nombre = usuario.user_metadata && usuario.user_metadata.full_name
        ? usuario.user_metadata.full_name
        : correo.split('@')[0];
      localStorage.setItem('kartooti:sesion', JSON.stringify({
        id: usuario.id,
        rol: 'estudiante',
        nombre: nombre,
        correo: usuario.email
      }));
      location.href = 'mapa.html';
    } catch (err) {
      console.error('Error al iniciar sesión con Supabase:', err);
      var detalle = String(err.message || '').toLowerCase();
      if (location.protocol === 'file:') {
        error.textContent = 'Abre la app con Live Server o npm run dev; no ejecutes el HTML directamente.';
      } else if (detalle.indexOf('failed to fetch') !== -1) {
        error.textContent = 'No se pudo conectar con Supabase. Revisa tu conexión a Internet e inténtalo de nuevo.';
      } else if (detalle.indexOf('email not confirmed') !== -1) {
        error.textContent = 'Confirma tu correo electrónico antes de iniciar sesión.';
      } else if (detalle.indexOf('invalid login credentials') !== -1) {
        error.textContent = 'El correo o la contraseña no son correctos.';
      } else {
        error.textContent = 'No fue posible iniciar sesión. Inténtalo de nuevo.';
      }
      boton.disabled = false;
      boton.textContent = 'Entrar';
    }
  });
  form.dataset.authReady = 'true';
})();