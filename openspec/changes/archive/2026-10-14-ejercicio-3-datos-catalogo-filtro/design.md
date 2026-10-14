# Design

## Context

Ver proposal.md - Why. Estado relevante: `index.html` ya define el contrato HTML (ids/names/values) y una vista Catálogo con tres fichas estáticas y un aviso de maqueta en la línea 32; `js/app.js` es un stub de 3 líneas; no hay tests ni `package.json`. Restricciones duras: HTML/CSS/JS nativos, sin librerías, frameworks, CDNs ni build; la página se abre directamente con `file://` (ES modules romperían por CORS) y no hay backend. Node v24.20.0 está disponible. El modelo de datos es el terreno de los Ejercicios 4 a 6.

## Goals / Non-Goals

**Goals:**
- Modelo de datos local con identificadores estables e integridad referencial verificable.
- Catálogo generado desde el array de libros, con contrato HTML intacto.
- Filtro por título (case-insensitive, substring, trim, vacío → todo, sin coincidencias → mensaje).
- Lógica separada en funciones de responsabilidad única y testeable sin navegador.

**Non-Goals:**
- ABM de libros/clientes/ventas, validación de formularios, `localStorage`, `fetch`, backend y README final (Ejercicios 4 a 6).
- Render de los formularios/listados de las otras vistas: solo se opera el catálogo.
- Introducir dependencias, `package.json`, bundlers o DOM simulado (jsdom): el proyecto no debe instalar nada.

## Decisions

1. **Script clásico con doble entorno (navegador + Node).** `js/app.js` sigue siendo un script clásico (compatible con `file://`) y, al final, expone su API a Node con un guard: `if (typeof module !== "undefined" && module.exports) { module.exports = { ... }; }`. Alternativa descartada: ES modules (`type="module"`), porque `file://` no permite importarlos sin servidor.

2. **Wiring de DOM aislado en `inicializar()`.** Todos los `addEventListener`/`DOMContentLoaded` viven dentro de `inicializar()`, que se invoca solo si `typeof document !== "undefined"`. Así `require("../js/app.js")` en Node no falla y el navegador sigue arrancando la app.

3. **Runner de pruebas: `node:test` + `node:assert` (incorporados).** Se ejecuta con `node --test`; cero instalación, cero dependencias, sin build. Los tests van en `tests/app.test.js` en CommonJS (`require`). Alternativa descartada: Jest/Vitest/Mocha (dependencias) o abrir un HTML de pruebas a mano (no automatizable en CI local).

4. **Identificadores estables (slug) alineados al contrato HTML.** Editoriales `ed-1`/`ed-2`, géneros `gen-1`/`gen-2`, autores `aut-1`..`aut-3`, clientes `cli-1`..`cli-3` (iguales a los `value` ya presentes en `index.html`) y libros `lib-1`..`lib-6`. Esto deja los `value` de los `<select>` de los Ej. 4-6 apuntando a los mismos ids del modelo. Alternativa descartada: ids numéricos, porque obligan a mapear entre el HTML y los datos.

5. **Un modelo de ejemplo coherente.** `lib-1` Rayuela (editorial `ed-1`, género `gen-1`, autor `aut-1`), `lib-2` El Aleph (`ed-2`, `gen-2`, `aut-2`), `lib-3` Antología fantástica (`ed-1`, género `null`, autores `aut-2` y `aut-3`) y tres libros nuevos `lib-4`..`lib-6` para llegar a seis. Los tres primeros mantienen los valores que ya mostraba la maqueta, para no romper la coherencia con las otras vistas.

6. **Precio como número; formato solo al mostrar.** `precio` se guarda numérico (necesario para la validación de Ej. 4 y los cálculos de Ej. 5). `formatearPrecio(valor)` produce `"$ 1.500,00"` con `valor.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })` prefijado por `"$ "`. Se evita `Intl.NumberFormat(..., {style:"currency"})` porque puede introducir un espacio no separable (U+00A0) y volver frágil la comparación exacta. Alternativa descartada: guardar el precio ya formateado como string (impide calcular en Ej. 5).

