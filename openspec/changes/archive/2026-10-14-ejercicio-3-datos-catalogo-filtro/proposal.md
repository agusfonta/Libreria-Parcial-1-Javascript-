# Proposal

## Why

El Ejercicio 3 del TPI "frontend de una librería" (Programación III, UTN) exige pasar de la maqueta estática a datos reales: un modelo de datos local en `js/app.js`, el catálogo generado a partir del array de libros y un filtro por título operativo. Hoy `js/app.js` está vacío y el catálogo de `index.html` es una lista fija de tres fichas con un aviso que declara que el buscador no filtra. Sin este change el proyecto no cumple la consigna del Ej. 3 ni deja el terreno de datos listo para los Ejercicios 4 a 6 (altas, ventas y persistencia).

## What Changes

- Se incorpora un modelo de datos local en `js/app.js` con cinco colecciones (`libros`, `editoriales`, `generos`, `autores`, `clientes`) cuyos elementos tienen identificadores estables (slug), y un conjunto inicial mínimo de 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes.
- Se garantiza la integridad referencial: cada libro apunta a una editorial existente, a uno o más autores existentes y a un género existente o `null` (nunca el texto «Sin clasificar» en los datos).
- El catálogo deja de ser maqueta: JavaScript genera las fichas dentro de `<ul id="lista-catalogo">` a partir del array de libros, mostrando los seis datos rotulados (título, ISBN, editorial, género, autores y precio), con precio en formato de moneda argentina y «Sin clasificar» para el género ausente.
- Se implementa el filtro por título sobre `#busqueda-titulo` con el evento `input`: búsqueda insensible a mayúsculas/minúsculas, por coincidencia parcial (substring) y con recorte de espacios (`trim`); búsqueda vacía muestra todo y sin coincidencias muestra `#mensaje-catalogo-sin-resultados`.
- Se activan los estados existentes `#mensaje-catalogo-vacio` y `#mensaje-catalogo-sin-resultados` según haya libros o resultados.
- Se quita el aviso de maqueta de la vista Catálogo (`index.html` línea 32) porque el buscador ya filtra.
- **BREAKING**: el listado HTML estático de tres fichas se deja de usar como contenido; pasa a generarse dinámicamente. Los `id`, `name` y `value` del contrato HTML no cambian.

Fuera de alcance: altas/bajas/modificaciones, validación de formularios, `localStorage`/persistencia, `fetch`/backend/login y README final (Ejercicios 4 a 6).

## Capabilities

### New Capabilities
- `datos-catalogo-filtro`: modelo de datos local del dominio (libros, editoriales, géneros, autores y clientes) con identificadores estables e integridad referencial; generación del catálogo a partir del array de libros; formato de precio; y filtro por título con sus estados (vacío y sin resultados), insertando datos de usuario con `textContent`.

### Modified Capabilities
- `vista-catalogo`: el catálogo deja de ser maqueta estática y pasa a generarse desde los datos; se quita el aviso de maqueta del buscador y el filtro por título queda operativo.

## Impact

- Archivos modificados: `js/app.js` (modelo de datos, render, filtro y estados) e `index.html` (quitar el aviso de maqueta de la vista Catálogo, línea 32, y retirar las fichas estáticas de ejemplo).
- Archivos nuevos: `tests/app.test.js` (pruebas con el runner incorporado de Node `node:test`, sin dependencias).
- Sin dependencias externas, sin servidor ni build: se sigue abriendo `index.html` directamente (`file://`); el filtro funciona sin `fetch`.
- No se tocan los `id`, `name` ni `value` del contrato HTML que consumirán los Ejercicios 4 a 6.
