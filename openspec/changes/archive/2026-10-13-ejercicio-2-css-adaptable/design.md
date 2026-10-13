# Design

## Context

- `index.html` (Ejercicio 1) es una sola página con `header` > `nav`, `main#contenido[tabindex=-1]` y cinco `section` (catálogo, libros, clientes, ventas, historial). Valida en W3C y su contrato está en `openspec/specs/*`.
- `css/estilos.css` solo tiene un comentario; `js/app.js` está vacío (la lógica llega en Ej. 3-6). No hay imágenes (`img`/`svg`/`picture` = 0, `assets/` vacío).
- Clases existentes: `aviso-maqueta` (4 `p`), `mensaje-vacio` (6 `p[hidden]`), `mensaje mensaje-resultado` (3 `div[role=status][aria-live=polite][hidden]`, vacíos). Nada más tiene clase.
- Cinco tablas sin contenedor: libros (6 columnas), clientes (2), renglones de venta (5, con botones "Quitar …"), historial (5, con enlace "Ver detalle …"), detalle de venta (4, dentro de `article#detalle-venta`, destino de `:target`).
- Riesgos de desborde a 320 px detectados: tabla de libros, ISBN y emails largos, `select multiple`, `fieldset` (su `min-width: min-content` por defecto), `input[type=number]`, cinco enlaces del `nav`.
- Restricciones: CSS nativo externo, sin librerías, CDNs ni fuentes remotas; en el HTML solo se agregan clases y wrappers `div`. Motivación: ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Un sistema de tokens en `:root` y un set chico de clases reutilizables que cubra todos los elementos de la maqueta.
- Mobile-first: la base funciona a 320 px; los breakpoints solo agregan columnas y aire.
- Foco visible y mensajes no dependientes del color resueltos de forma centralizada (una regla por concepto).

**Non-Goals:**
- No se agrega JS ni se cambia comportamiento (el buscador sigue sin filtrar, los formularios siguen recargando).
- No se cambian textos, ids, `role`/`aria-*`, orden del DOM ni semántica.
- No hay modo oscuro ni temas alternativos (la paleta se define una sola vez; un tema oscuro quedaría como mejora futura).
- No se usan resets/normalizadores externos; solo un reset mínimo propio (`box-sizing`, márgenes).

## Decisions

### D1. Archivo único `css/estilos.css` organizado por secciones

Un solo archivo con secciones comentadas en este orden: 0) guarda `[hidden]`, 1) tokens `:root`, 2) reset/base, 3) layout (cabecera, contenedor, vistas), 4) componentes (tarjeta, ficha, lista-datos, campo, btn, tabla), 5) mensajes, 6) foco, 7) media queries por breakpoint. *Alternativa*: varios archivos (`tokens.css`, `componentes.css`…) con varios `<link>`; descartada porque el tamaño no lo justifica y agregar `<link>` es una modificación del `head` fuera de "solo clases y wrappers".

### D2. Tokens (`:root`)

**Paleta "Pampa"** (verde pampa + papel cálido; contrastes WCAG 2.x calculados con la fórmula de luminancia relativa):

