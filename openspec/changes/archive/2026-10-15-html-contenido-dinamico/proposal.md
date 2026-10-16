# Proposal

## Why

El Ejercicio 4 dejó `index.html` duplicando datos del modelo: los cuerpos de las tablas de Libros y Clientes traían filas estáticas y los `select` de editorial, género, cliente y libro traían opciones estáticas (por ejemplo, `#venta-libro` solo ofrecía `lib-1`..`lib-3`). Al operar las altas desde JavaScript, ese marcado quedó desincronizado con el modelo real y obligaba a mantener dos fuentes de verdad. Este change convierte `index.html` en un esqueleto puramente dinámico: los contenedores data-driven se declaran vacíos y se pueblan desde los datos al cargar la página.

## What Changes

- `index.html`: se vacían los seis contenedores que duplicaban datos del modelo — `#tabla-libros-cuerpo` (3 `<tr>` estáticos), `#tabla-clientes-cuerpo` (3 `<tr>`), `#libro-editorial` (2 `<option>`), `#libro-genero` (2 `<option>`), `#venta-cliente` (3 `<option>`) y `#venta-libro` (3 `<option>`).
- `js/app.js`: se agrega una única llamada `refrescarOpcionesRelacionadas()` dentro de `inicializar()` (inmediatamente después del guard de early-return) para poblar `#venta-cliente`/`#venta-libro` desde los datos AL CARGAR, no solo tras un alta.
- Las filas de las tablas y las opciones de los formularios siguen generándose con las funciones ya existentes (`renderizarTablaLibros()`, `renderizarTablaClientes()`, `poblarOpcionesFormularioLibro()`, `refrescarOpcionesRelacionadas()`), invocadas desde `inicializar()`.
- **BREAKING**: se revierte la decisión #10 del design del Ej. 4, que había optado por NO vaciar las filas estáticas y dejar que el render inicial de JavaScript las reemplazara. Motivo del cambio: el HTML duplicaba datos y quedaba desincronizado con el modelo (p. ej. los selects de ventas solo tenían `lib-1`..`lib-3`); mantener datos en el marcado crea una segunda fuente de verdad. Ahora el marcado no declara datos.
- No cambian los `id`, `name` ni `value` del contrato HTML, ni las firmas de las funciones existentes.

Fuera de alcance: lógica de ventas/renglones/historial (Ej. 5), persistencia y README (Ej. 6). La maqueta de Etapa 1 de Ventas e Historial queda intacta.

## Capabilities

### New Capabilities

- `contrato-html-dinamico`: regla transversal del marcado — `index.html` MUST NOT contener contenido de datos estático que duplique el modelo; los contenedores data-driven (tablas y `select`) SHALL declararse vacíos y poblarse con JavaScript al cargar la página.

### Modified Capabilities

- `vista-altas`: los listados de libros y clientes y las opciones del formulario de libro dejan de declararse en el HTML y pasan a declararse vacíos, generándose desde los datos locales por JavaScript al cargar; todos los escenarios existentes se conservan y se agregan escenarios de «generado desde los datos».
- `vista-ventas-historial`: solo cambia el origen de las opciones de `#venta-cliente` y `#venta-libro`, que ahora SHALL poblarse desde los datos locales al cargar la página además de repoblarse tras cada alta; la composición de renglones y el resto de la vista no cambian.

## Impact

- Archivos modificados (fase de implementación, ya ejecutada): `index.html` (−62/+6 líneas netas) y `js/app.js` (+1 línea). No se toca `css/estilos.css` ni `tests/app.test.js`.
- Sin dependencias nuevas, sin servidor ni build: se sigue abriendo `index.html` por `file://`; el contrato HTML (`id`/`name`/`value`) se preserva tal cual.
- Trade-off: sin JavaScript, las tablas y los `select` quedan vacíos; es el mismo criterio ya aceptado para el catálogo en el Ej. 3.
