Para Completar por grupo

🌐 Nombre del Proyecto

Escribe aquí una descripción corta del proyecto.

👥 Integrantes

Nombre completo – Código
Nombre completo – Código

🎯 1. Objetivo General

Escribir un solo párrafo donde expliquen:
Qué quieren lograr con el sistema.
Qué problema buscan solucionar.

🌍 2. Contexto de Uso

¿Quién va a usar el sistema?
¿Cómo se va a utilizar el sistema?

📋 3. Requerimientos del Sistema
3.1 Requerimientos Funcionales

Escriban lo que el sistema debe hacer.

Ejemplo:
RF01: El sistema debe permitir registrar usuarios.

3.2 Requerimientos No Funcionales

Escriban cómo debe comportarse el sistema.

Ejemplo:
RNF01: La página debe ser responsive.

🧠 4. Diagramas UML

Diagrama de Casos de Uso

Explicar brevemente qué muestra el diagrama.

Diagrama de Secuencia

Explicar qué proceso representa.

🎨 5. URL del Prototipo

https://www.figma.com/design/Ypfzv785tkNQ0vcORi4F1u/Kartooti


🗄️ 6. Diseño de Base de Datos

Agregar imagen del modelo.
Tablas principales

🧩 7. Documentación del Sistema
Estructura de Carpetas

```
index.html            Página de inicio (landing) de Kartooti
/admin                Panel de administración
  resumen.html          Resumen con indicadores y actividad reciente
  datos.html            Actualizar Datos: puntos de interés del campus
  usuarios.html         Gestión de Usuarios
  eventos.html          Gestión de Eventos
/css
  base.css              Colores, fuentes y estilos comunes
  inicio.css            Estilos de la página de inicio
  footer.css            Pie de página del sitio
  admin.css             Estilos del panel de administración
/js
  inicio.js             Menú desplegable de la página de inicio en celular
  /admin
    comun.js            Barra lateral, encabezado, ventanas emergentes y avisos
    datos-ejemplo.js    Datos de ejemplo (puntos, usuarios y eventos)
    datos.js            Lógica de Actualizar Datos (buscar, filtrar, crear, editar, eliminar)
    usuarios.js         Lógica de Gestión de Usuarios (buscar, filtrar, ver detalle, invitar)
    eventos.js          Lógica de Gestión de Eventos (buscar, filtrar, crear, editar, publicar)
/assets
  /icons                Íconos SVG exportados desde Figma
  /img                  Imágenes (vista previa del mapa)
```

Por ahora el panel usa datos de ejemplo que se guardan en el navegador (localStorage), así que los cambios se mantienen al recargar la página. Cuando exista la base de datos, solo hay que reemplazar `js/admin/datos-ejemplo.js` por llamadas al servidor.

🚀 8. Instalación y Ejecución

No necesita instalar nada: es HTML, CSS y JavaScript puro.

1. Clona o descarga el repositorio.
2. Abre `index.html` en el navegador (doble clic) para ver la página de inicio.
3. Para entrar al panel, usa el botón **Acceso administrativo** de la página de inicio o abre `admin/resumen.html`.

Opcional: para verlo como un sitio real, en VS Code instala la extensión *Live Server* y haz clic en **Go Live**, o publícalo gratis con GitHub Pages (Settings → Pages → rama `main`).