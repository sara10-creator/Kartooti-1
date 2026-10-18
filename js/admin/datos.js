// Kartooti — Actualizar Datos (puntos de interés)
(function () {
  var K = Kartooti;
  K.renderLayout('datos');

  var puntos = K.load('puntos', DATOS_PUNTOS);
  var editandoId = null;

  var tabla = document.getElementById('tabla');
  var fBuscar = document.getElementById('f-buscar');
  var fTipo = document.getElementById('f-tipo');
  var fEstado = document.getElementById('f-estado');
  var form = document.getElementById('form-punto');

  function filtrados() {
    var q = K.norm(fBuscar.value);
    return puntos.filter(function (p) {
      var texto = K.norm(p.nombre + ' ' + p.edificio);
      return (!q || texto.indexOf(q) !== -1) &&
        (!fTipo.value || p.tipo === fTipo.value) &&
        (!fEstado.value || p.estado === fEstado.value);
    });
  }

  function render() {
    var lista = filtrados();
    tabla.innerHTML = lista.length ? lista.map(function (p) {
      return '<tr>' +
        '<td class="cell-strong">' + K.esc(p.nombre) + '</td>' +
        '<td><span class="tag tag--' + (COLORES.tipo[p.tipo] || 'gray') + '">' + K.esc(p.tipo) + '</span></td>' +
        '<td><span class="cell-main">' + K.esc(p.edificio) + '</span><span class="cell-sub">Piso ' + K.esc(p.piso || '—') + '</span></td>' +
        '<td><span class="tag tag--' + (COLORES.estado[p.estado] || 'gray') + '">' + K.esc(p.estado) + '</span></td>' +
        '<td><div class="actions">' +
          '<button class="icon-btn" type="button" data-editar="' + p.id + '" aria-label="Editar ' + K.esc(p.nombre) + '"><img src="../assets/icons/edit.svg" width="16" height="16" alt=""></button>' +
          '<button class="icon-btn" type="button" data-borrar="' + p.id + '" aria-label="Eliminar ' + K.esc(p.nombre) + '"><img src="../assets/icons/trash.svg" width="16" height="16" alt=""></button>' +
        '</div></td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="5" class="empty">No hay puntos de interés que coincidan con la búsqueda.</td></tr>';

    document.getElementById('s-total').textContent = puntos.length;
    document.getElementById('s-activos').textContent = puntos.filter(function (p) { return p.estado === 'Activo'; }).length;
    document.getElementById('s-pendientes').textContent = puntos.filter(function (p) { return p.estado === 'Pendiente'; }).length;
  }

  function abrir(punto) {
    editandoId = punto ? punto.id : null;
    document.getElementById('modal-punto-titulo').textContent = punto ? 'Editar punto de interés' : 'Nuevo punto de interés';
    form.nombre.value = punto ? punto.nombre : '';
    form.tipo.value = punto ? punto.tipo : 'Salón';
    form.estado.value = punto ? punto.estado : 'Activo';
    form.edificio.value = punto ? punto.edificio : '';
    form.piso.value = punto ? punto.piso : '';
    form.descripcion.value = punto ? punto.descripcion : '';
    K.openModal('modal-punto');
  }

  tabla.addEventListener('click', function (e) {
    var btnEditar = e.target.closest('[data-editar]');
    var btnBorrar = e.target.closest('[data-borrar]');
    if (btnEditar) {
      abrir(puntos.find(function (p) { return p.id === Number(btnEditar.dataset.editar); }));
    }
    if (btnBorrar) {
      var punto = puntos.find(function (p) { return p.id === Number(btnBorrar.dataset.borrar); });
      if (punto && confirm('¿Eliminar "' + punto.nombre + '"?')) {
        puntos = puntos.filter(function (p) { return p.id !== punto.id; });
        K.save('puntos', puntos);
        render();
        K.toast('Punto de interés eliminado');
      }
    }
  });

  document.getElementById('btn-nuevo').addEventListener('click', function () { abrir(null); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.nombre.value.trim() || !form.edificio.value.trim()) {
      (form.nombre.value.trim() ? form.edificio : form.nombre).focus();
      K.toast('Completa los campos obligatorios (*)');
      return;
    }
    var datos = {
      nombre: form.nombre.value.trim(),
      tipo: form.tipo.value,
      estado: form.estado.value,
      edificio: form.edificio.value.trim(),
      piso: form.piso.value.trim(),
      descripcion: form.descripcion.value.trim()
    };
    if (editandoId) {
      puntos = puntos.map(function (p) { return p.id === editandoId ? Object.assign({}, p, datos) : p; });
    } else {
      datos.id = K.nextId(puntos);
      puntos.push(datos);
    }
    K.save('puntos', puntos);
    K.closeModal('modal-punto');
    render();
    K.toast(editandoId ? 'Cambios guardados' : 'Punto de interés creado');
  });

  [fBuscar, fTipo, fEstado].forEach(function (el) { el.addEventListener('input', render); });
  render();
})();
