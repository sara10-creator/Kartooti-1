// ==========================================================
// Kartooti — Servidor (backend) para Render
//
// - Sirve la página web (HTML, CSS, JS, imágenes).
// - Eventos y puntos se guardan en Supabase (tablas eventos y puntos_interes);
//   comidas, lugares y planos siguen en la carpeta data/.
// - Entrega los datos como API:
//     GET  /api/eventos   GET /api/comidas   GET /api/puntos   GET /api/lugares
// - Permite que un ADMIN guarde cambios:
//     PUT  /api/eventos  (con la sesión de Supabase del admin)
//
// El login y registro siguen en Supabase. Este servidor solo
// comprueba con Supabase que quien guarda sea administrador.
// ==========================================================

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const CARPETA_DATOS = path.join(RAIZ, 'data');
const PUERTO = process.env.PORT || 3000;

// Mismos datos públicos que usa js/supabase.js (la clave publishable no es secreta).
// En Render puedes sobrescribirlos con variables de entorno.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gybfizqkjnttwggnzogz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_GdcuaDvL2m4HWGNXtMHPww_qqUPFmye';

// Colecciones que edita el admin y la tabla de Supabase donde viven.
// Cada campo de la página puede llamarse distinto en la tabla: se prueban
// los nombres en orden y se usa el primero que exista en esa tabla.
const TABLAS = {
  eventos: {
    tabla: process.env.TABLA_EVENTOS || 'eventos',
    campos: {
      id: ['id'], titulo: ['titulo', 'nombre'], categoria: ['categoria', 'tipo'], estado: ['estado'],
      fecha: ['fecha'], dia: ['dia'], mes: ['mes'], fechaTexto: ['fecha_texto', 'fechaTexto'],
      hora: ['hora'], lugar: ['lugar', 'ubicacion'], color: ['color'], descripcion: ['descripcion'],
      medio: ['medio', 'imagen', 'imagen_url']
    },
    // Columnas de fecha y hora juntas (timestamp): se llenan con la fecha y la hora del formulario
    extra: ['inicio', 'fin']
  },
  puntos: {
    tabla: process.env.TABLA_PUNTOS || 'puntos_interes',
    campos: {
      id: ['id'], nombre: ['nombre', 'titulo'], tipo: ['tipo', 'categoria'], edificio: ['edificio', 'bloque', 'ubicacion'],
      piso: ['piso'], estado: ['estado'], descripcion: ['descripcion'], medio: ['medio', 'imagen', 'imagen_url']
    }
  }
};
const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const COLOR = { 'Académico': 'primario', Cultural: 'amarillo', Deportivo: 'verde', 'Tecnología': 'primario' };
const ZONA = '-05:00'; // hora de Colombia

// "9:00 AM - 5:00 PM" → ['09:00', '17:00'];  "10:00 AM - 12:00 M" → ['10:00', '12:00']
function horasDe(texto) {
  const res = [];
  const re = /(\d{1,2})(?::(\d{2}))?\s*(a\.?\s*m\.?|p\.?\s*m\.?|m\b)?/gi;
  let m;
  while ((m = re.exec(String(texto || ''))) && res.length < 2) {
    let h = Number(m[1]);
    const min = m[2] || '00';
    const suf = (m[3] || '').toLowerCase().replace(/[\s.]/g, '');
    if (h > 23) continue;
    if (suf === 'pm' && h < 12) h += 12;
    if (suf === 'am' && h === 12) h = 0;
    res.push(String(h).padStart(2, '0') + ':' + min);
  }
  return res;
}

// Fecha (AAAA-MM-DD) y hora a texto ISO con la zona de Colombia
function aMarcaDeTiempo(fecha, hhmm) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha || '')) return null;
  return fecha + 'T' + (hhmm || '00:00') + ':00' + ZONA;
}

// Marca de tiempo → { fecha, hora } en hora de Colombia
function deMarcaDeTiempo(valor) {
  const d = new Date(valor);
  if (isNaN(d)) return null;
  const local = new Date(d.getTime() - 5 * 3600 * 1000);
  const fecha = local.toISOString().slice(0, 10);
  let h = local.getUTCHours();
  const min = String(local.getUTCMinutes()).padStart(2, '0');
  const suf = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return { fecha, hora: h + ':' + min + ' ' + suf };
}

// Solo estas colecciones existen en la API
const COLECCIONES = ['eventos', 'comidas', 'puntos', 'lugares', 'planos'];

const app = express();
app.use(express.json({ limit: '1mb' }));

