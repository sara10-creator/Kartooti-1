// ==========================================================
// Kartooti — Datos compartidos
//
// Eventos, comidas y puntos de interés vienen del servidor
// (server.js), que los lee de la carpeta data/*.json.
// Las páginas esperan a KartootiDatos.listo antes de pintar.
//
// Si no hay servidor (por ejemplo, abriendo el HTML con doble
// clic o con Live Server), se usan los datos de respaldo de
// abajo y los cambios del admin se guardan solo en este navegador.
// ==========================================================

var KartootiDatos = (function () {
  // Dirección de la API. Vacía = el mismo servidor que sirve la página.
  // Si algún día la API está en otro dominio: window.KARTOOTI_API = 'https://...'
  var API = (window.KARTOOTI_API || '') + '/api/';
  var DEL_SERVIDOR = ['eventos', 'comidas', 'puntos'];
  var cache = {};          // lo que respondió el servidor
  var hayServidor = false;

  // Datos de respaldo (los mismos de data/*.json)
  var INICIALES = {
    eventos: [
      { id: 1, titulo: 'Congreso internacional', categoria: 'Académico', estado: 'Publicado', dia: '25', mes: 'AGO', fecha: '2026-08-25', fechaTexto: '25, 26 y 27 de agosto', hora: '10:00 AM - 12:00 M', lugar: 'Aula máxima', color: 'primario', descripcion: '' },
      { id: 2, titulo: 'Conferencia animar', categoria: 'Cultural', estado: 'Publicado', dia: '19', mes: 'MAY', fecha: '2026-05-19', fechaTexto: 'Contigo desde el primer semestre de septiembre', hora: '1:00 PM', lugar: 'Aula especial XVII', color: 'verde', descripcion: '' },
      { id: 3, titulo: 'Festival barranquilla', categoria: 'Cultural', estado: 'Publicado', dia: '19', mes: 'MAY', fecha: '2026-05-19', fechaTexto: '25 de agosto', hora: '3:00 PM', lugar: 'Plaza Cervantes', color: 'amarillo', descripcion: '' },
      { id: 4, titulo: 'Vitrina científica', categoria: 'Académico', estado: 'Borrador', dia: '19', mes: 'SEP', fecha: '2026-09-19', fechaTexto: '19 de septiembre', hora: '9:00 AM - 5:00 PM', lugar: 'Auditorio mayor', color: 'primario', descripcion: 'Muestra de proyectos científicos de estudiantes y docentes.' },
      { id: 5, titulo: 'Torneo de fútbol', categoria: 'Deportivo', estado: 'Pendiente', dia: '15', mes: 'SEP', fecha: '2026-09-15', fechaTexto: '15 de septiembre', hora: '7:00 AM - 6:00 PM', lugar: 'Cancha norte', color: 'verde', descripcion: '' }
    ],
    puntos: [
      { id: 1, nombre: 'Lab. física mecánica', tipo: 'Laboratorio', edificio: 'Sótanos', piso: '0', estado: 'Activo', descripcion: '' },
      { id: 2, nombre: 'Aula máxima', tipo: 'Auditorio', edificio: 'Exterior', piso: '1', estado: 'Activo', descripcion: '' },
      { id: 3, nombre: 'C110', tipo: 'Salón', edificio: 'Bloque C', piso: '1', estado: 'Inactivo', descripcion: '' },
      { id: 4, nombre: 'Café leyenda', tipo: 'Cafetería', edificio: 'Exterior', piso: '1', estado: 'Activo', descripcion: '' },
      { id: 5, nombre: 'Salón E510', tipo: 'Salón', edificio: 'Bloque E', piso: '5', estado: 'Pendiente', descripcion: '' }
    ],
    usuarios: [
      { id: 1, nombre: 'Valentina Torres', correo: 'v.torres@unimilitar.edu.co', codigo: '1100001', rol: 'Estudiante', estado: 'Activo', registro: '10 Ene 2026', acceso: 'Hoy' },
      { id: 2, nombre: 'Diego Martínez', correo: 'diego.mtz@gmail.com', codigo: '', rol: 'Invitado', estado: 'Pendiente', registro: '02 Feb 2026', acceso: 'Nunca' },
      { id: 3, nombre: 'Juan Pérez', correo: 'juan.perez@unimilitar.edu.co', codigo: '1100003', rol: 'Estudiante', estado: 'Suspendido', registro: '15 Ene 2026', acceso: 'Hace 1 semana' },
      { id: 4, nombre: 'Laura Niño', correo: 'l.nino@unimilitar.edu.co', codigo: '1100004', rol: 'Estudiante', estado: 'Activo', registro: '20 Ene 2026', acceso: 'Ayer' },
      { id: 5, nombre: 'Carlos Mejía', correo: 'carlos.mejia@unimilitar.edu.co', codigo: '1100005', rol: 'Estudiante', estado: 'Activo', registro: '28 Ene 2026', acceso: 'Hoy' }
    ],
    comidas: [
      { id: 1, nombre: 'Café leyenda', icono: '☕', horario: '7:00 AM - 7:00 PM', menu: 'menu-no-disponible.jpg', edificio: 'Exterior', piso: '1' },
      { id: 2, nombre: 'Hamburguesa', icono: '🍔', horario: '1:00 PM - 8:00 PM', menu: 'menu-hamburguesa.jpg', edificio: 'Zona de comidas', piso: '1' },
      { id: 3, nombre: 'Taco más', icono: '🌮', horario: '12 M - 8:00 PM', menu: 'menu-no-disponible.jpg', edificio: 'Zona de comidas', piso: '1' },
      { id: 4, nombre: 'MUY', icono: '🍽️', horario: '7:00 AM - 4:00 PM', menu: 'menu-muy.jpg', edificio: 'Zona de comidas', piso: '1' },
      { id: 5, nombre: 'Pizzagram', icono: '🍕', horario: '1:00 PM - 7:00 PM', menu: 'menu-pizzagram.jpg', edificio: 'Zona de comidas', piso: '1' },
      { id: 6, nombre: 'Restaurante', icono: '🍴', horario: '7:00 AM - 7:00 PM', menu: 'menu-restaurante.jpg', edificio: 'Bloque central', piso: '1' },
      { id: 7, nombre: 'Carrito de café', icono: '☕', horario: '6:00 AM - 7:00 PM', menu: 'menu-no-disponible.jpg', edificio: 'Entrada principal', piso: '1' }
    ],
    actividad: [
      { tipo: 'usuario', titulo: 'Nuevo usuario registrado', detalle: 'est.hkshda@unimilitar.edu.co' },
      { tipo: 'punto', titulo: 'Punto de interés actualizado', detalle: 'Bloque D - Aula de diseño' },
      { tipo: 'evento', titulo: 'Evento publicado', detalle: 'Feria de innovación tecnológica' },
      { tipo: 'usuario', titulo: 'Nuevo usuario registrado', detalle: 'est.hkshda@unimilitar.edu.co' },
      { tipo: 'evento', titulo: 'Evento publicado', detalle: 'Feria de innovación tecnológica' },
      { tipo: 'evento', titulo: 'Evento publicado', detalle: 'Feria de innovación tecnológica' }
    ]
  };

  function copiar(x) { return JSON.parse(JSON.stringify(x)); }

  // ---------- Carga inicial desde el servidor ----------
  function pedir(clave) {
    return fetch(API + clave, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (datos) {
      cache[clave] = datos;
    });
  }

  var listo = Promise.all(DEL_SERVIDOR.map(pedir))
    .then(function () { hayServidor = true; })
    .catch(function (err) {
      cache = {};
      console.warn('Kartooti: no se pudo conectar con la API, se usan datos locales.', err);
    });

  function leer(clave) {
    // 1) Lo que dio el servidor (eventos, comidas, puntos)
    if (hayServidor && cache[clave]) return copiar(cache[clave]);
    // 2) Lo guardado en este navegador
    try {
      var guardado = localStorage.getItem('kartooti:' + clave);
      if (guardado) return JSON.parse(guardado);
    } catch (e) { /* sin almacenamiento disponible */ }
    // 3) Datos de respaldo
    return copiar(INICIALES[clave] || []);
  }

  // Token de la sesión de Supabase (lo guarda supabase-js en localStorage)
  function tokenSupabase() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (/^sb-.*-auth-token$/.test(k)) {
          var sesion = JSON.parse(localStorage.getItem(k));
          if (sesion && sesion.access_token) return sesion.access_token;
        }
      }
    } catch (e) { /* sin almacenamiento */ }
    return '';
  }

  function avisar(texto) {
    if (window.Kartooti && Kartooti.aviso) Kartooti.aviso(texto);
    else console.warn(texto);
  }

  // Guarda en el navegador y, si es eventos/comidas/puntos, también en el servidor
  function guardar(clave, valor) {
    try { localStorage.setItem('kartooti:' + clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }

    if (!hayServidor || DEL_SERVIDOR.indexOf(clave) === -1) return Promise.resolve();

    cache[clave] = copiar(valor);
    return fetch(API + clave, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokenSupabase() },
      body: JSON.stringify(valor)
    }).then(function (r) {
      if (!r.ok) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          throw new Error(j.error || ('HTTP ' + r.status));
        });
      }
    }).catch(function (err) {
      console.error('Kartooti: no se pudo guardar "' + clave + '" en el servidor:', err);
      avisar('No se pudo guardar en el servidor: ' + err.message);
    });
  }

  function siguienteId(lista) {
    return lista.reduce(function (m, x) { return Math.max(m, x.id || 0); }, 0) + 1;
  }

  // Busca un salón tipo "B201": bloque = letra, piso = primer número
  function ubicarSalon(texto) {
    var t = String(texto || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!t) return null;
    var puntos = leer('puntos');
    var normal = function (s) { return String(s).toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ''); };
    var p = puntos.find(function (x) { return normal(x.nombre).indexOf(normal(t)) !== -1; });
    if (p) return { nombre: p.nombre, edificio: p.edificio, piso: p.piso };
    var c = leer('comidas').find(function (x) { return normal(x.nombre) === normal(t) && x.edificio; });
    if (c) return { nombre: c.nombre, edificio: c.edificio, piso: c.piso };
    var m = t.match(/^([A-Z])(\d)(\d{1,2})$/);
    if (m) return { nombre: t, edificio: 'Bloque ' + m[1], piso: m[2] };
    return null;
  }

  return { listo: listo, leer: leer, guardar: guardar, siguienteId: siguienteId, ubicarSalon: ubicarSalon };
})();
