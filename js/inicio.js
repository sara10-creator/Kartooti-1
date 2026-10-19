// Kartooti — Página de inicio: menú desplegable en celular
(function () {
  var nav = document.querySelector('.nav');
  var boton = document.querySelector('.nav__menu');
  if (!nav || !boton) return;

  boton.addEventListener('click', function () {
    var abierto = nav.classList.toggle('esta-abierto');
    boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });

  nav.querySelectorAll('.nav__links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('esta-abierto');
      boton.setAttribute('aria-expanded', 'false');
    });
  });
})();
