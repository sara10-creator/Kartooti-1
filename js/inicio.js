// Kartooti — Página de inicio: menú desplegable en celular y animaciones
(function () {
  var nav = document.querySelector('.nav');
  var boton = document.querySelector('.nav__menu');
  if (!nav || !boton) return;

  boton.addEventListener('click', function () {
    var abierto = nav.classList.toggle('esta-abierto');
    boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });

  // Escape cierra el menú del celular y devuelve el foco al botón (teclado)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('esta-abierto')) {
      nav.classList.remove('esta-abierto');
      boton.setAttribute('aria-expanded', 'false');
      boton.focus();
    }
  });

  nav.querySelectorAll('.nav__links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('esta-abierto');
      boton.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ---------- Animaciones ----------
(function () {
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raiz = document.documentElement;

  // 1. Elementos que aparecen al hacer scroll (con un pequeño escalonado)
  function marcar(selector, extra, paso) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.classList.add('revelar');
      if (extra) el.classList.add(extra);
      el.style.setProperty('--retraso', (i * (paso || 0.12)) + 's');
    });
  }

  if ('IntersectionObserver' in window) {
    raiz.classList.add('anim');

    marcar('.funcion', null, 0.12);
    marcar('.seccion__cabeza', null, 0);
    marcar('.pasos__caja li', null, 0.15);
    marcar('.tips', 'revelar--zoom', 0);
    marcar('.tipo', null, 0.15);

    document.querySelectorAll('.tips__lista li').forEach(function (li, i) {
      li.style.setProperty('--retraso', (0.25 + i * 0.08) + 's');
    });

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observador.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.revelar').forEach(function (el) { observador.observe(el); });
  }

  // 2. Barra de progreso, sombra del encabezado y enlace activo
  var nav = document.querySelector('.nav');
  var barra = document.querySelector('.progreso');
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var secciones = enlaces.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var pendiente = false;

  function alDesplazar() {
    pendiente = false;
    var y = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    if (barra) barra.style.setProperty('--avance', total > 0 ? Math.min(y / total, 1) : 0);
    if (nav) nav.classList.toggle('con-sombra', y > 10);

    var actual = -1;
    secciones.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top <= 120) actual = i;
    });
    enlaces.forEach(function (a, i) { a.classList.toggle('activo', i === actual); });
  }

  window.addEventListener('scroll', function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(alDesplazar); }
  }, { passive: true });
  alDesplazar();

  // Con "reducir movimiento" se omiten burbujas, inclinación 3D y paralaje
  if (reducir) return;

  // 3. Burbujas que suben en el fondo del hero
  var fondo = document.querySelector('.hero__fondo');
  if (fondo) {
    var colores = ['#7dd4e8', '#f2ce5e', '#97d3b1', '#4ea8c0', '#46ecd5'];
    var cantidad = window.innerWidth < 600 ? 10 : 22;
    for (var i = 0; i < cantidad; i++) {
      var p = document.createElement('i');
      p.style.left = (Math.random() * 100) + '%';
      p.style.setProperty('--t', (4 + Math.random() * 10).toFixed(1) + 'px');
      p.style.setProperty('--c', colores[i % colores.length]);
      p.style.setProperty('--d', (9 + Math.random() * 10).toFixed(1) + 's');
      p.style.setProperty('--r', (-Math.random() * 18).toFixed(1) + 's');
      p.style.setProperty('--x', ((Math.random() - 0.5) * 160).toFixed(0) + 'px');
      fondo.appendChild(p);
    }
  }

  // 4. Efectos con el mouse (solo en pantallas con puntero fino)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // Tarjetas de funciones: inclinación 3D y luz que sigue el cursor
  document.querySelectorAll('.funcion').forEach(function (tarjeta) {
    tarjeta.addEventListener('mousemove', function (e) {
      var r = tarjeta.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      tarjeta.style.setProperty('--mx', (x * 100) + '%');
      tarjeta.style.setProperty('--my', (y * 100) + '%');
      tarjeta.style.transform = 'perspective(800px) rotateX(' + ((0.5 - y) * 10).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 12).toFixed(2) + 'deg) translateY(-6px)';
    });
    tarjeta.addEventListener('mouseleave', function () { tarjeta.style.transform = ''; });
  });

  // Maqueta y manchas del hero se mueven un poco con el cursor (paralaje)
  var hero = document.querySelector('.hero');
  var mock = document.querySelector('.hero__mock');
  if (hero && mock) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      mock.style.transform = 'translate(' + (x * 18).toFixed(1) + 'px,' + (y * 14).toFixed(1) + 'px) rotateY(' + (x * 8).toFixed(1) + 'deg) rotateX(' + (-y * 6).toFixed(1) + 'deg)';
      if (fondo) fondo.style.transform = 'translate(' + (-x * 30).toFixed(1) + 'px,' + (-y * 20).toFixed(1) + 'px)';
    });
    hero.addEventListener('mouseleave', function () {
      mock.style.transform = '';
      if (fondo) fondo.style.transform = '';
    });
    mock.style.transition = 'transform .4s ease-out';
    if (fondo) fondo.style.transition = 'transform .6s ease-out';
  }
})();
