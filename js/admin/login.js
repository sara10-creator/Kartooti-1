(function () {
  var form = document.getElementById('form-admin');
  var mensaje = document.getElementById('a-error');
  var boton = form.querySelector('button[type="submit"]');

  function error(texto) {
    mensaje.textContent = texto;
    mensaje.classList.toggle('es-visible', !!texto);
  }

  function textoError(err) {
    var detalle = String(err.message || '').toLowerCase();
    if (location.protocol === 'file:') return 'Abre la app con Live Server o npm run dev; no ejecutes el HTML directamente.';
    if (detalle.indexOf('failed to fetch') !== -1) return 'No se pudo conectar con Supabase. Revisa tu conexión a Internet e inténtalo de nuevo.';
    if (detalle.indexOf('invalid login credentials') !== -1) return 'El correo o la contraseña no son correctos.';
    if (detalle.indexOf('email not confirmed') !== -1) return 'Confirma tu correo antes de iniciar sesión.';
    if (err.code === 'PGRST205' || err.code === '42P01') return 'Falta aplicar la migración de perfiles de Supabase.';
    return 'No fue posible validar el acceso administrativo. Inténtalo de nuevo.';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    form.correo.classList.remove('es-error');
    form.clave.classList.remove('es-error');
    if (!form.correo.value.trim() || !form.correo.checkValidity()) {
      form.correo.classList.add('es-error');
      form.correo.focus();
      error('Escribe un correo válido.');
      return;
    }
    if (!form.clave.value) {
      form.clave.classList.add('es-error');
      form.clave.focus();
      error('Escribe tu contraseña.');
      return;
    }

    error('');
    boton.disabled = true;
    boton.textContent = 'Validando…';
    try {
      var modulo = await import('../supabase.js');
      var supabase = modulo.supabase;
      var acceso = await supabase.auth.signInWithPassword({
        email: form.correo.value.trim().toLowerCase(),
        password: form.clave.value
      });
      if (acceso.error) throw acceso.error;

      var consulta = await supabase
  .from('Kartooti registros')
  .select('Nombre_estudiante, rol')
  .eq('user_id', acceso.data.user.id)
  .maybeSingle();
if (consulta.error) throw consulta.error;

if (!consulta.data || consulta.data.rol !== 'admin') {
  // ... (igual que ahora)
}

Kartooti.iniciarSesion({
  id: acceso.data.user.id,
  nombre: consulta.data.Nombre_estudiante,
  correo: acceso.data.user.email,
  rol: 'Administrador'
});
      window.location.href = 'index.html';
    } catch (err) {
      console.error('Error en el acceso administrativo:', err);
      error(textoError(err));
    } finally {
      boton.disabled = false;
      boton.textContent = 'Iniciar sesión';
    }
  });
  form.dataset.authReady = 'true';
})();
