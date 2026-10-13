# Tasks

> Sin test runner en el proyecto: Strict TDD no aplica. Cada tarea se verifica en el navegador (DevTools / `javascript_tool`) o por inspección, como indica su descripción. Antes de empezar, confirmar las 3 "Decisiones abiertas" de design.md; las tareas asumen los defaults.

## 1. Ganchos HTML (solo clases y wrappers)

- [x] 1.1 Guardar copia de referencia `index.html` → scratchpad (`index.ej1.html`) y verificar que el archivo copiado es idéntico (`cmp`) antes de editar
- [x] 1.2 Agregar clases de estructura: `enlace-salto` (a de salto), `cabecera` (header), `nav-principal` (nav), `contenedor` (main), `vista tarjeta` (5 section), `tarjeta tarjeta--anidada` (`#detalle-venta`); verificar con `document.querySelectorAll('.vista.tarjeta').length === 5` y que cada clase aparece la cantidad indicada en la tabla D3
- [x] 1.3 Agregar clases del catálogo: `grilla-fichas` (`#lista-catalogo`), `ficha` (3 article), `lista-datos` (3 dl de fichas + dl de detalle), `campo buscador` / `campo-etiqueta` / `campo-control` en el buscador; verificar conteos en consola (`.ficha` = 3, `.lista-datos` = 4)
- [x] 1.4 Agregar clases de formularios: `formulario` (3 form), `formulario--columnas` (form-libro, form-cliente), `campo` (12 div), `campo--completo` (div de autores), `campo-etiqueta` (12 label), `campo-control` (12 input/select), `campo-ayuda` (`#ayuda-libro-autores`), `grupo-campos` (fieldset), `resumen-total` (2 p de total); verificar `.campo`, `.campo-etiqueta`, `.campo-control` = 12 cada uno
- [x] 1.5 Agregar clases de botones: `btn btn--primario` (Registrar libro, Registrar cliente, Confirmar venta), `btn btn--secundario` (Agregar renglón), `btn btn--peligro` (2 Quitar); verificar `document.querySelectorAll('button:not(.btn)').length === 0`
- [x] 1.6 Envolver cada una de las 5 `table` en `<div class="tabla-scroll">` y agregar `class="tabla"` a cada `table`; verificar `document.querySelectorAll('.tabla-scroll > table.tabla').length === 5`
- [x] 1.7 Verificar el contrato del Ej. 1: (a) diff normalizado — quitar de ambas versiones los atributos `class` agregados (conservando los originales `aviso-maqueta`, `mensaje-vacio`, `mensaje mensaje-resultado`) y las líneas de apertura/cierre de `div.tabla-scroll`, re-indentar y comparar: sin diferencias; (b) ids únicos: `new Set([...document.querySelectorAll('[id]')].map(e=>e.id)).size === document.querySelectorAll('[id]').length`; (c) W3C Nu HTML Checker (subida del archivo): 0 errores; (d) `grep` sin `style=` ni `<style`

## 2. Tokens y base

- [x] 2.1 Escribir en `css/estilos.css` el comentario de cabecera (incluye constancia "sin imágenes, requisito de alt cubierto por vacuidad" y contrato de mensajes para Ej. 4/5) y la guarda `[hidden] { display: none !important; }` como primera regla; verificar que todos los `[hidden]` tienen `display: none` computado
- [x] 2.2 Declarar los tokens de D2 en `:root` (paleta, fuentes, escala tipográfica, espaciado, radios, sombras, `--ancho-max`, `--alto-control`, foco); verificar en consola que `--color-primario`, `--fuente-base`, `--esp-4`, `--radio-md` y `--sombra-1` devuelven valor
- [x] 2.3 Reset mínimo y base por etiqueta (`box-sizing`, `body` con fondo/texto/fuente/interlineado, `h1`-`h3` con fuente de títulos y escala, `a`, `caption`, `legend`, `output`); verificar que `body` usa `--color-fondo` y que no hay recursos remotos en la pestaña Red

## 3. Layout

- [x] 3.1 Estilos de `cabecera` y `nav-principal` (Flex, `flex-wrap`, enlaces como pastillas de 44 px de alto, fondo primario); verificar a 320 px que los 5 enlaces pasan de línea sin desbordar y que `display` de la `ul` es `flex`
- [x] 3.2 `contenedor` (Grid de 1 columna, `padding-inline`, `max-width: var(--ancho-max)` + centrado ≥ 64em) y `vista`/`tarjeta` (superficie, radio, sombra, padding por breakpoint); verificar a 1280 px que el `main` mide ≤ 1152 px de ancho y está centrado
- [x] 3.3 `enlace-salto` oculto con `translateY` (no hacia la izquierda) y visible en `:focus`; verificar `scrollWidth <= clientWidth` a 320 px con el enlace oculto y que aparece al primer Tab
- [x] 3.4 Media queries `40em` y `64em` según D4 (cabecera en fila, `h2` mayor, padding de tarjetas); verificar con capturas a 320, 640, 1024 y 1280 px que no hay saltos de layout rotos

## 4. Componentes

