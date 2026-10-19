// Kartooti — Mapa de estudiante
(function () {
  var sesion = null;
  try { sesion = JSON.parse(localStorage.getItem('kartooti:sesion')); } catch (err) {}

  // Si no hay sesión de estudiante, vuelve al login
  if (!sesion || sesion.rol !== 'estudiante') {
    location.replace('login.html');
    return;
  }

  document.getElementById('saludo').textContent = 'Hola, ' + sesion.correo;

  document.getElementById('salir').addEventListener('click', function () {
    localStorage.removeItem('kartooti:sesion');
    location.href = '../index.html#acceso';
  });
})();