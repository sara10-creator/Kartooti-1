// Kartooti — Gestión de Usuarios
(function () {
  var K = Kartooti;
  K.renderLayout('usuarios');

  var usuarios = K.load('usuarios', DATOS_USUARIOS);
  var actualId = null;

  var tabla = document.getElementById('tabla');
  var fBuscar = document.getElementById('f-buscar');
  var fRol = document.getElementById('f-rol');
  var fEstado = document.getElementById('f-estado');
  var checkTodos = document.getElementById('check-todos');

  function filtrados() {
    var q = K.norm(fBuscar.value);
    return usuarios.filter(function (u) {
      return (!q || K.norm(u.nombre + ' ' + u.correo).indexOf(q) !== -1) &&
        (!fRol.value || u.rol === fRol.value) &&
        (!fEstado.value || u.estado === fEstado.value);
    });
  }

  function render() {
    var lista = filtrados();
    tabla.innerHTML = lista.length ? lista.map(function (u) {
      return '<tr>' +
        '<td class="col-check"><input type="checkbox" class="check fila-check" aria-label="Seleccionar ' + K.esc(u.nombre) + '"></td>' +
        '<td><div class="person"><span class="avatar">' + K.esc(u.nombre.charAt(0).toUpperCase()) + '</span>' +
          '<div><span class="person__name">' + K.esc(u.nombre) + '</span><span class="person__mail">' + K.esc(u.correo) + '</span></div></div></td>' +
        '<td><span class="tag tag--' + (COLORES.rol[u.rol] || 'gray') + '">' + K.esc(u.rol) + '</span></td>' +
        '<td><span class="tag tag--' + (COLORES.estado[u.estado] || 'gray') + '">' + K.esc(u.estado) + '</span></td>' +
        '<td class="cell-muted">' + K.esc(u.acceso) + '</td>' +
        '<td><button class="btn-detail" type="button" data-ver="' + u.id + '">Ver detalle</button></td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="6" class="empty">No hay usuarios que coincidan con la búsqueda.</td></tr>';

    checkTodos.checked = false;
    document.getElementById('s-total').textContent = usuarios.length;
    document.getElementById('s-estudiantes').textContent = usuarios.filter(function (u) { return u.rol === 'Estudiante'; }).length;
    document.getElementById('s-pendientes').textContent = usuarios.filter(function (u) { return u.estado === 'Pendiente'; }).length;
    document.getElementById('s-suspendidos').textContent = usuarios.filter(function (u) { return u.estado === 'Suspendido'; }).length;
  }

  function marcarEstado(estado) {
    document.querySelectorAll('#u-estado button').forEach(function (b) {
      var activo = b.dataset.value === estado;
      b.classList.toggle('is-active', activo);
      b.setAttribute('aria-pressed', activo ? 'true' : 'false');
    });
  }

  function actualizar(cambios) {
    usuarios = usuarios.map(function (u) { return u.id === actualId ? Object.assign({}, u, cambios) : u; });
    K.save('usuarios', usuarios);
    render();
    K.toast('Usuario actualizado');
  }

  function verDetalle(id) {
    var u = usuarios.find(function (x) { return x.id === id; });
    if (!u) return;
    actualId = id;
    document.getElementById('u-avatar').textContent = u.nombre.charAt(0).toUpperCase();
    document.getElementById('u-nombre').textContent = u.nombre;
    document.getElementById('u-correo').textContent = u.correo;
    document.getElementById('u-registro').textContent = u.registro || '—';
    document.getElementById('u-acceso').textContent = u.acceso;
    document.getElementById('u-rol').value = u.rol;
    marcarEstado(u.estado);
    K.openModal('modal-usuario');
  }

  tabla.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-ver]');
    if (btn) verDetalle(Number(btn.dataset.ver));
  });

  checkTodos.addEventListener('change', function () {
    document.querySelectorAll('.fila-check').forEach(function (c) { c.checked = checkTodos.checked; });
  });

  document.getElementById('u-rol').addEventListener('change', function (e) {
    actualizar({ rol: e.target.value });
  });

  document.getElementById('u-estado').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-value]');
    if (!b) return;
    marcarEstado(b.dataset.value);
    actualizar({ estado: b.dataset.value });
  });

  // Invitar usuario
  var formInv = document.getElementById('form-invitar');
  document.getElementById('btn-invitar').addEventListener('click', function () {
    formInv.reset();
    K.openModal('modal-invitar');
  });

  formInv.addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = formInv.nombre.value.trim();
    var correo = formInv.correo.value.trim();
    if (!nombre || !correo || !formInv.correo.checkValidity()) {
      K.toast('Escribe un nombre y un correo válido');
      return;
    }
    usuarios.push({
      id: K.nextId(usuarios), nombre: nombre, correo: correo, rol: formInv.rol.value,
      estado: 'Pendiente', acceso: 'Nunca', registro: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    K.save('usuarios', usuarios);
    K.closeModal('modal-invitar');
    render();
    K.toast('Invitación enviada a ' + correo);
  });

  [fBuscar, fRol, fEstado].forEach(function (el) { el.addEventListener('input', render); });
  render();
})();
