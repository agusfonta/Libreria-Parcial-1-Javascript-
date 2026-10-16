# contrato-html-dinamico Specification

## Purpose
Establece la regla transversal del contrato HTML: el marcado no declara datos de dominio; los contenedores cuyo contenido proviene del modelo son un esqueleto vacío que JavaScript puebla al cargar la página.

## Requirements

### Requirement: Contenedores data-driven declarados vacíos
En `index.html`, los contenedores cuyo contenido proviene del modelo de datos (cuerpos de tablas y `select` de formularios) MUST NOT declarar contenido de datos estático que duplique ese modelo. Cada contenedor data-driven SHALL declararse vacío en el marcado.

#### Scenario: Tabla de libros vacía en el marcado
- **WHEN** se inspecciona `#tabla-libros-cuerpo` en `index.html`
- **THEN** el `tbody` está vacío y no contiene filas `<tr>` estáticas

#### Scenario: Tabla de clientes vacía en el marcado
- **WHEN** se inspecciona `#tabla-clientes-cuerpo` en `index.html`
- **THEN** el `tbody` está vacío y no contiene filas `<tr>` estáticas

#### Scenario: Selects del formulario de libro vacíos
- **WHEN** se inspeccionan `#libro-editorial` y `#libro-genero` en `index.html`
- **THEN** ambos están vacíos y no contienen elementos `<option>` estáticos

#### Scenario: Selects del formulario de venta vacíos
- **WHEN** se inspeccionan `#venta-cliente` y `#venta-libro` en `index.html`
- **THEN** ambos están vacíos y no contienen elementos `<option>` estáticos

### Requirement: Contenido de datos generado por JavaScript al cargar
El HTML MUST NOT ser la fuente de verdad de los datos de dominio. Las tablas de libros y clientes y los `select` de editorial, género, cliente y libro SHALL poblarse desde el modelo de datos local mediante JavaScript al cargar la página, de modo que el contenido visible coincida siempre con el modelo.

#### Scenario: Filas de la tabla de libros generadas al cargar
- **WHEN** se carga la página
- **THEN** las filas de `#tabla-libros-cuerpo` se crean desde el array de libros y no provienen de marcado estático

#### Scenario: Opciones de venta generadas al cargar
- **WHEN** se carga la página
- **THEN** `#venta-cliente` y `#venta-libro` incluyen su opción inicial vacía y las opciones de todos los clientes y libros del modelo

### Requirement: Alcance de la maqueta de Etapa 1
El contenido estático de ejemplo de la maqueta de Etapa 1 de Ventas e Historial (renglones de venta, total, historial y detalle de venta) SHALL quedar fuera del alcance de esta capability y SHALL conservarse en el marcado hasta que lo reemplace la lógica del Ejercicio 5.

#### Scenario: Maqueta de venta intacta
- **WHEN** se inspeccionan `#venta-renglones-cuerpo` y `#venta-total` en `index.html`
- **THEN** conservan sus renglones y su total de ejemplo
