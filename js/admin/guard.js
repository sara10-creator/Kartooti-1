import { supabase } from '../supabase.js';

(async function () {
  function cerrarSesionLocal() {
    if (window.Kartooti) {
      window.Kartooti.cerrarSesion();
    } else {
      localStorage.removeItem('kartooti:sesion');
    }
  }

  function mostrarError(texto) {
    var estado = document.getElementById('auth-status');
    if (!estado) {
      document.documentElement.classList.remove('auth-pending');
      return;
    }

    estado.replaceChildren();
    var mensaje = document.createElement('p');
    mensaje.textContent = texto;
    var enlace = document.createElement('a');
    enlace.href = 'login.html';
    enlace.textContent = 'Ir al inicio de sesión administrativo';
    estado.appendChild(mensaje);
    estado.appendChild(enlace);
  }

  function mensajeDeError(err) {
    if (location.protocol === 'file:') {
      return 'Esta página necesita un servidor HTTP. Iníciala con npm run dev o Live Server; no la abras directamente desde el archivo HTML.';
    }
    if (err.code === 'PGRST205' || err.code === '42P01') {
      return 'No existe la tabla public.profiles. Ejecuta la migración de Supabase antes de entrar al panel.';
    }
    return 'No se pudo validar el acceso. Comprueba la conexión y la configuración de Supabase.';
  }

  try {
    var autenticacion = await supabase.auth.getSession();
    if (autenticacion.error) throw autenticacion.error;
    if (!autenticacion.data.session) {
      cerrarSesionLocal();
      location.replace('login.html');
      return;
    }
    var usuario = autenticacion.data.session.user;

    var consulta = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', usuario.id)
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
      id: usuario.id,
      nombre: consulta.data.full_name,
      correo: usuario.email,
      rol: 'Administrador'
    });
    var estado = document.getElementById('auth-status');
    if (estado) estado.remove();
    document.documentElement.classList.remove('auth-pending');
  } catch (err) {
    console.error('No se pudo comprobar el acceso administrativo:', err);
    cerrarSesionLocal();
    mostrarError(mensajeDeError(err));
  }
})();
