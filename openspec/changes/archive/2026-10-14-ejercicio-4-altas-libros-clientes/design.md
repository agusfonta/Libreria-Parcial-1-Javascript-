# Design

## Context

Ver proposal.md - Why. Estado relevante: `index.html` ya define el contrato HTML completo (ids/names/values) de ambos formularios y de los selects `#venta-libro`/`#venta-cliente`, con opciones estáticas y dos `<p class="aviso-maqueta">` (líneas 47 y 139, vista Ventas conserva el suyo propio). `js/app.js` (267 líneas) ya trae el modelo de datos del Ej. 3 (`libros`, `editoriales`, `generos`, `autores`, `clientes` con ids estables `lib-N`/`ed-N`/`gen-N`/`aut-N`/`cli-N`), los helpers `resolverEditorial`, `resolverGenero` (devuelve «Sin clasificar» ante `null`), `resolverAutores`, `formatearPrecio`, `normalizarTexto`, `filtrarPorTitulo`, `construirVistaFicha`, `crearFicha`, `actualizarEstado`, `renderizarCatalogo` e `inicializar()`, más el guard de `module.exports` y `tests/app.test.js` con `node:test`. La nota de las líneas 2-3 de `js/app.js` recuerda que los contenedores con `aria-live` deben recibir su texto DESPUÉS de quitar `hidden`. Restricciones duras: HTML/CSS/JS nativos, sin librerías ni build, `file://`, y los `id`/`name`/`value` del contrato HTML no cambian.

## Goals / Non-Goals

**Goals:**
- Formularios de libros y clientes operativos: `preventDefault`, validaciones completas, alta solo si todo pasa, errores como texto junto al formulario.
- Registros nuevos con ids estables sin colisiones, precio numérico, ISBN crudo y `generoId: null` ante género ausente.
- Opciones del formulario de libro y selects de ventas generados/repoblados desde los datos locales.
- Listados (`#tabla-libros-cuerpo`, `#tabla-clientes-cuerpo`) y catálogo actualizados sin recarga tras cada alta.
- Lógica de validación y de dominio en funciones puras, testeables con `node:test` sin navegador.

**Non-Goals:**
- Lógica de ventas (renglones, totales, historial — Ej. 5), `localStorage`/persistencia y README (Ej. 6), `fetch`/backend/login.
- Edición o eliminación de registros.
- Instalar dependencias (jsdom, Jest, etc.) ni tocar `css/estilos.css` (la clase `.aviso-maqueta` sigue viva para la vista Ventas).

## Decisions

1. **Extender `js/app.js` en lugar de crear `js/altas.js`.** Toda la lógica nueva (validaciones, altas, ids, repoblado) vive en `js/app.js`, junto a los helpers y arrays que necesita. Justificación: un solo script clásico evita definir un orden de carga entre scripts y exponer globals compartidos; los helpers (`normalizarTexto`, `formatearPrecio`, `construirVistaFicha`, `renderizarCatalogo`) quedan en scope directo; el archivo ya tiene el patrón doble entorno (navegador + `module.exports` para Node) y el guard de `inicializar()`. Alternativa descartada: `js/altas.js` obligaría a duplicar o globalizar el modelo, o a confiar en el orden de los `<script>` sin aportar modularidad real (no hay módulos ES bajo `file://`).

2. **Generación de ids: prefijo + barrido del sufijo numérico máximo.** Función pura `generarSiguienteId(colecciones, prefijo)`: filtra los ids con el formato `prefijo-N`, extrae el sufijo numérico, toma el máximo y devuelve `prefijo-(máximo + 1)` (`lib-7`, `cli-4`, …). Garantiza unicidad sin estado externo. Alternativas descartadas: contador incremental global (se desincroniza si cambian los datos de ejemplo) y `Date.now()` (rompería el formato `lib-N` que exige el contrato HTML de los selects).

