// Kartooti — Gestión de Eventos
(function () {
  var K = Kartooti;
  K.renderLayout('eventos');

  var MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  var eventos = K.load('eventos', DATOS_EVENTOS);
  var editandoId = null;
  var vista = 'lista';

  var tabla = document.getElementById('tabla');
  var tarjetas = document.getElementById('vista-tarjetas');
  var fBuscar = document.getElementById('f-buscar');
  var fCategoria = document.getElementById('f-categoria');
  var fEstado = document.getElementById('f-estado');
  var form = document.getElementById('form-evento');

  function fechaBonita(iso) {
    var p = String(iso || '').split('-');
    if (p.length !== 3) return iso || '—';
    return p[2] + ' ' + MESES[Number(p[1]) - 1] + ' ' + p[0];
  }

  function filtrados() {
    var q = K.norm(fBuscar.value);
    return eventos.filter(function (ev) {
      return (!q || K.norm(ev.titulo + ' ' + ev.lugar).indexOf(q) !== -1) &&
        (!fCategoria.value || ev.categoria === fCategoria.value) &&
        (!fEstado.value || ev.estado === fEstado.value);
    });
  }

  function botones(ev) {
    var publicado = ev.estado === 'Publicado';
    return '<div class="actions">' +
      '<button class="icon-btn" type="button" data-publicar="' + ev.id + '" aria-label="' + (publicado ? 'Ocultar' : 'Publicar') + ' evento" title="' + (publicado ? 'Ocultar (pasar a borrador)' : 'Publicar') + '">' +
        '<img src="../assets/icons/' + (publicado ? 'eye-off' : 'eye') + '.svg" width="16" height="16" alt=""></button>' +
      '<button class="icon-btn" type="button" data-editar="' + ev.id + '" aria-label="Editar evento"><img src="../assets/icons/edit.svg" width="16" height="16" alt=""></button>' +
      '<button class="icon-btn" type="button" data-borrar="' + ev.id + '" aria-label="Eliminar evento"><img src="../assets/icons/trash.svg" width="16" height="16" alt=""></button>' +
    '</div>';
  }

  function render() {
    var lista = filtrados();
    var vacio = 'No hay eventos que coincidan con la búsqueda.';

    tabla.innerHTML = lista.length ? lista.map(function (ev) {
      return '<tr>' +
        '<td><div class="event"><span class="event__dot" style="background:' + (COLORES.punto[ev.categoria] || '#2a9db5') + '"></span>' +
          '<div><span class="event__title">' + K.esc(ev.titulo) + '</span><span class="cell-sub">' + K.esc(ev.lugar) + '</span></div></div></td>' +
        '<td><span class="tag tag--' + (COLORES.categoria[ev.categoria] || 'gray') + '">' + K.esc(ev.categoria) + '</span></td>' +
        '<td><span class="cell-main">' + fechaBonita(ev.fecha) + '</span><span class="cell-sub">' + K.esc(ev.hora) + '</span></td>' +
        '<td><span class="tag tag--' + (COLORES.estado[ev.estado] || 'gray') + '">' + K.esc(ev.estado) + '</span></td>' +
        '<td>' + botones(ev) + '</td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="5" class="empty">' + vacio + '</td></tr>';

    tarjetas.innerHTML = lista.length ? lista.map(function (ev) {
      return '<article class="ev-card">' +
        '<div class="ev-card__top"><span class="tag tag--' + (COLORES.categoria[ev.categoria] || 'gray') + '">' + K.esc(ev.categoria) + '</span>' +
        '<span class="tag tag--' + (COLORES.estado[ev.estado] || 'gray') + '">' + K.esc(ev.estado) + '</span></div>' +
        '<div><span class="event__title">' + K.esc(ev.titulo) + '</span><span class="cell-sub">' + K.esc(ev.lugar) + '</span></div>' +
        '<div class="ev-card__foot"><span><span class="cell-main">' + fechaBonita(ev.fecha) + '</span><span class="cell-sub">' + K.esc(ev.hora) + '</span></span>' + botones(ev) + '</div>' +
      '</article>';
    }).join('') : '<p class="empty">' + vacio + '</p>';

    document.getElementById('s-total').textContent = eventos.length;
    document.getElementById('s-publicados').textContent = eventos.filter(function (e) { return e.estado === 'Publicado'; }).length;
    document.getElementById('s-borradores').textContent = eventos.filter(function (e) { return e.estado === 'Borrador'; }).length;
    document.getElementById('s-finalizados').textContent = eventos.filter(function (e) { return e.estado === 'Finalizado'; }).length;
  }

  function guardar(msg) {
    K.save('eventos', eventos);
    render();
    if (msg) K.toast(msg);
  }

  function abrir(ev) {
    editandoId = ev ? ev.id : null;
    document.getElementById('modal-evento-titulo').textContent = ev ? 'Editar evento' : 'Nuevo evento';
    form.titulo.value = ev ? ev.titulo : '';
    form.categoria.value = ev ? ev.categoria : 'Académico';
    form.estado.value = ev ? ev.estado : 'Borrador';
    form.fecha.value = ev ? ev.fecha : '';
    form.hora.value = ev ? ev.hora : '';
    form.lugar.value = ev ? ev.lugar : '';
    form.capacidad.value = ev ? ev.capacidad : '';
    form.descripcion.value = ev ? ev.descripcion : '';
    K.openModal('modal-evento');
  }

  function porId(id) {
    return eventos.find(function (e) { return e.id === Number(id); });
  }

  function onAccion(e) {
    var b;
    if ((b = e.target.closest('[data-editar]'))) abrir(porId(b.dataset.editar));
    if ((b = e.target.closest('[data-publicar]'))) {
      var ev = porId(b.dataset.publicar);
      ev.estado = ev.estado === 'Publicado' ? 'Borrador' : 'Publicado';
      guardar(ev.estado === 'Publicado' ? 'Evento publicado' : 'Evento pasado a borrador');
    }
    if ((b = e.target.closest('[data-borrar]'))) {
      var borrar = porId(b.dataset.borrar);
      if (borrar && confirm('¿Eliminar "' + borrar.titulo + '"?')) {
        eventos = eventos.filter(function (x) { return x.id !== borrar.id; });
        guardar('Evento eliminado');
      }
    }
  }

  tabla.addEventListener('click', onAccion);
  tarjetas.addEventListener('click', onAccion);
  document.getElementById('btn-nuevo').addEventListener('click', function () { abrir(null); });

  document.querySelectorAll('.view-toggle button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      vista = btn.dataset.vista;
      document.querySelectorAll('.view-toggle button').forEach(function (b) {
        var activo = b === btn;
        b.classList.toggle('is-active', activo);
        b.setAttribute('aria-pressed', activo ? 'true' : 'false');
      });
      document.getElementById('vista-lista').hidden = vista !== 'lista';
      tarjetas.hidden = vista !== 'tarjetas';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var faltante = ['titulo', 'fecha', 'lugar'].find(function (k) { return !form[k].value.trim(); });
    if (faltante) {
      form[faltante].focus();
      K.toast('Completa los campos obligatorios (*)');
      return;
    }
    var datos = {
      titulo: form.titulo.value.trim(),
      categoria: form.categoria.value,
      estado: form.estado.value,
      fecha: form.fecha.value,
      hora: form.hora.value.trim(),
      lugar: form.lugar.value.trim(),
      capacidad: form.capacidad.value ? Number(form.capacidad.value) : '',
      descripcion: form.descripcion.value.trim()
    };
    if (editandoId) {
      eventos = eventos.map(function (x) { return x.id === editandoId ? Object.assign({}, x, datos) : x; });
    } else {
      datos.id = K.nextId(eventos);
      eventos.push(datos);
    }
    K.closeModal('modal-evento');
    guardar(editandoId ? 'Cambios guardados' : 'Evento creado');
  });

  [fBuscar, fCategoria, fEstado].forEach(function (el) { el.addEventListener('input', render); });
  render();
})();
