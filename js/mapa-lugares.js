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

  // Oscurece la foto, enmarca el lugar y pone su nombre encima
  function resaltar(capa, lugar) {
    capa.innerHTML = '';
    if (!lugar || !lugar.zona) return;
    var z = lugar.zona;
    capa.appendChild(el('path', {
      d: 'M0 0H' + ANCHO + 'V' + ALTO + 'H0Z M' + z.x + ' ' + z.y + 'h' + z.w + 'v' + z.h + 'h' + (-z.w) + 'Z',
      'fill-rule': 'evenodd', fill: 'rgba(10,25,40,.5)'
    }));
    capa.appendChild(el('rect', { x: z.x, y: z.y, width: z.w, height: z.h, rx: 4, class: 'mapa-zona' }));
    var ancho = Math.max(80, lugar.nombre.length * 12 + 32);
    var cx = Math.min(Math.max(z.x + z.w / 2, ancho / 2 + 6), ANCHO - ancho / 2 - 6);
    var arriba = z.y > 56;
    var y = arriba ? z.y - 48 : z.y + z.h + 12;
    capa.appendChild(el('rect', { x: cx - ancho / 2, y: y, width: ancho, height: 36, rx: 18, fill: '#025373', stroke: '#fff', 'stroke-width': 2 }));
    capa.appendChild(el('text', { x: cx, y: y + 24, 'text-anchor': 'middle', fill: '#fff', 'font-size': 19, 'font-weight': 700, 'font-family': 'Inter, sans-serif' }, lugar.nombre));
  }

  return { resaltar: resaltar, ANCHO: ANCHO, ALTO: ALTO, ICONOS: ICONOS };
})();