// ---------- Utilidades ----------
function rutaDe(coleccion) {
  return path.join(CARPETA_DATOS, coleccion + '.json');
}

async function leerColeccion(coleccion) {
  const texto = await readFile(rutaDe(coleccion), 'utf8');
  return JSON.parse(texto);
}

// Escribe en un archivo temporal y luego lo renombra,
// así nunca queda un JSON a medio escribir.
async function guardarColeccion(coleccion, datos) {
  const destino = rutaDe(coleccion);
  const temporal = destino + '.tmp';
  await writeFile(temporal, JSON.stringify(datos, null, 2) + '\n', 'utf8');
  await rename(temporal, destino);
}

// ---------- Supabase como base de datos ----------
function clienteSupabase(token) {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: token ? { headers: { Authorization: 'Bearer ' + token } } : {},
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

// Averigua qué columnas tiene la tabla (una vez por arranque del servidor)
const columnasCache = {};
async function columnasDe(coleccion) {
  const conf = TABLAS[coleccion];
  if (columnasCache[coleccion]) return columnasCache[coleccion];
  const sb = clienteSupabase();
  const candidatas = new Set(['actualizado_en', 'actualizado_por']);
  Object.values(conf.campos).forEach((lista) => lista.forEach((c) => candidatas.add(c)));
  (conf.extra || []).forEach((c) => candidatas.add(c));
  const existen = new Set();
  await Promise.all([...candidatas].map(async (col) => {
    const { error } = await sb.from(conf.tabla).select(col).limit(1);
    if (!error) existen.add(col);
    else if (error.code === 'PGRST205' || error.code === '42P01') throw error; // la tabla no existe
  }));
  if (!existen.has('id')) throw new Error('La tabla "' + conf.tabla + '" no tiene columna id');
  // campo de la página → columna real
  const mapa = {};
  for (const [campo, nombres] of Object.entries(conf.campos)) {
    const col = nombres.find((n) => existen.has(n));
    if (col) mapa[campo] = col;
  }
  columnasCache[coleccion] = { mapa, existen };
  console.log('Tabla "' + conf.tabla + '": campos usados ' + JSON.stringify(mapa));
  return columnasCache[coleccion];
}

// Completa lo que la página necesita y la tabla quizá no guarda
function completar(coleccion, obj) {
  if (coleccion === 'eventos') {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(obj.fecha || '');
    if (m) {
      obj.fecha = m[0];
      if (!obj.dia) obj.dia = String(Number(m[3]));
      if (!obj.mes) obj.mes = MESES[Number(m[2]) - 1];
      if (!obj.fechaTexto) obj.fechaTexto = Number(m[3]) + ' de ' + MESES_LARGO[Number(m[2]) - 1];
    }
    if (!obj.color) obj.color = COLOR[obj.categoria] || 'primario';
    if (!obj.estado) obj.estado = 'Publicado';
  }
  if (coleccion === 'puntos' && !obj.estado) obj.estado = 'Activo';
  return obj;
}

async function leerDeSupabase(coleccion) {
  const conf = TABLAS[coleccion];
  const { mapa } = await columnasDe(coleccion);
  const { data, error } = await clienteSupabase().from(conf.tabla).select('*').order('id');
  if (error) throw error;
  return data.map((fila) => {
    const obj = {};
    for (const [campo, col] of Object.entries(mapa)) {
      if (fila[col] !== null && fila[col] !== undefined) obj[campo] = fila[col];
    }
    // Si la tabla guarda inicio/fin como fecha y hora juntas, se separan para la página
    if (fila.inicio) {
      const ini = deMarcaDeTiempo(fila.inicio);
      if (ini) {
        if (!obj.fecha) obj.fecha = ini.fecha;
        if (!obj.hora) {
          const fin = fila.fin ? deMarcaDeTiempo(fila.fin) : null;
          obj.hora = ini.hora + (fin && fin.hora !== ini.hora ? ' - ' + fin.hora : '');
        }
      }
    }
    return completar(coleccion, obj);
  });
}

// Guarda la lista completa: crea o actualiza las que vienen y borra las que ya no están
async function guardarEnSupabase(coleccion, lista, token, correo) {
  const conf = TABLAS[coleccion];
  const { mapa, existen } = await columnasDe(coleccion);
  const sb = clienteSupabase(token);
  const filas = lista.map((x) => {
    const fila = {};
    for (const [campo, col] of Object.entries(mapa)) {
      const v = x[campo];
      fila[col] = v === undefined || (v === '' && campo === 'fecha') ? null : v;
    }
    if (existen.has('inicio') || existen.has('fin')) {
      const [h1, h2] = horasDe(x.hora);
      const inicio = aMarcaDeTiempo(x.fecha, h1);
      if (existen.has('inicio')) fila.inicio = inicio;
      // Sin hora final, el evento dura 2 horas
      if (existen.has('fin')) {
        fila.fin = h2 ? aMarcaDeTiempo(x.fecha, h2)
          : (inicio ? new Date(new Date(inicio).getTime() + 2 * 3600 * 1000).toISOString() : null);
      }
    }
    if (existen.has('actualizado_en')) fila.actualizado_en = new Date().toISOString();
    if (existen.has('actualizado_por')) fila.actualizado_por = correo || null;
    return fila;
  });
  // Ids que ya están en la tabla: esos se actualizan; los demás son nuevos
  const { data: actuales, error: errorIds } = await sb.from(conf.tabla).select('id');
  if (errorIds) throw errorIds;
  const yaExisten = new Set(actuales.map((r) => r.id));

  // La columna id puede generarse sola en Supabase, así que nunca se envía:
  // se actualiza por id y los nuevos se insertan sin id (Supabase les pone uno).
  const idsFinales = [];
  const nuevos = [];
  for (let i = 0; i < filas.length; i++) {
    const { id, ...resto } = filas[i];
    if (Number.isInteger(id) && yaExisten.has(id)) {
      const { error } = await sb.from(conf.tabla).update(resto).eq('id', id);
      if (error) throw error;
      idsFinales[i] = id;
    } else {
      nuevos.push({ i, resto });
    }
  }
  if (nuevos.length) {
    const { data: creados, error } = await sb.from(conf.tabla).insert(nuevos.map((n) => n.resto)).select('id');
    if (error) throw error;
    nuevos.forEach((n, k) => { idsFinales[n.i] = creados[k].id; });
  }

  // Borra lo que el admin eliminó (lo que estaba en la tabla y ya no viene en la lista)
  const quedan = new Set(idsFinales);
  const sobran = [...yaExisten].filter((id) => !quedan.has(id));
  if (sobran.length) {
    const { error } = await sb.from(conf.tabla).delete().in('id', sobran);
    if (error) throw error;
  }
  return idsFinales;
}

// Explica en español los errores típicos de Supabase
function explicar(err, tabla) {
  const m = String((err && err.message) || err);
  if (err && err.code === '42501') return 'Supabase no deja escribir en "' + tabla + '": falta la regla (RLS) que permita al admin crear, editar y borrar. Ejecuta el SQL de permisos. (' + m + ')';
  if (err && err.code === '23502') return 'A la tabla "' + tabla + '" le falta un dato obligatorio: ' + m;
  if (err && err.code === '428C9') return 'La columna id de "' + tabla + '" se genera sola y no acepta ids desde la página: cámbiala a "generated by default". (' + m + ')';
  return m;
}

const faltaTabla = (err) => err && (err.code === 'PGRST205' || err.code === '42P01');

// Comprueba con Supabase que el token pertenece a un usuario con rol "admin"
// (el mismo rol que revisa el login de admin). Devuelve también el motivo,
// para que el panel pueda mostrar por qué no se guardó.
async function verificarAdmin(req) {
  const cabecera = req.get('authorization') || '';
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7).trim() : '';
  if (!token) return { admin: false, motivo: 'La petición llegó sin sesión. Cierra sesión en el panel y vuelve a entrar.' };

  // Cliente que actúa "como" ese usuario, para respetar las reglas (RLS) de Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Authorization: 'Bearer ' + token } },
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: usuario, error } = await supabase.auth.getUser(token);
  if (error || !usuario || !usuario.user) {
    return { admin: false, motivo: 'La sesión venció o no es válida (' + (error ? error.message : 'sin usuario') + '). Vuelve a iniciar sesión.' };
  }

  const id = usuario.user.id;
  const esRolAdmin = (valor) => String(valor || '').trim().toLowerCase() === 'admin';
  const info = { correo: usuario.user.email, id, token };

  // 1) Tabla que usa hoy el login de admin: "Kartooti registros" (columna rol)
  const r1 = await supabase.from('Kartooti registros').select('rol').eq('user_id', id).maybeSingle();
  info.rolEnRegistros = r1.data ? r1.data.rol : null;
  if (r1.error) info.errorRegistros = r1.error.message;
  if (r1.data && esRolAdmin(r1.data.rol)) return { admin: true, ...info };

  // 2) Respaldo: la tabla profiles original (columna role)
  const r2 = await supabase.from('profiles').select('role').eq('id', id).maybeSingle();
  info.rolEnProfiles = r2.data ? r2.data.role : null;
  if (r2.error) info.errorProfiles = r2.error.message;
  if (r2.data && esRolAdmin(r2.data.role)) return { admin: true, ...info };

  let motivo;
  if (r1.error) motivo = 'El servidor no pudo leer la tabla "Kartooti registros": ' + r1.error.message;
  else if (!r1.data) motivo = 'El servidor no encontró la fila de ' + info.correo + ' en "Kartooti registros" (user_id = ' + id + '). Revisa la regla RLS de lectura de esa tabla.';
  else motivo = 'En "Kartooti registros" el rol de ' + info.correo + ' es "' + r1.data.rol + '", no "admin".';
  return { admin: false, motivo, ...info };
}

