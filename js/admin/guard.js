import { supabase } from '../supabase.js';

(async function () {
  function cerrarSesionLocal() {
    if (window.Kartooti) {
      window.Kartooti.cerrarSesion();
    } else {
      localStorage.removeItem('kartooti:sesion');
    }
  }

  try {
    var autenticacion = await supabase.auth.getUser();
    if (autenticacion.error) throw autenticacion.error;
    if (!autenticacion.data.user) {
      cerrarSesionLocal();
      location.replace('login.html');
      return;
    }

    var consulta = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', autenticacion.data.user.id)
      .maybeSingle();
    if (consulta.error) throw consulta.error;

    if (!consulta.data || consulta.data.role !== 'admin') {
      var salida = await supabase.auth.signOut();
      if (salida.error) console.error('No se pudo cerrar la sesión sin permisos administrativos:', salida.error);
      cerrarSesionLocal();
      location.replace('login.html');
      return;
    }

    window.Kartooti.iniciarSesion({
      id: autenticacion.data.user.id,
      nombre: consulta.data.full_name,
      correo: autenticacion.data.user.email,
      rol: 'Administrador'
    });
    document.documentElement.classList.remove('auth-pending');
  } catch (err) {
    console.error('No se pudo comprobar el acceso administrativo:', err);
    cerrarSesionLocal();
    window.alert('No se pudo validar tu acceso. Comprueba la conexión y que la migración de perfiles esté aplicada.');
    location.replace('login.html');
  }
})();
