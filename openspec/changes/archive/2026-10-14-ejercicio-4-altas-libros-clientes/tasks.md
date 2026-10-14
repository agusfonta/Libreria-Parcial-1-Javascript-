# Tasks

> Strict TDD Mode activo. Runner: `node:test` + `node:assert` incorporados, ejecutado con `node --test` (sin dependencias). Ciclo por comportamiento: SAFETY NET → RED → GREEN → TRIANGULATE → REFACTOR. Las funciones puras (`generarSiguienteId`, `normalizarIsbn`, `emailValido`, `validarLibro`, `validarCliente`, `mostrarMensaje`) se cubren con tests; la manipulación de DOM (tablas, selects, mensajes, avisos) se verifica con checklist manual en el navegador (no se instala jsdom). Ninguna tarea de este change escribe código de producción todavía: se ejecutan en la fase apply.

## 1. Red de seguridad y andamiaje

- [x] 1.1 SAFETY NET: ejecutar `node --test` en el repo y registrar la línea base (cantidad de tests y fallos) antes de tocar `js/app.js`; si existe alguna falla previa, reportarla sin corregirla.
- [x] 1.2 Verificar que `js/app.js` sigue cargando en Node con `node -e "require('./js/app.js')"` y que `tests/app.test.js` es el archivo de pruebas vigente; confirmar que no hace falta ninguna dependencia nueva.

## 2. IDs y normalización de ISBN (funciones puras + tests)

- [x] 2.1 RED: en `tests/app.test.js` escribir tests de `generarSiguienteId(libros, "lib") === "lib-7"` (con `lib-1`..`lib-6`) y de que `normalizarIsbn("978-0-00-000001-1")` y `normalizarIsbn("978 0 00 000001 1")` devuelven el mismo valor; correr `node --test` y confirmar que fallan.
- [x] 2.2 GREEN: implementar en `js/app.js` `generarSiguienteId(coleccion, prefijo)` (barrido del sufijo numérico máximo + 1) y `normalizarIsbn(isbn)` (quitar espacios y guiones, pasar a minúsculas); exportarlas y verificar que `node --test` pasa.
- [x] 2.3 TRIANGULATE: agregar casos borde — `generarSiguienteId(clientes, "cli") === "cli-4"`; ids con formato ajeno al prefijo se ignoran; `normalizarIsbn` con mayúsculas (por ejemplo la `x` de ISBN-10) y con espacios en los extremos; dos altas consecutivas no colisionan; verificar que `node --test` pasa.
- [x] 2.4 REFACTOR: extraer el cálculo del sufijo numérico a un helper interno y mantener ambas funciones exportadas; verificar que `node --test` sigue verde.

## 3. Validaciones del formulario de libro (funciones puras + tests)

- [x] 3.1 RED: escribir tests de `validarLibro(datos)` — título vacío o solo espacios devuelve mensaje; ISBN vacío devuelve mensaje; precio no numérico o menor o igual a cero devuelve mensaje; correr `node --test` y confirmar que fallan.
- [x] 3.2 GREEN: implementar `validarLibro(datos)` devolviendo un array de mensajes de error (`[]` cuando todo pasa); verificar que `node --test` pasa.
- [x] 3.3 TRIANGULATE: agregar casos — ISBN duplicado con separadores distintos contra el modelo real (`lib-1`..`lib-6`); editorial vacía o inexistente; ninguna selección de autores; autor inexistente entre los seleccionados; género `null`/«Sin clasificar» permitido; género inexistente; datos válidos devuelven `[]`; verificar que `node --test` pasa.
- [x] 3.4 REFACTOR: extraer los textos de los mensajes a constantes y verificar que `node --test` sigue verde.

## 4. Validaciones del formulario de cliente (funciones puras + tests)