// ---------- API ----------
app.get('/api/salud', (req, res) => {
  res.json({ ok: true, colecciones: COLECCIONES });
});

// Dice si la sesión que llega es de un admin y, si no, por qué (para el panel)
app.get('/api/yo', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const { token, ...resto } = await verificarAdmin(req);
    res.json(resto);
  } catch (err) {
    console.error('Error en /api/yo:', err);
    res.status(500).json({ admin: false, motivo: 'Error del servidor al consultar Supabase: ' + err.message });
  }
});

app.get('/api/:coleccion', async (req, res) => {
  const { coleccion } = req.params;
  if (!COLECCIONES.includes(coleccion)) {
    return res.status(404).json({ error: 'No existe la colección "' + coleccion + '"' });
  }
  res.set('Cache-Control', 'no-store');
  if (TABLAS[coleccion]) {
    try {
      return res.json(await leerDeSupabase(coleccion));
    } catch (err) {
      // Si la tabla aún no existe en Supabase, se usan los archivos JSON
      console.error('No se pudo leer "' + coleccion + '" de Supabase, uso data/' + coleccion + '.json:', err.message || err);
    }
  }
  try {
    res.json(await leerColeccion(coleccion));
  } catch (err) {
    console.error('Error leyendo ' + coleccion + ':', err);
    res.status(500).json({ error: 'No se pudieron leer los datos' });
  }
});

