// Kartooti — Mapa interactivo: panel para elegir un lugar y verlo resaltado en la foto
KartootiDatos.listo.then(function () {
  var K = Kartooti;
  var D = KartootiDatos;
  var capa = document.getElementById('mapa-capa');
  var lista = document.getElementById('tarjetas-lugar');
  var chips = document.getElementById('chips');
  var filtro = document.getElementById('filtro-lugar');
  var vacio = document.getElementById('sin-lugares');
  var detalle = document.getElementById('detalle-lugar');
  if (!capa || !lista) return;

  var lugares = D.leer('lugares').filter(function (l) { return l.zona; });
  var comidas = D.leer('comidas');
  var NOMBRE_CAT = { 'Bloques': 'Bloques', 'Alimentación': 'Comida', 'Espacios': 'Espacios' };
  var categoria = 'Todos';
  var actual = null;

  // ---------- Chips de categoría ----------
  ['Todos'].concat(Object.keys(NOMBRE_CAT)).forEach(function (cat) {
    if (cat !== 'Todos' && !lugares.some(function (l) { return l.categoria === cat; })) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = cat === 'Todos' ? 'Todos' : NOMBRE_CAT[cat];
    b.setAttribute('aria-pressed', String(cat === categoria));
    b.addEventListener('click', function () {
      categoria = cat;
      chips.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      pintarLista();
    });
    chips.appendChild(b);
  });

  // ---------- Tarjetas ----------
  function pintarLista() {
    var q = D.normalizar(filtro.value);
    var visibles = lugares.filter(function (l) {
      if (categoria !== 'Todos' && l.categoria !== categoria) return false;
      if (!q) return true;
      return [l.nombre].concat(l.alias || []).some(function (n) { return D.normalizar(n).indexOf(q) !== -1; });
    });
    lista.innerHTML = '';
    visibles.forEach(function (l) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tarjeta-lugar';
      b.dataset.id = l.id;
      if (actual && actual.id === l.id) b.setAttribute('aria-current', 'true');
      b.innerHTML = '<span class="tarjeta-lugar__icono" aria-hidden="true">' + (KartootiMapa.ICONOS[l.categoria] || '📍') + '</span>' +
        '<span><span class="tarjeta-lugar__nombre">' + K.esc(l.nombre) + '</span>' +
        '<span class="tarjeta-lugar__tipo">' + K.esc(NOMBRE_CAT[l.categoria] || l.categoria) + '</span></span>';
      b.addEventListener('click', function () { elegir(l); });
      li.appendChild(b);
      lista.appendChild(li);
    });
    vacio.hidden = visibles.length > 0;
  }

  // ---------- Elegir un lugar ----------
  function elegir(l) {
    actual = l;
    KartootiMapa.resaltar(capa, l);
    lista.querySelectorAll('.tarjeta-lugar').forEach(function (b) {
      if (Number(b.dataset.id) === l.id) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });

    // Acerca y centra el mapa en el lugar
    var z = l.zona;
    if (window.KartootiZoom) {
      KartootiZoom(180, (z.x + z.w / 2) / KartootiMapa.ANCHO, (z.y + z.h / 2) / KartootiMapa.ALTO);
    }

    // Detalle debajo de la lista
    var html = '📍 <b>' + K.esc(l.nombre) + '</b>';
    if (l.categoria === 'Alimentación') {
      var c = comidas.find(function (x) { return D.normalizar(x.nombre) === D.normalizar(l.nombre); });
      if (c && c.horario) html += '<br>Horario: ' + K.esc(c.horario);
      html += '<br><a href="comida.html">Ver menús de comida</a>';
    } else if (l.categoria === 'Bloques') {
      html += '<br>Los salones de este bloque empiezan por <b>' + K.esc(l.nombre.slice(-1)) + '</b> (por ejemplo ' +
        K.esc(l.nombre.slice(-1)) + '201). <a href="buscar.html">Buscar un salón</a>';
    } else {
      html += '<br>Resaltado en el mapa.';
    }
    detalle.innerHTML = html;
    detalle.hidden = false;
    history.replaceState(null, '', '?lugar=' + encodeURIComponent(l.nombre));
  }

  filtro.addEventListener('input', pintarLista);
  pintarLista();

  // Llega desde Buscar con ?lugar=Bloque%20B
  var pedido = new URLSearchParams(location.search).get('lugar');
  var inicial = pedido && D.lugarPorNombre(pedido);
  if (inicial && inicial.zona) elegir(inicial);
});
