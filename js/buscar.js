// Kartooti — Buscar ubicación de un salón
(function () {
  var K = Kartooti;
  var form = document.getElementById('form-buscar');
  var input = document.getElementById('b-texto');
  var resultado = document.getElementById('resultado');
  var texto = document.getElementById('resultado-texto');
  var sugerencias = document.getElementById('sugerencias');
  var ayuda = document.getElementById('como-funciona');

  function mostrar(q) {
    q = String(q || '').trim();
    if (!q) {
      input.classList.add('es-error');
      input.focus();
      K.aviso('Escribe un salón, por ejemplo B201');
      return;
    }
    input.classList.remove('es-error');
    var lugar = KartootiDatos.ubicarSalon(q);
    if (lugar) {
      texto.classList.remove('no-encontrado');
      texto.innerHTML = '📍 <b>' + K.esc(lugar.nombre) + '</b> está en <b>' + K.esc(lugar.edificio) + '</b>, piso <b>' + K.esc(lugar.piso) + '</b>.';
    } else {
      texto.classList.add('no-encontrado');
      texto.innerHTML = 'No encontramos <b>' + K.esc(q) + '</b>. Revisa que el código del salón sea correcto (por ejemplo: B201).';
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
    history.replaceState(null, '', location.pathname);
    input.focus();
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); mostrar(input.value); });
  document.getElementById('b-limpiar').addEventListener('click', limpiar);
  document.querySelectorAll('.sugerencia').forEach(function (b) {
    b.addEventListener('click', function () { input.value = b.textContent; mostrar(b.textContent); });
  });

  var inicial = new URLSearchParams(location.search).get('q');
  if (inicial) { input.value = inicial; mostrar(inicial); }
})();
