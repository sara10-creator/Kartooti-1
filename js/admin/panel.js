// ==========================================================
// Kartooti — Panel de administración: barra lateral,
// "Mi cuenta" y la ventana para cargar archivos (medios)
// ==========================================================

var Panel = (function () {
  var K = Kartooti;
  var r = K.raiz;

  var MENU = [
    { id: 'resumen', texto: 'Resumen', href: 'index.html', icono: 'sb-resumen.svg' },
    { id: 'datos', texto: 'Actualizar datos', href: 'datos.html', icono: 'sb-datos.svg' },
    { id: 'usuarios', texto: 'Gestión de usuarios', href: 'usuarios.html', icono: 'sb-usuarios.svg' },
    { id: 'eventos', texto: 'Gestión de eventos', href: 'eventos.html', icono: 'sb-eventos.svg' }
  ];

  function admin() {
    var s = K.sesion();
    return (s && s.rol === 'Administrador') ? s : { nombre: 'Admin 1', correo: 'admin@unimilitar.edu.co', rol: 'Administrador' };
  }

  function iniciar(activo) {
    var barra = document.getElementById('sidebar');
    var a = admin();

    barra.innerHTML =
      '<div class="sidebar__marca"><img src="' + r + 'assets/img/logo.png" alt=""><div><b>Kartooti</b><small>Panel de administración</small></div></div>' +
      '<p class="sidebar__titulo">Menú principal</p>' +
      '<nav class="sidebar__menu" aria-label="Menú del panel">' +
        MENU.map(function (m) {
          var es = m.id === activo;
          return '<a class="sidebar__op' + (es ? ' es-activo' : '') + '" href="' + m.href + '"' + (es ? ' aria-current="page"' : '') + '>' +
            '<img src="' + r + 'assets/icons/' + m.icono + '" alt="">' + m.texto + '</a>';
        }).join('') +
      '</nav>' +
      '<div class="sidebar__pie">' +
        '<button class="sidebar__cuenta" type="button" id="btn-mi-cuenta" aria-haspopup="dialog"><img src="' + r + 'assets/icons/sb-cuenta.svg" width="26" height="34" alt="">Mi cuenta</button>' +
        '<a class="btn-salir" href="login.html" data-salir><img src="' + r + 'assets/icons/salir.svg" width="35" height="31" alt="">Salir</a>' +
      '</div>';

    // Barra superior en celular (es un <header>: así queda dentro de un "landmark")
    // Si la página ya tiene su propio <header>, se usa <nav> para no repetir el landmark "banner"
    var movil = document.createElement(document.querySelector('header') ? 'nav' : 'header');
    if (movil.tagName === 'NAV') movil.setAttribute('aria-label', 'Barra del panel en celular');
    movil.className = 'menu-movil';
    movil.innerHTML = '<button type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="sidebar"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button><img src="' + r + 'assets/img/logo.png" alt="">Kartooti';
    var saltar = document.querySelector('.saltar');
    document.body.insertBefore(movil, saltar ? saltar.nextSibling : document.body.firstChild);
    var btnMenu = movil.querySelector('button');

    function menuMovil(abrir) {
      document.body.classList.toggle('menu-abierto', abrir);
      btnMenu.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      btnMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
      if (abrir) { var primero = barra.querySelector('a, button'); if (primero) setTimeout(function () { primero.focus(); }, 60); }
    }
    btnMenu.addEventListener('click', function (e) {
      e.stopPropagation();
      menuMovil(!document.body.classList.contains('menu-abierto'));
    });
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('menu-abierto') && !barra.contains(e.target)) menuMovil(false);
    });
    // Escape cierra el menú del celular y devuelve el foco al botón
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-abierto')) { menuMovil(false); btnMenu.focus(); }
    });

    // Tarjeta "Mi cuenta"
    var tarjeta = document.createElement('div');
    tarjeta.className = 'cuenta cuenta--admin';
    tarjeta.setAttribute('role', 'dialog');
    tarjeta.setAttribute('aria-label', 'Mi cuenta');
    tarjeta.innerHTML =
      '<button class="btn-cerrar" type="button" aria-label="Cerrar"><img src="' + r + 'assets/icons/cerrar-x.png" alt=""></button>' +
      '<div class="cuenta__cabeza"><svg width="30" height="38" viewBox="0 0 19 24" fill="none" aria-hidden="true"><path d="M13.9922 5.83008C13.9922 7.06707 13.5008 8.25339 12.6261 9.12808C11.7514 10.0028 10.5651 10.4941 9.32813 10.4941C8.09115 10.4941 6.90482 10.0028 6.03014 9.12808C5.15546 8.25339 4.66407 7.06707 4.66407 5.83008C4.66407 4.59309 5.15546 3.40677 6.03014 2.53209C6.90482 1.65741 8.09115 1.16602 9.32813 1.16602C10.5651 1.16602 11.7514 1.65741 12.6261 2.53209C13.5008 3.40677 13.9922 4.59309 13.9922 5.83008ZM9.32813 13.9922C7.1634 13.9922 5.08734 14.8521 3.55664 16.3828C2.02595 17.9135 1.16602 19.9896 1.16602 22.1543H17.4902C17.4902 19.9896 16.6303 17.9135 15.0996 16.3828C13.5689 14.8521 11.4929 13.9922 9.32813 13.9922Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<div><p class="cuenta__nombre">' + K.esc(a.nombre) + '</p><p class="cuenta__correo">' + K.esc(a.correo) + '</p></div></div>' +
      '<p class="cuenta__dato">Rol: Administrador</p>' +
      '<p class="cuenta__dato">Estado: Activo</p>' +
      '<a class="cuenta__salir" href="' + r + 'index.html" data-salir>Cerrar sesión</a>';
    tarjeta.id = 'tarjeta-mi-cuenta';
    // Justo después de la barra lateral, para que el orden con Tab sea natural
    barra.parentNode.insertBefore(tarjeta, barra.nextSibling);

    var btnCuenta = document.getElementById('btn-mi-cuenta');
    btnCuenta.setAttribute('aria-expanded', 'false');
    btnCuenta.setAttribute('aria-controls', 'tarjeta-mi-cuenta');
    function cuenta(abrir, devolverFoco) {
      tarjeta.classList.toggle('esta-abierto', abrir);
      btnCuenta.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      if (abrir) tarjeta.querySelector('.btn-cerrar').focus();
      else if (devolverFoco) btnCuenta.focus();
    }
    btnCuenta.addEventListener('click', function (e) {
      e.stopPropagation();
      cuenta(!tarjeta.classList.contains('esta-abierto'));
    });
    tarjeta.querySelector('.btn-cerrar').addEventListener('click', function () { cuenta(false, true); });
    document.addEventListener('click', function (e) {
      if (tarjeta.classList.contains('esta-abierto') && !tarjeta.contains(e.target)) cuenta(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && tarjeta.classList.contains('esta-abierto')) cuenta(false, true);
    });

    prepararCargaArchivos();
  }

  // ---------- Ventana "Ingrese medios" (cargar archivos) ----------
  var alGuardarMedio = null;
  function prepararCargaArchivos() {
    var m = document.getElementById('modal-archivos');
    if (!m) return;
    var input = document.getElementById('archivo-input');
    var nombre = document.getElementById('archivo-nombre');
    var buscar = document.getElementById('archivo-buscar');
    var seleccionado = null;

    input.addEventListener('change', function () {
      var f = input.files[0];
      if (!f) return;
      if (f.size > 25 * 1024 * 1024) {
        K.aviso('El archivo supera el límite de 25 MB');
        input.value = '';
        return;
      }
      seleccionado = f.name;
      nombre.textContent = f.name;
      buscar.value = f.name;
    });

    document.getElementById('archivo-guardar').addEventListener('click', function () {
      if (!seleccionado) { K.aviso('Primero elige un archivo desde "Biblioteca / este PC"'); return; }
      if (alGuardarMedio) alGuardarMedio(seleccionado);
      K.cerrarModal(m);
    });

    m.abrir = function (callback) {
      alGuardarMedio = callback;
      seleccionado = null;
      input.value = '';
      buscar.value = '';
      nombre.textContent = 'Ningún archivo seleccionado';
      K.abrirModal('modal-archivos');
    };
  }

  function pedirArchivo(callback) {
    var m = document.getElementById('modal-archivos');
    if (m && m.abrir) m.abrir(callback);
  }

  // Lista con filtro de texto y selects
  function filtrar(lista, texto, campos, filtros) {
    var q = K.normal(texto);
    return lista.filter(function (item) {
      var okTexto = !q || campos.some(function (c) { return K.normal(item[c]).indexOf(q) !== -1; });
      var okFiltros = Object.keys(filtros).every(function (k) { return !filtros[k] || item[k] === filtros[k]; });
      return okTexto && okFiltros;
    });
  }

  return { iniciar: iniciar, pedirArchivo: pedirArchivo, filtrar: filtrar };
})();
