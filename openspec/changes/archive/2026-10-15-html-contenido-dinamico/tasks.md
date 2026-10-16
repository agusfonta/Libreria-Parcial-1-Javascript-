# Tasks

> **Nota de implementación**: la implementación de este change se completó ANTES de formalizarlo con OpenSpec y está verificada. Verificación: suite `node --test` **54/54 (0 fail)**, idéntica a la línea base (sin regresión), y revisión por lectura del DOM de `index.html`. **Desviación documentada**: la capa DOM no tiene runner (no hay jsdom ni dependencias) por la restricción dura del proyecto de HTML/CSS/JS nativos sin build; su verificación es por lectura del marcado y de las funciones de render. El cambio en `js/app.js` es 1 llamada a la función existente `refrescarOpcionesRelacionadas()` (ya testeada indirectamente por la suite). Todas las tareas quedan `[x]`.

## 1. Red de seguridad

- [x] 1.1 SAFETY NET: ejecutar `node --test` (auto-discovery; `node --test tests/` falla con MODULE_NOT_FOUND en Node v24/Windows) y registrar la línea base antes de tocar el proyecto: 54 tests, 0 fail. Verificación: salida de la suite con `pass 54` / `fail 0`.

## 2. Vaciar los seis contenedores data-driven del marcado

- [x] 2.1 Vaciar `#tabla-libros-cuerpo`: eliminar los tres `<tr>` estáticos (Rayuela / El Aleph / Antología fantástica) y dejarlo como `<tbody>` vacío. Verificación: inspección de `index.html`; `renderizarTablaLibros()` lo llena en `inicializar()`.
- [x] 2.2 Vaciar `#tabla-clientes-cuerpo`: eliminar los tres `<tr>` estáticos y dejarlo como `<tbody>` vacío. Verificación: inspección de `index.html`; `renderizarTablaClientes()` lo llena en `inicializar()`.
- [x] 2.3 Vaciar `#libro-editorial`: eliminar las dos `<option>` estáticas (queda un `<select required>` vacío). Verificación: inspección de `index.html`; `poblarOpcionesFormularioLibro()` lo repuebla en `inicializar()`.
- [x] 2.4 Vaciar `#libro-genero`: eliminar las dos `<option>` estáticas (queda un `<select>` vacío; el placeholder «Sin clasificar» lo agrega JS). Verificación: inspección de `index.html`.
- [x] 2.5 Vaciar `#venta-cliente`: eliminar las tres `<option>` estáticas. Verificación: inspección de `index.html`; `refrescarOpcionesRelacionadas()` lo puebla.
- [x] 2.6 Vaciar `#venta-libro`: eliminar las tres `<option>` estáticas. Verificación: inspección de `index.html`; `refrescarOpcionesRelacionadas()` lo puebla.
- [x] 2.7 Confirmar que NO se tocaron los contenedores de la maqueta de Etapa 1: `#venta-renglones-cuerpo`, `#venta-total`, `#historial-cuerpo` y `<article id="detalle-venta">` conservan su contenido de ejemplo. Verificación: `git diff index.html` no muestra cambios en esas líneas.

## 3. Poblar los selects de venta al cargar

- [x] 3.1 Agregar UNA llamada `refrescarOpcionesRelacionadas();` dentro de `inicializar()`, inmediatamente después del guard de early-return `if (!buscador && !formLibro && !formCliente) { return; }`. Verificación: `git diff js/app.js` muestra exactamente +1 línea; `#venta-cliente`/`#venta-libro` arrancan completos desde los datos.
- [x] 3.2 Confirmar que no se modificó ninguna firma de función ni se duplicó lógica de render (se reutilizan las funciones existentes). Verificación: `git diff --stat` acota `js/app.js` a una sola inserción.

## 4. Verificar el contrato HTML

- [x] 4.1 Verificar que `id`, `name` y `value` del contrato HTML no cambiaron respecto del Ej. 4. Verificación: `git diff index.html` solo elimina filas/opciones y no altera atributos de identificación de contenedores.
- [x] 4.2 Verificar coherencia con los specs: `contrato-html-dinamico` (contenedores vacíos + generación por JS), `vista-altas` (listados y opciones generados desde datos) y `vista-ventas-historial` (opciones al cargar). Verificación: `openspec validate "html-contenido-dinamico" --strict` sin errores.

## 5. Verificación integral

- [x] 5.1 Ejecutar `node --test` y confirmar 54/54 (baseline y final idénticos, sin regresión). Verificación: salida de la suite con `pass 54` / `fail 0`.
- [x] 5.2 Confirmar que ninguna tarea modificó `css/estilos.css` ni `tests/app.test.js`. Verificación: `git diff --stat` solo lista `index.html` y `js/app.js`.
- [x] 5.3 Ejecutar `openspec validate "html-contenido-dinamico" --strict` sin errores y `openspec status --change "html-contenido-dinamico" --json` con los cuatro artefactos en `done` e `isPlanningComplete: true`. Verificación: salida de ambos comandos.

## Workflow follow-up

- Archivar el change con OpenSpec una vez que el orquestador verifique (sincroniza las delta specs a `openspec/specs/` y crea `openspec/specs/contrato-html-dinamico/spec.md`).
- Revisar que `openspec/specs/vista-altas/spec.md` y `openspec/specs/vista-ventas-historial/spec.md` quedaron con los requirements modificados esperados tras el archive.