7. **`generoId: null` para género ausente; «Sin clasificar» es solo presentación.** El modelo nunca guarda el texto «Sin clasificar» en `generoId`. La etiqueta se decide al resolver la referencia (`null` → «Sin clasificar»), igual que la opción vacía del selector del Ej. 4.

8. **Funciones de responsabilidad única, reutilizables por Ej. 4-6:**
   - Datos: `libros`, `editoriales`, `generos`, `autores`, `clientes`.
   - Resolución: `resolverEditorial(id)`, `resolverGenero(id)`, `resolverAutores(ids)`.
   - Formato: `formatearPrecio(valor)`.
   - Filtro: `filtrarPorTitulo(libros, termino)` (pura).
   - Vista: `construirVistaFicha(libro)` devuelve un objeto plano con los seis campos ya resueltos/formateados (pura y testeable sin DOM).
   - Render: `renderizarCatalogo(libros)` limpia `#lista-catalogo` y construye cada `<li><article><h3>…</h3><dl>…</dl></article>` insertando texto con `textContent`.
   - Integridad: `validarIntegridadReferencial()` para tests y verificación.

9. **Separar cómputo puro de manipulación del DOM.** `construirVistaFicha` y `filtrarPorTitulo` son puras y se cubren con tests; `renderizarCatalogo` es la única capa que toca el DOM y se verifica manualmente en el navegador. Así no se necesita jsdom.

10. **Seguridad: `textContent` siempre.** Títulos, nombres y cualquier dato se insertan con `createElement` + `textContent`. No se usa `innerHTML` con contenido del modelo ni del usuario. El valor de la búsqueda también se trata como texto.

11. **Estados dirigidos por JS.** `renderizarCatalogo` recibe la lista ya filtrada y muestra/oculta `#mensaje-catalogo-sin-resultados` (sin resultados) o `#mensaje-catalogo-vacio` (modelo sin libros), manteniéndolos ocultos en caso contrario. El `aria-live` de las demás vistas del proyecto ya está resuelto en su spec; aquí solo se controla `hidden`.

12. **`index.html`: quitar el aviso de maqueta (línea 32) y vaciar las fichas estáticas.** Se elimina el `<p class="aviso-maqueta">` de la vista Catálogo y se quitan los tres `<li>` de ejemplo de `<ul id="lista-catalogo">` (no tienen `id`/`name`/`value`, así que no afectan el contrato) para que el catálogo visible provenga siempre del array. `renderizarCatalogo` además limpia el contenedor antes de dibujar, de modo que es idempotente al re-filtrar. No se toca ningún `id`, `name` ni `value` del resto de la vista. Alternativa considerada: dejar los `<li>` estáticos y que JS los reemplace en `DOMContentLoaded`; descartada por el parpadeo de contenido obsoleto y por la escena "Listado generado desde los datos" de la spec.

## Risks / Trade-offs

- [El guard `module.exports` no debe ejecutarse en el navegador] → se comprueba `typeof module !== "undefined"`; en un script clásico `module` no existe y el bloque se ignora.
- [Diferencias de ICU en `toLocaleString`] → Node 24 incluye ICU completo y los navegadores modernos también; se fija `minimumFractionDigits`/`maximumFractionDigits` y se documentan los casos exactos («$ 1.500,00», «$ 500,00») en tests.
- [Manipular el DOM no se cubre con tests al no usar jsdom] → las decisiones de formato/relación/filtro se prueban como funciones puras y el render se verifica con el checklist manual de navegador en las tasks.
- [Vaciar las fichas estáticas deja la lista vacía si el JS falla] → aceptable según la consigna (la vista depende de JS en el Ej. 3); se documenta el checklist para confirmar que la página abre con las seis fichas generadas.
- [Duplicación conceptual de «Sin clasificar» entre la vista y el modelo] → una sola función (`resolverGenero`) produce la etiqueta; el modelo guarda `null`.

## Migration Plan

No aplica (proyecto sin despliegue). Rollback: restaurar `js/app.js` al stub, reinsertar el aviso y las fichas de ejemplo en `index.html` y borrar `tests/`.
