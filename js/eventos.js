// Kartooti — Eventos del campus (solo los publicados)
(function () {
  var K = Kartooti;
  var COLORES = { primario: '#025373', verde: '#97d3b1', amarillo: '#f2ce5e', celeste: '#4ea8c0' };
  var lista = document.getElementById('lista-eventos');
  var r = K.raiz + 'assets/icons/';

  var eventos = KartootiDatos.leer('eventos').filter(function (e) { return e.estado === 'Publicado'; });

  if (!eventos.length) {
    lista.innerHTML = '<p class="vacio">Todavía no hay eventos publicados. ¡Vuelve pronto!</p>';
    return;
  }

  lista.innerHTML = eventos.map(function (e) {
    var color = COLORES[e.color] || COLORES.primario;
    return '<article class="evento" style="--color:' + color + '">' +
      '<div class="evento__cabeza">' +
        '<div class="evento__fecha"><b>' + K.esc(e.dia) + '</b><small>' + K.esc(e.mes) + '</small></div>' +
        '<h2>' + K.esc(e.titulo) + '</h2>' +
      '</div>' +
      '<p class="evento__dato"><img src="' + r + 'ev-calendario.svg" alt="Fecha">' + K.esc(e.fechaTexto) + '</p>' +
      '<p class="evento__dato"><img src="' + r + 'ev-reloj.svg" alt="Hora">' + K.esc(e.hora) + '</p>' +
      '<p class="evento__dato"><img src="' + r + 'ev-lugar.svg" alt="Lugar">' + K.esc(e.lugar) + '</p>' +
      '<a class="evento__info" href="https://umng.edu.co/eventos/" target="_blank" rel="noopener">Más info &gt;</a>' +
    '</article>';
  }).join('');
})();
