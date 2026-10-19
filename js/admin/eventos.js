// Kartooti admin — Gestión de eventos (lo publicado aparece en la página "Eventos")
(function () {
  var K = Kartooti, D = KartootiDatos;
  var CATEGORIAS = { 'Académico': 'e-celeste', Cultural: 'e-amarillo', Deportivo: 'e-verde', 'Tecnología': 'e-azul' };
  var COLOR = { 'Académico': 'primario', Cultural: 'amarillo', Deportivo: 'verde', 'Tecnología': 'primario' };
  var MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  var MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var lista = D.leer('eventos');
  var tabla = document.getElementById('tabla');
  var f = { texto: document.getElementById('f-texto'), categoria: document.getElementById('f-categoria'), estado: document.getElementById('f-estado') };
  var form = document.getElementById('form-evento');
  var medio = Tabla.medios('e-medios', 'e-medios-estado');
  var editando = null;

  function fechaCorta(iso) {
    var p = String(iso || '').split('-');
    return p.length === 3 ? Number(p[2]) + ' ' + MESES[Number(p[1]) - 1].charAt(0) + MESES[Number(p[1]) - 1].slice(1).toLowerCase() + ' ' + p[0] : '';
  }

  function pintar() {
    var v = Panel.filtrar(lista, f.texto.value, ['titulo', 'lugar'], { categoria: f.categoria.value, estado: f.estado.value });
    tabla.innerHTML = v.length ? v.map(function (e) {
      return '<tr><td><div class="celda-doble"><b>' + K.esc(e.titulo) + '</b><span>' + K.esc(e.lugar) + '</span></div></td>' +
        '<td><span class="etiqueta ' + (CATEGORIAS[e.categoria] || 'e-gris') + '">' + K.esc(e.categoria) + '</span></td>' +
        '<td>' + K.esc(fechaCorta(e.fecha)) + '<br><small>' + K.esc(e.hora) + '</small></td>' +
        '<td>' + Tabla.estado(e.estado) + '</td>' +
        '<td>' + Tabla.acciones(e.id, e.titulo) + '</td></tr>';
    }).join('') : Tabla.vacia(5);
    document.getElementById('c-total').textContent = lista.length;
    document.getElementById('c-publicados').textContent = lista.filter(function (e) { return e.estado === 'Publicado'; }).length;
    document.getElementById('c-pendientes').textContent = lista.filter(function (e) { return e.estado === 'Pendiente'; }).length;
  }

  function abrir(ev) {
    editando = ev || null;
    document.getElementById('evento-titulo').textContent = ev ? 'Editar evento' : 'Añadir evento';
    form.reset();
    ['titulo', 'categoria', 'estado', 'fecha', 'hora', 'lugar', 'descripcion'].forEach(function (c) { form[c].classList.remove('es-error'); if (ev) form[c].value = ev[c] || ''; });
    medio.poner(ev && ev.medio);
    K.abrirModal('modal-evento');
    setTimeout(function () { form.titulo.focus(); }, 50);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!Tabla.validar(form, ['titulo', 'fecha', 'hora', 'lugar'])) return;
    var p = form.fecha.value.split('-');
    var datos = {
      titulo: form.titulo.value.trim(), categoria: form.categoria.value, estado: form.estado.value,
      fecha: form.fecha.value, dia: String(Number(p[2])), mes: MESES[Number(p[1]) - 1],
      fechaTexto: Number(p[2]) + ' de ' + MESES_LARGO[Number(p[1]) - 1],
      hora: form.hora.value.trim(), lugar: form.lugar.value.trim(), descripcion: form.descripcion.value.trim(),
      color: COLOR[form.categoria.value] || 'primario', medio: medio.valor()
    };
    var eraPublicado = editando && editando.estado === 'Publicado';
    if (editando) Object.assign(editando, datos);
    else lista.push(Object.assign({ id: D.siguienteId(lista) }, datos));
    D.guardar('eventos', lista);
    if (datos.estado === 'Publicado' && !eraPublicado) Tabla.registrar('evento', 'Evento publicado', datos.titulo);
    K.cerrarModal(document.getElementById('modal-evento'));
    K.aviso(datos.estado === 'Publicado' ? 'Guardado: ya aparece en "Eventos del campus"' : 'Evento guardado');
    pintar();
  });

  tabla.addEventListener('click', function (e) {
    var ed = e.target.closest('[data-editar]'), bo = e.target.closest('[data-borrar]');
    if (ed) abrir(lista.find(function (x) { return x.id === Number(ed.dataset.editar); }));
    if (bo) {
      var ev = lista.find(function (x) { return x.id === Number(bo.dataset.borrar); });
      if (confirm('¿Eliminar "' + ev.titulo + '"?')) { lista = lista.filter(function (x) { return x !== ev; }); D.guardar('eventos', lista); K.aviso('Evento eliminado'); pintar(); }
    }
  });

  document.getElementById('btn-nuevo').addEventListener('click', function () { abrir(null); });
  f.texto.addEventListener('input', pintar); f.categoria.addEventListener('change', pintar); f.estado.addEventListener('change', pintar);
  pintar();
})();