| Token | Hex | Rol | Par evaluado | Ratio |
|---|---|---|---|---|
| `--color-fondo` | `#faf7f2` | fondo de página (papel) | — | — |
| `--color-superficie` | `#ffffff` | tarjetas, fichas, controles | — | — |
| `--color-texto` | `#1f2a24` | texto principal | sobre fondo / superficie | 13.89 / 14.84 |
| `--color-texto-suave` | `#4a5550` | `dt`, ayudas, caption | sobre fondo / superficie | 7.26 / 7.76 |
| `--color-primario` | `#1e5b4f` | cabecera, botón primario, enlaces, `h2` | blanco sobre primario; primario sobre fondo | 7.88; 7.38 |
| `--color-primario-oscuro` | `#164539` | hover/active del primario | blanco sobre él | 10.80 |
| `--color-primario-claro` | `#e3efe9` | `thead`, botón secundario | texto / primario sobre él | 12.57 / 6.68 |
| `--color-acento` | `#b5651d` | ocre: filete de tarjetas y `h1` decorativo (no texto chico) | sobre fondo | 4.06 (≥3:1 no textual) |
| `--color-borde` | `#6b726c` | borde de controles y tablas | sobre superficie / fondo | 4.94 / 4.63 |
| `--color-foco` | `#1d4ed8` | anillo de foco (azul, distinto de la paleta) | sobre superficie / fondo | 6.70 / 6.27 |
| `--color-foco-sobre-oscuro` | `#ffd166` | anillo de foco dentro de la cabecera | sobre primario | 5.47 |
| `--color-error` / `--color-error-fondo` | `#9b1c1c` / `#fdecec` | `mensaje--error`, `btn--peligro`, `:user-invalid` | texto/fondo; borde sobre página | 7.14; 7.63 |
| `--color-ok` / `--color-ok-fondo` | `#1e5631` / `#e6f4ea` | `mensaje--ok` | texto/fondo; borde sobre página | 7.61; 8.08 |
| `--color-aviso` / `--color-aviso-fondo` / `--color-aviso-borde` | `#6b4500` / `#fff4d6` / `#a86b00` | `aviso-maqueta` | texto/fondo; borde sobre página | 7.74; 4.12 |
| `--color-info-fondo` / `--color-info-borde` | `#eef2f0` / `#5b6b64` | `mensaje-vacio` (texto = `--color-texto`) | texto/fondo; borde sobre página | 13.14; 5.27 |

Nota: el anillo de foco contra el verde primario da 1.18:1, por eso el foco usa `outline-offset: 2px` (el anillo cae sobre fondo/superficie, 6.27-6.70:1) y en la cabecera se usa `--color-foco-sobre-oscuro`.

**Tipografía** (solo fuentes del sistema):
- `--fuente-base: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;`
- `--fuente-titulos: Georgia, "Iowan Old Style", "Palatino Linotype", "Book Antiqua", serif;` (identidad "librería" en `h1`/`h2`/`h3`).
- Escala (base 16 px, `rem`): `--texto-sm: 0.875rem` (caption, ayudas, `dt`), `--texto-base: 1rem` (cuerpo, controles), `--texto-md: 1.125rem` (`h3`, legend), `--texto-lg: 1.375rem` (`h2` base), `--texto-xl: 1.75rem` (`h2` ≥ 64em), `--texto-2xl: clamp(1.5rem, 1.1rem + 2vw, 2.25rem)` (`h1`).
- `--interlineado: 1.5`; `--interlineado-titulos: 1.2`; pesos 400/600/700.

**Espaciado** (escala 4 px): `--esp-1: .25rem` · `--esp-2: .5rem` · `--esp-3: .75rem` · `--esp-4: 1rem` · `--esp-5: 1.5rem` · `--esp-6: 2rem` · `--esp-7: 3rem`.

**Radios**: `--radio-sm: .25rem` (controles, botones) · `--radio-md: .5rem` (mensajes, fichas, tablas) · `--radio-lg: .75rem` (tarjetas de vista).

**Sombras**: `--sombra-1: 0 1px 2px rgb(31 42 36 / .08), 0 1px 3px rgb(31 42 36 / .06)` (fichas) · `--sombra-2: 0 4px 12px rgb(31 42 36 / .10)` (tarjetas de vista, hover de ficha).

**Otros**: `--ancho-max: 72rem` (1152 px, centrado a 1280), `--alto-control: 2.75rem` (44 px), `--foco-grosor: 3px`, `--foco-separacion: 2px`, `--borde-grosor: 1px`.

*Alternativa*: valores literales repetidos; descartada porque la rúbrica valora coherencia y los tokens la hacen verificable.

### D3. Convención de clases reutilizables

Nombres en español, kebab-case, estilo BEM liviano: bloque (`btn`), modificador con `--` (`btn--primario`), parte con `-` (`campo-etiqueta`). Las clases existentes se conservan tal cual.

