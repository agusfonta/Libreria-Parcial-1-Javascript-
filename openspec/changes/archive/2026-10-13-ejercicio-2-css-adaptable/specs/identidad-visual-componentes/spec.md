# Spec Delta

## Purpose

Dar a la Librería Pampa una identidad visual propia y coherente (colores, tipografía, espaciado, tarjetas, formularios, botones y tablas) definida en hojas de estilo externas con clases reutilizadas para elementos equivalentes.

## ADDED Requirements

### Requirement: Estilos en archivos externos
Toda la presentación SHALL definirse en archivos CSS externos dentro de `css/` enlazados desde `index.html`. El documento MUST NOT contener atributos `style` ni elementos `<style>`, y MUST NOT cargar hojas de estilo, fuentes o librerías remotas (CDN, Google Fonts u otras).

#### Scenario: Sin estilos inline ni embebidos
- **WHEN** se busca en `index.html` el atributo `style=` y la etiqueta `<style`
- **THEN** no hay ninguna coincidencia

#### Scenario: Sin recursos remotos
- **WHEN** se inspeccionan los `link`, `@import` y `url()` del documento y de `css/`
- **THEN** todos apuntan a archivos locales del proyecto y la pestaña Red del navegador no muestra peticiones a otros dominios

### Requirement: Identidad visual basada en tokens
La hoja de estilos SHALL declarar en `:root` custom properties para la paleta de colores, la tipografía (pila de fuentes del sistema y escala de tamaños), el espaciado, los radios y las sombras, y los componentes MUST usar esos tokens en lugar de valores sueltos repetidos. Todo par texto/fondo usado MUST alcanzar contraste WCAG AA (4.5:1 para texto normal) y los bordes de controles y el indicador de foco MUST alcanzar al menos 3:1 contra el fondo adyacente.

#### Scenario: Tokens declarados
- **WHEN** se ejecuta en consola `getComputedStyle(document.documentElement).getPropertyValue('--color-primario')` (y análogos para tipografía, espaciado, radio y sombra)
- **THEN** cada token devuelve un valor no vacío

#### Scenario: Contraste de texto suficiente
- **WHEN** se mide el contraste de texto de párrafos, botones primarios, encabezados de tabla y cada variante de mensaje con una herramienta de contraste (DevTools o equivalente)
- **THEN** cada ratio es mayor o igual a 4.5:1

### Requirement: Clases reutilizadas para elementos equivalentes
Los elementos equivalentes SHALL compartir la misma clase y el mismo aspecto: todas las vistas como tarjeta, todas las fichas del catálogo, todos los campos de formulario (contenedor, etiqueta, control, ayuda), todos los botones según su variante, todas las tablas y sus contenedores de scroll, y todos los mensajes según su tipo.

#### Scenario: Botones equivalentes con el mismo aspecto
- **WHEN** se comparan los estilos computados de "Registrar libro", "Registrar cliente" y "Confirmar venta"
- **THEN** comparten la clase de botón primario y tienen el mismo color de fondo, tipografía, radio y relleno

#### Scenario: Campos equivalentes con el mismo aspecto
- **WHEN** se inspeccionan los contenedores de campo de los formularios de libro, cliente, venta y del buscador
- **THEN** todos usan las mismas clases de campo y sus etiquetas y controles tienen el mismo estilo computado

#### Scenario: Tablas equivalentes con el mismo aspecto
- **WHEN** se inspeccionan las cinco tablas del documento
- **THEN** las cinco tienen la misma clase de tabla, están dentro de un contenedor con la misma clase de scroll y comparten estilos de encabezado y celdas

### Requirement: Componentes legibles y operables
Los controles de formulario y botones SHALL tener un tamaño de texto de al menos 1rem y un área táctil de al menos 2.75rem (44 px) de alto; ningún texto de contenido MUST tener un tamaño menor a 0.875rem.

#### Scenario: Tamaño mínimo de controles
- **WHEN** se mide con DevTools la altura de cualquier `input`, `select` de una línea o `button`
- **THEN** la altura computada es mayor o igual a 44 px y su `font-size` es mayor o igual a 16 px

### Requirement: Contrato del Ejercicio 1 preservado
Las modificaciones a `index.html` SHALL limitarse a agregar atributos `class` y contenedores `div` envolventes; ids, textos, jerarquía semántica y atributos de accesibilidad MUST permanecer idénticos, y el documento MUST seguir validando sin errores en el Nu HTML Checker del W3C.

#### Scenario: Diff limitado a clases y wrappers
- **WHEN** se compara `index.html` contra su versión previa ignorando los atributos `class` agregados y las líneas de apertura/cierre de los `div.tabla-scroll`
- **THEN** no queda ninguna diferencia

#### Scenario: Validación W3C
- **WHEN** se valida `index.html` en el Nu HTML Checker
- **THEN** el resultado reporta 0 errores y todos los ids siguen siendo únicos
