// Kartooti — Recuperar la contraseña con Supabase
//
// 1) recuperar.html: la persona escribe su correo y Supabase le envía un enlace.
// 2) El enlace abre restablecer.html con una sesión temporal de recuperación.
// 3) restablecer.html: escribe la contraseña nueva y Supabase la guarda (cifrada).
// La contraseña nunca pasa por nuestro servidor ni se guarda en la app.
import { supabase } from './supabase.js';

function mostrar(id, texto) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.classList.toggle('es-visible', !!texto);
}

function marcar(campos) {
  document.querySelectorAll('.input').forEach(function (i) {
    i.classList.remove('es-error');
    i.removeAttribute('aria-invalid');
  });
  campos.forEach(function (c) {
    c.classList.add('es-error');
    c.setAttribute('aria-invalid', 'true');
  });
  if (campos[0]) campos[0].focus();
}

function ocupado(form, si, texto) {
  var b = form.querySelector('button[type="submit"]');
  if (si) { b.dataset.original = b.textContent; b.textContent = texto; b.disabled = true; }
  else { b.textContent = b.dataset.original || b.textContent; b.disabled = false; }
}

function mensajeDeError(err) {
  var m = String((err && err.message) || '').toLowerCase();
  if (m.indexOf('rate limit') !== -1 || m.indexOf('security purposes') !== -1) return 'Ya pediste un enlace hace poco. Espera unos minutos e inténtalo de nuevo.';
  if (m.indexOf('failed to fetch') !== -1) return 'No se pudo conectar. Revisa tu conexión a Internet.';
  if (m.indexOf('same') !== -1 && m.indexOf('password') !== -1) return 'La contraseña nueva debe ser distinta de la anterior.';
  if (m.indexOf('password') !== -1) return 'La contraseña no cumple los requisitos de seguridad.';
  if (m.indexOf('session') !== -1 || m.indexOf('jwt') !== -1) return 'El enlace ya no es válido. Pide uno nuevo.';
  return 'No fue posible completar la solicitud. Inténtalo de nuevo.';
}

// ---------- 1) Pedir el enlace ----------
var formRec = document.getElementById('form-recuperar');
if (formRec) {
  var guardado = window.KartootiCookies && KartootiCookies.datos && KartootiCookies.datos();
  if (guardado && guardado.correo && !formRec.correo.value) formRec.correo.value = guardado.correo;

  formRec.addEventListener('submit', async function (e) {
    e.preventDefault();
    var correo = formRec.correo;
    mostrar('rec-error', ''); mostrar('rec-ok', '');
    if (!correo.value.trim() || !correo.checkValidity()) { marcar([correo]); return mostrar('rec-error', 'Escribe un correo válido.'); }
    marcar([]);
    ocupado(formRec, true, 'Enviando…');
    try {
      var r = await supabase.auth.resetPasswordForEmail(correo.value.trim().toLowerCase(), {
        redirectTo: location.origin + '/restablecer.html'
      });
      if (r.error) throw r.error;
      // Mismo mensaje exista o no la cuenta, para no revelar qué correos están registrados
      mostrar('rec-ok', 'Listo. Si ese correo tiene una cuenta en Kartooti, te llegará un enlace en unos minutos. Revisa también la carpeta de spam.');
      formRec.reset();
    } catch (err) {
      console.error('Error al pedir la recuperación:', err);
      mostrar('rec-error', mensajeDeError(err));
    }
    ocupado(formRec, false);
  });
  formRec.dataset.authReady = 'true';
}

// ---------- 2) Guardar la contraseña nueva ----------
var formNueva = document.getElementById('form-restablecer');
if (formNueva) {
  var otra = document.getElementById('nueva-otra');
  var hayRecuperacion = false;

  function enlaceInvalido(texto) {
    mostrar('nueva-error', texto || 'Este enlace no es válido o ya venció. Pide uno nuevo.');
    formNueva.querySelector('button[type="submit"]').disabled = true;
    otra.hidden = false;
  }

  // Errores que Supabase pone en la dirección (enlace vencido o ya usado)
  var hash = new URLSearchParams(location.hash.slice(1));
  var errorUrl = hash.get('error_description') || new URLSearchParams(location.search).get('error_description');

  supabase.auth.onAuthStateChange(function (evento, sesion) {
    if (evento === 'PASSWORD_RECOVERY' || (sesion && evento === 'SIGNED_IN')) hayRecuperacion = true;
  });

  if (errorUrl) {
    enlaceInvalido();
  } else {
    // Supabase lee el enlace al cargar; damos un momento y revisamos que haya sesión
    setTimeout(async function () {
      var r = await supabase.auth.getSession();
      if (!(r.data && r.data.session) && !hayRecuperacion) enlaceInvalido();
    }, 800);
  }

  formNueva.addEventListener('submit', async function (e) {
    e.preventDefault();
    var c1 = formNueva.clave, c2 = formNueva.clave2;
    mostrar('nueva-error', '');
    if (c1.value.length < 8) { marcar([c1]); return mostrar('nueva-error', 'La contraseña debe tener al menos 8 caracteres.'); }
    if (c1.value !== c2.value) { marcar([c2]); return mostrar('nueva-error', 'Las contraseñas no coinciden.'); }
    marcar([]);
    ocupado(formNueva, true, 'Guardando…');
    try {
      var r = await supabase.auth.updateUser({ password: c1.value });
      if (r.error) throw r.error;
      formNueva.reset();
      // Cierra la sesión temporal para que entre de nuevo con la contraseña nueva
      await supabase.auth.signOut();
      try { localStorage.removeItem('kartooti:sesion'); } catch (err2) { /* nada */ }
      mostrar('nueva-ok', 'Tu contraseña se cambió. Te llevamos a iniciar sesión…');
      setTimeout(function () { location.href = 'login.html'; }, 2500);
    } catch (err) {
      console.error('Error al cambiar la contraseña:', err);
      mostrar('nueva-error', mensajeDeError(err));
      ocupado(formNueva, false);
    }
  });
  formNueva.dataset.authReady = 'true';
}
