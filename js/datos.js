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
  var DEL_SERVIDOR = ['eventos', 'comidas', 'puntos', 'lugares'];
  var cache = {};          // lo que respondió el servidor
  var hayServidor = false;

  // Datos de respaldo (los mismos de data/*.json)
  var INICIALES = {
    lugares: [{"id": 1, "nombre": "Bloque A", "categoria": "Bloques", "alias": [], "zona": {"x": 537, "y": 439, "w": 117, "h": 75}, "descripcion": ""}, {"id": 2, "nombre": "Bloque B", "categoria": "Bloques", "alias": [], "zona": {"x": 539, "y": 301, "w": 195, "h": 75}, "descripcion": ""}, {"id": 3, "nombre": "Bloque C", "categoria": "Bloques", "alias": [], "zona": {"x": 539, "y": 172, "w": 195, "h": 80}, "descripcion": ""}, {"id": 4, "nombre": "Bloque D", "categoria": "Bloques", "alias": [], "zona": {"x": 539, "y": 47, "w": 195, "h": 77}, "descripcion": ""}, {"id": 5, "nombre": "Bloque E", "categoria": "Bloques", "alias": [], "zona": {"x": 734, "y": 47, "w": 83, "h": 252}, "descripcion": ""}, {"id": 6, "nombre": "Bloque F", "categoria": "Bloques", "alias": [], "zona": null, "descripcion": ""}, {"id": 7, "nombre": "Capilla", "categoria": "Hitos", "alias": [], "zona": null, "descripcion": ""}, {"id": 8, "nombre": "Gym", "categoria": "Hitos", "alias": ["Gimnasio"], "zona": {"x": 331, "y": 140, "w": 42, "h": 36}, "descripcion": ""}, {"id": 9, "nombre": "Complejo Deportivo", "categoria": "Hitos", "alias": ["Canchas"], "zona": null, "descripcion": ""}, {"id": 10, "nombre": "Cafeterías", "categoria": "Alimentación", "alias": ["Cafeteria", "Zona de comidas"], "zona": null, "descripcion": ""}, {"id": 11, "nombre": "Café Leyenda", "categoria": "Alimentación", "alias": ["Cafe leyenda"], "zona": {"x": 838, "y": 372, "w": 67, "h": 32}, "descripcion": ""}, {"id": 12, "nombre": "Restaurante", "categoria": "Alimentación", "alias": [], "zona": {"x": 542, "y": 351, "w": 36, "h": 36}, "descripcion": ""}, {"id": 13, "nombre": "Pizzagram", "categoria": "Alimentación", "alias": ["Pizza"], "zona": {"x": 542, "y": 391, "w": 36, "h": 36}, "descripcion": ""}, {"id": 14, "nombre": "Carrito de café", "categoria": "Alimentación", "alias": ["Carrito", "Tinto"], "zona": {"x": 490, "y": 247, "w": 36, "h": 36}, "descripcion": ""}, {"id": 15, "nombre": "Taco más", "categoria": "Alimentación", "alias": ["Tacos", "Taco mas"], "zona": {"x": 682, "y": 546, "w": 36, "h": 36}, "descripcion": ""}, {"id": 16, "nombre": "Hamburguesa", "categoria": "Alimentación", "alias": ["Hamburguesas", "Burger"], "zona": {"x": 744, "y": 541, "w": 36, "h": 36}, "descripcion": ""}, {"id": 17, "nombre": "Aula Máxima", "categoria": "Espacios", "alias": [], "zona": {"x": 282, "y": 45, "w": 128, "h": 120}, "descripcion": ""}, {"id": 18, "nombre": "Auditorios", "categoria": "Espacios", "alias": ["Auditorio", "Auditorio mayor"], "zona": {"x": 734, "y": 301, "w": 97, "h": 88}, "descripcion": ""}, {"id": 19, "nombre": "Plaza Cervantes", "categoria": "Espacios", "alias": [], "zona": {"x": 334, "y": 192, "w": 125, "h": 129}, "descripcion": ""}, {"id": 20, "nombre": "Hub de Innovación", "categoria": "Espacios", "alias": ["Hub"], "zona": null, "descripcion": ""}, {"id": 21, "nombre": "Acceso", "categoria": "Acceso", "alias": ["Entrada", "Entrada principal", "Porteria"], "zona": null, "descripcion": ""}],
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
      { id: 1, nombre: 'Café leyenda', icono: '☕', horario: '7:00 AM - 7:00 PM', menu: 'menu-cafe-leyenda.jpg', menuTexto: 'Este establecimiento no cuenta con un menú. Acércate al mismo para ver su oferta. Precio promedio: 5k - 10k.', edificio: 'Exterior', piso: '1' },
      { id: 2, nombre: 'Hamburguesa', icono: '🍔', horario: '1:00 PM - 8:00 PM', menu: 'menu-hamburguesa.jpg', edificio: 'Zona de comidas', piso: '1' },
      { id: 3, nombre: 'Taco más', icono: '🌮', horario: '12 M - 8:00 PM', menu: 'menu-no-disponible.jpg', edificio: 'Zona de comidas', piso: '1' },
      { id: 5, nombre: 'Pizzagram', icono: '🍕', horario: '1:00 PM - 7:00 PM', menu: 'menu-pizzagram.jpg', edificio: 'Zona de comidas', piso: '1' },
      { id: 6, nombre: 'Restaurante', icono: '🍴', horario: '7:00 AM - 7:00 PM', menu: 'menu-restaurante.jpg', edificio: 'Bloque central', piso: '1' },
      { id: 7, nombre: 'Carrito de café', icono: '☕', horario: '6:00 AM - 7:00 PM', menu: 'menu-carrito-cafe.jpg', menuTexto: 'Este establecimiento no cuenta con un menú. Acércate al mismo para ver su oferta. Precio promedio: 4k - 8k.', edificio: 'Entrada principal', piso: '1' }
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
  // ---------- Búsqueda de lugares del campus ----------
  // Quita tildes, espacios de más y mayúsculas para comparar
  function normalizar(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  }

  function lugarPorNombre(nombre) {
    var n = normalizar(nombre);
    if (!n) return null;
    return leer('lugares').find(function (l) {
      return normalizar(l.nombre) === n || (l.alias || []).some(function (a) { return normalizar(a) === n; });
    }) || null;
  }

  // Devuelve { lugar, titulo, piso, detalle } o null.
  // Entiende: códigos de salón (B201, b-201), nombres de lugares y sus alias,
  // puntos de interés del admin y restaurantes.
  function buscarLugar(texto) {
    var q = normalizar(texto);
    if (!q) return null;
    var compacto = q.replace(/[\s-]/g, '');

    // 1) Puntos de interés registrados por el admin (salones, laboratorios…)
    var punto = leer('puntos').find(function (x) {
      var n = normalizar(x.nombre).replace(/[\s-]/g, '');
      return n === compacto || n.replace(/^salon/, '') === compacto;
    });
    if (punto) {
      return { lugar: lugarPorNombre(punto.edificio) || lugarPorNombre(punto.nombre), titulo: punto.nombre,
        piso: punto.piso, detalle: punto.edificio };
    }

    // 2) Código de salón: letra del bloque + piso + número
    var m = compacto.match(/^(?:salon)?([a-z])(\d)(\d{1,2})$/);
    if (m) {
      var bloque = lugarPorNombre('Bloque ' + m[1].toUpperCase());
      if (bloque) return { lugar: bloque, titulo: compacto.toUpperCase().replace(/^SALON/, ''), piso: m[2], detalle: bloque.nombre };
    }

    // 3) Lugares del campus: exacto, luego que empiece igual, luego que lo contenga
    var lugares = leer('lugares');
    var nombres = function (l) { return [l.nombre].concat(l.alias || []).map(normalizar); };
    var q2 = q.replace(/^bloque\s*/, 'bloque ');
    if (/^[a-f]$/.test(q)) q2 = 'bloque ' + q;
    var exacto = lugares.find(function (l) { return nombres(l).indexOf(q2) !== -1; });
    var empieza = lugares.find(function (l) { return nombres(l).some(function (n) { return n.indexOf(q2) === 0; }); });
    var contiene = lugares.find(function (l) { return nombres(l).some(function (n) { return n.indexOf(q2) !== -1; }); });
    var l = exacto || empieza || contiene;
    if (l) return { lugar: l, titulo: l.nombre, piso: '', detalle: l.categoria };

    // 4) Restaurantes de la sección de comidas
    var c = leer('comidas').find(function (x) { return normalizar(x.nombre).indexOf(q) !== -1; });
    if (c) return { lugar: lugarPorNombre(c.edificio) || lugarPorNombre(c.nombre), titulo: c.nombre, piso: c.piso, detalle: c.edificio };

    return null;
  }

  // Compatibilidad con el código anterior
  function ubicarSalon(texto) {
    var r = buscarLugar(texto);
    return r ? { nombre: r.titulo, edificio: r.lugar ? r.lugar.nombre : r.detalle, piso: r.piso } : null;
  }

  return { listo: listo, leer: leer, guardar: guardar, siguienteId: siguienteId, ubicarSalon: ubicarSalon,
    buscarLugar: buscarLugar, lugarPorNombre: lugarPorNombre, normalizar: normalizar };
})();
