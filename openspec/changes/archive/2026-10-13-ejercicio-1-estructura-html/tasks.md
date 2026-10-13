# Tasks

> No hay test runner en el proyecto (HTML estático): Strict TDD no aplica. Cada tarea se verifica manualmente en el navegador, con el árbol de accesibilidad de DevTools y con el Nu HTML Checker (https://validator.w3.org/nu/, opción "File upload" o "Text input").

## 1. Esqueleto y navegación

- [x] 1.1 Crear `css/estilos.css` y `js/app.js` vacíos (solo comentario de cabecera; en `app.js` anotar que los mensajes `hidden` deben recibir su texto después de quitar `hidden`) y verificar que ambos archivos existen en esas rutas.
- [x] 1.2 Crear `index.html` con `<!doctype html>`, `lang="es"`, `meta charset="utf-8"`, `meta viewport`, `<title>` con el nombre de la librería, `link` a `css/estilos.css` y `script defer` a `js/app.js`; verificar al abrirlo con doble clic que la pestaña de Red de DevTools no muestra errores 404 ni solicitudes externas.
- [x] 1.3 Agregar enlace "Saltar al contenido principal" (`href="#contenido"`), `header` con `h1` del nombre de la librería, `nav` con `aria-label="Principal"` y enlaces Catálogo/Libros/Clientes/Ventas/Historial, y `main id="contenido"` con cinco `section` (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`) cada una con `h2` y `aria-labelledby`; verificar que cada enlace del menú lleva a su sección y que el árbol de accesibilidad muestra banner, navigation, main y las cinco regiones.

## 2. Vista Catálogo

- [x] 2.1 Agregar el título de la librería en la vista, `p.aviso-maqueta` ("el buscador aún no filtra") y el buscador (`label` + `input type="search" id="busqueda-titulo" name="titulo"`); verificar que clic en la etiqueta enfoca el campo y que su nombre accesible menciona "título".
- [x] 2.2 Agregar `ul#lista-catalogo` con tres `li > article` (lib-1 Rayuela $ 1.500,00; lib-2 El Aleph $ 2.000,00; lib-3 sin género, 2 autores, $ 2.500,00), título en `h3` y `dl` con ISBN, editorial, género, autores y precio; verificar que cada ficha muestra los seis datos, que lib-3 dice «Sin clasificar» y lista sus dos autores.
- [x] 2.3 Agregar `p.mensaje-vacio` "No hay libros en el catálogo" (`id="mensaje-catalogo-vacio"`) y `p.mensaje-vacio` de búsqueda sin resultados (`id="mensaje-catalogo-sin-resultados"`), ambos `hidden`; verificar que no se ven al cargar y que al quitar `hidden` desde DevTools se leen con texto claro.

## 3. Vistas Libros y Clientes

- [x] 3.1 Agregar `p.aviso-maqueta` y `form#form-libro` con `libro-titulo`, `libro-isbn`, `libro-precio` (`type="number" min="0.01" step="0.01"`), `libro-editorial` (ed-1, ed-2), `libro-genero` («Sin clasificar» `value=""`, gen-1, gen-2), `libro-autores` (`select multiple`, aut-1..aut-3, ayuda con `aria-describedby`), `name` de dominio, `required` en título/ISBN/precio/editorial/autores y botón `type="submit"` "Registrar libro"; verificar en DevTools los `id`/`name`/`value` contra design.md (decisiones 2-4) y que se pueden seleccionar dos autores a la vez.
- [x] 3.2 Agregar `div#mensaje-libro-resultado` (`role="status" aria-live="polite" hidden`) junto al formulario, tabla de libros (`caption`, `th scope="col"` para título, ISBN, editorial, género, autores, precio, `tbody#tabla-libros-cuerpo` con lib-1..lib-3) y `p.mensaje-vacio` `hidden`; verificar que las filas coinciden con el catálogo (títulos, precios, «Sin clasificar») y que los mensajes no se ven.
- [x] 3.3 Agregar `p.aviso-maqueta` y `form#form-cliente` con `cliente-nombre` (`name="nombreCompleto"`) y `cliente-email` (`type="email" name="email"`), ambos `required`, botón "Registrar cliente", `div#mensaje-cliente-resultado` oculto, tabla de clientes (`caption`, `th scope="col"`, `tbody#tabla-clientes-cuerpo` con cli-1..cli-3 ficticios en `example.com`) y mensaje de lista vacía `hidden`; verificar que no hay campo de apellido y que la tabla muestra tres clientes con encabezados.

## 4. Vistas Ventas e Historial

- [x] 4.1 Agregar `p.aviso-maqueta` y `form#form-venta` con `venta-cliente` (opción vacía + cli-1..cli-3), `venta-libro` (opción vacía + lib-1..lib-3), `venta-cantidad` (`type="number" min="1" step="1"`) y `button#btn-agregar-renglon type="button"` "Agregar renglón"; verificar que activar el botón no recarga la página y que cada control tiene etiqueta.
- [x] 4.2 Agregar tabla de renglones (`caption`, encabezados libro/cantidad/precio unitario/subtotal/acciones, `tbody#venta-renglones-cuerpo`) con la venta de ejemplo (2 × Rayuela $ 1.500,00 = $ 3.000,00; 1 × El Aleph $ 2.000,00 = $ 2.000,00), botones `type="button"` "Quitar Rayuela"/"Quitar El Aleph", `output#venta-total` con $ 5.000,00, botón submit "Confirmar venta", `p.mensaje-vacio` de venta sin renglones `hidden` y `div#mensaje-venta-resultado` oculto; verificar que subtotales y total cuadran (3000 + 2000 = 5000) y que los mensajes no se ven.
- [x] 4.3 Agregar tabla de historial (`caption`, encabezados identificador/fecha/cliente/total/detalle, `tbody#historial-cuerpo` con V-0001, fecha `<time datetime>`, cliente cli-1, $ 5.000,00 y enlace "Ver detalle de V-0001" a `#detalle-venta`), mensaje de historial vacío `hidden` y bloque `#detalle-venta` con datos generales, tabla de renglones (mismos valores que 4.2) y total; verificar que el enlace lleva al detalle, que los importes coinciden con la vista Ventas y que no hay controles de editar/eliminar.

## 5. Verificación integral

- [x] 5.1 Validar `index.html` en el Nu HTML Checker y corregir hasta obtener 0 errores (advertencias anotadas si las hay).
- [x] 5.2 Revisar el árbol de accesibilidad (DevTools > Accessibility): todo control tiene nombre desde su `label`, todo botón tiene texto de acción y `type` explícito, toda tabla tiene caption y encabezados de columna, un único `h1` y `h2` por vista sin saltos.
- [x] 5.3 Verificar consistencia cruzada de datos de ejemplo: mismos ids, títulos, precios, géneros y clientes en Catálogo, Libros, Clientes, Ventas, Historial y detalle; búsqueda en el código de "Sin clasificar" en catálogo, tabla de libros y selector de género.
- [x] 5.4 Repasar el checklist de la rúbrica del Ej. 1 contra la página: index.html de entrada; 5 vistas con navegación clara; catálogo (título, buscador, 6 datos, «Sin clasificar»); altas y listados de libros y clientes; venta (cliente, renglones, resumen); historial con acceso al detalle; header/nav/main; labels; botones descriptivos; tablas con encabezados; mensajes de vacío, sin resultados, éxito y rechazo; avisos de maqueta; sin librerías/CDNs. Marcar cada ítem como cumplido u observado.
- [x] 5.5 Recorrido final por teclado: recargar la página, presionar Tab y confirmar que el primer foco es "Saltar al contenido principal"; activar con Enter; recorrer toda la página con Tab y Shift+Tab confirmando orden coherente (menú, buscador, formularios, botones, enlaces de detalle), que Enter activa enlaces del menú y "Ver detalle de V-0001", y que ningún elemento con `hidden` (mensajes de vacío, sin resultados y de resultado) es visible ni recibe foco en el estado inicial.
