// ==========================================================
// Kartooti — piezas compartidas: encabezado, pie de página,
// sesión del usuario, tarjeta "Mi cuenta", ventanas y avisos
// ==========================================================

var Kartooti = (function () {
  var raiz = document.body.getAttribute('data-raiz') || '';

  // ---------- Sesión ----------
  function sesion() {
    try { return JSON.parse(localStorage.getItem('kartooti:sesion')) || null; } catch (e) { return null; }
  }
  function iniciarSesion(datos) {
    try { localStorage.setItem('kartooti:sesion', JSON.stringify(datos)); } catch (e) { /* sin almacenamiento */ }
  }
  function cerrarSesion() {
    try { localStorage.removeItem('kartooti:sesion'); } catch (e) { /* sin almacenamiento */ }
  }

  // ---------- Utilidades ----------
  function esc(t) {
    return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function normal(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  var ICONO_PERSONA = '<svg width="38" height="49" viewBox="0 0 19 24" fill="none" aria-hidden="true"><path d="M13.9922 5.83008C13.9922 7.06707 13.5008 8.25339 12.6261 9.12808C11.7514 10.0028 10.5651 10.4941 9.32813 10.4941C8.09115 10.4941 6.90482 10.0028 6.03014 9.12808C5.15546 8.25339 4.66407 7.06707 4.66407 5.83008C4.66407 4.59309 5.15546 3.40677 6.03014 2.53209C6.90482 1.65741 8.09115 1.16602 9.32813 1.16602C10.5651 1.16602 11.7514 1.65741 12.6261 2.53209C13.5008 3.40677 13.9922 4.59309 13.9922 5.83008ZM9.32813 13.9922C7.1634 13.9922 5.08734 14.8521 3.55664 16.3828C2.02595 17.9135 1.16602 19.9896 1.16602 22.1543H17.4902C17.4902 19.9896 16.6303 17.9135 15.0996 16.3828C13.5689 14.8521 11.4929 13.9922 9.32813 13.9922Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---------- Encabezado de las páginas con sesión ----------
  function pintarEncabezado() {
    var cont = document.getElementById('encabezado');
    if (!cont) return;
    var s = sesion() || { nombre: 'Invitado', correo: '—', rol: 'Invitado' };
    cont.className = 'header';
    cont.innerHTML =
      '<a class="marca" href="' + raiz + 'principal.html" aria-label="Kartooti, ir al inicio">' +
        '<img src="' + raiz + 'assets/img/logo.png" alt="">' +
        '<span>Kartooti</span>' +
      '</a>' +
      '<div class="header__acciones">' +
        '<button class="btn-usuario" type="button" id="btn-cuenta" aria-haspopup="dialog" aria-expanded="false">' +
          '<img src="' + raiz + 'assets/icons/user.svg" width="16" height="21" alt="">' +
          '<span>' + esc(primerNombre(s.nombre)) + '</span>' +
        '</button>' +
        '<a class="btn-salir" href="' + raiz + 'login.html" data-salir>' +
          '<img src="' + raiz + 'assets/icons/salir.svg" width="35" height="31" alt="">Salir' +
        '</a>' +
      '</div>';

    // Tarjeta "Mi cuenta"
    var tarjeta = document.createElement('div');
    tarjeta.className = 'cuenta';
    tarjeta.id = 'tarjeta-cuenta';
    tarjeta.setAttribute('role', 'dialog');
    tarjeta.setAttribute('aria-label', 'Mi cuenta');
    tarjeta.innerHTML =
      '<button class="btn-cerrar" type="button" aria-label="Cerrar"><img src="' + raiz + 'assets/icons/cerrar-x.png" alt=""></button>' +
      '<div class="cuenta__cabeza">' + ICONO_PERSONA +
        '<div><p class="cuenta__nombre">' + esc(s.nombre) + '</p><p class="cuenta__correo">' + esc(s.correo) + '</p></div>' +
      '</div>' +
      '<p class="cuenta__dato">Rol: ' + esc(s.rol) + '</p>' +
      '<p class="cuenta__dato">Estado: Activo</p>' +
      '<a class="cuenta__salir" href="' + raiz + 'index.html" data-salir>Cerrar sesión</a>';
    document.body.appendChild(tarjeta);

    var btn = document.getElementById('btn-cuenta');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var abierta = tarjeta.classList.toggle('esta-abierto');
      btn.setAttribute('aria-expanded', abierta ? 'true' : 'false');
    });
    tarjeta.querySelector('.btn-cerrar').addEventListener('click', function () {
      tarjeta.classList.remove('esta-abierto');
      btn.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('click', function (e) {
      if (tarjeta.classList.contains('esta-abierto') && !tarjeta.contains(e.target)) {
        tarjeta.classList.remove('esta-abierto');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function primerNombre(n) {
    return String(n || 'usuario').split(' ')[0];
  }

  // ---------- Pie de página ----------
  function pintarPie() {
    var cont = document.getElementById('pie');
    if (!cont) return;
    var inicio = raiz + 'index.html';
    cont.className = 'footer';
    cont.innerHTML =
      '<div class="footer__inner">' +
        '<img class="footer__logo" src="' + raiz + 'assets/img/logo.png" alt="">' +
        '<div class="footer__marca"><b>Kartooti</b><small>Contigo desde el primer semestre</small></div>' +
        '<nav class="footer__links" aria-label="Enlaces del pie de página">' +
          '<a href="' + inicio + '#que-es">¿Qué es?</a>' +
          '<a href="' + inicio + '#funciones">Funciones</a>' +
          '<a href="' + inicio + '#como-usarla">Cómo usarla</a>' +
          '<a href="' + inicio + '#acceso">Acceso</a>' +
        '</nav>' +
        '<p class="footer__copy">© 2026 Kartooti · Hecho con 💙 por estudiantes</p>' +
      '</div>';
  }

  // ---------- Ventanas emergentes ----------
  function abrirModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.add('esta-abierto');
    m.setAttribute('aria-hidden', 'false');
    var foco = m.querySelector('input, select, textarea, button:not(.btn-cerrar)') || m.querySelector('button');
    if (foco) setTimeout(function () { foco.focus(); }, 40);
  }
  function cerrarModal(m) {
    if (typeof m === 'string') m = document.getElementById(m);
    if (!m) return;
    m.classList.remove('esta-abierto');
    m.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('click', function (e) {
    var cerrar = e.target.closest('[data-cerrar]');
    if (cerrar) cerrarModal(cerrar.closest('.modal'));
    if (e.target.classList && e.target.classList.contains('modal')) cerrarModal(e.target);
    var salir = e.target.closest('[data-salir]');
    if (salir) cerrarSesion();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal.esta-abierto').forEach(cerrarModal);
    var t = document.getElementById('tarjeta-cuenta');
    if (t) t.classList.remove('esta-abierto');
  });

  // ---------- Aviso ----------
  var temporizador;
  function aviso(texto) {
    var el = document.querySelector('.aviso');
    if (!el) {
      el = document.createElement('div');
      el.className = 'aviso';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = texto;
    el.classList.add('es-visible');
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { el.classList.remove('es-visible'); }, 2400);
  }

  pintarEncabezado();
  pintarPie();

  return {
    raiz: raiz,
    sesion: sesion,
    iniciarSesion: iniciarSesion,
    cerrarSesion: cerrarSesion,
    abrirModal: abrirModal,
    cerrarModal: cerrarModal,
    aviso: aviso,
    esc: esc,
    normal: normal
  };
})();
