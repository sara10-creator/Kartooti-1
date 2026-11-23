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
  var DEL_SERVIDOR = ['eventos', 'comidas', 'puntos', 'lugares', 'planos'];
  var cache = {};          // lo que respondió el servidor
  var hayServidor = false;

  // Datos de respaldo (los mismos de data/*.json)
  var INICIALES = {
    planos: [{"bloque": "B", "piso": "1", "imagen": "b-1.png", "espacios": [{"nombre": "Departamento de Derecho", "alias": ["Derecho"], "zonas": [{"x": 698, "y": 218, "w": 178, "h": 294}]}, {"nombre": "Departamento de Ciencias Básicas", "alias": ["Ciencias básicas"], "zonas": [{"x": 373, "y": 635, "w": 313, "h": 305}]}, {"nombre": "Aula especial 1-A", "alias": ["Aula especial 1A", "1A"], "zonas": [{"x": 700, "y": 635, "w": 322, "h": 305}]}], "ancho": 1400, "alto": 990}, {"bloque": "B", "piso": "2", "imagen": "b-2.png", "espacios": [{"nombre": "B-201", "alias": [], "zonas": [{"x": 33, "y": 218, "w": 319, "h": 294}]}, {"nombre": "B-203", "alias": [], "zonas": [{"x": 365, "y": 218, "w": 159, "h": 294}]}, {"nombre": "B-205", "alias": [], "zonas": [{"x": 524, "y": 218, "w": 154, "h": 294}]}, {"nombre": "B-207", "alias": [], "zonas": [{"x": 698, "y": 218, "w": 178, "h": 294}]}, {"nombre": "B-209", "alias": [], "zonas": [{"x": 876, "y": 218, "w": 146, "h": 294}]}, {"nombre": "B-202", "alias": [], "zonas": [{"x": 373, "y": 635, "w": 313, "h": 305}]}, {"nombre": "B-204", "alias": [], "zonas": [{"x": 700, "y": 635, "w": 322, "h": 305}]}, {"nombre": "B-206", "alias": [], "zonas": [{"x": 1040, "y": 635, "w": 148, "h": 305}]}, {"nombre": "B-208", "alias": [], "zonas": [{"x": 1190, "y": 635, "w": 195, "h": 305}]}], "ancho": 1400, "alto": 990}, {"bloque": "C", "piso": "1", "imagen": "c-1.png", "espacios": [{"nombre": "Biblioteca", "alias": [], "zonas": [{"x": 805, "y": 515, "w": 435, "h": 187}]}, {"nombre": "Hemeroteca", "alias": [], "zonas": [{"x": 606, "y": 515, "w": 96, "h": 187}, {"x": 702, "y": 515, "w": 103, "h": 187}]}], "ancho": 1400, "alto": 990}, {"bloque": "C", "piso": "2", "imagen": "c-2.png", "espacios": [{"nombre": "C-205", "alias": [], "zonas": [{"x": 930, "y": 236, "w": 128, "h": 206}]}, {"nombre": "C-206", "alias": [], "zonas": [{"x": 1058, "y": 236, "w": 182, "h": 206}]}, {"nombre": "C-203", "alias": [], "zonas": [{"x": 805, "y": 515, "w": 232, "h": 187}]}, {"nombre": "C-204", "alias": [], "zonas": [{"x": 1037, "y": 515, "w": 203, "h": 187}]}], "ancho": 1400, "alto": 990}, {"bloque": "C", "piso": "3", "imagen": "c-3.png", "espacios": [{"nombre": "C-305", "alias": [], "zonas": [{"x": 930, "y": 236, "w": 128, "h": 206}]}, {"nombre": "C-306", "alias": [], "zonas": [{"x": 1058, "y": 236, "w": 182, "h": 206}]}, {"nombre": "C-303", "alias": [], "zonas": [{"x": 805, "y": 515, "w": 232, "h": 187}]}, {"nombre": "C-304", "alias": [], "zonas": [{"x": 1037, "y": 515, "w": 203, "h": 187}]}, {"nombre": "Aula especial 3A", "alias": ["Aula especial 3-A", "3A"], "zonas": [{"x": 118, "y": 515, "w": 190, "h": 187}]}], "ancho": 1400, "alto": 990}, {"bloque": "D", "piso": "1", "imagen": "d-1.png", "espacios": [{"nombre": "Departamento de Tecnologías de la Información", "alias": ["Tecnologías de la información", "Departamento TI", "TI"], "zonas": [{"x": 362, "y": 230, "w": 308, "h": 310}]}, {"nombre": "Hemeroteca", "alias": [], "zonas": [{"x": 680, "y": 648, "w": 323, "h": 307}]}], "ancho": 1400, "alto": 990}, {"bloque": "D", "piso": "2", "imagen": "d-2.png", "espacios": [{"nombre": "D-205", "alias": [], "zonas": [{"x": 38, "y": 230, "w": 227, "h": 310}]}, {"nombre": "D-203", "alias": [], "zonas": [{"x": 362, "y": 230, "w": 308, "h": 310}]}, {"nombre": "Laboratorio de diseño", "alias": ["Lab diseño", "Lab de diseño"], "zonas": [{"x": 680, "y": 230, "w": 205, "h": 310}]}, {"nombre": "Salón de dibujo", "alias": ["Salón dibujo", "Dibujo"], "zonas": [{"x": 887, "y": 230, "w": 188, "h": 310}]}, {"nombre": "Departamento de Humanidades", "alias": ["Humanidades"], "zonas": [{"x": 1077, "y": 230, "w": 273, "h": 310}]}, {"nombre": "D-204", "alias": [], "zonas": [{"x": 365, "y": 648, "w": 313, "h": 307}]}, {"nombre": "D-202", "alias": [], "zonas": [{"x": 680, "y": 648, "w": 323, "h": 307}]}, {"nombre": "D-208", "alias": [], "zonas": [{"x": 1005, "y": 648, "w": 343, "h": 307}]}], "ancho": 1400, "alto": 990}, {"bloque": "D", "piso": "3", "imagen": "d-3.png", "espacios": [{"nombre": "D-306", "alias": [], "zonas": [{"x": 38, "y": 230, "w": 227, "h": 310}]}, {"nombre": "D-305", "alias": [], "zonas": [{"x": 362, "y": 230, "w": 308, "h": 310}]}, {"nombre": "D-303", "alias": [], "zonas": [{"x": 680, "y": 230, "w": 205, "h": 310}]}, {"nombre": "D-301", "alias": [], "zonas": [{"x": 887, "y": 230, "w": 188, "h": 310}]}, {"nombre": "D-304", "alias": [], "zonas": [{"x": 365, "y": 648, "w": 313, "h": 307}]}, {"nombre": "D-302", "alias": [], "zonas": [{"x": 680, "y": 648, "w": 323, "h": 307}]}], "ancho": 1400, "alto": 990}, {"bloque": "E", "piso": "2", "imagen": "e-2.png", "espacios": [{"nombre": "E-201", "alias": [], "zonas": [{"x": 365, "y": 372, "w": 107, "h": 143}]}, {"nombre": "E-202", "alias": [], "zonas": [{"x": 365, "y": 515, "w": 107, "h": 105}]}, {"nombre": "E-204", "alias": [], "zonas": [{"x": 365, "y": 620, "w": 107, "h": 110}]}, {"nombre": "E-205", "alias": [], "zonas": [{"x": 365, "y": 730, "w": 107, "h": 115}]}, {"nombre": "E-203", "alias": [], "zonas": [{"x": 510, "y": 425, "w": 118, "h": 265}]}, {"nombre": "E-206", "alias": [], "zonas": [{"x": 365, "y": 918, "w": 110, "h": 107}, {"x": 512, "y": 820, "w": 120, "h": 200}]}, {"nombre": "E-207", "alias": [], "zonas": [{"x": 365, "y": 1025, "w": 110, "h": 95}]}, {"nombre": "E-209", "alias": [], "zonas": [{"x": 365, "y": 1120, "w": 110, "h": 95}]}, {"nombre": "E-208", "alias": [], "zonas": [{"x": 515, "y": 1020, "w": 118, "h": 98}]}, {"nombre": "Auditorios del Bloque E", "alias": ["Auditorio E"], "zonas": [{"x": 405, "y": 15, "w": 183, "h": 190}, {"x": 250, "y": 170, "w": 190, "h": 175}]}], "ancho": 990, "alto": 1400}],
    lugares: [{"id": 1, "nombre": "Bloque A", "categoria": "Bloques", "alias": [], "zona": {"x": 537, "y": 439, "w": 117, "h": 75}, "descripcion": ""}, {"id": 2, "nombre": "Bloque B", "categoria": "Bloques", "alias": [], "zona": {"x": 539, "y": 301, "w": 195, "h": 75}, "descripcion": ""}, {"id": 3, "nombre": "Bloque C", "categoria": "Bloques", "alias": [], "zona": {"x": 539, "y": 172, "w": 195, "h": 80}, "descripcion": ""}, {"id": 4, "nombre": "Bloque D", "categoria": "Bloques", "alias": [], "zona": {"x": 539, "y": 47, "w": 195, "h": 77}, "descripcion": ""}, {"id": 5, "nombre": "Bloque E", "categoria": "Bloques", "alias": [], "zona": {"x": 734, "y": 47, "w": 83, "h": 252}, "descripcion": ""}, {"id": 6, "nombre": "Gym", "categoria": "Espacios", "alias": ["Gimnasio"], "zona": {"x": 331, "y": 140, "w": 42, "h": 36}, "descripcion": ""}, {"id": 7, "nombre": "Café Leyenda", "categoria": "Alimentación", "alias": ["Cafe leyenda"], "zona": {"x": 838, "y": 372, "w": 67, "h": 32}, "descripcion": ""}, {"id": 8, "nombre": "Restaurante", "categoria": "Alimentación", "alias": [], "zona": {"x": 542, "y": 351, "w": 36, "h": 36}, "descripcion": ""}, {"id": 9, "nombre": "Pizzagram", "categoria": "Alimentación", "alias": ["Pizza"], "zona": {"x": 542, "y": 391, "w": 36, "h": 36}, "descripcion": ""}, {"id": 10, "nombre": "Carrito de café", "categoria": "Alimentación", "alias": ["Carrito", "Tinto"], "zona": {"x": 490, "y": 247, "w": 36, "h": 36}, "descripcion": ""}, {"id": 11, "nombre": "Taco más", "categoria": "Alimentación", "alias": ["Tacos", "Taco mas"], "zona": {"x": 682, "y": 546, "w": 36, "h": 36}, "descripcion": ""}, {"id": 12, "nombre": "Hamburguesa", "categoria": "Alimentación", "alias": ["Hamburguesas", "Burger"], "zona": {"x": 744, "y": 541, "w": 36, "h": 36}, "descripcion": ""}, {"id": 13, "nombre": "Aula Máxima", "categoria": "Espacios", "alias": [], "zona": {"x": 282, "y": 45, "w": 128, "h": 120}, "descripcion": ""}, {"id": 14, "nombre": "Auditorios", "categoria": "Espacios", "alias": ["Auditorio", "Auditorio mayor"], "zona": {"x": 734, "y": 301, "w": 97, "h": 88}, "descripcion": ""}, {"id": 15, "nombre": "Plaza Cervantes", "categoria": "Espacios", "alias": [], "zona": {"x": 334, "y": 192, "w": 125, "h": 129}, "descripcion": ""}],
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

    if (DEL_SERVIDOR.indexOf(clave) === -1) return Promise.resolve();
    if (!hayServidor) {
      avisar('Sin conexión con el servidor: el cambio solo quedó en este navegador.');
      return Promise.resolve();
    }

    cache[clave] = copiar(valor);
    return fetch(API + clave, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokenSupabase() },
      body: JSON.stringify(valor)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error(j.error || ('HTTP ' + r.status));
        // Supabase pudo asignar ids nuevos: se copian a la lista para no duplicar en el próximo guardado
        if (Array.isArray(j.ids) && Array.isArray(valor)) {
          j.ids.forEach(function (id, i) { if (valor[i] && id !== undefined) valor[i].id = id; });
          cache[clave] = copiar(valor);
          try { localStorage.setItem('kartooti:' + clave, JSON.stringify(valor)); } catch (e) { /* nada */ }
        }
      });
    }).catch(function (err) {
      console.error('Kartooti: no se pudo guardar "' + clave + '" en el servidor:', err);
      avisar('No se pudo guardar en el servidor: ' + err.message);
      throw err;
    }).then(function () {
      avisar('Guardado en el servidor ✓');
    }, function () { /* ya se avisó */ });
  }

  // Pregunta al servidor si la sesión actual puede guardar (lo usa el panel de admin)
  function verificarAdmin() {
    return fetch(API + 'yo', { headers: { 'Authorization': 'Bearer ' + tokenSupabase() }, cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .catch(function (err) { return { admin: false, motivo: 'No se pudo conectar con el servidor (' + err.message + ').' }; });
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

  // Busca en data/planos.json: primero nombre exacto, luego que lo contenga
  function buscarEnPlanos(compacto) {
    var exactos = [], parecidos = [];
    var limpio = function (s) { return normalizar(s).replace(/[\s-]/g, ''); };
    leer('planos').forEach(function (plano) {
      (plano.espacios || []).forEach(function (esp) {
        var nombres = [esp.nombre].concat(esp.alias || []).map(limpio);
        if (nombres.indexOf(compacto) !== -1) exactos.push({ plano: plano, espacio: esp });
        else if (compacto.length >= 4 && !/\d/.test(compacto) &&
          nombres.some(function (n) { return n.indexOf(compacto) !== -1; })) parecidos.push({ plano: plano, espacio: esp });
      });
    });
    return exactos.length ? exactos : parecidos;
  }

  // Devuelve { lugar, titulo, piso, detalle, plano?, zonas? } o null.
  // Entiende: códigos de salón (B201, b-201), nombres de lugares y sus alias,
  // puntos de interés del admin y restaurantes.
  function buscarLugar(texto) {
    var q = normalizar(texto);
    if (!q) return null;
    var compacto = q.replace(/[\s-]/g, '');

    // 0) Salones y espacios dibujados en los planos de cada piso
    var enPlano = buscarEnPlanos(compacto);
    if (enPlano.length) {
      var r0 = enPlano[0];
      return { lugar: lugarPorNombre('Bloque ' + r0.plano.bloque), titulo: r0.espacio.nombre, piso: r0.plano.piso,
        detalle: 'Bloque ' + r0.plano.bloque, plano: r0.plano, zonas: r0.espacio.zonas,
        tambien: enPlano.slice(1).map(function (x) { return 'Bloque ' + x.plano.bloque + ', piso ' + x.plano.piso; }) };
    }

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
    buscarLugar: buscarLugar, verificarAdmin: verificarAdmin, lugarPorNombre: lugarPorNombre, normalizar: normalizar };
})();
