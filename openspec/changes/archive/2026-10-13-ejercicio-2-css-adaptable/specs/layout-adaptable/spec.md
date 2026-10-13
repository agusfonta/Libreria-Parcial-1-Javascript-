# Spec Delta

## Purpose

Organizar el contenido con Flexbox y Grid de forma que la interfaz sea legible y usable entre 320 px y 1280 px de ancho, sin desplazamiento horizontal de la página, y con tablas que se desplazan dentro de su propio contenedor.

## ADDED Requirements

### Requirement: Organización con Flexbox y Grid
La disposición de la cabecera, la navegación, la grilla de fichas del catálogo, los formularios y las listas de datos SHALL resolverse con Flexbox o Grid (no con floats, tablas de maquetación ni posicionamiento absoluto del contenido).

#### Scenario: Navegación y cabecera con Flexbox
- **WHEN** se consulta el `display` computado de la lista del `nav` principal
- **THEN** es `flex` y los enlaces pasan a una nueva línea en lugar de desbordar cuando no entran

#### Scenario: Catálogo y formularios con Grid
- **WHEN** se consulta el `display` computado de `#lista-catalogo` y de los formularios `#form-libro`, `#form-cliente` y `#form-venta`
- **THEN** es `grid` en todos los casos

### Requirement: Sin desplazamiento horizontal de la página
A 320 px y a 1280 px de ancho de viewport la página completa SHALL no presentar desplazamiento horizontal, y sus textos y controles MUST ser legibles sin zoom.

#### Scenario: Ancho de 320 px
- **WHEN** el viewport mide 320 px de ancho y se evalúa `document.documentElement.scrollWidth <= document.documentElement.clientWidth`
- **THEN** el resultado es `true`

#### Scenario: Ancho de 1280 px
- **WHEN** el viewport mide 1280 px de ancho y se evalúa `document.documentElement.scrollWidth <= document.documentElement.clientWidth`
- **THEN** el resultado es `true`

#### Scenario: Ningún elemento excede el viewport
- **WHEN** a 320 px se recorren todos los elementos del `body` que no están dentro de un contenedor de scroll de tabla y se compara su `getBoundingClientRect().right` con `document.documentElement.clientWidth`
- **THEN** ninguno lo supera

#### Scenario: El desbordamiento no se oculta
- **WHEN** se inspeccionan los estilos computados de `html` y `body`
- **THEN** `overflow-x` no es `hidden` ni `clip` (el cumplimiento no se logra recortando contenido)

### Requirement: Tablas con desplazamiento propio
Cada tabla de datos SHALL estar dentro de un contenedor que, cuando la tabla es más ancha que el espacio disponible, se desplaza horizontalmente por sí mismo sin desplazar la página.

#### Scenario: Tabla de libros a 320 px
- **WHEN** el viewport mide 320 px y se inspecciona el contenedor de la tabla de libros registrados
- **THEN** el contenedor tiene `overflow-x: auto`, su `scrollWidth` es mayor que su `clientWidth` y el documento sigue sin scroll horizontal

#### Scenario: Tabla que entra en el ancho
- **WHEN** el viewport mide 1280 px y se inspeccionan los cinco contenedores de tabla
- **THEN** ninguno muestra barra de desplazamiento porque cada tabla ocupa como máximo el ancho disponible

### Requirement: Contenido largo contenido en su bloque
Los textos largos sin espacios (ISBN, emails) fuera de las tablas y los controles de formulario (incluido el selector múltiple y el `fieldset`) SHALL ajustarse al ancho de su contenedor a 320 px.

#### Scenario: Controles dentro del formulario a 320 px
- **WHEN** el viewport mide 320 px y se compara el ancho de cada `input`, `select` y `fieldset` con el de su formulario
- **THEN** ningún control es más ancho que su formulario

### Requirement: Adaptación progresiva entre anchos
La interfaz SHALL partir de una disposición de una columna para anchos pequeños y aprovechar el espacio adicional en anchos mayores (por ejemplo, varias fichas por fila y formularios en dos columnas), con un ancho máximo de contenido que mantenga líneas legibles a 1280 px.

#### Scenario: Una columna a 320 px
- **WHEN** el viewport mide 320 px
- **THEN** las fichas del catálogo y los campos de los formularios se apilan en una sola columna

#### Scenario: Varias columnas a 1280 px
- **WHEN** el viewport mide 1280 px
- **THEN** el catálogo muestra más de una ficha por fila, los formularios de alta muestran los campos en dos columnas y el contenido principal no supera el ancho máximo definido, centrado en la página
