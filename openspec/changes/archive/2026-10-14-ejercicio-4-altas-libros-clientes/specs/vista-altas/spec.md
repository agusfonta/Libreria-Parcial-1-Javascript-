# Spec Delta

## MODIFIED Requirements

### Requirement: Formulario de alta de libro
La vista Libros SHALL contener un formulario (`id="form-libro"`) con: título (texto), ISBN (texto), precio (número, mínimo mayor que cero con paso 0.01), editorial (selector), género (selector) y autores (grupo de casillas —`checkbox`— equivalentes a un selector múltiple, dentro del contenedor `id="libro-autores"`). Cada control MUST tener un atributo `name` igual al campo de dominio y un `id` con prefijo `libro-`; cada casilla de autor MUST usar `name="autores"` y un `value` estable (`aut-N`). Título, ISBN, precio y editorial MUST marcarse como obligatorios con el atributo nativo `required`. El campo de autores MUST considerarse obligatorio en el sentido de «al menos un autor tildado»: esa regla MUST aplicarse con JavaScript y MUST NOT depender del atributo `required`, porque en un grupo de casillas con el mismo `name` el navegador exigiría marcar todas. Las opciones MUST usar como `value` identificadores estables (`ed-N`, `gen-N`, `aut-N`). El selector de género MUST incluir la opción «Sin clasificar» con valor vacío. El formulario MUST tener un botón de envío con texto que describe la acción (por ejemplo "Registrar libro"). Su envío SHALL procesarse con JavaScript sin recargar la página y sus opciones SHALL generarse desde los datos locales.

#### Scenario: Campos del libro
- **WHEN** se inspecciona el formulario de alta de libro
- **THEN** existen los seis controles con sus `name` de dominio y un botón "Registrar libro"

#### Scenario: Opción Sin clasificar
- **WHEN** se despliega el selector de género
- **THEN** aparece la opción «Sin clasificar» con valor vacío además de los géneros de ejemplo

#### Scenario: Varios autores
- **WHEN** el usuario tilda dos casillas de autores
- **THEN** ambas quedan tildadas simultáneamente

### Requirement: Listado de libros registrados
La vista Libros SHALL mostrar una tabla de libros registrados con encabezados de columna para título, ISBN, editorial, género, autores y precio, y un cuerpo (`id="tabla-libros-cuerpo"`) con los libros de ejemplo. Un libro sin género MUST mostrar «Sin clasificar». Las filas SHALL generarse desde los datos locales y actualizarse tras cada alta registrada.

#### Scenario: Tabla de libros
- **WHEN** se lee la tabla de libros
- **THEN** tiene título (caption) y encabezados en todas sus columnas, y las filas corresponden a los libros de ejemplo del catálogo

### Requirement: Formulario de alta de cliente
La vista Clientes SHALL contener un formulario (`id="form-cliente"`) con nombre completo (texto) y email (`type="email"`), ambos obligatorios, con `name` de dominio e `id` con prefijo `cliente-`, y un botón con texto descriptivo (por ejemplo "Registrar cliente"). MUST NOT existir un campo de apellido separado. Su envío SHALL procesarse con JavaScript sin recargar la página.

#### Scenario: Campos del cliente
- **WHEN** se inspecciona el formulario de alta de cliente
- **THEN** existen solo los campos nombre completo y email, y un botón "Registrar cliente"

### Requirement: Listado de clientes registrados
La vista Clientes SHALL mostrar una tabla de clientes con encabezados para nombre completo y email, y un cuerpo con al menos tres clientes ficticios de ejemplo. Las filas SHALL generarse desde los datos locales y actualizarse tras cada alta registrada.

#### Scenario: Tabla de clientes
- **WHEN** se lee la tabla de clientes
- **THEN** muestra encabezados de columna y tres clientes ficticios

### Requirement: Mensajes de las altas
Cada formulario de alta SHALL tener junto a él un contenedor de mensaje de resultado (`#mensaje-libro-resultado` y `#mensaje-cliente-resultado`) oculto inicialmente, y cada tabla SHALL tener un mensaje de listado vacío oculto inicialmente. JavaScript SHALL mostrar en ese contenedor el resultado del alta (correcta o rechazada). Las vistas Libros y Clientes MUST NOT mostrar avisos de maqueta: sus formularios son operativos.

#### Scenario: Estado inicial de altas
- **WHEN** se carga la página
- **THEN** los mensajes de resultado y de listado vacío de Libros y Clientes no son visibles y ninguna de las dos vistas muestra un aviso de maqueta

#### Scenario: Resultado del alta junto al formulario
- **WHEN** el usuario envía un formulario de alta con un resultado correcto o rechazado
- **THEN** el mensaje correspondiente aparece en el contenedor junto a ese formulario
