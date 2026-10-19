// ==========================================================
// Kartooti — Datos de ejemplo (tomados del Figma) y almacén
// compartido. El panel de administración y las páginas
// públicas leen y guardan en el mismo lugar (localStorage),
// así que si el admin publica un evento, aparece en "Eventos".
// Cuando exista la base de datos, solo se cambia este archivo.
// ==========================================================

var KartootiDatos = (function () {
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

  function leer(clave) {
    try {
      var guardado = localStorage.getItem('kartooti:' + clave);
      if (guardado) return JSON.parse(guardado);
    } catch (e) { /* sin almacenamiento disponible */ }
    return copiar(INICIALES[clave] || []);
  }

  function guardar(clave, valor) {
    try { localStorage.setItem('kartooti:' + clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }
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

  return { leer: leer, guardar: guardar, siguienteId: siguienteId, ubicarSalon: ubicarSalon };
})();
