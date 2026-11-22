// Kartooti — Iniciar sesión, crear cuenta y acceso de invitado
import { supabase } from './supabase.js';

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

  var DOMINIO = '@unimilitar.edu.co';
  function esInstitucional(correo) {
    return correo.trim().toLowerCase().slice(-DOMINIO.length) === DOMINIO;
  }

  function nombreDesdeCorreo(correo) {
    var base = correo.split('@')[0].replace(/^est\./, '').replace(/[._-]+/g, ' ');
    return base.replace(/\b\w/g, function (l) { return l.toUpperCase(); });
  }

  function nombreDeUsuario(usuario, correo) {
    return usuario.user_metadata && usuario.user_metadata.full_name
      ? usuario.user_metadata.full_name
      : nombreDesdeCorreo(correo);
  }

  function mensajeDeAutenticacion(err) {
    var mensaje = String(err.message || '').toLowerCase();
    if (mensaje.indexOf('invalid login credentials') !== -1) return 'El correo o la contraseña no son correctos.';
    if (mensaje.indexOf('email not confirmed') !== -1) return 'Confirma tu correo electrónico antes de iniciar sesión.';
    if (mensaje.indexOf('already registered') !== -1 || mensaje.indexOf('already been registered') !== -1) return 'Ya existe una cuenta con ese correo.';
    if (mensaje.indexOf('password should be at least') !== -1) return 'La contraseña no cumple los requisitos de seguridad.';
    return 'No fue posible completar la solicitud. Inténtalo de nuevo.';
  }

  function cambiarEstadoBoton(formulario, ocupado, textoOcupado) {
    var boton = formulario.querySelector('button[type="submit"]');
    if (!boton) return;
    if (ocupado) {
      boton.dataset.textoOriginal = boton.textContent;
      boton.disabled = true;
      boton.textContent = textoOcupado;
    } else {
      boton.disabled = false;
      boton.textContent = boton.dataset.textoOriginal || boton.textContent;
      delete boton.dataset.textoOriginal;
    }
  }

  // ---------- Iniciar sesión ----------
  var login = document.getElementById('form-login');
  if (login) {
    login.addEventListener('submit', async function (e) {
      e.preventDefault();
      var correo = login.correo, clave = login.clave;
      if (!correo.value.trim() || !correo.checkValidity()) { marcar([correo]); return error('l-error', 'Escribe un correo válido.'); }
      if (!esInstitucional(correo.value)) { marcar([correo]); return error('l-error', 'Usa tu correo institucional (' + DOMINIO + ').'); }
      if (!clave.value) { marcar([clave]); return error('l-error', 'Escribe tu contraseña.'); }
      error('l-error', '');
      cambiarEstadoBoton(login, true, 'Iniciando sesión…');
      try {
        var resultado = await supabase.auth.signInWithPassword({
          email: correo.value.trim().toLowerCase(),
          password: clave.value
        });
        if (resultado.error) throw resultado.error;
        var usuario = resultado.data.user;
        K.iniciarSesion({
          id: usuario.id,
          nombre: nombreDeUsuario(usuario, correo.value.trim()),
          correo: usuario.email,
          rol: 'Estudiante'
        });
        window.location.href = 'principal.html';
      } catch (err) {
        console.error('Error al iniciar sesión con Supabase:', err);
        error('l-error', mensajeDeAutenticacion(err));
        cambiarEstadoBoton(login, false);
      }
    });
  }

  // ---------- Crear cuenta ----------
  var registro = document.getElementById('form-registro');
  if (registro) {
    registro.addEventListener('submit', async function (e) {
      e.preventDefault();
      var f = registro;
      if (!f.nombre.value.trim()) { marcar([f.nombre]); return error('r-error', 'Escribe tu nombre completo.'); }
      if (!f.correo.value.trim() || !f.correo.checkValidity()) { marcar([f.correo]); return error('r-error', 'Escribe un correo electrónico válido.'); }
      if (!esInstitucional(f.correo.value)) { marcar([f.correo]); return error('r-error', 'Usa tu correo institucional (' + DOMINIO + ').'); }
      if (f.clave.value.length < 6) { marcar([f.clave]); return error('r-error', 'La contraseña debe tener al menos 6 caracteres.'); }
      if (f.clave.value !== f.clave2.value) { marcar([f.clave2]); return error('r-error', 'Las contraseñas no coinciden.'); }
      error('r-error', '');
      cambiarEstadoBoton(registro, true, 'Creando cuenta…');
      try {
        var resultado = await supabase.auth.signUp({
          email: f.correo.value.trim().toLowerCase(),
          password: f.clave.value,
          options: {
            emailRedirectTo: new URL('login.html', window.location.href).href,
            data: { full_name: f.nombre.value.trim() }
          }
        });
        if (resultado.error) throw resultado.error;

        if (resultado.data.session && resultado.data.user) {
          K.iniciarSesion({
            id: resultado.data.user.id,
            nombre: f.nombre.value.trim(),
            correo: resultado.data.user.email,
            rol: 'Estudiante'
          });
          window.location.href = 'principal.html';
          return;
        }

        K.aviso('Cuenta creada. Revisa tu correo para confirmar el registro.');
        setTimeout(function () { window.location.href = 'login.html'; }, 2500);
      } catch (err) {
        console.error('Error al crear la cuenta con Supabase:', err);
        error('r-error', mensajeDeAutenticacion(err));
        cambiarEstadoBoton(registro, false);
      }
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
