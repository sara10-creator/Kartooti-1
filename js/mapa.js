// Kartooti — Mapa interactivo: acercar, alejar y arrastrar
(function () {
  var ventana = document.getElementById('mapa-ventana');
  var img = document.getElementById('mapa-img');
  var valor = document.getElementById('zoom-valor');
  var mas = document.getElementById('zoom-mas');
  var menos = document.getElementById('zoom-menos');
  if (!ventana || !img) return;

  var MIN = 100, MAX = 300, PASO = 20;
  var zoom = 100;

  function aplicar(nuevo) {
    // Mantiene el centro de la vista al cambiar el zoom
    var cx = (ventana.scrollLeft + ventana.clientWidth / 2) / ventana.scrollWidth;
    var cy = (ventana.scrollTop + ventana.clientHeight / 2) / ventana.scrollHeight;
    zoom = Math.max(MIN, Math.min(MAX, nuevo));
    img.style.width = zoom + '%';
    img.style.height = zoom + '%';
    valor.textContent = zoom + '%';
    mas.disabled = zoom >= MAX;
    menos.disabled = zoom <= MIN;
    requestAnimationFrame(function () {
      ventana.scrollLeft = cx * ventana.scrollWidth - ventana.clientWidth / 2;
      ventana.scrollTop = cy * ventana.scrollHeight - ventana.clientHeight / 2;
    });
  }

  mas.addEventListener('click', function () { aplicar(zoom + PASO); });
  menos.addEventListener('click', function () { aplicar(zoom - PASO); });

  // Teclado: + y - cuando el mapa tiene el foco
  ventana.addEventListener('keydown', function (e) {
    if (e.key === '+' || e.key === '=') { e.preventDefault(); aplicar(zoom + PASO); }
    if (e.key === '-') { e.preventDefault(); aplicar(zoom - PASO); }
  });

  // Arrastrar con el mouse para desplazarse
  var arrastrando = false, x0 = 0, y0 = 0, sl = 0, st = 0;
  ventana.addEventListener('mousedown', function (e) {
    arrastrando = true; x0 = e.clientX; y0 = e.clientY; sl = ventana.scrollLeft; st = ventana.scrollTop;
    ventana.classList.add('arrastrando');
  });
  window.addEventListener('mousemove', function (e) {
    if (!arrastrando) return;
    ventana.scrollLeft = sl - (e.clientX - x0);
    ventana.scrollTop = st - (e.clientY - y0);
  });
  window.addEventListener('mouseup', function () {
    arrastrando = false;
    ventana.classList.remove('arrastrando');
  });

  aplicar(140); // el diseño muestra el mapa al 140 %
})();