app.put('/api/:coleccion', async (req, res) => {
  const { coleccion } = req.params;
  if (!COLECCIONES.includes(coleccion)) {
    return res.status(404).json({ error: 'No existe la colección "' + coleccion + '"' });
  }
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Se esperaba una lista (array) de elementos' });
  }

  try {
    const v = await verificarAdmin(req);
    if (!v.admin) {
      console.warn('PUT /api/' + coleccion + ' rechazado: ' + v.motivo);
      return res.status(403).json({ error: 'Solo un administrador puede guardar cambios. ' + v.motivo });
    }
    if (TABLAS[coleccion]) {
      try {
        const ids = await guardarEnSupabase(coleccion, req.body, v.token, v.correo);
        console.log('PUT /api/' + coleccion + ' guardado en Supabase por ' + v.correo + ' (' + req.body.length + ' elementos)');
        return res.json({ ok: true, total: req.body.length, donde: 'supabase', ids });
      } catch (err) {
        if (!faltaTabla(err)) {
          const texto = explicar(err, TABLAS[coleccion].tabla);
          console.error('Supabase rechazó el guardado de ' + coleccion + ' [' + (err.code || '') + ']: ' + texto);
          return res.status(500).json({ error: texto });
        }
        console.warn('La tabla "' + coleccion + '" no existe en Supabase; guardo en data/' + coleccion + '.json');
      }
    }
    await guardarColeccion(coleccion, req.body);
    console.log('PUT /api/' + coleccion + ' guardado en archivo por ' + v.correo + ' (' + req.body.length + ' elementos)');
    res.json({ ok: true, total: req.body.length, donde: 'archivo' });
  } catch (err) {
    console.error('Error guardando ' + coleccion + ':', err);
    res.status(500).json({ error: 'No se pudieron guardar los datos' });
  }
});

// Cualquier otra ruta /api/... que no exista
app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta de API no encontrada' }));

// ---------- Página web ----------
// No exponer archivos internos del proyecto
const PRIVADO = /^\/(node_modules|supabase|server\.js|package(-lock)?\.json|render\.yaml|vite\.config\.js|\.git)/;
app.use((req, res, next) => (PRIVADO.test(req.path) ? res.status(404).end() : next()));

app.use(express.static(RAIZ, { dotfiles: 'deny', extensions: ['html'] }));

app.listen(PUERTO, () => {
  console.log('Kartooti funcionando en http://localhost:' + PUERTO);
});
