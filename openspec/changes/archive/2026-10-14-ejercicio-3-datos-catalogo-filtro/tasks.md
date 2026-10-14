# Tasks

> Strict TDD Mode activo. Runner: `node:test` + `node:assert` incorporados, ejecutado con `node --test` (sin dependencias). Ciclo por comportamiento: SAFETY NET → RED → GREEN → TRIANGULATE → REFACTOR. Las funciones puras (datos, formato, resolución, filtro, `construirVistaFicha`) se cubren con tests; la manipulación de DOM se verifica manualmente en el navegador (no se instala jsdom).

## 1. Andamiaje testeable de `js/app.js`

- [x] 1.1 SAFETY NET: ejecutar `node --test` en el repo y registrar la línea base (sin tests todavía: 0 fallos) antes de modificar `js/app.js`; si existiera alguna falla previa, reportarla sin corregirla.
- [x] 1.2 Envolver todo el wiring de DOM en una función `inicializar()` que se invoque solo si `typeof document !== "undefined"`, y agregar al final de `js/app.js` el guard `if (typeof module !== "undefined" && module.exports) { module.exports = { ... }; }`; verificar con `node --check js/app.js` y `node -e "require('./js/app.js')"` que el archivo es sintácticamente válido y se carga en Node sin error.
- [x] 1.3 Crear `tests/app.test.js` (CommonJS) con una prueba de humo que hace `require("../js/app.js")` y comprueba que no lanza; verificar que `node --test` ejecuta el archivo y pasa.

## 2. Modelo de datos e integridad referencial

- [x] 2.1 RED: en `tests/app.test.js` escribir tests que exijan las colecciones `libros` (≥6), `editoriales` (≥2), `generos` (≥2), `autores` (≥3) y `clientes` (≥3), con `id` string no vacío y sin repetidos; correr `node --test` y confirmar que fallan porque las colecciones aún no existen.
- [x] 2.2 GREEN: declarar las cinco colecciones en `js/app.js` con los datos de ejemplo (libros `lib-1`..`lib-6`, editoriales `ed-1`/`ed-2`, géneros `gen-1`/`gen-2`, autores `aut-1`..`aut-3`, clientes `cli-1`..`cli-3`) y exportarlas; verificar que `node --test` pasa.
- [x] 2.3 TRIANGULATE: agregar tests de integridad referencial (cada `editorialId` existe; cada `autorIds[]` con ≥1 autor existente; `generoId` es `null` o un género existente; `generoId` nunca vale «Sin clasificar»); verificar que `node --test` pasa con estos casos de borde.
- [x] 2.4 REFACTOR: extraer `validarIntegridadReferencial()` reutilizable y usarla desde los tests; verificar que `node --test` sigue verde.

## 3. Formato de precio y resolución de referencias

- [x] 3.1 RED: escribir tests de `formatearPrecio(1500) === "$ 1.500,00"` y `formatearPrecio(500) === "$ 500,00"`; correr `node --test` y confirmar que fallan.
- [x] 3.2 GREEN: implementar `formatearPrecio` en `js/app.js`; verificar que `node --test` pasa.
- [x] 3.3 TRIANGULATE: agregar tests de `resolverEditorial(id)`, `resolverGenero(id)` (`null` → «Sin clasificar», id válido → su nombre) y `resolverAutores(ids)` (un autor y varios autores); implementarlas y verificar que `node --test` pasa.
- [x] 3.4 RED→GREEN→TRIANGULATE de `construirVistaFicha(libro)`: un test por ficha con los seis campos resueltos y formateados, uno con género ausente («Sin clasificar») y uno con varios autores; implementarla y verificar que `node --test` pasa.

## 4. Filtro por título

- [x] 4.1 RED: escribir tests de `filtrarPorTitulo(libros, termino)` con coincidencia parcial (substring) que devuelva solo los libros cuyo título la contiene; correr `node --test` y confirmar que fallan.
- [x] 4.2 GREEN: implementar `filtrarPorTitulo` (insensible a mayúsculas/minúsculas, `trim` de extremos; término vacío o solo espacios → todos los libros; sin coincidencias → lista vacía); verificar que `node --test` pasa.
- [x] 4.3 TRIANGULATE: agregar tests de borde (mayúsculas/minúsculas mezcladas, espacios sobrantes al inicio y al final, término vacío, término sin coincidencias); verificar que `node --test` pasa.

## 5. Render dinámico, estados y ajustes de `index.html`

- [x] 5.1 En `index.html`, quitar el aviso de maqueta de la vista Catálogo (línea 32) y vaciar los `<li>` de ejemplo de `<ul id="lista-catalogo">`; verificar que siguen presentes los `id`/`name`/`value` de la vista (`busqueda-titulo`, `lista-catalogo`, `mensaje-catalogo-vacio`, `mensaje-catalogo-sin-resultados`) y que no se modificó ninguna otra vista.
- [x] 5.2 Implementar `renderizarCatalogo(libros)`: limpiar `#lista-catalogo`, crear por cada libro `<li><article><h3>` con el título y `<dl>` con los seis datos rotulados (título, ISBN, editorial, género, autores y precio) desde `construirVistaFicha`, insertando todo con `createElement` + `textContent`; verificar en el navegador que la consola no arroja errores y que aparecen seis fichas.
- [x] 5.3 En `inicializar()`, enganchar el evento `input` de `#busqueda-titulo` para re-renderizar con `filtrarPorTitulo`, y realizar un render inicial; mostrar `#mensaje-catalogo-sin-resultados` cuando el filtro no devuelve libros y `#mensaje-catalogo-vacio` cuando el modelo no tiene libros (ocultando ambos en caso contrario); verificar en el navegador con el checklist de acceso por teclado y de estado.
- [ ] 5.4 Verificar el uso seguro de datos: comprobar en el código que ningún inserto usa `innerHTML` con contenido del modelo o del usuario (solo `textContent`), y probar en el navegador un título de prueba con caracteres `<` y `&` que se vea como texto.

## 6. Verificación integral

- [x] 6.1 Ejecutar `node --test` y confirmar que toda la suite (colecciones, integridad, formato, resolución, filtro y ficha) pasa sin fallos.
- [ ] 6.2 Checklist manual en navegador con `index.html` abierto por `file://`: seis libros, 2 editoriales / 2 géneros / 3 autores / 3 clientes en los datos; filtrar por título insensible a mayúsculas; coincidencia parcial; `trim`; búsqueda vacía muestra todo; sin coincidencias muestra `#mensaje-catalogo-sin-resultados`; libro sin género muestra «Sin clasificar»; libro con varios autores los muestra todos; precio «$ 1.500,00» y «$ 500,00»; el aviso de maqueta de la vista Catálogo ya no aparece.
- [x] 6.3 Ejecutar `openspec validate "ejercicio-3-datos-catalogo-filtro" --strict` y confirmar que el change sigue válido tras la implementación.

## Workflow follow-up

- Archivar el change con OpenSpec una vez verificada la implementación y sincronizadas las delta specs a `openspec/specs/`.
- Revisar que `openspec/specs/vista-catalogo/spec.md` y `openspec/specs/datos-catalogo-filtro/spec.md` quedaron con los requirements modificados/agregados esperados.
