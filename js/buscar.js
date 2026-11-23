// Kartooti — Buscar ubicación en el campus (sede Calle 100)
// Espera a que lleguen los datos del servidor antes de pintar
KartootiDatos.listo.then(function () {
  var K = Kartooti;
  var D = KartootiDatos;
  var form = document.getElementById('form-buscar');
  var input = document.getElementById('b-texto');
  var resultado = document.getElementById('resultado');
  var texto = document.getElementById('resultado-texto');
  var sugerencias = document.getElementById('sugerencias');
  var ayuda = document.getElementById('como-funciona');
  var capa = document.getElementById('campus-capa');
  var lista = document.getElementById('campus-lista');
  var opciones = document.getElementById('b-opciones');
  var NS = 'http://www.w3.org/2000/svg';
  var lugares = D.leer('lugares');
  var ORDEN = ['Acceso', 'Hitos', 'Bloques', 'Alimentación', 'Espacios'];

  // ---------- Resaltar un lugar en el mapa ----------
  function el(tag, attrs, txt) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (txt) n.textContent = txt;
    return n;
  }

  function resaltar(lugar) {
    capa.innerHTML = '';
    if (!lugar || !lugar.zona) return;
    var z = lugar.zona;
    // Oscurece todo menos el lugar
    capa.appendChild(el('path', {
      d: 'M0 0H950V537H0Z M' + z.x + ' ' + z.y + 'h' + z.w + 'v' + z.h + 'h' + (-z.w) + 'Z',
      'fill-rule': 'evenodd', fill: 'rgba(15,30,45,.45)'
    }));
    capa.appendChild(el('rect', { x: z.x, y: z.y, width: z.w, height: z.h, rx: 3, class: 'campus__zona' }));
    // Etiqueta encima (o debajo si no cabe)
    var ancho = Math.max(70, lugar.nombre.length * 11.5 + 30);
    var cx = Math.min(Math.max(z.x + z.w / 2, ancho / 2 + 6), 950 - ancho / 2 - 6);
    var arriba = z.y > 52;
    var y = arriba ? z.y - 46 : z.y + z.h + 10;
    var g = el('g', {});
    g.appendChild(el('rect', { x: cx - ancho / 2, y: y, width: ancho, height: 36, rx: 8, fill: '#1d1d1f' }));
    g.appendChild(el('path', { d: arriba ? 'M' + (cx - 6) + ' ' + (y + 36) + 'l7 8l7 -8Z' : 'M' + (cx - 6) + ' ' + y + 'l7 -8l7 8Z', fill: '#1d1d1f' }));
    g.appendChild(el('text', { x: cx, y: y + 25, 'text-anchor': 'middle', fill: '#fff', 'font-size': 19, 'font-weight': 700, 'font-family': 'Inter, sans-serif' }, lugar.nombre));
    capa.appendChild(g);
  }

  function marcarEnLista(lugar) {
    lista.querySelectorAll('.campus__item').forEach(function (b) {
      if (lugar && Number(b.dataset.id) === lugar.id) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  // ---------- Buscar ----------
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
    if (r) {
      texto.classList.remove('no-encontrado');
      var partes = '📍 <b>' + K.esc(r.titulo) + '</b>';
      if (r.lugar && D.normalizar(r.lugar.nombre) !== D.normalizar(r.titulo)) partes += ' está en <b>' + K.esc(r.lugar.nombre) + '</b>';
      else if (!r.lugar && r.detalle) partes += ' está en <b>' + K.esc(r.detalle) + '</b>';
      if (r.piso) partes += ', piso <b>' + K.esc(r.piso) + '</b>';
      partes += '.';
      if (!r.lugar || !r.lugar.zona) partes += ' Todavía no lo tenemos marcado en el mapa.';
      else partes += ' Lo resaltamos en el mapa.';
      texto.innerHTML = partes;
      resaltar(r.lugar);
      marcarEnLista(r.lugar);
    } else {
      texto.classList.add('no-encontrado');
      texto.innerHTML = 'No encontramos <b>' + K.esc(q) + '</b>. Prueba con un código de salón (por ejemplo B201) o elige un lugar de la lista.';
      resaltar(null);
      marcarEnLista(null);
    }
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
    resaltar(null);
    marcarEnLista(null);
    history.replaceState(null, '', location.pathname);
    input.focus();
  }

  // ---------- Lista por categorías (como el mapa de la UMNG) ----------
  var categorias = ORDEN.concat(lugares.map(function (l) { return l.categoria; }))
    .filter(function (c, i, arr) { return arr.indexOf(c) === i; });
  categorias.forEach(function (cat) {
    var deCat = lugares.filter(function (l) { return l.categoria === cat; });
    if (!deCat.length) return;
    var grupo = document.createElement('div');
    grupo.className = 'campus__grupo';
    var idTitulo = 'cat-' + D.normalizar(cat).replace(/\W+/g, '-');
    grupo.innerHTML = '<h3 id="' + idTitulo + '">' + K.esc(cat) + '</h3>';
    var ul = document.createElement('ul');
    ul.setAttribute('aria-labelledby', idTitulo);
    deCat.forEach(function (l) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'campus__item';
      b.dataset.id = l.id;
      b.innerHTML = K.esc(l.nombre) + (l.zona ? '' : ' <small>(sin ubicar)</small>');
      b.addEventListener('click', function () { input.value = l.nombre; mostrar(l.nombre); });
      li.appendChild(b);
      ul.appendChild(li);
    });
    grupo.appendChild(ul);
    lista.appendChild(grupo);
  });

  // Autocompletar con nombres de lugares y puntos
  var nombres = lugares.map(function (l) { return l.nombre; })
    .concat(D.leer('puntos').map(function (p) { return p.nombre; }));
  nombres.filter(function (n, i, arr) { return arr.indexOf(n) === i; }).forEach(function (n) {
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
