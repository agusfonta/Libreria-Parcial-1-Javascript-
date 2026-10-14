# Proposal

## Why

El Ejercicio 4 del TPI "Frontend de una librería" (Programación III, UTN) exige que los formularios de altas de Libros y Clientes dejen de ser maqueta y pasen a ser operativos: registrar libros y clientes nuevos con validaciones completas, incorporar cada registro con un identificador estable y actualizar los listados y las opciones relacionadas sin recargar la página. Hoy los formularios solo recargan la página (aviso de maqueta en `index.html`) y las tablas y el catálogo muestran contenido fijo. Sin este change el proyecto no cumple la consigna del Ej. 4 y los Ejercicios 5 (ventas) y 6 (persistencia) no tendrán datos frescos donde apoyarse.

## What Changes

- `#form-libro` y `#form-cliente` pasan a operar: el envío se cancela con `preventDefault`, se validan los campos y el registro solo se agrega si todas las validaciones pasan; los errores se muestran en `#mensaje-libro-resultado` y `#mensaje-cliente-resultado`, junto a cada formulario.
- Validaciones de libro: título e ISBN no vacíos; ISBN único comparado sin espacios ni guiones (sin dígito verificador); precio numérico mayor que cero; editorial existente; al menos un autor seleccionado y todos los autores existentes; género opcional («Sin clasificar» = valor vacío) y, si se asigna, existente en los datos.
- Validaciones de cliente: nombre completo y email no vacíos; formato de email válido; email sin duplicados comparado con `trim` e insensible a mayúsculas/minúsculas.
- Las opciones de `#libro-editorial`, `#libro-genero` y `#libro-autores` se generan a partir de las colecciones locales (editorial y género como selectores simples, autores como selector múltiple).
- Tras cada alta exitosa se actualizan sin recarga `#tabla-libros-cuerpo` / `#tabla-clientes-cuerpo`, las fichas del catálogo y las opciones de `#venta-libro` / `#venta-cliente` (solo las opciones; la lógica de ventas es del Ej. 5).
- Los registros nuevos reciben ids estables sin colisiones (`lib-7`, `cli-4`, …), el precio se guarda como número, el ISBN como texto crudo y el género ausente como `generoId: null`.
- Se quitan los avisos de maqueta de las vistas Libros y Clientes (`index.html`, líneas ~47 y ~139) porque los formularios ya operan.
- **BREAKING**: los párrafos «Maqueta de Etapa 1…» de Libros y Clientes desaparecen y las filas estáticas de las tablas pasan a generarse desde los datos. Los `id`, `name` y `value` del contrato HTML no cambian.

Fuera de alcance: lógica de ventas (renglones, totales, historial — Ej. 5), `localStorage`/persistencia y README (Ej. 6), `fetch`/backend/login, y edición o eliminación de registros.

## Capabilities

### New Capabilities

- `altas-libros-clientes`: comportamiento operativo de los formularios de alta — validaciones de libro y cliente, prevención del envío, identificadores e integridad de los registros nuevos, generación de opciones desde los datos locales y repoblado de listados, catálogo y selects relacionados tras cada alta.

### Modified Capabilities

- `vista-altas`: los formularios dejan de identificarse como maqueta y pasan a operar; los mensajes de resultado muestran el alta correcta o el rechazo junto al formulario; los listados se generan desde los datos locales. Todos los escenarios existentes de la spec se conservan (sin cambios o con adiciones).
- `vista-ventas-historial`: solo cambia el origen de las opciones de `#venta-libro` y `#venta-cliente`, que pasan a repoblarse desde los datos tras cada alta; la composición de renglones y el resto de la vista no cambian.

## Impact

- Archivos modificados (en la fase de implementación, no en esta): `js/app.js` (validaciones, altas, ids, repoblado y wiring en `inicializar()`), `index.html` (quitar los dos `<p class="aviso-maqueta">` de Libros y Clientes) y `tests/app.test.js` (nuevas pruebas de las validaciones y de la generación de ids).
- Sin dependencias nuevas, sin servidor ni build: se sigue abriendo `index.html` directamente (`file://`); los `id`/`name`/`value` del contrato HTML se preservan tal cual.
- `css/estilos.css` no se modifica: la clase `.aviso-maqueta` sigue usándose en la vista Ventas (Ej. 5).
