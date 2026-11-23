// ==========================================================
// Kartooti — Botón de accesibilidad (esquina inferior izquierda)
//
// Abre un panel con ajustes que cada persona puede activar:
//   - Tamaño del texto (100 % a 150 %)
//   - Alto contraste
//   - Subrayar enlaces
//   - Letra fácil de leer
//   - Detener animaciones
// Los ajustes se guardan en este navegador y se aplican en todas
// las páginas. Se carga en el <head> para que no "parpadee".
// ==========================================================

(function () {
  var CLAVE = 'kartooti:accesibilidad';
  var TAMANOS = [100, 115, 130, 150];
  var OPCIONES = [
    { id: 'contraste', texto: 'Alto contraste', icono: '<svg width="20" height="20" viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 2a8 8 0 0 1 0 16z" fill="currentColor"/></svg>' },
    { id: 'enlaces', texto: 'Subrayar enlaces', icono: 'U' },
    { id: 'legible', texto: 'Letra fácil de leer', icono: 'Aa' },
    { id: 'pausa', texto: 'Detener animaciones', icono: '❚❚' }
  ];

  // ---------- Ajustes guardados ----------
  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; }
  }
  function guardar(a) {
    try { localStorage.setItem(CLAVE, JSON.stringify(a)); } catch (e) { /* sin almacenamiento */ }
  }
  var ajustes = leer();
  if (TAMANOS.indexOf(ajustes.tamano) === -1) ajustes.tamano = 100;

  // ---------- Estilos (van aquí mismo para no tocar cada página) ----------
  var CSS = [
    // Tamaño: se amplía todo menos el propio botón y su panel
    'html[data-a11y-tamano] body > *:not(.a11y){zoom:var(--a11y-zoom,1)}',
    // Alto contraste
    'html.a11y-contraste body > *:not(.a11y){filter:contrast(1.45) saturate(1.15)}',
    'html.a11y-contraste body{background:#fff}',
    // Subrayar enlaces
    'html.a11y-enlaces a:not(.a11y *){text-decoration:underline !important;text-underline-offset:3px;text-decoration-thickness:2px}',
    // Letra fácil de leer (WCAG 1.4.12: más espacio entre letras, palabras y líneas)
    'html.a11y-legible body *:not(.a11y *):not(svg):not(svg *){font-family:Verdana,Tahoma,Arial,sans-serif !important;letter-spacing:.04em !important;word-spacing:.14em !important}',
    'html.a11y-legible p,html.a11y-legible li{line-height:1.7 !important}',
    // Detener animaciones
    'html.a11y-pausa *,html.a11y-pausa *::before,html.a11y-pausa *::after{animation:none !important;transition:none !important;scroll-behavior:auto !important}',

    // ---------- El botón ----------
    '.a11y{position:fixed;left:20px;bottom:20px;z-index:9999;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}',
    'body.admin .a11y{left:auto;right:20px}',
    '.a11y__boton{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border:3px solid #fff;border-radius:50%;background:#025373;color:#fff;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.28);transition:transform .2s}',
    '.a11y__boton:hover{transform:scale(1.06)}',
    '.a11y__boton:focus-visible{outline:3px solid #025373;outline-offset:3px}',
    '.a11y__boton svg{width:32px;height:32px}',

    // ---------- El panel ----------
    '.a11y__panel{position:absolute;left:0;bottom:70px;width:300px;max-width:calc(100vw - 40px);padding:18px;border-radius:16px;background:#fff;color:#1d293d;box-shadow:0 18px 40px rgba(0,0,0,.3);border:2px solid #025373}',
    'body.admin .a11y__panel{left:auto;right:0}',
    '.a11y__panel[hidden]{display:none}',
    '.a11y__cabeza{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}',
    '.a11y__titulo{margin:0;font-size:18px;line-height:24px;font-weight:800;color:#025373}',
    '.a11y__cerrar{width:36px;height:36px;border:0;border-radius:8px;background:#f0f8fa;color:#025373;font-size:22px;line-height:1;cursor:pointer}',
    '.a11y__grupo{margin:0 0 12px;padding:10px 12px;border-radius:12px;background:#f0f8fa}',
    '.a11y__etiqueta{margin:0 0 8px;font-size:14px;font-weight:700;color:#1d293d}',
    '.a11y__tamano{display:flex;align-items:center;justify-content:space-between;gap:8px}',
    '.a11y__tamano button{min-width:52px;height:40px;border:2px solid #025373;border-radius:10px;background:#fff;color:#025373;font-size:16px;font-weight:800;cursor:pointer}',
    '.a11y__tamano button:disabled{opacity:.45;cursor:not-allowed}',
    '.a11y__valor{font-size:16px;font-weight:800;color:#025373}',
    '.a11y__opciones{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}',
    '.a11y__op{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:72px;padding:8px;border:2px solid #c5dde6;border-radius:12px;background:#fff;color:#1d293d;font-size:13px;font-weight:700;line-height:16px;text-align:center;cursor:pointer}',
    '.a11y__op span{font-size:18px;line-height:20px;color:#025373}',
    '.a11y__op[aria-pressed="true"]{border-color:#025373;background:#025373;color:#fff}',
    '.a11y__op[aria-pressed="true"] span{color:#fff}',
    '.a11y__reset{width:100%;height:42px;border:2px solid #025373;border-radius:10px;background:#fff;color:#025373;font-size:15px;font-weight:700;cursor:pointer}',
    '.a11y button:focus-visible{outline:3px solid #025373;outline-offset:2px}',
    '@media (max-width:560px){.a11y{left:12px;bottom:12px}body.admin .a11y{right:12px}.a11y__boton{width:50px;height:50px}}'
  ].join('');

  var estilo = document.createElement('style');
  estilo.id = 'a11y-estilos';
  estilo.textContent = CSS;
  document.head.appendChild(estilo);

  // ---------- Aplicar ajustes a la página ----------
  function aplicar() {
    var html = document.documentElement;
    OPCIONES.forEach(function (o) { html.classList.toggle('a11y-' + o.id, !!ajustes[o.id]); });
    if (ajustes.tamano !== 100) {
      html.setAttribute('data-a11y-tamano', ajustes.tamano);
      html.style.setProperty('--a11y-zoom', ajustes.tamano / 100);
    } else {
      html.removeAttribute('data-a11y-tamano');
      html.style.removeProperty('--a11y-zoom');
    }
  }
  aplicar(); // antes de que se pinte la página

  // ---------- Construir el botón y el panel ----------
  var ICONO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="6.5" r="1.2" fill="currentColor"/>' +
    '<path d="M7 9.5l5 1 5-1"/><path d="M12 10.5v3.5l-2.5 4.5"/><path d="M12 14l2.5 4.5"/></svg>';

  function construir() {
    if (document.querySelector('.a11y')) return;

    var raiz = document.createElement('div');
    raiz.className = 'a11y';
    raiz.innerHTML =
      '<button class="a11y__boton" type="button" aria-expanded="false" aria-controls="a11y-panel" aria-label="Opciones de accesibilidad">' + ICONO + '</button>' +
      '<div class="a11y__panel" id="a11y-panel" role="dialog" aria-labelledby="a11y-titulo" hidden>' +
        '<div class="a11y__cabeza">' +
          '<h2 class="a11y__titulo" id="a11y-titulo">Accesibilidad</h2>' +
          '<button class="a11y__cerrar" type="button" aria-label="Cerrar opciones de accesibilidad">×</button>' +
        '</div>' +
        '<div class="a11y__grupo" role="group" aria-labelledby="a11y-tamano-titulo">' +
          '<p class="a11y__etiqueta" id="a11y-tamano-titulo">Tamaño del texto</p>' +
          '<div class="a11y__tamano">' +
            '<button type="button" data-a11y-tamano="-1" aria-label="Texto más pequeño">A−</button>' +
            '<span class="a11y__valor" aria-live="polite"></span>' +
            '<button type="button" data-a11y-tamano="1" aria-label="Texto más grande">A+</button>' +
          '</div>' +
        '</div>' +
        '<div class="a11y__opciones">' +
          OPCIONES.map(function (o) {
            return '<button class="a11y__op" type="button" data-a11y-op="' + o.id + '" aria-pressed="false">' +
              '<span aria-hidden="true">' + o.icono + '</span>' + o.texto + '</button>';
          }).join('') +
        '</div>' +
        '<button class="a11y__reset" type="button">Restablecer ajustes</button>' +
      '</div>';
    document.body.appendChild(raiz);

    var boton = raiz.querySelector('.a11y__boton');
    var panel = raiz.querySelector('.a11y__panel');
    var valor = raiz.querySelector('.a11y__valor');
    var menos = raiz.querySelector('[data-a11y-tamano="-1"]');
    var mas = raiz.querySelector('[data-a11y-tamano="1"]');

    function pintar() {
      valor.textContent = ajustes.tamano + ' %';
      menos.disabled = ajustes.tamano === TAMANOS[0];
      mas.disabled = ajustes.tamano === TAMANOS[TAMANOS.length - 1];
      raiz.querySelectorAll('[data-a11y-op]').forEach(function (b) {
        b.setAttribute('aria-pressed', ajustes[b.dataset.a11yOp] ? 'true' : 'false');
      });
    }

    function abrir(si) {
      panel.hidden = !si;
      boton.setAttribute('aria-expanded', si ? 'true' : 'false');
      if (si) raiz.querySelector('.a11y__cerrar').focus();
    }

    boton.addEventListener('click', function () { abrir(panel.hidden); });
    raiz.querySelector('.a11y__cerrar').addEventListener('click', function () { abrir(false); boton.focus(); });

    raiz.querySelector('.a11y__tamano').addEventListener('click', function (e) {
      var b = e.target.closest('[data-a11y-tamano]');
      if (!b || b.disabled) return;
      var i = TAMANOS.indexOf(ajustes.tamano) + Number(b.getAttribute('data-a11y-tamano'));
      ajustes.tamano = TAMANOS[Math.max(0, Math.min(TAMANOS.length - 1, i))];
      guardar(ajustes); aplicar(); pintar();
      // Si el botón quedó desactivado, el foco pasa al otro para no perderse
      if (b.disabled) (b === mas ? menos : mas).focus();
    });

    raiz.querySelector('.a11y__opciones').addEventListener('click', function (e) {
      var b = e.target.closest('[data-a11y-op]');
      if (!b) return;
      var id = b.dataset.a11yOp;
      ajustes[id] = !ajustes[id];
      guardar(ajustes); aplicar(); pintar();
    });

    raiz.querySelector('.a11y__reset').addEventListener('click', function () {
      ajustes = { tamano: 100 };
      guardar(ajustes); aplicar(); pintar();
    });

    // Escape cierra el panel y devuelve el foco al botón
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { abrir(false); boton.focus(); }
    });
    // Clic fuera del panel lo cierra
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !raiz.contains(e.target)) abrir(false);
    });

    pintar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construir);
  else construir();
})();