- [x] 4.1 RED: escribir tests de `validarCliente(datos, clientes)` — nombre vacío o solo espacios devuelve mensaje; email vacío o con formato inválido (sin `@` o sin dominio) devuelve mensaje; correr `node --test` y confirmar que fallan.
- [x] 4.2 GREEN: implementar `emailValido(email)` (regex simple) y `validarCliente(datos, clientesExistentes)`; verificar que `node --test` pasa.
- [x] 4.3 TRIANGULATE: agregar casos — email duplicado comparado con `trim` y sin distinguir mayúsculas/minúsculas (` Ana@Example.com ` contra `ana@example.com`) devuelve mensaje; email único devuelve `[]`; verificar que `node --test` pasa.
- [x] 4.4 REFACTOR: unificar en un helper la comparación de email normalizado y verificar que `node --test` sigue verde.

## 5. Opciones del formulario de libro desde los datos locales

- [x] 5.1 Implementar `poblarOpcionesFormularioLibro()`: genera las opciones de `#libro-editorial`, de `#libro-genero` (con «Sin clasificar» `value=""` primero) y de `#libro-autores` (selector múltiple) desde `editoriales`, `generos` y `autores`, usando `createElement` + `textContent`; verificar en el navegador que las opciones coinciden con los datos y que se pueden mantener varios autores seleccionados.
- [x] 5.2 Enganchar `poblarOpcionesFormularioLibro()` en `inicializar()` y verificar que al recargar no se duplican opciones (idempotencia) y que la consola no arroja errores.

## 6. Alta de libro: mensajes, tabla y envío

- [x] 6.1 Implementar `mostrarMensaje(contenedor, texto)` (limpiar contenido, quitar `hidden` y recién después asignar `textContent`) y `renderizarTablaLibros()` (redibuja `#tabla-libros-cuerpo` desde `libros` con los seis datos y «Sin clasificar» ante género `null`); verificar en el navegador que la tabla inicial se genera desde el modelo.
- [x] 6.2 Implementar el handler de `submit` de `#form-libro` dentro de `inicializar()`: `preventDefault`, lectura de los valores, `validarLibro`; si pasa, crear el registro con `generarSiguienteId(libros, "lib")`, `precio` con `Number(...)`, ISBN crudo y `generoId: null` cuando el género está vacío, agregarlo al modelo, hacer `reset()` del formulario y mostrar el mensaje de éxito; verificar en el navegador el alta válida, el rechazo con los errores en `#mensaje-libro-resultado` y que la página no se recarga.
- [x] 6.3 Verificar seguridad y unicidad: dos altas consecutivas generan `lib-7` y `lib-8`; un título con caracteres `<` o `&` se ve como texto literal; comprobar que ningún inserto del alta usa `innerHTML`.

## 7. Alta de cliente: tabla y envío

- [x] 7.1 Implementar `renderizarTablaClientes()` (redibuja `#tabla-clientes-cuerpo` desde `clientes`); verificar en el navegador que la tabla inicial se genera desde el modelo.
- [x] 7.2 Implementar el handler de `submit` de `#form-cliente`: `preventDefault`, `validarCliente`; si pasa, crear el cliente con `generarSiguienteId(clientes, "cli")`, agregarlo al modelo, hacer `reset()` y mostrar el mensaje en `#mensaje-cliente-resultado`; verificar en el navegador el alta válida (`cli-4`), el rechazo por email duplicado con distinto caso y que la página no se recarga.
- [x] 7.3 Verificar que el alta no incorpora ningún campo de apellido separado: solo nombre completo y email.

## 8. Repoblado de opciones relacionadas y catálogo tras cada alta

- [x] 8.1 Implementar `refrescarOpcionesRelacionadas()` (repuebla solo las opciones de `#venta-libro` y `#venta-cliente`, conservando sus opciones iniciales vacías) y llamarlo tras cada alta correcta junto con `renderizarTablaLibros()`/`renderizarTablaClientes()`, la tabla contraria y `renderizarCatalogo(filtrarPorTitulo(libros, buscador.value))`; verificar en el navegador que tras un alta aparecen la fila de la tabla, la ficha del catálogo y la opción nueva en el select de ventas, sin recargar.
- [x] 8.2 Verificar que la lógica de ventas no cambió: los renglones y el total siguen siendo los de ejemplo y el formulario de venta conserva su estructura y sus `id`/`name`/`value`.