| Clase | Elemento(s) en `index.html` | Cant. | Nueva / existente |
|---|---|---|---|
| `enlace-salto` | `a[href="#contenido"]` | 1 | nueva |
| `cabecera` | `header` | 1 | nueva |
| `nav-principal` | `nav[aria-label="Principal"]` (su `ul` se estiliza por descendencia) | 1 | nueva |
| `contenedor` | `main#contenido` | 1 | nueva |
| `vista tarjeta` | las 5 `section` | 5 | nueva |
| `tarjeta tarjeta--anidada` | `article#detalle-venta` | 1 | nueva |
| `grilla-fichas` | `ul#lista-catalogo` | 1 | nueva |
| `ficha` | `article` de cada libro del catálogo | 3 | nueva |
| `lista-datos` | `dl` de las fichas y del detalle de venta | 4 | nueva |
| `formulario` | `#form-libro`, `#form-cliente`, `#form-venta` | 3 | nueva |
| `formulario--columnas` | `#form-libro`, `#form-cliente` (2 columnas ≥ 40em) | 2 | nueva |
| `campo` | `div` que envuelve label+control (6 libro, 2 cliente, 3 venta, 1 buscador) | 12 | nueva |
| `campo--completo` | `div` de autores (ocupa toda la fila) | 1 | nueva |
| `buscador` | `div` del buscador del catálogo (junto con `campo`) | 1 | nueva |
| `campo-etiqueta` | cada `label` | 12 | nueva |
| `campo-control` | cada `input`/`select` | 12 | nueva |
| `campo-ayuda` | `p#ayuda-libro-autores` | 1 | nueva |
| `grupo-campos` | `fieldset` de la venta | 1 | nueva |
| `btn btn--primario` | Registrar libro, Registrar cliente, Confirmar venta | 3 | nueva |
| `btn btn--secundario` | Agregar renglón | 1 | nueva |
| `btn btn--peligro` | Quitar Rayuela, Quitar El Aleph | 2 | nueva |
| `tabla-scroll` | `div` nuevo que envuelve cada `table` | 5 | nueva (wrapper) |
| `tabla` | cada `table` | 5 | nueva |
| `resumen-total` | `p` "Total de la venta" (venta y detalle) | 2 | nueva |
| `mensaje` + `mensaje-resultado` | 3 `div[role=status]` | 3 | existente |
| `mensaje--error` / `mensaje--ok` | ninguno hoy: variantes para JS (Ej. 4/5) | 0 | nueva (solo CSS) |
| `mensaje-vacio` | 6 `p[hidden]` | 6 | existente |
| `aviso-maqueta` | 4 `p` | 4 | existente |

Los estilos de mensaje se comparten con una lista de selectores (`.mensaje, .mensaje-vacio, .aviso-maqueta`) para no tener que agregar `mensaje` a los `p` existentes. Elementos sin clase (`h1`-`h3`, `p`, `a`, `caption`, `legend`, `output`, `time`) se estilizan por etiqueta en la sección base.

### D4. Estrategia responsive (mobile-first)

- **Base (< 40em, diseñada a 320 px)**: una columna; `contenedor` con `padding-inline: var(--esp-4)`; tarjetas con `padding: var(--esp-4)`. A 320 px queda ≈ 254 px de contenido útil dentro de la tarjeta.
- **`@media (min-width: 40em)` (640 px)**: `formulario--columnas` pasa a 2 columnas; `grupo-campos` en 2 columnas (libro | cantidad) con el botón debajo; tarjetas con `padding: var(--esp-6)`.
- **`@media (min-width: 64em)` (1024 px)**: cabecera en fila (`h1` a la izquierda, `nav` a la derecha); `grupo-campos` en 3 columnas (libro | cantidad | botón alineado al final); `h2` a `--texto-xl`; `contenedor` con `max-width: var(--ancho-max)` y `margin-inline: auto` (a 1280 px, 1152 px centrados).
- Breakpoints en `em` para respetar el zoom de texto del usuario.

**Flex vs Grid**:

| Componente | Técnica | Por qué |
|---|---|---|
| `cabecera` | Flex (`column` → `row` ≥ 64em, `justify-content: space-between`, `flex-wrap`) | alineación en un eje de dos bloques de tamaño de contenido |
| `nav-principal ul` | Flex con `flex-wrap: wrap` y `gap` | cinco enlaces de ancho variable que deben pasar de línea sin desbordar |
| `contenedor` | Grid de 1 columna con `gap` | apila las vistas con espaciado uniforme |
| `grilla-fichas` | Grid `repeat(auto-fill, minmax(min(100%, 16rem), 1fr))` | columnas automáticas sin media query; `min(100%, …)` evita desborde a 320 px |
| `lista-datos` | Grid `max-content 1fr` (`dt` | `dd`) | alinea rótulos y valores como tabla de definiciones |
| `formulario` / `formulario--columnas` | Grid 1 col → `repeat(2, minmax(0, 1fr))` | layout bidimensional de campos; `campo--completo` y el botón con `grid-column: 1 / -1` |
| `campo` | Flex `column` con `gap: var(--esp-1)` | etiqueta sobre control (y ayuda) |
| `grupo-campos` | Grid 1 → 2 → 3 columnas | alinear controles y botón en una fila en escritorio |

