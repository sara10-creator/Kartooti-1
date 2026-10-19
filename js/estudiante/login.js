// Kartooti — Login de estudiante
(function () {
  var DOMINIO = '@unimilitar.edu.co';
  var form = document.getElementById('form-login');
  var error = document.getElementById('error');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var correo = form.correo.value.trim().toLowerCase();
    var clave = form.clave.value;

    if (correo.slice(-DOMINIO.length) !== DOMINIO) {
      error.textContent = 'Usa tu correo institucional (' + DOMINIO + ').';
      return;
    }
    if (clave.length < 6) {
      error.textContent = 'La contraseña debe tener mínimo 6 caracteres.';
      return;
    }

    try {
      localStorage.setItem('kartooti:sesion', JSON.stringify({ rol: 'estudiante', correo: correo }));
    } catch (err) { /* sin almacenamiento */ }
    location.href = 'mapa.html';
  });
})();