// Kartooti — Acceso de invitado
(function () {
  var CODIGOS = ['KART-2026', 'UMNG-VISITA'];   // códigos de ejemplo
  var form = document.getElementById('form-acceso');
  var error = document.getElementById('error');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var codigo = form.codigo.value.trim().toUpperCase();

    if (CODIGOS.indexOf(codigo) === -1) {
      error.textContent = 'Código de invitación no válido.';
      return;
    }

    try {
      localStorage.setItem('kartooti:sesion', JSON.stringify({ rol: 'invitado', codigo: codigo }));
    } catch (err) { /* sin almacenamiento */ }
    location.href = 'mapa.html';
  });
})();