- [x] 4.1 `grilla-fichas` (Grid `auto-fill`/`minmax(min(100%, 16rem), 1fr)`), `ficha` (superficie, filete de acento, `--sombra-1`) y `lista-datos` (Grid `max-content 1fr`, `dt` en texto suave, `overflow-wrap: anywhere` en `dd`); verificar 1 columna a 320 px y ≥ 2 fichas por fila a 1280 px
- [x] 4.2 `formulario`, `formulario--columnas` (2 columnas ≥ 40em), `campo`, `campo--completo`, `campo-etiqueta`, `campo-control` (100% ancho, `min-height: var(--alto-control)`, borde `--color-borde`, `font-size: 1rem`), `select[multiple]` sin alto fijo, `campo-ayuda`; verificar a 320 px que ningún control es más ancho que su formulario y a 1280 px que libro/cliente muestran 2 columnas
- [x] 4.3 `grupo-campos` (fieldset con `min-width: 0`, Grid 1→2→3 columnas) y `resumen-total`; verificar a 320 px que el fieldset no desborda (`getBoundingClientRect().right` ≤ ancho del form)
- [x] 4.4 `btn` y variantes `btn--primario`, `btn--secundario`, `btn--peligro` (+ `:hover`, `:active`, `:disabled`) con altura ≥ 44 px; verificar que los 3 botones primarios tienen idéntico estilo computado (fondo, radio, padding, fuente) y medir contraste de texto ≥ 4.5:1 en cada variante

## 5. Tablas

- [x] 5.1 `tabla-scroll` (`overflow-x: auto`, `max-width: 100%`, borde y radio) y `tabla` (`width: 100%`, `border-collapse`, `thead` en `--color-primario-claro`, `th` `nowrap`, filas cebra, `caption` a la izquierda); verificar a 320 px que el wrapper de libros tiene `scrollWidth > clientWidth` mientras `document.documentElement.scrollWidth <= clientWidth`
- [x] 5.2 Verificar a 1280 px que ninguno de los 5 wrappers tiene `scrollWidth > clientWidth` y que las 5 tablas comparten estilo computado de `th` y `td`

## 6. Foco y teclado

- [x] 6.1 Regla global `:focus-visible` (3 px sólido `--color-foco`, offset 2 px), variante `.cabecera :focus-visible` con `--color-foco-sobre-oscuro`, `.tabla-scroll:focus-visible` con offset negativo, cambio de `border-color` en controles enfocados; verificar con `grep` que no existe `outline: none`/`outline: 0` en `css/`
- [x] 6.2 `scroll-margin-top` en vistas y `#detalle-venta`, realce de `#detalle-venta:target`; verificar que al activar "Ver detalle de V-0001" el título del detalle queda visible y realzado
- [x] 6.3 Recorrido con Tab/Shift+Tab a 320 px y a 1280 px registrando en cada parada `document.activeElement` y `getComputedStyle(...).outlineStyle/outlineWidth`; verificar que todos los controles tienen contorno ≥ 2 px, orden coherente con la lectura y control visible en el viewport (incluye botones "Quitar" dentro de la tabla desplazable y, en Chrome 130+, el wrapper de la tabla de libros desplazable con flechas)

## 7. Mensajes

- [x] 7.1 Base compartida `.mensaje, .mensaje-vacio, .aviso-maqueta` (padding, radio, borde izquierdo) **sin** propiedad `display`; variantes `aviso-maqueta` (⚠, dashed) y `mensaje-vacio` (ℹ, dotted + izquierda sólida) con `::before` y texto alternativo con fallback; verificar que los 4 avisos se ven con ícono y que los 6 `mensaje-vacio` siguen con `display: none`
- [x] 7.2 Variantes `mensaje--error` (✖ "Error: ", borde sólido completo) y `mensaje--ok` (✔ "Listo: ", borde izquierdo doble) y `.campo-control:user-invalid` (2 px dashed); verificar forzando desde consola, sin editar el HTML: `const m=document.getElementById('mensaje-libro-resultado'); m.classList.add('mensaje--error'); m.hidden=false; m.textContent='El ISBN ya existe.'` y luego con `mensaje--ok`, capturando ambos estados y en escala de grises (DevTools > Rendering > Emulate vision deficiencies: Achromatopsia)
- [x] 7.3 Verificar la reversibilidad del estado oculto: tras la prueba 7.2 poner `m.hidden=true`, quitar las clases y el texto, y confirmar `getComputedStyle(m).display === 'none'`; repetir mostrando/ocultando un `mensaje-vacio`

## 8. Verificación final (integración)

- [x] 8.1 Ancho de página: con el viewport a 320 px y a 1280 px evaluar `document.documentElement.scrollWidth <= document.documentElement.clientWidth` (ambos `true`) y listar elementos fuera de `.tabla-scroll` cuyo `getBoundingClientRect().right > clientWidth` (lista vacía); confirmar `overflow-x` de `html`/`body` distinto de `hidden`/`clip`
- [x] 8.2 Capturas de pantalla completas a 320 px y a 1280 px de las 5 vistas para la entrega — guardadas en `docs/capturas/ej2-320.png` (320x5214) y `docs/capturas/ej2-1280.png` (1280x3601), página completa con Edge headless vía CDP; scrollWidth = ancho del viewport en ambos
- [x] 8.3 Estado `[hidden]`: al cargar, `[...document.querySelectorAll('[hidden]')].every(e => getComputedStyle(e).display === 'none')` es `true` (9 elementos: 6 `mensaje-vacio` + 3 `mensaje-resultado`)
- [x] 8.4 Imágenes: `document.querySelectorAll('img, svg, picture, [role="img"]').length === 0` y `assets/` sin imágenes; registrar la constancia en el checklist
- [x] 8.5 Revalidación W3C del `index.html` final (0 errores) y nueva corrida del diff normalizado de 1.7 contra `index.ej1.html`
- [x] 8.6 Checklist de los 7 requisitos del Ej. 2 con evidencia por ítem: (1) identidad visual / tokens, (2) CSS externo + clases reutilizadas + sin inline/`<style>`, (3) Flex/Grid, (4) 320/1280 sin scroll de página + tablas con scroll propio, (5) `:focus-visible` + recorrido con teclado, (6) mensajes sin depender del color, (7) imágenes: no hay, cubierto por vacuidad
