// Kartooti — Iniciar sesión, crear cuenta y acceso de invitado
(function () {
  var K = Kartooti;

  function error(id, texto) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = texto;
    el.classList.toggle('es-visible', !!texto);
  }

  function marcar(campos) {
    document.querySelectorAll('.input').forEach(function (i) { i.classList.remove('es-error'); });
    campos.forEach(function (c) { c.classList.add('es-error'); });
    if (campos[0]) campos[0].focus();
  }

  function nombreDesdeCorreo(correo) {
    var base = correo.split('@')[0].replace(/^est\./, '').replace(/[._-]+/g, ' ');
    return base.replace(/\b\w/g, function (l) { return l.toUpperCase(); });
  }

  // ---------- Iniciar sesión ----------
  var login = document.getElementById('form-login');
  if (login) {
    login.addEventListener('submit', function (e) {
      e.preventDefault();
      var correo = login.correo, clave = login.clave;
      if (!correo.value.trim() || !correo.checkValidity()) { marcar([correo]); return error('l-error', 'Escribe un correo válido.'); }
      if (!clave.value) { marcar([clave]); return error('l-error', 'Escribe tu contraseña.'); }
      error('l-error', '');
      K.iniciarSesion({ nombre: nombreDesdeCorreo(correo.value.trim()), correo: correo.value.trim(), rol: 'Estudiante' });
      window.location.href = 'principal.html';
    });
  }

  // ---------- Crear cuenta ----------
  var registro = document.getElementById('form-registro');
  if (registro) {
    registro.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = registro;
      if (!f.nombre.value.trim()) { marcar([f.nombre]); return error('r-error', 'Escribe tu nombre completo.'); }
      if (!f.correo.value.trim() || !f.correo.checkValidity()) { marcar([f.correo]); return error('r-error', 'Escribe un correo electrónico válido.'); }
      if (f.clave.value.length < 6) { marcar([f.clave]); return error('r-error', 'La contraseña debe tener al menos 6 caracteres.'); }
      if (f.clave.value !== f.clave2.value) { marcar([f.clave2]); return error('r-error', 'Las contraseñas no coinciden.'); }
      error('r-error', '');
      K.aviso('¡Cuenta creada! Ahora inicia sesión.');
      setTimeout(function () { window.location.href = 'login.html'; }, 1200);
    });
  }

  // ---------- Acceso invitado ----------
  var invitado = document.getElementById('form-invitado');
  if (invitado) {
    invitado.addEventListener('submit', function (e) {
      e.preventDefault();
      var codigo = invitado.codigo.value.trim();
      if (codigo.length < 4) { marcar([invitado.codigo]); return error('i-error', 'Ingresa un código de invitación válido (mínimo 4 caracteres).'); }
      error('i-error', '');
      K.iniciarSesion({ nombre: 'Invitado', correo: 'Código ' + codigo.toUpperCase(), rol: 'Invitado' });
      window.location.href = 'principal.html';
    });
  }
})();