3. **Normalización de ISBN con helper propio `normalizarIsbn(isbn)`.** Quita espacios y guiones (`replace(/[\s-]/g, "")`) y pasa a minúsculas, conservando la X de ISBN-10 como `x`. El ISBN se guarda normalizado al registrar un libro (sin separadores, en minúsculas). La normalización también se usa para comparar unicidad contra los ISBN ya registrados, y es idempotente.

4. **Render de mensajes: un contenedor por formulario, solo texto.** `#mensaje-libro-resultado` y `#mensaje-cliente-resultado` (ya con `role="status"` y `aria-live="polite"` en el HTML) reciben el resultado del alta vía una función `mostrarMensaje(contenedor, texto)` que limpia el contenido, quita `hidden` y DESPUÉS asigna `textContent` (respetando la nota de `js/app.js` líneas 2-3 para que el lector de pantalla anuncie el texto). Los errores de un envío se presentan como texto plano, un mensaje por línea. Alternativa descartada: mensajes por campo individual (requiere nuevos `id`/markup en el HTML, fuera del contrato preservado).

5. **Repoblado centralizado con responsabilidad única y nombres en español.**
   - `poblarOpcionesFormularioLibro()` genera las opciones de `#libro-editorial`, `#libro-genero` (incluida «Sin clasificar» con `value=""`) desde las colecciones locales y las casillas de autor dentro del contenedor `#libro-autores` (un `input type="checkbox"` `name="autores"` `value="aut-N"` más su `<label>` por autor, creados con `createElement` + `textContent` y `setAttribute("for", …)`).
   - `renderizarTablaLibros()` y `renderizarTablaClientes()` redibujan `#tabla-libros-cuerpo` y `#tabla-clientes-cuerpo` desde el modelo (mismo patrón de `renderizarCatalogo`: `replaceChildren()` + `createElement`/`textContent`).
   - `refrescarOpcionesRelacionadas()` repuebla las opciones de `#venta-libro` y `#venta-cliente` conservando su opción inicial vacía y sin tocar el resto del formulario de ventas.
   - Cada handler de alta correcta llama al repoblado que le corresponde (tablas + catálogo + `refrescarOpcionesRelacionadas()`). Alternativa descartada: updates directos incrustados en cada handler (duplicación y varias responsabilidades en la misma función).

6. **Validaciones como funciones puras que devuelven arrays de mensajes.** `validarLibro(datos)` y `validarCliente(datos)` retornan `[]` cuando todo pasa o la lista de mensajes de error; el handler de `submit` decide qué mostrar. ISBN duplicado se compara con `normalizarIsbn`; email único comparando `email.trim().toLowerCase()` entre el ingresado y los existentes. El precio se convierte con `Number(...)` y se rechaza si no es finito o es ≤ 0.

7. **Formato de email: regex simple y suficiente.** `emailValido(email)` usa `^[^\s@]+@[^\s@]+\.[^\s@]+$`: valida `@`, dominio con punto y ausencia de espacios, sin pretender cubrir la RFC 5322 (no es el objetivo del ejercicio). Alternativa descartada: librerías de validación (sin dependencias) o solo `type="email"` + `checkValidity()` del navegador (menos testeable en Node y no unifica mensajes en español).

8. **Wiring de eventos dentro de `inicializar()`.** `inicializar()` registra los `submit` de `#form-libro` y `#form-cliente` (con `preventDefault`), llama a `poblarOpcionesFormularioLibro()` y hace un render inicial de ambas tablas para reemplazar las filas estáticas del HTML por render desde datos, además del wiring del buscador que ya existe. Tras un alta correcta se limpia el formulario (`reset()`) y se muestra un mensaje de éxito. El orden de operaciones del mensaje (quitar `hidden` y luego texto) queda encapsulado en `mostrarMensaje`.

9. **Seguridad: `textContent` siempre.** Filas de tablas, opciones de selectores, fichas del catálogo y mensajes se construyen con `createElement` + `textContent`; nunca `innerHTML` con datos del modelo o del usuario (consistente con la spec `datos-catalogo-filtro`).

