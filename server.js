// ==========================================================
// Kartooti — Servidor (backend) para Render
//
// - Sirve la página web (HTML, CSS, JS, imágenes).
// - Entrega los datos de la carpeta data/ como API:
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
  const info = { correo: usuario.user.email, id };

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
    res.json(await verificarAdmin(req));
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
  try {
    res.set('Cache-Control', 'no-store');
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
    await guardarColeccion(coleccion, req.body);
    console.log('PUT /api/' + coleccion + ' guardado por ' + v.correo + ' (' + req.body.length + ' elementos)');
    res.json({ ok: true, total: req.body.length });
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
