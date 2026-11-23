(function () {
  var parametros = new URLSearchParams(window.location.search);
  if (parametros.has('clave') || parametros.has('password')) {
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
  }

  document.querySelectorAll('form[data-auth-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (form.dataset.authReady === 'true') return;
      e.preventDefault();
      var mensaje = form.querySelector('[role="alert"]');
      if (mensaje) {
        mensaje.textContent = 'No se pudo cargar la autenticación. Abre la app desde un servidor HTTP y verifica tu conexión.';
        mensaje.classList.add('es-visible');
      }
    });
  });
})();
