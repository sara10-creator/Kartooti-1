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
    // Justo después del encabezado: así, con Tab, se llega a la tarjeta después del botón
    cont.parentNode.insertBefore(tarjeta, cont.nextSibling);

    var btn = document.getElementById('btn-cuenta');
    btn.setAttribute('aria-controls', 'tarjeta-cuenta');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var abierta = tarjeta.classList.toggle('esta-abierto');
      btn.setAttribute('aria-expanded', abierta ? 'true' : 'false');
      // Al abrir, el foco entra en la tarjeta (WCAG 2.4.3)
      if (abierta) tarjeta.querySelector('.btn-cerrar').focus();
    });
    tarjeta.querySelector('.btn-cerrar').addEventListener('click', function () {
      tarjeta.classList.remove('esta-abierto');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
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
  // Accesibilidad (WCAG 2.1.2, 2.4.3): al abrir, el foco entra en la ventana;
  // Tab no se escapa hacia la página de atrás; al cerrar, el foco vuelve
  // al botón que la abrió.
  var ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var origenDelFoco = {};

  function abrirModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    if (!m.getAttribute('role')) m.setAttribute('role', 'dialog');
    origenDelFoco[id] = document.activeElement;
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
    var volver = origenDelFoco[m.id];
    if (volver && document.contains(volver) && typeof volver.focus === 'function') volver.focus();
    delete origenDelFoco[m.id];
  }

  // Mantiene el foco dentro de la ventana abierta mientras se usa Tab
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var abiertas = document.querySelectorAll('.modal.esta-abierto');
    var m = abiertas[abiertas.length - 1];
    if (!m) return;
    var lista = Array.prototype.filter.call(m.querySelectorAll(ENFOCABLES), function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
    if (!lista.length) return;
    var primero = lista[0], ultimo = lista[lista.length - 1];
    if (!m.contains(document.activeElement)) { e.preventDefault(); primero.focus(); return; }
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });

  // ---------- Enlace "Saltar al contenido principal" (WCAG 2.4.1) ----------
  function prepararSaltar() {
    var main = document.querySelector('main');
    if (!main || document.querySelector('.saltar')) return;
    // Solo hace falta si antes del contenido hay encabezado, menú o barra lateral
    if (!document.querySelector('#encabezado, .nav, .sidebar, header')) return;
    if (!main.id) main.id = 'contenido';
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    var a = document.createElement('a');
    a.className = 'saltar';
    a.href = '#' + main.id;
    a.textContent = 'Saltar al contenido principal';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      main.focus();
      main.scrollIntoView();
    });
    document.body.insertBefore(a, document.body.firstChild);
  }

  document.addEventListener('click', function (e) {
    var cerrar = e.target.closest('[data-cerrar]');
    if (cerrar) cerrarModal(cerrar.closest('.modal'));
    if (e.target.classList && e.target.classList.contains('modal')) cerrarModal(e.target);
    var salir = e.target.closest('[data-salir]');
    if (salir) {
      e.preventDefault();
      var destino = salir.href;
      var clienteUrl = new URL(raiz + 'js/supabase.js', document.baseURI).href;
      import(clienteUrl).then(function (modulo) {
        return modulo.supabase.auth.signOut();
      }).then(function (resultado) {
        if (resultado.error) throw resultado.error;
        cerrarSesion();
        window.location.assign(destino);
      }).catch(function (err) {
        console.error('Error al cerrar sesión con Supabase:', err);
        aviso('No fue posible cerrar la sesión. Inténtalo de nuevo.');
      });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal.esta-abierto').forEach(cerrarModal);
    var t = document.getElementById('tarjeta-cuenta');
    if (t && t.classList.contains('esta-abierto')) {
      t.classList.remove('esta-abierto');
      var b = document.getElementById('btn-cuenta');
      if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
    }
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
  prepararSaltar();

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
