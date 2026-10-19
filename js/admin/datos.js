// Kartooti admin — Actualizar datos (puntos de interés)
(function () {
  var K = Kartooti, D = KartootiDatos;
  var TIPOS = { Laboratorio: 'e-celeste', Auditorio: 'e-amarillo', 'Salón': 'e-azul', 'Cafetería': 'e-verde', Biblioteca: 'e-celeste' };
  var lista = D.leer('puntos');
  var tabla = document.getElementById('tabla');
  var f = { texto: document.getElementById('f-texto'), tipo: document.getElementById('f-tipo'), estado: document.getElementById('f-estado') };
  var form = document.getElementById('form-punto');
  var medio = Tabla.medios('p-medios', 'p-medios-estado');
  var editando = null;

  function pintar() {
    var v = Panel.filtrar(lista, f.texto.value, ['nombre', 'edificio'], { tipo: f.tipo.value, estado: f.estado.value });
    tabla.innerHTML = v.length ? v.map(function (p) {
      return '<tr><td><div class="celda-doble"><b>' + K.esc(p.nombre) + '</b>' + (p.descripcion ? '<span>' + K.esc(p.descripcion) + '</span>' : '') + '</div></td>' +
        '<td><span class="etiqueta ' + (TIPOS[p.tipo] || 'e-gris') + '">' + K.esc(p.tipo) + '</span></td>' +
        '<td>' + K.esc(p.edificio) + ', piso ' + K.esc(p.piso) + '</td>' +
        '<td>' + Tabla.estado(p.estado) + '</td>' +
        '<td>' + Tabla.acciones(p.id, p.nombre) + '</td></tr>';
    }).join('') : Tabla.vacia(5);
    document.getElementById('c-total').textContent = lista.length;
    document.getElementById('c-activos').textContent = lista.filter(function (p) { return p.estado === 'Activo'; }).length;
    document.getElementById('c-pendientes').textContent = lista.filter(function (p) { return p.estado === 'Pendiente'; }).length;
  }

  function abrir(p) {
    editando = p || null;
    document.getElementById('punto-titulo').textContent = p ? 'Editar punto de interés' : 'Añadir punto de interés';
    form.reset();
    ['nombre', 'tipo', 'estado', 'edificio', 'piso', 'descripcion'].forEach(function (c) { form[c].classList.remove('es-error'); if (p) form[c].value = p[c] || ''; });
    medio.poner(p && p.medio);
    K.abrirModal('modal-punto');
    setTimeout(function () { form.nombre.focus(); }, 50);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!Tabla.validar(form, ['nombre', 'edificio', 'piso'])) return;
    var datos = { nombre: form.nombre.value.trim(), tipo: form.tipo.value, estado: form.estado.value, edificio: form.edificio.value.trim(), piso: form.piso.value.trim(), descripcion: form.descripcion.value.trim(), medio: medio.valor() };
    if (editando) Object.assign(editando, datos);
    else lista.push(Object.assign({ id: D.siguienteId(lista) }, datos));
    D.guardar('puntos', lista);
    Tabla.registrar('punto', editando ? 'Punto de interés actualizado' : 'Punto de interés creado', datos.edificio + ' - ' + datos.nombre);
    K.cerrarModal(document.getElementById('modal-punto'));
    K.aviso(editando ? 'Cambios guardados' : 'Punto de interés añadido');
    pintar();
  });

  tabla.addEventListener('click', function (e) {
    var ed = e.target.closest('[data-editar]'), bo = e.target.closest('[data-borrar]');
    if (ed) abrir(lista.find(function (p) { return p.id === Number(ed.dataset.editar); }));
    if (bo) {
      var p = lista.find(function (x) { return x.id === Number(bo.dataset.borrar); });
      if (confirm('¿Eliminar "' + p.nombre + '"?')) { lista = lista.filter(function (x) { return x !== p; }); D.guardar('puntos', lista); K.aviso('Punto eliminado'); pintar(); }
    }
  });

  document.getElementById('btn-nuevo').addEventListener('click', function () { abrir(null); });
  f.texto.addEventListener('input', pintar); f.tipo.addEventListener('change', pintar); f.estado.addEventListener('change', pintar);
  pintar();
})();
