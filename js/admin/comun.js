// ==========================================================
// Kartooti — Panel de administración: piezas compartidas
// (barra lateral, encabezado, ventanas emergentes, avisos y
//  almacenamiento local de los datos de ejemplo)
// ==========================================================

var Kartooti = (function () {
  // Íconos de la barra lateral (usan currentColor para cambiar de color
  // entre el estado normal y el activo)
  var ICONS = {
    resumen: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V7.5C2.5 7.96024 2.8731 8.33333 3.33333 8.33333H7.5C7.96024 8.33333 8.33333 7.96024 8.33333 7.5V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z" stroke="currentColor" stroke-width="1.66667"/><path d="M16.6667 2.5H12.5C12.0398 2.5 11.6667 2.8731 11.6667 3.33333V7.5C11.6667 7.96024 12.0398 8.33333 12.5 8.33333H16.6667C17.1269 8.33333 17.5 7.96024 17.5 7.5V3.33333C17.5 2.8731 17.1269 2.5 16.6667 2.5Z" stroke="currentColor" stroke-width="1.66667"/><path d="M7.5 11.6667H3.33333C2.8731 11.6667 2.5 12.0398 2.5 12.5001V16.6667C2.5 17.127 2.8731 17.5001 3.33333 17.5001H7.5C7.96024 17.5001 8.33333 17.127 8.33333 16.6667V12.5001C8.33333 12.0398 7.96024 11.6667 7.5 11.6667Z" stroke="currentColor" stroke-width="1.66667"/><path d="M16.6667 11.6667H12.5C12.0398 11.6667 11.6667 12.0398 11.6667 12.5001V16.6667C11.6667 17.127 12.0398 17.5001 12.5 17.5001H16.6667C17.1269 17.5001 17.5 17.127 17.5 16.6667V12.5001C17.5 12.0398 17.1269 11.6667 16.6667 11.6667Z" stroke="currentColor" stroke-width="1.66667"/></svg>',
    datos: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 14.1666L7.5 16.6666L2.96083 14.3966C2.82243 14.3274 2.70602 14.2211 2.62463 14.0895C2.54324 13.9579 2.50008 13.8063 2.5 13.6516V4.68159C2.50008 4.53959 2.53643 4.39997 2.60562 4.27598C2.67481 4.15198 2.77453 4.04772 2.89533 3.97309C3.01613 3.89846 3.15399 3.85593 3.29584 3.84954C3.43769 3.84315 3.57882 3.87311 3.70583 3.93659L7.5 5.83325M7.5 16.6666V5.83325M12.5 14.1666L16.2942 16.0633C16.4212 16.1267 16.5623 16.1567 16.7042 16.1503C16.846 16.1439 16.9839 16.1014 17.1047 16.0267C17.2255 15.9521 17.3252 15.8479 17.3944 15.7239C17.4636 15.5999 17.4999 15.4602 17.5 15.3183V6.34825C17.4999 6.19353 17.4568 6.04189 17.3754 5.91031C17.294 5.77873 17.1776 5.67241 17.0392 5.60325L12.5 3.33325L7.5 5.83325M12.5 14.1666V3.33325" stroke="currentColor" stroke-width="1.66667"/></svg>',
    usuarios: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M14.1667 17.5V15.8333C14.1667 14.9493 13.8155 14.1014 13.1904 13.4763C12.5652 12.8512 11.7174 12.5 10.8333 12.5H4.16667C3.28261 12.5 2.43477 12.8512 1.80964 13.4763C1.18452 14.1014 0.833334 14.9493 0.833334 15.8333V17.5" stroke="currentColor" stroke-width="1.66667"/><path d="M7.5 9.16667C9.34095 9.16667 10.8333 7.67428 10.8333 5.83333C10.8333 3.99238 9.34095 2.5 7.5 2.5C5.65905 2.5 4.16667 3.99238 4.16667 5.83333C4.16667 7.67428 5.65905 9.16667 7.5 9.16667Z" stroke="currentColor" stroke-width="1.66667"/><path d="M19.1667 17.5001V15.8334C19.1661 15.0948 18.9203 14.3774 18.4678 13.7937C18.0153 13.2099 17.3818 12.793 16.6667 12.6084M13.3333 2.6084C14.0503 2.79198 14.6859 3.20898 15.1397 3.79366C15.5935 4.37833 15.8399 5.09742 15.8399 5.83757C15.8399 6.57771 15.5935 7.2968 15.1397 7.88147C14.6859 8.46615 14.0503 8.88315 13.3333 9.06673" stroke="currentColor" stroke-width="1.66667"/></svg>',
    eventos: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6.66667 5.83333V2.5M13.3333 5.83333V2.5M5.83333 9.16667H14.1667M4.16667 17.5H15.8333C16.2754 17.5 16.6993 17.3244 17.0118 17.0118C17.3244 16.6993 17.5 16.2754 17.5 15.8333V5.83333C17.5 5.39131 17.3244 4.96738 17.0118 4.65482C16.6993 4.34226 16.2754 4.16667 15.8333 4.16667H4.16667C3.72464 4.16667 3.30072 4.34226 2.98816 4.65482C2.67559 4.96738 2.5 5.39131 2.5 5.83333V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5Z" stroke="currentColor" stroke-width="1.66667"/></svg>'
  };

  var MENU = [
    { id: 'resumen', label: 'Resumen', href: 'resumen.html' },
    { id: 'datos', label: 'Actualizar Datos', href: 'datos.html' },
    { id: 'usuarios', label: 'Gestión de Usuarios', href: 'usuarios.html' },
    { id: 'eventos', label: 'Gestión de Eventos', href: 'eventos.html' }
  ];

  // ---------- Estructura de la página ----------
  function renderLayout(activeId) {
    var sidebar = document.getElementById('sidebar');
    var topbar = document.getElementById('topbar');

    if (sidebar) {
      var links = MENU.map(function (item) {
        var active = item.id === activeId;
        return '<a class="sidebar__link' + (active ? ' is-active' : '') + '" href="' + item.href + '"' +
          (active ? ' aria-current="page"' : '') + '>' + ICONS[item.id] + '<span>' + item.label + '</span></a>';
      }).join('');

      sidebar.innerHTML =
        '<div class="sidebar__brand">' +
          '<span class="sidebar__logo" aria-hidden="true">🐢</span>' +
          '<div><p class="sidebar__name">Kartooti</p><p class="sidebar__sub">Panel de Administración</p></div>' +
        '</div>' +
        '<nav class="sidebar__nav" aria-label="Menú del panel">' +
          '<p class="sidebar__label">Menú principal</p>' + links +
        '</nav>' +
        '<div class="sidebar__foot">' +
          '<div class="sidebar__user">' +
            '<span class="avatar">A</span>' +
            '<div><p class="sidebar__user-name">Administrador</p><p class="sidebar__user-mail">admin@universidad.edu</p></div>' +
          '</div>' +
          '<a class="sidebar__back" href="../index.html"><img src="../assets/icons/logout.svg" width="16" height="16" alt="">Volver al sitio</a>' +
        '</div>';
    }

    if (topbar) {
      topbar.innerHTML =
        '<button class="topbar__menu" type="button" aria-label="Abrir menú"><span></span><span></span><span></span></button>' +
        '<span class="topbar__label">Panel de Admin</span>' +
        '<span class="avatar">A</span>';

      topbar.querySelector('.topbar__menu').addEventListener('click', function () {
        document.body.classList.toggle('sidebar-open');
      });
    }

    // Cierra la barra lateral en móvil al tocar fuera
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('sidebar-open')) return;
      if (e.target.closest('.sidebar') || e.target.closest('.topbar__menu')) return;
      document.body.classList.remove('sidebar-open');
    });
  }

  // ---------- Ventanas emergentes ----------
  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    var first = modal.querySelector('input, select, textarea, button');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }

  function closeModal(modal) {
    if (typeof modal === 'string') modal = document.getElementById(modal);
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('click', function (e) {
    var closer = e.target.closest('[data-close]');
    if (closer) closeModal(closer.closest('.modal'));
    if (e.target.classList && e.target.classList.contains('modal')) closeModal(e.target);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.is-open').forEach(closeModal);
    }
  });

  // ---------- Aviso flotante ----------
  var toastTimer;
  function toast(msg) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2200);
  }

  // ---------- Datos guardados en el navegador ----------
  function load(key, fallback) {
    try {
      var raw = localStorage.getItem('kartooti:' + key);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback));
    } catch (err) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  function save(key, value) {
    try { localStorage.setItem('kartooti:' + key, JSON.stringify(value)); } catch (err) { /* sin almacenamiento */ }
  }

  // ---------- Utilidades ----------
  function esc(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function norm(text) {
    return String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function nextId(list) {
    return list.reduce(function (max, item) { return Math.max(max, item.id); }, 0) + 1;
  }

  return {
    renderLayout: renderLayout,
    openModal: openModal,
    closeModal: closeModal,
    toast: toast,
    load: load,
    save: save,
    esc: esc,
    norm: norm,
    nextId: nextId
  };
})();
