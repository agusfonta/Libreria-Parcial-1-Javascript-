# Proposal

## Why

El Ejercicio 1 dejó la maqueta HTML completa y válida, pero `css/estilos.css` está vacío: la página se ve con estilos por defecto del navegador, las tablas desbordan a 320 px y no hay identidad visual. El Ejercicio 2 del TPI ("Presentación con CSS y uso adaptable", 20 puntos según el PDF de consignas: coherencia y organización 8, adaptación 8, accesibilidad básica 4) exige dar presentación propia, adaptable y accesible sin tocar la lógica ni el contenido.

## What Changes

- Se define una identidad visual propia y coherente (paleta, tipografía del sistema, espaciado, tarjetas, formularios, botones, tablas y mensajes) mediante custom properties en `:root` dentro de `css/estilos.css` (CSS externo, sin `style` inline ni `<style>`, sin fuentes remotas, librerías ni CDNs).
- Se organiza el contenido con Flexbox (cabecera, navegación, filas de acciones) y Grid (grilla de fichas del catálogo, formularios, listas de datos), con enfoque mobile-first y breakpoints en `40em` y `64em`.
- La página no produce desplazamiento horizontal a 320 px ni a 1280 px; cada tabla se desplaza dentro de su propio contenedor `div.tabla-scroll` con `overflow-x: auto`.
- Todos los controles interactivos muestran un foco visible (`:focus-visible`) de alto contraste y se recorren con el teclado.
- Los mensajes (vacío, sin resultados, resultado, aviso de maqueta, y las variantes de error/éxito preparadas para JS) se distinguen por texto, prefijo/ícono y estilo de borde, no solo por color. Se agrega `[hidden] { display: none !important; }` para que ninguna regla de clase vuelva visibles los mensajes ocultos.
- Cambios en `index.html` limitados a **agregar atributos `class`** y **5 contenedores `<div class="tabla-scroll">`** (uno por tabla). No se modifican ids, textos, semántica ni atributos de accesibilidad.
- Imágenes: el documento no contiene imágenes (`img`, `svg`, `picture`) y `assets/` está vacío; el requisito de texto alternativo se cumple por vacuidad y se deja constancia.

## Capabilities

### New Capabilities
- `identidad-visual-componentes`: identidad visual coherente con tokens y clases reutilizables para tarjetas, fichas, formularios, botones y tablas, en CSS externo.
- `layout-adaptable`: organización con Flexbox/Grid, comportamiento a 320 px y 1280 px sin scroll horizontal de página y tablas con scroll propio.
- `foco-teclado`: foco visible en todos los controles y recorrido completo por teclado con los estilos aplicados.
- `mensajes-alternativas-imagen`: mensajes de estado y error perceptibles sin depender del color, preservación del estado `hidden` y política de texto alternativo para imágenes.

### Modified Capabilities
(ninguna: los requisitos del Ejercicio 1 en `openspec/specs/*` no cambian y MUST seguir cumpliéndose)

## Impact

- `css/estilos.css`: se completa (hoy solo contiene un comentario).
- `index.html`: solo se agregan clases y 5 wrappers `div.tabla-scroll`; se verifica que el contrato del Ejercicio 1 sigue intacto (ids únicos, W3C Nu sin errores, diff con clases/wrappers removidos idéntico al original).
- `js/app.js`: sin cambios. Las variantes `mensaje--error` / `mensaje--ok` quedan disponibles para los Ejercicios 4 y 5.
- Sin dependencias nuevas.