### D5. Contención de tablas y desborde

- `div.tabla-scroll { overflow-x: auto; max-width: 100%; }` con borde/radio propio; la `table.tabla { width: 100%; border-collapse: collapse; }`. Si la tabla cabe, no aparece barra (1280 px); si no (libros a 320 px), scrollea solo el wrapper.
- `th { white-space: nowrap; }` para que el encabezado no se parta letra a letra; `td` mantiene `overflow-wrap: normal` (dentro del wrapper es preferible scrollear que quebrar ISBN). `caption` con `text-align: start` (se desplaza junto con la tabla; aceptable).
- Fuera de tablas: `dd, .campo-ayuda, p { overflow-wrap: anywhere; }` (ISBN, emails, textos largos).
- Controles: `.campo-control { width: 100%; max-width: 100%; min-width: 0; }`; `.grupo-campos { min-width: 0; }` (anula `min-width: min-content` del `fieldset`); hijos de grid con `minmax(0, 1fr)`.
- **Prohibido** `overflow-x: hidden`/`clip` en `html`/`body`: el requisito se cumple sin ocultar desbordes (verificable).
- El `enlace-salto` se oculta desplazándolo **hacia arriba** (`position: absolute; transform: translateY(-120%)`) y no hacia la izquierda, para no crear ancho fantasma; en `:focus` vuelve con `translateY(0)`.

### D6. Foco visible

```css
:focus-visible {
  outline: var(--foco-grosor) solid var(--color-foco);
  outline-offset: var(--foco-separacion);
}
.cabecera :focus-visible { outline-color: var(--color-foco-sobre-oscuro); }
.tabla-scroll:focus-visible { outline-offset: calc(var(--foco-grosor) * -1); } /* dentro del wrapper para no ser recortado */
```
- Regla global (cubre `a`, `button`, `input`, `select`, `main` al recibir foco por el salto, y `tabla-scroll` cuando el navegador lo hace enfocable). Ninguna regla `outline: none`.
- Los controles además cambian `border-color` a `--color-foco` en `:focus-visible` (doble señal).
- `scroll-margin-top: var(--esp-4)` en las `section` y `#detalle-venta` para que la navegación por anclas no deje el título pegado al borde; `#detalle-venta:target` recibe un borde de acento como realce.

### D7. Mensajes sin depender del color

- **Guarda `hidden`** al principio del archivo: `[hidden] { display: none !important; }`. Además ninguna regla asigna `display` a `.mensaje`, `.mensaje-resultado` ni `.mensaje-vacio` (el bloque por defecto de `p`/`div` alcanza); se usa `padding`, `border` y `::before` inline.
- Base compartida (`.mensaje, .mensaje-vacio, .aviso-maqueta`): `padding: var(--esp-3) var(--esp-4)`, `border-radius: var(--radio-md)`, `border-left-width: 6px`.
- Variantes (tres señales: texto propio + prefijo/ícono + estilo de borde distinto):

| Tipo | Clase | Prefijo `::before` (visual / alternativa) | Borde | Colores |
|---|---|---|---|---|
| Error | `mensaje--error` | `"✖ Error: "` / `"Error: "` | `2px solid` + izquierda `6px solid` | error / error-fondo |
| Correcto | `mensaje--ok` | `"✔ Listo: "` / `"Listo: "` | izquierda `6px double` | ok / ok-fondo |
| Aviso de maqueta | `aviso-maqueta` | `"⚠ "` / `""` (su texto ya dice "Maqueta de Etapa 1") | `2px dashed` | aviso / aviso-fondo / aviso-borde |
| Vacío / sin resultados | `mensaje-vacio` | `"ℹ "` / `""` | izquierda `6px solid` + resto `1px dotted` | texto / info-fondo / info-borde |

