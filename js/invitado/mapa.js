// Kartooti — Mapa de invitado
(function () {
  var sesion = null;
  try { sesion = JSON.parse(localStorage.getItem('kartooti:sesion')); } catch (err) {}

  // Si no hay sesión de invitado, vuelve al acceso
  if (!sesion || sesion.rol !== 'invitado') {
    location.replace('acceso.html');
    return;
  }

  document.getElementById('saludo').textContent = 'Hola, invitado';

  document.getElementById('salir').addEventListener('click', function () {
    localStorage.removeItem('kartooti:sesion');
    location.href = '../index.html#acceso';
  });
})();