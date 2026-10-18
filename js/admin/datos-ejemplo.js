// ==========================================================
// Kartooti — Datos de ejemplo del panel (tomados del diseño)
// Cuando exista una base de datos, estos arreglos se reemplazan
// por las respuestas del servidor.
// ==========================================================

var DATOS_PUNTOS = [
  { id: 1, nombre: 'Salón 101', tipo: 'Salón', edificio: 'Bloque A', piso: '1', estado: 'Activo', descripcion: '' },
  { id: 2, nombre: 'Lab. de Sistemas', tipo: 'Laboratorio', edificio: 'Bloque B', piso: '2', estado: 'Activo', descripcion: 'Laboratorio de computación con 30 equipos.' },
  { id: 3, nombre: 'Biblioteca Central', tipo: 'Biblioteca', edificio: 'Edificio Principal', piso: '1', estado: 'Activo', descripcion: '' },
  { id: 4, nombre: 'Cafetería Norte', tipo: 'Cafetería', edificio: 'Zona Norte', piso: '1', estado: 'Activo', descripcion: '' },
  { id: 5, nombre: 'Auditorio Mayor', tipo: 'Auditorio', edificio: 'Bloque Central', piso: '1', estado: 'Activo', descripcion: '' },
  { id: 6, nombre: 'Sala de Cómputo D', tipo: 'Salón', edificio: 'Bloque D', piso: '3', estado: 'Pendiente', descripcion: '' },
  { id: 7, nombre: 'Cafetería Sur', tipo: 'Cafetería', edificio: 'Zona Sur', piso: '1', estado: 'Inactivo', descripcion: '' }
];

var DATOS_USUARIOS = [
  { id: 1, nombre: 'Valentina Torres', correo: 'v.torres@uni.edu', rol: 'Estudiante', estado: 'Activo', acceso: 'Hoy', registro: '10 Ene 2026' },
  { id: 2, nombre: 'Carlos Mejía', correo: 'carlos.mejia@uni.edu', rol: 'Estudiante', estado: 'Activo', acceso: 'Ayer', registro: '14 Ene 2026' },
  { id: 3, nombre: 'Sofía Ramírez', correo: 's.ramirez@uni.edu', rol: 'Estudiante', estado: 'Pendiente', acceso: 'Nunca', registro: '02 Feb 2026' },
  { id: 4, nombre: 'Miguel Ángel Castro', correo: 'm.castro@uni.edu', rol: 'Estudiante', estado: 'Activo', acceso: 'Hace 2 días', registro: '20 Ene 2026' },
  { id: 5, nombre: 'Juan Pérez', correo: 'juan.perez@uni.edu', rol: 'Estudiante', estado: 'Suspendido', acceso: 'Hace 1 sem', registro: '11 Ene 2026' },
  { id: 6, nombre: 'Laura Niño', correo: 'l.nino@uni.edu', rol: 'Estudiante', estado: 'Activo', acceso: 'Hoy', registro: '05 Feb 2026' },
  { id: 7, nombre: 'Visitante Externo', correo: 'visitante_ext@gmail.com', rol: 'Invitado', estado: 'Activo', acceso: 'Hoy', registro: '18 Oct 2026' },
  { id: 8, nombre: 'Administrador', correo: 'admin@universidad.edu', rol: 'Admin', estado: 'Activo', acceso: 'Hoy', registro: '01 Ene 2026' }
];

var DATOS_EVENTOS = [
  { id: 1, titulo: 'Vitrina Científica', lugar: 'Auditorio Mayor', categoria: 'Académico', fecha: '2026-09-19', hora: '9:00 AM - 5:00 PM', estado: 'Publicado', capacidad: 300, descripcion: 'Muestra de proyectos científicos de estudiantes y docentes.' },
  { id: 2, titulo: 'Sistema Drones y Antidromes: Retos y Oportunidades', lugar: 'Salón 201 — Bloque B', categoria: 'Tecnología', fecha: '2026-10-08', hora: '2:00 PM - 6:00 PM', estado: 'Publicado', capacidad: 80, descripcion: '' },
  { id: 3, titulo: 'XVI Congreso Internacional de Biorética', lugar: 'Campus Mayor Germán', categoria: 'Académico', fecha: '2026-11-12', hora: '8:00 AM - 6:00 PM', estado: 'Publicado', capacidad: 500, descripcion: '' },
  { id: 4, titulo: 'Feria de Innovación Tecnológica', lugar: 'Zona de Exposición Norte', categoria: 'Tecnología', fecha: '2026-11-22', hora: '10:00 AM - 4:00 PM', estado: 'Publicado', capacidad: 400, descripcion: '' },
  { id: 5, titulo: 'Congreso Nacional de Ingeniería', lugar: 'Auditorio y Salones Varios', categoria: 'Académico', fecha: '2026-12-03', hora: '8:00 AM - 7:00 PM', estado: 'Publicado', capacidad: 600, descripcion: '' },
  { id: 6, titulo: 'Torneo de Fútbol — Copa Campus', lugar: 'Cancha Norte', categoria: 'Deportivo', fecha: '2026-09-15', hora: '7:00 AM - 6:00 PM', estado: 'Borrador', capacidad: 200, descripcion: '' },
  { id: 7, titulo: 'Festival Cultural Universitario', lugar: 'Plaza Central', categoria: 'Cultural', fecha: '2026-10-28', hora: '4:00 PM - 9:00 PM', estado: 'Borrador', capacidad: 1000, descripcion: '' }
];

// Colores de cada etiqueta según el diseño
var COLORES = {
  tipo: { 'Salón': 'teal', 'Laboratorio': 'violet', 'Biblioteca': 'blue', 'Cafetería': 'green', 'Auditorio': 'amber' },
  estado: { 'Activo': 'green', 'Pendiente': 'amber', 'Inactivo': 'gray', 'Suspendido': 'red', 'Publicado': 'green', 'Borrador': 'gray', 'Finalizado': 'blue' },
  rol: { 'Estudiante': 'teal', 'Invitado': 'amber', 'Admin': 'violet' },
  categoria: { 'Académico': 'teal', 'Tecnología': 'violet', 'Deportivo': 'green', 'Cultural': 'pink' },
  punto: { 'Académico': '#2a9db5', 'Tecnología': '#8e51ff', 'Deportivo': '#00bc7d', 'Cultural': '#f6339a' }
};
