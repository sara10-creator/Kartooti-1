// Kartooti — Eventos del campus (solo los publicados)
// Espera a que lleguen los datos del servidor antes de pintar
KartootiDatos.listo.then(function () {
  var K = Kartooti;
  var COLORES = { primario: '#025373', verde: '#97d3b1', amarillo: '#f2ce5e', celeste: '#4ea8c0' };
  // Sobre los colores claros el texto va oscuro; el blanco no se lee (WCAG 1.4.3)
  var TEXTO = { primario: '#ffffff', verde: '#1d293d', amarillo: '#1d293d', celeste: '#1d293d' };
  var lista = document.getElementById('lista-eventos');
  var r = K.raiz + 'assets/icons/';

  var eventos = KartootiDatos.leer('eventos').filter(function (e) { return e.estado === 'Publicado'; });

  if (!eventos.length) {
    lista.innerHTML = '<p class="vacio">Todavía no hay eventos publicados. ¡Vuelve pronto!</p>';
    return;
  }

  lista.innerHTML = eventos.map(function (e) {
    var color = COLORES[e.color] || COLORES.primario;
    var texto = TEXTO[e.color] || TEXTO.primario;
    return '<article class="evento" style="--color:' + color + ';--color-texto:' + texto + '">' +
      '<div class="evento__cabeza">' +
        '<div class="evento__fecha"><b>' + K.esc(e.dia) + '</b><small>' + K.esc(e.mes) + '</small></div>' +
        '<h2>' + K.esc(e.titulo) + '</h2>' +
      '</div>' +
      '<p class="evento__dato"><img src="' + r + 'ev-calendario.svg" alt="Fecha:">' + K.esc(e.fechaTexto) + '</p>' +
      '<p class="evento__dato"><img src="' + r + 'ev-reloj.svg" alt="Hora:">' + K.esc(e.hora) + '</p>' +
      '<p class="evento__dato"><img src="' + r + 'ev-lugar.svg" alt="Lugar:">' + K.esc(e.lugar) + '</p>' +
      '<a class="evento__info" href="https://umng.edu.co/eventos/" target="_blank" rel="noopener" aria-label="Más info: ' + K.esc(e.titulo) + ' (se abre en una pestaña nueva)">Más info &gt;</a>' +
    '</article>';
  }).join('');
});
