# Proposal

## Why

El TPI "frontend de una librería" (Programación III, UTN) exige como Ejercicio 1 (20 puntos, Etapa 1) una estructura HTML semántica con `index.html` como entrada y navegación clara entre cinco vistas: Catálogo, Libros, Clientes, Ventas e Historial. El proyecto hoy no tiene código: esta maqueta es la base sobre la que se apoyan los ejercicios 2 a 6 (CSS, datos locales, altas, ventas y persistencia), por lo que debe contemplar desde ya los campos, identificadores y estados que luego usará JavaScript.

## What Changes

- Se crea `index.html` como única página de entrada, con `header`, `nav` y `main` semánticos, enlace para saltar al contenido y cinco secciones navegables por anclas.
- **Catálogo**: título de la librería, buscador por título y listado de libros con título, ISBN, editorial, género, autores y precio; un libro sin género muestra «Sin clasificar».
- **Libros**: formulario de alta (título, ISBN, precio, editorial, género con opción «Sin clasificar», autores múltiples) y tabla de libros registrados.
- **Clientes**: formulario de alta (nombre completo, email) y tabla de clientes registrados.
- **Ventas**: selección de cliente, composición de renglones (libro, cantidad) y resumen con subtotales y total.
- **Historial**: tabla de ventas (identificador, fecha, cliente, total) con acceso al detalle de renglones.
- Mensajes estructurales (inicialmente ocultos) para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas.
- Datos estáticos de ejemplo, ficticios, en listados e historial; los controles aún no funcionales se identifican como "maqueta".
- Se crean `css/estilos.css` y `js/app.js` vacíos y enlazados, para preparar la separación estructura/estilos/comportamiento.

Fuera de alcance: identidad visual y diseño adaptable (Ej. 2), datos en JS, renderizado y filtro (Ej. 3; incluye la interacción básica de Etapa 1, el filtro por título, por lo que este change solo entrega estructura), validación y altas reales (Ej. 4), lógica de ventas (Ej. 5), `localStorage` y README final (Ej. 6). No se usan librerías, frameworks ni CDNs.

## Capabilities

### New Capabilities
- `estructura-navegacion`: página de entrada `index.html`, landmarks semánticos (`header`, `nav`, `main`), enlace de salto y navegación entre las cinco vistas.
- `vista-catalogo`: título de la librería, buscador por título y listado de libros con sus seis datos y la regla «Sin clasificar».
- `vista-altas`: formularios de alta y tablas de listados para Libros y Clientes, con los campos de dominio que usará JavaScript.
- `vista-ventas-historial`: formulario de venta (cliente, renglones, resumen) e historial de ventas con acceso al detalle.
- `accesibilidad-estados-html`: etiquetas asociadas a cada campo, botones con texto descriptivo, tablas con encabezados, mensajes de estado (vacío, sin resultados, éxito, rechazo) y marcado de controles de maqueta.

### Modified Capabilities
<!-- Ninguna: no existen specs previas en el proyecto. -->

## Impact

- Archivos nuevos: `index.html`, `css/estilos.css` (vacío), `js/app.js` (vacío, cargado con `defer`).
- Sin dependencias externas, sin servidor ni build: se abre `index.html` directamente en el navegador.
- Los `id`, atributos `name` y valores de `option` definidos aquí son el contrato que consumirán los ejercicios 3 a 5; cambiarlos después implica tocar el JavaScript.