10. **`index.html`: quitar solo los dos avisos de maqueta.** Se eliminan los `<p class="aviso-maqueta">` de las vistas Libros (línea ~47) y Clientes (línea ~139). El de Ventas (línea ~186) permanece porque su lógica sigue sin operar (Ej. 5). No se modifica ningún `id`, `name` ni `value`, ni se vacían manualmente las tablas: el render inicial de JS las genera desde el modelo (mismo criterio que el catálogo del Ej. 3).

11. **Pruebas con el patrón ya establecido.** `tests/app.test.js` se extiende con `node:test`/`node:assert`: SAFETY NET corriendo la suite actual primero, luego RED→GREEN→TRIANGULATE por comportamiento puro (validaciones, `normalizarIsbn`, `generarSiguienteId`, formato de datos guardados). La manipulación de DOM (tablas, selects, mensajes, avisos) se verifica con checklist manual en el navegador, sin instalar jsdom.

12. **Autores como casillas (`checkbox`) en lugar de un `<select multiple>`, sin `required` nativo.** Se reemplaza el `<select multiple>` de autores por un grupo de casillas generado por JS dentro del contenedor `#libro-autores` (el `id` se conserva; cada casilla usa `name="autores"` y `value="aut-N"`), porque un `<select multiple>` exige mantener presionada la tecla Ctrl/Cmd para conservar más de una opción y un clic simple reemplaza la selección: el usuario percibía que «solo permite un autor». Las casillas permiten tildar varios autores de forma intuitiva (alternativa válida según la spec: «selector múltiple o casillas equivalentes»). NO se aplica el atributo nativo `required` a las casillas: según MDN, en un grupo de `checkbox` con el mismo `name` solo los que tienen `required` son obligatorios, de modo que el navegador exigiría marcar TODAS en vez de «al menos una». La regla «al menos un autor» sigue viviendo en `validarLibro(datos)`, que ya devuelve «Seleccioná al menos un autor» cuando `autorIds` queda vacío; el contenedor expone `aria-required="true"` y `aria-describedby` para accesibilidad. La lectura de autores en el `submit` usa el helper puro `obtenerIdsSeleccionados(casillas)` (`filter(checked).map(value)`) en lugar de `.selectedOptions`.

## Risks / Trade-offs

- [Repoblar `#venta-libro`/`#venta-cliente` podría pisar una selección hecha por el usuario] → solo ocurre tras un alta correcta y la lógica de ventas aún no existe (Ej. 5); se conserva la opción vacía inicial y no se preselecciona nada.
- [La regex de email acepta algunos formatos poco realistas] → suficiente y testeable para el ejercicio; se documenta como límite consciente.
- [Vaciar las tablas estáticas deja la vista dependiente de JS] → mismo trade-off aceptado en el Ej. 3 para el catálogo; el checklist manual confirma el render inicial.
- [`generarSiguienteId` asume sufijos numéricos] → todos los ids del modelo siguen `prefijo-N`; un test verifica el formato y la no colisión.
- [Un solo bloque de texto con varios errores por envío] → aceptable para el ejercicio; el contenedor con `aria-live` announce el conjunto de una vez.
- [Duplicación conceptual de «Sin clasificar» (opción `value=""` vs `generoId: null`)] → la opción es solo presentación; el modelo guarda `null` y `resolverGenero` produce la etiqueta (decisión heredada del Ej. 3).

## Migration Plan

No aplica (proyecto sin despliegue). Rollback: revertir los commits de implementación (restaurar `index.html` con los dos avisos y las filas estáticas, y `js/app.js` a su estado del Ej. 3).

## Open Questions

Las decisiones 1 a 12 quedan documentadas como recomendación y pueden ajustarse en la revisión del usuario antes de ejecutar apply; ninguna cambia los specs ni el desglose de tareas de forma estructural.
