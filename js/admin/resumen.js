// Kartooti admin — Resumen: indicadores y actividad reciente
(function () {
  var K = Kartooti, D = KartootiDatos;
  var r = K.raiz + 'assets/icons/';
  var ICONOS = { usuario: 'act-user.svg', punto: 'act-lugar.svg', evento: 'act-reloj.svg' };

  var eventos = D.leer('eventos'), puntos = D.leer('puntos');
  // Los números del diseño más lo que se haya añadido desde el panel
  document.getElementById('k-eventos').textContent = 34 + eventos.filter(function (e) { return e.estado === 'Publicado'; }).length + 2;
  document.getElementById('k-puntos').textContent = 85 + puntos.filter(function (p) { return p.estado === 'Activo'; }).length + 1;

  document.getElementById('lista-actividad').innerHTML = D.leer('actividad').slice(0, 6).map(function (a) {
    return '<li><span class="actividad__icono"><img src="' + r + (ICONOS[a.tipo] || ICONOS.evento) + '" alt=""></span>' +
      '<div><b>' + K.esc(a.titulo) + '</b><span>' + K.esc(a.detalle) + '</span></div></li>';
  }).join('');
})();