## 9. Limpieza de avisos de maqueta en `index.html`

- [x] 9.1 Quitar el `<p class="aviso-maqueta">` de la vista Libros (línea ~47) y el de la vista Clientes (línea ~139); verificar que el aviso de la vista Ventas permanece y que no se modificó ningún `id`, `name` ni `value`.
- [x] 9.2 Verificar en el navegador que Libros y Clientes ya no muestran aviso de maqueta y que Ventas lo sigue mostrando.

## 10. Verificación integral

- [x] 10.1 Ejecutar `node --test` y confirmar que toda la suite (Ej. 3 + Ej. 4: ids, ISBN, validaciones de libro y cliente) pasa sin fallos.
- [x] 10.2 Checklist manual en navegador con `index.html` abierto por `file://`: opciones de los selectores generadas desde los datos; rechazos de libro (título/ISBN vacío, ISBN duplicado con separadores distintos, precio ≤ 0, sin autor, editorial/género/autores inexistentes); rechazos de cliente (nombre vacío, email inválido, email duplicado con distinto caso); altas correctas con ids `lib-7` y `cli-4`; tablas, catálogo y selects de ventas actualizados sin recarga; mensajes de resultado ocultos al inicio; avisos de maqueta quitados en Libros y Clientes.
- [x] 10.3 Ejecutar `openspec validate "ejercicio-4-altas-libros-clientes" --strict` y confirmar que el change sigue válido tras la implementación.

## 11. Corrección: autores como casillas

> Reapertura del apply. Causa raíz: el `<select multiple>` de autores exigía mantener Ctrl/Cmd para conservar más de una opción (un clic simple reemplaza la selección), por lo que el usuario percibía que «solo permite un autor». Se reemplaza por un grupo de casillas equivalentes (permitido por la spec). NO se usa `required` nativo en las casillas: en un grupo de `checkbox` con el mismo `name`, el navegador exigiría marcar todas (no «al menos una»); esa regla sigue en `validarLibro`.

- [x] 11.1 RED: en `tests/app.test.js` escribir tests de `obtenerIdsSeleccionados(casillas)` — dos tildadas devuelven sus `value`; lista vacía y ninguna tildada devuelven `[]`; se preserva el orden; correr `node --test` y confirmar que fallan.
- [x] 11.2 GREEN: implementar en `js/app.js` `obtenerIdsSeleccionados(casillas)` (`Array.from(casillas).filter(c => c.checked).map(c => c.value)`) y exportarla en `module.exports`; verificar que `node --test` pasa.
- [x] 11.3 TRIANGULATE: agregar el caso de una sola casilla tildada y el de todas tildadas; verificar que `node --test` pasa.
- [x] 11.4 En `index.html`, reemplazar el `<select id="libro-autores" multiple required>` por un `<fieldset>` con `<legend>Autores</legend>` y un contenedor `<div id="libro-autores" aria-describedby="ayuda-libro-autores" aria-required="true">` (se conserva el `id`; sin `required` nativo) y actualizar el texto de `#ayuda-libro-autores` a «Marcá uno o más autores.»; verificar que no cambia ningún otro `id`/`name`/`value`.
- [x] 11.5 Actualizar `poblarOpcionesFormularioLibro()` para poblar `#libro-autores` con una casilla (`type="checkbox"`, `name="autores"`, `value=autor.id`, `id="libro-autor-aut-N"`) más su `<label>` (`setAttribute("for", …)`, `textContent`) por autor, limpiando antes con `replaceChildren()` (idempotencia); editorial y género siguen usando `crearOpcion`.
- [x] 11.6 Actualizar el handler de `submit` de `#form-libro` para leer los autores con `obtenerIdsSeleccionados(document.querySelectorAll('#libro-autores input[name="autores"]'))` en lugar de `.selectedOptions`.
- [x] 11.7 Actualizar las delta specs de `vista-altas` (autores como casillas; obligatorio = al menos uno, por JavaScript; scenario «Varios autores») y de `altas-libros-clientes` (requirement de opciones y scenario «Autores como casillas»); actualizar `design.md` (decisión 5 y nueva decisión 12 con el porqué de las casillas y del no-`required`).
- [x] 11.8 Ejecutar `node --test` (suite completa verde), verificar con grep que `js/app.js` no usa `innerHTML`/`outerHTML`/`insertAdjacentHTML`, correr un harness de humo con fake-DOM (definir `document` antes de requerir `js/app.js`, tildar dos casillas y confirmar `lib-7` con ambos autores) y `openspec validate "ejercicio-4-altas-libros-clientes" --strict`.

