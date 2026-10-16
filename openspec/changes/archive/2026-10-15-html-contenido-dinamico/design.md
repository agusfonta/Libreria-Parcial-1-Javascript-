# Design

## Context

Ver proposal.md - Why. Estado relevante: `index.html` declaraba datos del modelo en el marcado — tres `<tr>` en `#tabla-libros-cuerpo` (Rayuela / El Aleph / Antología fantástica), tres `<tr>` en `#tabla-clientes-cuerpo`, dos `<option>` en `#libro-editorial`, dos `<option>` en `#libro-genero` y tres `<option>` en cada uno de `#venta-cliente` y `#venta-libro`. `js/app.js` ya trae el modelo (`libros`, `editoriales`, `generos`, `autores`, `clientes`), las funciones `renderizarTablaLibros()`, `renderizarTablaClientes()`, `poblarOpcionesFormularioLibro()` y `refrescarOpcionesRelacionadas()`, y el `inicializar()` con el guard de early-return `if (!buscador && !formLibro && !formCliente) { return; }`. El design del Ej. 4 (decisión #10) había optado deliberadamente por NO vaciar las filas estáticas y dejar que el render inicial de JavaScript las reemplazara al cargar. Restricciones duras: HTML/CSS/JS nativos, sin librerías ni build, `file://`, y los `id`/`name`/`value` del contrato HTML no cambian.

## Goals / Non-Goals

**Goals:**
- El marcado deja de ser una segunda fuente de verdad: los seis contenedores data-driven se declaran vacíos.
- Todo el contenido de datos (filas de tablas, opciones de selects) proviene del modelo local vía JavaScript al cargar la página.
- Los selects de ventas (`#venta-cliente`, `#venta-libro`) quedan completos desde el arranque, no recién después de un alta.

**Non-Goals:**
- Lógica de ventas/renglones/total/historial (Ej. 5) y persistencia/README (Ej. 6).
- Tocar `css/estilos.css`, `tests/app.test.js` o las firmas de las funciones existentes.
- Vaciar la maqueta de Etapa 1 de Ventas e Historial (`#venta-renglones-cuerpo`, `#venta-total`, `#historial-cuerpo`, `#detalle-venta`).

## Decisions

1. **Vaciar el HTML en lugar de dejarlo como fallback (revierte la decisión #10 del Ej. 4).** El Ej. 4 había decidido no tocar las filas estáticas: eran un fallback visual y el render inicial las reemplazaba. La experiencia posterior mostró que eso mantenía dos fuentes de verdad desincronizadas: los selects de ventas (nunca repoblados al cargar) solo ofrecían `lib-1`..`lib-3`, mientras el catálogo ya tenía seis libros del modelo. Se vacía el marcado para que el modelo local sea la única fuente de verdad y todo dato visible provenga de él. Alternativa descartada: mantener el fallback estático (obliga a mantener sincronizadas a mano ambas copias, justo el problema que este change elimina).

2. **Llamada de init a `refrescarOpcionesRelacionadas()`.** Se agrega una única línea en `inicializar()`, inmediatamente después del guard de early-return, para poblar `#venta-cliente`/`#venta-libro` al cargar. Antes, esa función solo se invocaba tras un alta exitosa, por lo que los selects de ventas arrancaban con las opciones estáticas incompletas del HTML (solo `lib-1`..`lib-3`) y solo se completaban al registrar algo. Alternativa descartada: añadir un `render` de ventas aparte (duplica responsabilidad); se reutiliza la función ya existente y testeada.

3. **Reutilizar las funciones de render existentes en `inicializar()`.** `renderizarTablaLibros()`, `renderizarTablaClientes()` y `poblarOpcionesFormularioLibro()` ya se llaman en `inicializar()` y redibujan sus contenedores con `replaceChildren()`. Al vaciar el HTML, son ellas —sin cambios— las que generan todo el contenido desde el modelo. No se crea código nuevo salvo la llamada de la decisión 2.

4. **Trade-off: sin JavaScript, tablas y selects quedan vacíos.** Se acepta el mismo criterio que el Ej. 3 ya adoptó para `#lista-catalogo` (listado generado desde datos con contenedor vacío). El proyecto no tiene requisito de operar sin JS; el marcado vacío es el precio de no duplicar datos.

5. **Seguridad: `textContent`, nunca `innerHTML`.** Todo el render (filas, opciones, fichas, mensajes) sigue construyéndose con `createElement` + `textContent`; este change no incorpora ningún inserto con `innerHTML`/`outerHTML`/`insertAdjacentHTML`, consistente con la spec `datos-catalogo-filtro`.

6. **La maqueta de Etapa 1 de Ventas/Historial queda intacta.** El `<p class="aviso-maqueta">` de Ventas, `#venta-renglones-cuerpo`, `#venta-total`, `#historial-cuerpo` y `#detalle-venta` conservan su contenido de ejemplo: pertenecen al Ej. 5 y su vaciado no es parte de esta regla.

## Risks / Trade-offs

- [Vistas dependientes de JavaScript si falla la carga del script] → mismo trade-off ya aceptado para el catálogo en el Ej. 3; `js/app.js` se carga con `defer` y la suite confirma que el modelo y las funciones de render están disponibles.
- [Perder el fallback estático puede ocultar un error de render] → verificación por lectura del DOM (los `id` son estables) y la suite `node --test` (54/54) confirman que las funciones de render no se rompieron; la capa DOM se documenta como desviación (sin jsdom).
- [Desincronización futura si alguien vuelve a poner datos en el HTML] → la nueva capability `contrato-html-dinamico` fija la regla como contrato verificable (contenedores declarados vacíos).
- [`refrescarOpcionesRelacionadas()` en init podría pisar una selección] → en el arranque la selección es la opción vacía; no hay selección del usuario que preservar y la lógica de ventas aún no existe (Ej. 5).

## Migration Plan

No aplica (proyecto sin despliegue). Rollback: revertir el commit de implementación (restaurar las filas/opciones estáticas en `index.html` y quitar la llamada de init en `js/app.js`).

## Open Questions

Ninguna: las decisiones quedan cerradas y no alteran los specs ni el desglose de tareas.
