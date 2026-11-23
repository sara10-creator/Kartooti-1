// ==========================================================
// Kartooti — Aviso de cookies y datos de inicio de sesión
//
// Basado en el ejemplo de clase:
//   - La primera vez sale un aviso para aceptar o rechazar las cookies.
//   - La decisión se guarda en la cookie "kartooti_consent" (1 año).
//   - Solo si se aceptan, se guardan datos de inicio de sesión que NO son
//     secretos: nombre, correo, rol y fecha del último acceso (30 días).
//     Nunca se guardan contraseñas ni tokens.
//   - Con esos datos, la próxima vez el correo aparece ya escrito en el
//     login y la app puede saludar por el nombre.
//   - En el pie de página hay un botón "Configurar cookies" para cambiar
//     la decisión o borrar los datos guardados.
// ==========================================================

var KartootiCookies = (function () {
  var CONSENTIMIENTO = 'kartooti_consent';
  var DIAS_CONSENTIMIENTO = 365;
  var DIAS_DATOS = 30;
  // Cookies con datos de inicio de sesión (nada de contraseñas ni tokens)
  var DATOS = ['kartooti_nombre', 'kartooti_correo', 'kartooti_rol', 'kartooti_ultimo_acceso'];

  // ---------- Leer, escribir y borrar cookies ----------
  function escribir(nombre, valor, dias) {
    document.cookie = nombre + '=' + encodeURIComponent(valor) +
      '; Max-Age=' + (dias * 24 * 60 * 60) + '; Path=/; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '');
  }
  function leer(nombre) {
    var par = document.cookie.split(';').map(function (c) { return c.trim(); })
      .filter(function (c) { return c.indexOf(nombre + '=') === 0; })[0];
    return par ? decodeURIComponent(par.slice(nombre.length + 1)) : '';
  }
  function borrar(nombre) {
    document.cookie = nombre + '=; Max-Age=0; Path=/; SameSite=Lax';
  }

  function decision() { return leer(CONSENTIMIENTO); } // 'accepted', 'rejected' o ''
  function aceptadas() { return decision() === 'accepted'; }

  function borrarDatos() { DATOS.forEach(borrar); }

  // ---------- Guardar datos de la sesión (solo con permiso) ----------
  function sesionActual() {
    try { return JSON.parse(localStorage.getItem('kartooti:sesion')) || null; } catch (e) { return null; }
  }

  function guardarSesion(s) {
    if (!aceptadas() || !s) return;
    var rol = String(s.rol || '').toLowerCase();
    if (s.nombre) escribir('kartooti_nombre', s.nombre, DIAS_DATOS);
    // El correo solo se recuerda si es real (los invitados no tienen)
    if (s.correo && s.correo.indexOf('@') !== -1) escribir('kartooti_correo', s.correo, DIAS_DATOS);
    if (rol) escribir('kartooti_rol', rol, DIAS_DATOS);
    // Último acceso: se anota una vez por visita
    var marcado = false;
    try { marcado = sessionStorage.getItem('kartooti:acceso-anotado') === '1'; } catch (e) { /* nada */ }
    if (!marcado) {
      escribir('kartooti_ultimo_acceso', new Date().toISOString(), DIAS_DATOS);
      try { sessionStorage.setItem('kartooti:acceso-anotado', '1'); } catch (e) { /* nada */ }
    }
  }

  // Llena el correo en los formularios de inicio de sesión
  function rellenarLogin() {
    if (!aceptadas()) return;
    var correo = leer('kartooti_correo');
    if (!correo) return;
    ['l-correo', 'correo', 'a-correo'].forEach(function (id) {
      var input = document.getElementById(id);
      if (!input || input.value || input.closest('[data-sin-recordar]')) return;
      // Solo en páginas de inicio de sesión (no en "crear cuenta")
      if (!/login/.test(location.pathname)) return;
      input.value = correo;
      var nota = document.createElement('small');
      nota.className = 'cookies-recordado';
      nota.textContent = 'Recordamos tu correo de tu último ingreso.';
      input.insertAdjacentElement('afterend', nota);
    });
  }

  // Datos guardados, para que otras partes de la app los usen
  function datos() {
    if (!aceptadas()) return null;
    return {
      nombre: leer('kartooti_nombre'),
      correo: leer('kartooti_correo'),
      rol: leer('kartooti_rol'),
      ultimoAcceso: leer('kartooti_ultimo_acceso')
    };
  }

  // ---------- Estilos del aviso ----------
  var CSS = [
    '.cookies{position:fixed;left:50%;bottom:20px;z-index:9990;transform:translateX(-50%);width:min(720px,calc(100vw - 32px));padding:22px 24px;border-radius:20px;background:#fff;color:#1d293d;border:2px solid #025373;box-shadow:0 18px 44px rgba(0,0,0,.25);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}',
    '.cookies[hidden]{display:none}',
    '.cookies__cabeza{display:flex;align-items:center;gap:12px;margin-bottom:8px}',
    '.cookies__icono{font-size:28px;line-height:1}',
    '.cookies__titulo{margin:0;font-size:20px;line-height:26px;font-weight:800;color:#025373}',
    '.cookies__texto{margin:0 0 6px;font-size:15px;line-height:23px;color:#314158}',
    '.cookies__lista{margin:6px 0 14px 20px;padding:0;list-style:disc;font-size:14px;line-height:22px;color:#45556c}',
    '.cookies__botones{display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
    '.cookies__btn{min-height:44px;padding:0 22px;border-radius:12px;font:inherit;font-size:15px;font-weight:700;cursor:pointer}',
    '.cookies__btn--aceptar{border:0;background:#025373;color:#fff}',
    '.cookies__btn--rechazar{border:2px solid #025373;background:#fff;color:#025373}',
    '.cookies__btn--borrar{border:0;background:none;color:#a32d2d;text-decoration:underline;text-underline-offset:3px;padding:0 6px}',
    '.cookies__btn:focus-visible{outline:3px solid #f2ce5e;outline-offset:2px;box-shadow:0 0 0 6px #025373}',
    '.cookies__estado{margin:10px 0 0;font-size:14px;color:#00756a;font-weight:600}',
    '.cookies__error{margin:10px 0 0;font-size:14px;color:#a32d2d;font-weight:600}',
    '.cookies-recordado{display:block;margin-top:6px;font-size:13px;color:#45556c}',
    '.cookies-config{margin-top:8px;padding:6px 0;border:0;background:none;color:inherit;font:inherit;font-size:14px;text-decoration:underline;text-underline-offset:3px;cursor:pointer}',
    // En celular el aviso queda encima del botón de accesibilidad
    '@media (max-width:560px){.cookies{bottom:76px;padding:18px}.cookies__btn{flex:1}}'
  ].join('');

  // ---------- El aviso ----------
  var aviso, btnAceptar, btnRechazar, btnBorrar, error, estado, origenFoco;

  function construir() {
    var estilo = document.createElement('style');
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    aviso = document.createElement('div');
    aviso.className = 'cookies';
    aviso.id = 'aviso-cookies';
    aviso.setAttribute('role', 'dialog');
    aviso.setAttribute('aria-labelledby', 'cookies-titulo');
    aviso.setAttribute('aria-describedby', 'cookies-texto');
    aviso.hidden = true;
    aviso.innerHTML =
      '<div class="cookies__cabeza"><span class="cookies__icono" aria-hidden="true">🍪</span>' +
        '<h2 class="cookies__titulo" id="cookies-titulo">Usamos cookies</h2></div>' +
      '<p class="cookies__texto" id="cookies-texto">Si las aceptas, Kartooti recordará algunos datos de tu inicio de sesión ' +
        'durante 30 días para que entrar sea más rápido:</p>' +
      '<ul class="cookies__lista">' +
        '<li>Tu nombre, para saludarte.</li>' +
        '<li>Tu correo, para que aparezca ya escrito al iniciar sesión.</li>' +
        '<li>Tu tipo de cuenta (estudiante, invitado o administrador) y la fecha de tu último acceso.</li>' +
        '<li><b>Nunca</b> guardamos tu contraseña.</li>' +
      '</ul>' +
      '<div class="cookies__botones">' +
        '<button class="cookies__btn cookies__btn--aceptar" type="button" id="aceptar-cookies">Aceptar cookies</button>' +
        '<button class="cookies__btn cookies__btn--rechazar" type="button" id="rechazar-cookies">Rechazar</button>' +
        '<button class="cookies__btn cookies__btn--borrar" type="button" id="borrar-cookies" hidden>Borrar mis datos guardados</button>' +
      '</div>' +
      '<p class="cookies__estado" id="estado-cookies" role="status" aria-live="polite"></p>' +
      '<p class="cookies__error" id="error-cookies" role="alert" hidden>Tu navegador bloqueó las cookies. Revisa su configuración para poder guardarlas.</p>';
    document.body.appendChild(aviso);

    btnAceptar = aviso.querySelector('#aceptar-cookies');
    btnRechazar = aviso.querySelector('#rechazar-cookies');
    btnBorrar = aviso.querySelector('#borrar-cookies');
    error = aviso.querySelector('#error-cookies');
    estado = aviso.querySelector('#estado-cookies');

    btnAceptar.addEventListener('click', function () {
      escribir(CONSENTIMIENTO, 'accepted', DIAS_CONSENTIMIENTO);
      if (!aceptadas()) { error.hidden = false; return; } // el navegador no las guardó
      guardarSesion(sesionActual());
      cerrar();
    });

    btnRechazar.addEventListener('click', function () {
      escribir(CONSENTIMIENTO, 'rejected', DIAS_CONSENTIMIENTO);
      borrarDatos(); // si antes había aceptado, se borra lo guardado
      cerrar();
    });

    btnBorrar.addEventListener('click', function () {
      borrarDatos();
      estado.textContent = 'Listo: borramos tu nombre, correo, rol y último acceso.';
    });

    document.addEventListener('keydown', function (e) {
      // Escape solo cierra cuando ya hay una decisión (desde "Configurar cookies")
      if (e.key === 'Escape' && !aviso.hidden && decision()) cerrar();
    });
  }

  function abrir() {
    if (!aviso) construir();
    origenFoco = document.activeElement;
    error.hidden = true;
    estado.textContent = decision() === 'accepted' ? 'Ahora mismo las cookies están aceptadas.'
      : decision() === 'rejected' ? 'Ahora mismo las cookies están rechazadas.' : '';
    btnBorrar.hidden = !leer('kartooti_nombre') && !leer('kartooti_correo');
    aviso.hidden = false;
    btnAceptar.focus();
  }

  function cerrar() {
    aviso.hidden = true;
    if (origenFoco && document.contains(origenFoco) && origenFoco !== document.body) origenFoco.focus();
  }

  // Botón "Configurar cookies" en los pies de página
  function ponerEnlaceEnPie() {
    document.querySelectorAll('footer').forEach(function (pie) {
      if (pie.querySelector('.cookies-config')) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cookies-config';
      b.textContent = 'Configurar cookies';
      b.addEventListener('click', abrir);
      var destino = pie.querySelector('.footer__inner') || pie;
      // Mismo color que el texto del pie, para que se lea bien en fondos oscuros o claros
      var muestra = pie.querySelector('p, small, a, span');
      if (muestra) b.style.color = getComputedStyle(muestra).color;
      destino.appendChild(b);
    });
  }

  function iniciar() {
    ponerEnlaceEnPie();
    if (!decision()) {
      // Como en el ejemplo de clase: sin decisión, no queda ningún dato guardado
      borrarDatos();
      abrir();
      return;
    }
    // Cualquier valor distinto de "accepted" (rechazadas o cambiado a mano) borra los datos
    if (!aceptadas()) { borrarDatos(); return; }
    guardarSesion(sesionActual());
    rellenarLogin();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  return { abrir: abrir, aceptadas: aceptadas, datos: datos, guardarSesion: guardarSesion, borrarDatos: borrarDatos };
})();
