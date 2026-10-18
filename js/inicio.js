// Kartooti — Página de inicio
// Menú desplegable en pantallas pequeñas.
(function () {
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Cierra el menú al elegir un enlace
  nav.querySelectorAll('.nav__links a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
