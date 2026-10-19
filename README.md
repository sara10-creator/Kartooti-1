Kartooti

Este proyecto, Kartooti, tiene un enfoque académico, no solo porque esta hecho como parte de un entregable para una asignatura, sino porque su principal función funcionar como una herramienta para estudiantes y otros miembros de la comunidad académica de la sede calle 100 de la Universidad Militar Nueva Granada. Desde kartooti te será posible encontrar las ubicaciones de salones y demás espacios, mantenerte al día con eventos y novedades, e informarte sobre los menus y disponibilidad de las distintas zonas de comida y cafes de la universidad.

Mediante Kartooti, buscamos ayudar a tantas personas como se pueda, ya sean estudiantes nuevos, visitantes o miembros ya establecidos de la comunidad que busquen estar siempre al día con todo lo relacionado al campus. Esperamos este proyecto te haga la navegación por la U más sencilla y que te facilite un poco la vida.

Integrantes

Sara Alejandra Jara - 1202829
David Sánchez García – 1202831
Daniel Díaz – Código

1. Objetivo General

Kartooti funciona como una herramienta que busca facilitar la vida universitaria ayudando a sus usuarios a ubicarse mejor en la sede calle 100 de una UMNG y a estar mejor informados sobre distintas dinámicas y eventos realizados en este espacio.

La app busca evitar que los estudiantes y demás miembros de la comunidad pierdan tiempo en desplazamientos, evitando llegadas tardías y facilitando el entendimiento de los espacios.

De igual forma, kartooti tiene como propósito brindarle a sus usuarios una mejor forma de informarse de eventos y dinámicas realizadas en las instalaciones. Usualmente esta información se pierde en el mar de correos institucionales que llegan a las cuentas de los estudiantes, utilizando Kartooti, se podrá revisar cuales eventos se están llevando a cabo en la universidad en el momento, facilitando el acceso a esta información.

2. Contexto de Uso

El sistema será utilizado mayormente por estudiantes de la Universidad Militar Nueva granada, con un énfasis en estudiantes de nuevo ingreso que recién se están a adaptando al entorno universitario, al igual que cualquier miembro de la comunidad universitaria que desee facilitar sus desplazamientos y acceder a información relevante más facilmente

El sistema funciona mediante un inicio de sesión que se le pedirá a cada usuario que desee ingresar. Después de eso, el usuario podrá revisar la ubicación de puntos de interés en el sede, ya sean salones, aulas especiales o demás puntos. Así mismo, desde la pestaña de eventos, el usuario podrá revisar cuales dinámicas hay disponibles en la sede calle 100. La aplicación funcionara tanto en dispositivos mobiles como en formato de escritorio, adaptándose a diferentes tamaños de pantalla y por ende, a las necesidades del usuario.

📋 3. Requerimientos del Sistema
3.1 Requerimientos Funcionales

RF-01. Registro de usuarios: El sistema debe permitir que los estudiantes creen una cuenta ingresando sus datos personales y credenciales de acceso.

RF-02. Inicio de sesión: El sistema debe permitir que los usuarios registrados inicien sesión mediante sus credenciales.

RF-03. Visualización del mapa: El sistema debe permitir que los estudiantes visualicen un mapa interactivo de la universidad con sus edificios, salones y demás puntos de interés.

RF-04. Búsqueda de ubicaciones: El sistema debe permitir que los usuarios busquen ubicaciones específicas dentro de la universidad y consulten información relacionada con ellas.

RF-05. Consulta de eventos: El sistema debe permitir que los estudiantes consulten los eventos y actividades programados dentro de la universidad, incluyendo sus fechas, horarios, ubicaciones y descripciones.

RF-06. Notificaciones de eventos: El sistema debe enviar notificaciones a los usuarios para informarles sobre eventos, actividades y dinámicas universitarias.

RF-07. Gestión de eventos: El sistema debe permitir que los administradores registrados publiquen, actualicen y eliminen información relacionada con los eventos universitarios.

3.2 Requerimientos No Funcionales

RNF-01. Usabilidad: La aplicación debe contar con una interfaz intuitiva que permita a los estudiantes acceder fácilmente al mapa y consultar los eventos universitarios.

RNF-02. Rendimiento: La aplicación debe cargar la pantalla principal en un máximo de 3 segundos bajo condiciones normales de conexión.

RNF-03. Seguridad: El sistema debe proteger las cuentas de los usuarios mediante el almacenamiento seguro de contraseñas y mecanismos de autenticación.

RNF-04. Privacidad: El sistema debe proteger los datos personales de los estudiantes y evitar que sean accesibles para personas no autorizadas.

RNF-05. Compatibilidad: La aplicación debe funcionar correctamente en los dispositivos móviles y las versiones de los sistemas operativos definidos como compatibles con el proyecto.

RNF-06. Disponibilidad: El sistema debe mantener una disponibilidad mínima del 99 % mensual, excluyendo los periodos de mantenimiento programado.

RNF-07. Accesibilidad: La aplicación debe utilizar textos legibles, contraste adecuado y controles accesibles para facilitar su uso por personas con diferentes capacidades.

🧠 4. Diagramas UML

DIAGRAMA DE CASOS DE USO:

<img width="1209" height="1600" alt="image" src="https://github.com/user-attachments/assets/dffeff5b-e1d2-48a3-babb-74cef32577a1" />

Actores del sistema

- Usuario: es el estudiante o usuario general que accede a la aplicación para consultar información.
- Administrador: es la persona encargada de mantener actualizada la información de la universidad, como las ubicaciones y los eventos.
  
Funcionalidades del usuario

1. Iniciar sesión: permite acceder a la aplicación. El diagrama incluye el ingreso de un correo o código temporal como parte de este proceso.
2. Cerrar sesión: permite finalizar la sesión activa del usuario.
3. Visualizar mapa interactivo: permite consultar el mapa del campus.
4. Buscar ubicación: permite encontrar un lugar específico dentro de la universidad.
5. Ver detalles de ubicación: permite consultar información adicional sobre un lugar seleccionado.
6. Ver eventos: permite conocer las actividades que se desarrollan en la universidad.
7. Ver detalles del evento: permite consultar información específica de cada actividad.
8. Ver servicios del campus: permite acceder a información de servicios universitarios, como los gastronómicos y la papelería, incluidos sus horarios y demás datos relevantes.
   
Funcionalidades del administrador

1. Elegir destino y calcular ruta: permite seleccionar un destino y calcular una ruta para llegar a él.
2. Gestionar ubicaciones: permite agregar, editar y eliminar ubicaciones del mapa.
3. Gestionar eventos: permite agregar, editar y eliminar eventos publicados en la aplicación.

Diagrama de Secuencia



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
