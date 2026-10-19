// Kartooti admin — Gestión de usuarios
(function () {
  var K = Kartooti, D = KartootiDatos;
  var ROLES = { Estudiante: 'e-celeste', Invitado: 'e-amarillo', Administrador: 'e-azul' };
  var lista = D.leer('usuarios');
  var tabla = document.getElementById('tabla');
  var f = { texto: document.getElementById('f-texto'), rol: document.getElementById('f-rol'), estado: document.getElementById('f-estado') };
  var form = document.getElementById('form-usuario');
  var actual = null;

  function guardar() { D.guardar('usuarios', lista); pintar(); }

  function pintar() {
    var v = Panel.filtrar(lista, f.texto.value, ['nombre', 'correo'], { rol: f.rol.value, estado: f.estado.value });
    tabla.innerHTML = v.length ? v.map(function (u) {
      return '<tr><td><button type="button" class="celda-persona" data-ver="' + u.id + '" style="text-align:left"><b>' + K.esc(u.nombre) + '</b><span>' + K.esc(u.correo) + '</span></button></td>' +
        '<td><span class="etiqueta ' + (ROLES[u.rol] || 'e-gris') + '">' + K.esc(u.rol) + '</span></td>' +
        '<td>' + Tabla.estado(u.estado) + '</td>' +
        '<td>' + K.esc(u.acceso) + '</td>' +
        '<td>' + Tabla.acciones(u.id, u.nombre) + '</td></tr>';
    }).join('') : Tabla.vacia(5);
    document.getElementById('c-total').textContent = lista.length;
    document.getElementById('c-activos').textContent = lista.filter(function (u) { return u.estado === 'Activo'; }).length;
    document.getElementById('c-pendientes').textContent = lista.filter(function (u) { return u.estado === 'Pendiente'; }).length;
  }

  // Ventana de detalles: aquí se cambia rol y estado
  var rolSel = document.getElementById('d-rol');
  var botones = document.getElementById('d-estado');
  function marcarEstado() {
    botones.querySelectorAll('button').forEach(function (b) {
      var on = b.dataset.estado === actual.estado;
      b.classList.toggle('es-activo', on); b.setAttribute('aria-pressed', on);
    });
  }
  function verDetalle(u) {
    actual = u;
    document.getElementById('d-avatar').textContent = u.nombre.charAt(0).toUpperCase();
    document.getElementById('d-nombre').textContent = u.nombre;
    document.getElementById('d-correo').textContent = u.correo;
    document.getElementById('d-registro').textContent = u.registro;
    document.getElementById('d-acceso').textContent = u.acceso;
    rolSel.value = u.rol;
    marcarEstado();
    K.abrirModal('modal-detalle');
  }
  rolSel.addEventListener('change', function () { actual.rol = rolSel.value; guardar(); K.aviso('Rol actualizado'); });
  botones.addEventListener('click', function (e) {
    var b = e.target.closest('[data-estado]');
    if (!b) return;
    actual.estado = b.dataset.estado; marcarEstado(); guardar(); K.aviso('Estado: ' + actual.estado);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!Tabla.validar(form, ['nombre', 'correo'])) return;
    var correo = form.correo.value.trim().toLowerCase();
    if (lista.some(function (u) { return u.correo.toLowerCase() === correo; })) { form.correo.classList.add('es-error'); K.aviso('Ya existe un usuario con ese correo'); return; }
    var hoy = new Date();
    var MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    lista.push({ id: D.siguienteId(lista), nombre: form.nombre.value.trim(), correo: correo, codigo: form.codigo.value.trim(), rol: form.rol.value, estado: form.estado.value,
      registro: ('0' + hoy.getDate()).slice(-2) + ' ' + MESES[hoy.getMonth()] + ' ' + hoy.getFullYear(), acceso: 'Nunca' });
    Tabla.registrar('usuario', 'Nuevo usuario registrado', correo);
    K.cerrarModal(document.getElementById('modal-usuario'));
    K.aviso('Usuario añadido');
    guardar();
  });

  tabla.addEventListener('click', function (e) {
    var ver = e.target.closest('[data-ver]'), ed = e.target.closest('[data-editar]'), bo = e.target.closest('[data-borrar]');
    var b = ver || ed || bo;
    if (!b) return;
    var id = Number(b.dataset.ver || b.dataset.editar || b.dataset.borrar);
    var u = lista.find(function (x) { return x.id === id; });
    if (!u) return;
    if (ver || ed) verDetalle(u);
    if (bo && confirm('¿Eliminar a "' + u.nombre + '"?')) { lista = lista.filter(function (x) { return x !== u; }); guardar(); K.aviso('Usuario eliminado'); }
  });

  document.getElementById('btn-nuevo').addEventListener('click', function () {
    form.reset();
    ['nombre', 'correo'].forEach(function (c) { form[c].classList.remove('es-error'); });
    K.abrirModal('modal-usuario');
    setTimeout(function () { form.nombre.focus(); }, 50);
  });
  f.texto.addEventListener('input', pintar); f.rol.addEventListener('change', pintar); f.estado.addEventListener('change', pintar);
  pintar();
})();