## Workflow follow-up

- Archivar el change con OpenSpec una vez verificada la implementación y sincronizadas las delta specs a `openspec/specs/`.
- Revisar que `openspec/specs/vista-altas/spec.md` y `openspec/specs/vista-ventas-historial/spec.md` quedaron con los requirements modificados esperados y que se creó `openspec/specs/altas-libros-clientes/spec.md`.

## 12. Corrección: ISBN normalizado al guardar

- [x] 12.1 SAFETY NET: ejecutar `node --test` y registrar baseline (51 pasando) antes de modificar.
- [x] 12.2 RED: escribir tests para crearLibro (exportado) que verifiquen ISBN normalizado: guiones 978-0-00-000004-2 → 9780000000042; espacios 978 0 00 000004 2 → 9780000000042; ISBN-10 con X `0-8044-2957-X` → `080442957x`; campos adicionales (precio numérico, id lib-7, título trim, generoId null cuando vacío). Ejecutar `node --test` y confirmar RED (función ya implementada pero tests confirman comportamiento).
- [x] 12.3 GREEN: implementar/confirmar crearLibro(datos, coleccion) que usa `normalizarIsbn(datos.isbn)` para el campo isbn, preservando generoId: null cuando viene vacío y demás campos; exportar en module.exports. Verificar que `node --test` pasa.
- [x] 12.4 TRIANGULATE: agregar caso con generoId real (ej. gen-1) y ISBN distinto; verificar que `node --test` pasa (suite completa con nuevos tests).
- [x] 12.5 Actualizar semilla de libros: normalizar los 6 ISBNs a 9780000000011, 9780000000028, 9780000000035, 9780000000042, 9780000000059, 9780000000066 en js/app.js.
- [x] 12.6 Actualizar spec `altas-libros-clientes/spec.md`: requisito "Integridad de los datos de alta" ahora indica ISBN SHALL guardarse normalizado (sin espacios/guiones, minúsculas, conserva X de ISBN-10); renombrar escenario "ISBN crudo" a "ISBN normalizado al guardar" con el WHEN/THEN correspondiente.
- [x] 12.7 Revisar specs/vista-altas/spec.md: confirmar que no afirma almacenamiento crudo (solo describe formulario); actualizar si necesario (no requerido).
- [x] 12.8 Actualizar design.md: decisión 3 refleja ISBN guardado normalizado (anteriormente solo para comparar), reutilización de `normalizarIsbn`, idempotente.
- [x] 12.9 Verificar en js/app.js que el handler de alta usa crearLibro(datos, libros) (refactor puro sin cambiar comportamiento) y no duplica lógica.
- [x] 12.10 Ejecutar verificación: `node --test` → 54 tests, 0 fail. openspec validate "ejercicio-4-altas-libros-clientes" --strict → válido. openspec instructions apply --change "ejercicio-4-altas-libros-clientes" --json → consultar estado.
