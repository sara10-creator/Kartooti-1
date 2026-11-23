// Kartooti — Buscar ubicación: escribe un salón o lugar y te mostramos dónde queda
KartootiDatos.listo.then(function () {
  var K = Kartooti;
  var D = KartootiDatos;
  var form = document.getElementById('form-buscar');
  var input = document.getElementById('b-texto');
  var resultado = document.getElementById('resultado');
  var texto = document.getElementById('resultado-texto');
  var foto = document.getElementById('resultado-mapa');
  var capa = document.getElementById('resultado-capa');
  var verEnMapa = document.getElementById('ver-en-mapa');
  var sugerencias = document.getElementById('sugerencias');
  var ayuda = document.getElementById('como-funciona');
  var opciones = document.getElementById('b-opciones');

  function mostrar(q) {
    q = String(q || '').trim();
    if (!q) {
      input.classList.add('es-error');
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      K.aviso('Escribe un salón o lugar, por ejemplo B201');
      return;
    }
    input.classList.remove('es-error');
    input.removeAttribute('aria-invalid');
    var r = D.buscarLugar(q);
    var lugar = r && r.lugar && r.lugar.zona ? r.lugar : null;
    if (r) {
      texto.classList.remove('no-encontrado');
      var partes = '📍 <b>' + K.esc(r.titulo) + '</b>';
      if (lugar && D.normalizar(lugar.nombre) !== D.normalizar(r.titulo)) partes += ' está en <b>' + K.esc(lugar.nombre) + '</b>';
      else if (!lugar && r.detalle) partes += ' está en <b>' + K.esc(r.detalle) + '</b>';
      if (r.piso) partes += ', piso <b>' + K.esc(r.piso) + '</b>';
      texto.innerHTML = partes + '.';
    } else {
      texto.classList.add('no-encontrado');
      texto.innerHTML = 'No encontramos <b>' + K.esc(q) + '</b>. Prueba con un código de salón (por ejemplo B201) o el nombre de un lugar.';
    }
    foto.hidden = !lugar;
    KartootiMapa.resaltar(capa, lugar);
    verEnMapa.href = 'mapa.html' + (lugar ? '?lugar=' + encodeURIComponent(lugar.nombre) : '');
    resultado.classList.add('es-visible');
    sugerencias.hidden = true;
    ayuda.hidden = true;
    history.replaceState(null, '', '?q=' + encodeURIComponent(q));
  }

  function limpiar() {
    input.value = '';
    input.classList.remove('es-error');
    resultado.classList.remove('es-visible');
    sugerencias.hidden = false;
    ayuda.hidden = false;
    history.replaceState(null, '', location.pathname);
    input.focus();
  }

  // Autocompletar con lugares y puntos
  D.leer('lugares').map(function (l) { return l.nombre; })
    .concat(D.leer('puntos').map(function (p) { return p.nombre; }))
    .filter(function (n, i, arr) { return arr.indexOf(n) === i; })
    .forEach(function (n) {
      var o = document.createElement('option');
      o.value = n;
      opciones.appendChild(o);
    });

  form.addEventListener('submit', function (e) { e.preventDefault(); mostrar(input.value); });
  document.getElementById('b-limpiar').addEventListener('click', limpiar);
  document.querySelectorAll('.sugerencia').forEach(function (b) {
    b.addEventListener('click', function () { input.value = b.textContent; mostrar(b.textContent); });
  });

  var inicial = new URLSearchParams(location.search).get('q');
  if (inicial) { input.value = inicial; mostrar(inicial); }
});
