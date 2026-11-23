// Kartooti — Dibuja en la foto aérea el lugar elegido (lo usan Buscar y el Mapa interactivo)
// Las zonas de data/lugares.json están en píxeles de mapa-aereo.jpg (1195 × 671).
var KartootiMapa = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var ANCHO = 1195, ALTO = 671;
  var ICONOS = { 'Bloques': '🏫', 'Alimentación': '🍽️', 'Espacios': '🏛️' };

  function el(tag, attrs, txt) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (txt) n.textContent = txt;
    return n;
  }

  // Oscurece la imagen, enmarca una o varias zonas y pone el nombre encima de la primera.
  // ancho/alto: tamaño de la imagen (por defecto la foto aérea)
  function resaltarZonas(capa, zonas, nombre, ancho, alto) {
    ancho = ancho || ANCHO; alto = alto || ALTO;
    capa.innerHTML = '';
    if (!zonas || !zonas.length) return;
    var huecos = zonas.map(function (z) {
      return 'M' + z.x + ' ' + z.y + 'h' + z.w + 'v' + z.h + 'h' + (-z.w) + 'Z';
    }).join(' ');
    capa.appendChild(el('path', { d: 'M0 0H' + ancho + 'V' + alto + 'H0Z ' + huecos, 'fill-rule': 'evenodd', fill: 'rgba(10,25,40,.5)' }));
    zonas.forEach(function (z) {
      capa.appendChild(el('rect', { x: z.x, y: z.y, width: z.w, height: z.h, rx: 4, class: 'mapa-zona' }));
    });
    if (!nombre) return;
    var z = zonas[0];
    // Tamaño de la etiqueta proporcional a la imagen, para que se lea igual en la foto y en los planos
    var fs = ancho * 0.026, alturaEt = fs * 1.9;
    var anchoEt = Math.max(fs * 4, nombre.length * fs * 0.62 + fs * 1.6);
    var cx = Math.min(Math.max(z.x + z.w / 2, anchoEt / 2 + 6), ancho - anchoEt / 2 - 6);
    var arriba = z.y > alturaEt + 20;
    var y = arriba ? z.y - alturaEt - 12 : Math.min(z.y + z.h + 12, alto - alturaEt - 4);
    capa.appendChild(el('rect', { x: cx - anchoEt / 2, y: y, width: anchoEt, height: alturaEt, rx: alturaEt / 2, fill: '#025373', stroke: '#fff', 'stroke-width': 2 }));
    capa.appendChild(el('text', { x: cx, y: y + alturaEt * 0.67, 'text-anchor': 'middle', fill: '#fff', 'font-size': fs, 'font-weight': 700, 'font-family': 'Inter, sans-serif' }, nombre));
  }

  function resaltar(capa, lugar) {
    resaltarZonas(capa, lugar && lugar.zona ? [lugar.zona] : null, lugar && lugar.nombre);
  }

  return { resaltar: resaltar, resaltarZonas: resaltarZonas, ANCHO: ANCHO, ALTO: ALTO, ICONOS: ICONOS };
})();
