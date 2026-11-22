// Kartooti — Mapa de estudiante
import { supabase } from '../supabase.js';

(async function () {
  var sesion = null;
  try { sesion = JSON.parse(localStorage.getItem('kartooti:sesion')); } catch (err) {}

  var resultado;
  try {
    resultado = await supabase.auth.getUser();
    if (resultado.error) throw resultado.error;
  } catch (err) {
    console.error('Error al comprobar la sesión con Supabase:', err);
    location.replace('login.html');
    return;
  }

  // Si no hay sesión autenticada de estudiante, vuelve al login
  if (!resultado.data.user || !sesion || sesion.rol !== 'estudiante') {
    localStorage.removeItem('kartooti:sesion');
    location.replace('login.html');
    return;
  }

  document.getElementById('saludo').textContent = 'Hola, ' + (sesion.nombre || sesion.correo);

  document.getElementById('salir').addEventListener('click', async function (e) {
    var boton = e.currentTarget;
    boton.disabled = true;
    try {
      var salida = await supabase.auth.signOut();
      if (salida.error) throw salida.error;
      localStorage.removeItem('kartooti:sesion');
      location.href = '../index.html#acceso';
    } catch (err) {
      console.error('Error al cerrar sesión con Supabase:', err);
      window.alert('No fue posible cerrar la sesión. Inténtalo de nuevo.');
      boton.disabled = false;
    }
  });
})();