// Kartooti — Servicios de comida y menús
(function () {
  var K = Kartooti;
  var lista = document.getElementById('lista-comidas');
  var r = K.raiz + 'assets/';
  var comidas = KartootiDatos.leer('comidas');

  lista.innerHTML = comidas.map(function (c) {
    return '<article class="comida">' +
      '<div class="comida__nombre"><span aria-hidden="true">' + c.icono + '</span><h2>' + K.esc(c.nombre) + '</h2></div>' +
      '<p class="comida__label">Horario de apertura</p>' +
      '<p class="comida__horario">' + K.esc(c.horario) + '</p>' +
      '<div class="comida__botones">' +
        '<a class="btn btn--primario" href="buscar.html?q=' + encodeURIComponent(c.nombre) + '"><img src="' + r + 'icons/food-mapa.svg" width="21" height="21" alt="">Ver Mapa</a>' +
        '<button class="btn btn--borde" type="button" data-menu="' + c.id + '"><img src="' + r + 'icons/food-menu.svg" alt="">Menú</button>' +
      '</div>' +
    '</article>';
  }).join('');

  lista.addEventListener('click', function (e) {
    var b = e.target.closest('[data-menu]');
    if (!b) return;
    var c = comidas.find(function (x) { return x.id === Number(b.dataset.menu); });
    var img = document.getElementById('menu-img');
    img.src = r + 'img/' + c.menu;
    img.alt = c.menu.indexOf('no-disponible') !== -1 ? 'Menú no disponible por ahora' : 'Menú de ' + c.nombre;
    document.getElementById('menu-nombre').textContent = c.menu.indexOf('no-disponible') !== -1 ? c.nombre + ': menú aún no disponible' : 'Menú de ' + c.nombre;
    K.abrirModal('modal-menu');
  });
})();
