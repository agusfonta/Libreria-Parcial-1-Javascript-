# Design

## Context

Proyecto vacío (solo `docs/` con la consigna y `openspec/`). Ver proposal.md - Why. Restricciones de la consigna: HTML/CSS/JS nativos, sin librerías, frameworks ni CDNs; se abre `index.html` sin servidor; datos ficticios. Este marcado es el contrato que consumirán los ejercicios 2 a 6, por lo que las decisiones de nombres (`id`, `name`, `value`) importan más que la presentación.

## Goals / Non-Goals

**Goals:**
- Un único documento válido (W3C, 0 errores) que cubra la rúbrica "Vistas y navegación: 10; semántica, formularios y estados: 10".
- Ganchos estables para JavaScript: `id` de contenedores, `name` de campos, `value` de opciones y mensajes de estado ya presentes en el DOM.
- Operable por teclado desde el primer día.

**Non-Goals:**
- Ocultar/mostrar vistas con JS (router) o cualquier comportamiento: `js/app.js` queda vacío.
- Estilos: `css/estilos.css` queda vacío (Ej. 2).
- `novalidate` y validación personalizada (Ej. 4).
- La interacción básica de Etapa 1 (filtro por título) se implementa en el change de Ej.3; este change solo entrega estructura.

## Decisions

1. **Una sola página con 5 secciones y anclas** (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`) más enlace de salto a `#contenido` (el `main`).
   Alternativa: 5 archivos HTML. Descartada: duplica header/nav, y los Ej. 4-5 necesitan que un alta actualice opciones de otra vista sin recargar; con una sola página el DOM es compartido.

2. **Convención de `id`**: kebab-case en español, con prefijo de vista. Lista cerrada:
   `busqueda-titulo`, `lista-catalogo`, `form-libro`, `libro-titulo`, `libro-isbn`, `libro-precio`, `libro-editorial`, `libro-genero`, `libro-autores`, `tabla-libros-cuerpo`, `form-cliente`, `cliente-nombre`, `cliente-email`, `tabla-clientes-cuerpo`, `form-venta`, `venta-cliente`, `venta-libro`, `venta-cantidad`, `btn-agregar-renglon`, `venta-renglones-cuerpo`, `venta-total`, `historial-cuerpo`, `detalle-venta`. Los mensajes siguen `mensaje-<vista>-<estado>` (p. ej. `mensaje-catalogo-sin-resultados`, `mensaje-libro-resultado`).
   Alternativa: inglés o camelCase. Descartada: la consigna y el dominio están en español y kebab-case es el uso habitual en HTML.

3. **`name` = campo de dominio** (`titulo`, `isbn`, `precio`, `editorial`, `genero`, `autores`, `nombreCompleto`, `email`, `cliente`, `libro`, `cantidad`), para leer con `FormData` en el Ej. 4 sin mapeos.

4. **`value` de opciones = id estable** (`ed-1`, `gen-1`, `aut-1`, `lib-1`, `cli-1`), igual a los identificadores que tendrán los arrays del Ej. 3. «Sin clasificar» usa `value=""` (ausencia de género). Selector de cliente y libro de venta con primera opción vacía "Seleccioná un cliente/libro".

5. **Autores con `select multiple`** (con `size` para mostrar varias opciones) y texto de ayuda vinculado por `aria-describedby` explicando Ctrl/Cmd+clic.
   Alternativa: casillas en `fieldset`. Es equivalente según la consigna; se elige `select multiple` porque el Ej. 4 genera las opciones igual que editorial y género.

6. **Catálogo como `ul > li > article` con `dl`** (dt/dd para ISBN, editorial, género, autores, precio; título en `h3`). Libros/Clientes/Ventas/Historial como tablas (`caption`, `thead` con `th scope="col"`, `tbody` con id).
   Alternativa: tabla para el catálogo. Descartada: el catálogo es una colección de fichas (tarjetas en Ej. 2), las tablas son registros administrativos.

7. **Estados en el DOM desde el inicio**:
   - Lista vacía / sin resultados: `<p class="mensaje-vacio" hidden>`.
   - Resultado de operación: `<div class="mensaje mensaje-resultado" role="status" aria-live="polite" hidden>`; JS podrá cambiar a `role="alert"` para rechazos.
   - Texto explícito ("Libro registrado", "No se pudo registrar: …") para no depender del color.

8. **Precios en formato es-AR** "$ 1.500,00" (lo que producirá `Intl.NumberFormat('es-AR', {style:'currency', currency:'ARS'})`), con dos decimales.

9. **Datos de ejemplo** (ficticios, coherentes entre vistas):
   - Editoriales `ed-1`, `ed-2`; géneros `gen-1`, `gen-2`; autores `aut-1`..`aut-3`.
   - `lib-1` Rayuela $ 1.500,00; `lib-2` El Aleph $ 2.000,00; `lib-3` sin género, con 2 autores, $ 2.500,00.
   - Clientes `cli-1`..`cli-3` con emails ficticios (dominio `example.com`).
   - Venta `V-0001`: 2 × Rayuela ($ 3.000,00) + 1 × El Aleph ($ 2.000,00) = $ 5.000,00; la misma composición se muestra en el resumen de Ventas, en la fila del Historial y en `#detalle-venta`. Coincide con el caso manual del Ej. 6.

10. **Detalle del historial**: el acceso es un enlace "Ver detalle de V-0001" a `#detalle-venta`, una `section`/`article` estática debajo de la tabla. En Ej. 5 JS lo reemplazará por el renglón real (o `details`/botón).

11. **Validación nativa**: se mantienen `required`, `min`, `step`, `type="email"`; `novalidate` se agrega recién en Ej. 4 cuando exista validación propia. En Etapa 1 los formularios no tienen `action`; enviar recarga la misma página, lo cual es aceptable en la maqueta y queda declarado en el aviso.

12. **Aviso de maqueta**: `<p class="aviso-maqueta">` al inicio de cada sección con controles pendientes, indicando qué aún no funciona.

13. **Archivos**: `css/estilos.css` y `js/app.js` vacíos (con un comentario de cabecera), enlazados desde `head`; el script con `defer`.

## Risks / Trade-offs

- [Enviar un formulario en la maqueta recarga la página con parámetros en la URL] → Aviso de maqueta explícito; `preventDefault` llega en Ej. 4.
- [Mensajes `hidden` con `aria-live` pueden no anunciarse al primer cambio en algunos lectores] → JS del Ej. 4/5 debe cambiar el texto después de quitar `hidden`; se documenta en el comentario de `app.js`.
- [Datos estáticos duplicados en varias vistas pueden desincronizarse] → Tarea de verificación cruzada de los mismos libros/clientes/precios en todas las vistas; desaparece al renderizar desde JS (Ej. 3).
- [`select multiple` es menos descubrible con mouse] → Texto de ayuda asociado; Ej. 2 puede mejorarlo visualmente.
- [Sin CSS, todas las vistas se ven a la vez y la página es larga] → Aceptable en Etapa 1; la navegación por anclas y el enlace de salto mitigan.

## Migration Plan

No aplica (proyecto nuevo). Rollback: eliminar `index.html`, `css/` y `js/`.
