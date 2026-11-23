// Kartooti admin — utilidades de las tablas
var Tabla = (function () {
  var K = Kartooti;
  var r = K.raiz + 'assets/icons/';

  function estado(e) {
    var c = { Activo: 'e-activo', Publicado: 'e-activo', Inactivo: 'e-inactivo', Pendiente: 'e-pendiente', Suspendido: 'e-suspendido', Borrador: 'e-gris' }[e] || 'e-gris';
    return '<span class="etiqueta ' + c + '">' + K.esc(e) + '</span>';
  }
  function acciones(id, nombre) {
    return '<span class="acciones">' +
      '<button type="button" data-editar="' + id + '" aria-label="Editar ' + K.esc(nombre) + '"><img src="' + r + 'adm-editar.svg" alt=""></button>' +
      '<button type="button" data-borrar="' + id + '" aria-label="Eliminar ' + K.esc(nombre) + '"><img src="' + r + 'adm-borrar.svg" alt=""></button>' +
      '</span>';
  }
  function vacia(cols) { return '<tr><td class="vacio-tabla" colspan="' + cols + '">No hay resultados con esos filtros.</td></tr>'; }

  // Registra una acción en "Actividad reciente" del resumen
  function registrar(tipo, titulo, detalle) {
    var a = KartootiDatos.leer('actividad');
    a.unshift({ tipo: tipo, titulo: titulo, detalle: detalle });
    KartootiDatos.guardar('actividad', a.slice(0, 20));
  }

  // Botón de medios dentro de un formulario
  function medios(botonId, estadoId) {
    var est = document.getElementById(estadoId);
    var archivo = '';
    document.getElementById(botonId).addEventListener('click', function () {
      Panel.pedirArchivo(function (nombre) { archivo = nombre; est.textContent = 'Archivo añadido: ' + nombre; });
    });
    return {
      valor: function () { return archivo; },
      poner: function (v) { archivo = v || ''; est.textContent = archivo ? 'Archivo añadido: ' + archivo : 'Sin medios añadidos...'; }
    };
  }

  function validar(form, campos) {
    for (var i = 0; i < campos.length; i++) {
      var el = form[campos[i]];
      el.classList.remove('es-error');
      el.removeAttribute('aria-invalid');
      if (!el.value.trim() || (el.type === 'email' && !el.checkValidity())) {
        el.classList.add('es-error');
        el.setAttribute('aria-invalid', 'true'); // el lector de pantalla anuncia que el campo tiene un error
        el.focus();
        K.aviso('Completa el campo obligatorio marcado en rojo');
        return false;
      }
    }
    return true;
  }

  return { estado: estado, acciones: acciones, vacia: vacia, registrar: registrar, medios: medios, validar: validar };
})();

// Aviso fijo en el panel: ¿los cambios se guardan en el servidor?
KartootiDatos.listo.then(function () {
  var main = document.querySelector('.admin-main');
  if (!main || !KartootiDatos.verificarAdmin) return;
  var caja = document.createElement('p');
  caja.className = 'estado-servidor';
  caja.setAttribute('role', 'status');
  caja.textContent = 'Comprobando conexión con el servidor…';
  main.insertBefore(caja, main.firstChild);
  KartootiDatos.verificarAdmin().then(function (r) {
    if (r.admin) {
      caja.classList.add('estado-servidor--ok');
      caja.textContent = 'Conectado como administrador (' + (r.correo || '') + '): los cambios se guardan en el servidor.';
    } else {
      caja.classList.add('estado-servidor--error');
      caja.textContent = 'Los cambios NO se guardarán en el servidor. Motivo: ' + (r.motivo || 'desconocido');
    }
  });
});