- Declaración con fallback: primero `content: "✖ Error: ";` y luego `content: "✖ Error: " / "Error: ";` (los navegadores sin soporte de texto alternativo ignoran la segunda). Los íconos son caracteres Unicode del sistema, no imágenes.
- Contrato para Ej. 4/5 (documentado como comentario en el CSS): el JS agrega `mensaje--error` o `mensaje--ok` al `div.mensaje-resultado`, quita `hidden` y **después** setea el texto, sin repetir "Error:"/"Listo:" en el texto.
- Controles inválidos tras interacción: `.campo-control:user-invalid { border: 2px dashed var(--color-error); }` (cambia grosor y estilo además del color; el mensaje textual lo da la validación nativa del navegador).

### D8. Imágenes

No hay imágenes en el documento: se cumple por vacuidad. Se deja constancia en un comentario al inicio de `css/estilos.css` y en el checklist final. Los íconos de mensajes son contenido generado decorativo (D7).

## Decisiones abiertas

Requieren confirmación del usuario en el checkpoint; el diseño ya asume el default recomendado.

**(a) Wrapper `tabla-scroll` sin `tabindex`/`role`/`aria-label` — default: SÍ, sin atributos.**
Respeta literalmente la regla "en el HTML solo se agregan clases y wrappers". Chrome 130+ y Firefox vuelven enfocables por teclado los contenedores con scroll que no tienen controles internos (libros, clientes, detalle), y en las tablas con controles (renglones con "Quitar", historial con "Ver detalle") el foco del control desplaza el contenedor. Riesgo: Safari no enfoca el contenedor, y un lector de pantalla no anuncia la región. *Alternativa*: permitir como excepción documentada `tabindex="0" role="region" aria-label="Tabla de … (desplazable)"` en los 5 wrappers; mejora a11y en todos los navegadores, pero agrega atributos de accesibilidad al HTML (fuera de la regla) y debe re-validarse en W3C.

**(b) Preparar ya `mensaje--error` / `mensaje--ok` — default: SÍ.**
Hoy ningún mensaje de resultado es visible (Ej. 1 los deja vacíos y ocultos), pero el requisito 6 del Ej. 2 ("errores no dependen solo del color") solo es demostrable si la variante de error existe en CSS. Se verifica forzándola desde la consola sin editar el HTML, y en Ej. 4/5 el JS solo alterna la clase. *Alternativa*: diferir las variantes al Ej. 4; deja el requisito 6 sin evidencia en esta entrega.

**(c) Paleta y tipografía libres — default: SÍ, identidad "Pampa" propia (verde + papel + ocre, serif del sistema en títulos).**
No hay manual de marca ni restricción en la consigna; la rúbrica solo pide identidad "propia y coherente". Si el usuario prefiere otra paleta, basta con cambiar los tokens de D2 (y re-calcular contrastes); clases y layout no cambian.

## Risks / Trade-offs

- [Contenedores de scroll no enfocables en Safari] → se documenta en la decisión abierta (a); la alternativa con `tabindex` queda lista para aplicar si el usuario la aprueba.
- [`content` con texto alternativo (`/ ""`) no soportado en navegadores viejos] → declaración de fallback previa; en el peor caso el lector lee el ícono, que es redundante pero no engañoso.
- [El prefijo `::before` "Error:" podría duplicarse si el JS futuro también lo escribe] → contrato documentado en D7 y en comentario del CSS.
- [`:user-invalid` no existe en navegadores antiguos] → es una mejora progresiva; sin soporte, el control conserva su borde normal y la validación nativa sigue mostrando texto.
- [Ancho real de scrollbar en Windows (≈17 px) reduce el ancho útil a 320 px] → la verificación usa `clientWidth` (descuenta la barra) y el diseño deja margen con `minmax(min(100%, …))`.
- [Agregar clases/wrappers podría romper el contrato del Ej. 1] → tarea dedicada con diff normalizado y revalidación W3C.

## Migration Plan

No aplica despliegue: es un sitio estático. Rollback = restaurar `index.html` y `css/estilos.css` previos (el diff normalizado de la tarea de verificación prueba que el HTML sin clases/wrappers es idéntico).
