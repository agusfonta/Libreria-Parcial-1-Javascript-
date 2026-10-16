# Spec Delta

## MODIFIED Requirements

### Requirement: Formulario de alta de libro
La vista Libros SHALL contener un formulario (`id="form-libro"`) con: título (texto), ISBN (texto), precio (número, mínimo mayor que cero con paso 0.01), editorial (selector), género (selector) y autores (grupo de casillas —`checkbox`— equivalentes a un selector múltiple, dentro del contenedor `id="libro-autores"`). Cada control MUST tener un atributo `name` igual al campo de dominio y un `id` con prefijo `libro-`; cada casilla de autor MUST usar `name="autores"` y un `value` estable (`aut-N`). Título, ISBN, precio y editorial MUST marcarse como obligatorios con el atributo nativo `required`. El campo de autores MUST considerarse obligatorio en el sentido de «al menos un autor tildado»: esa regla MUST aplicarse con JavaScript y MUST NOT depender del atributo `required`, porque en un grupo de casillas con el mismo `name` el navegador exigiría marcar todas. Las opciones MUST usar como `value` identificadores estables (`ed-N`, `gen-N`, `aut-N`). El selector de género MUST incluir la opción «Sin clasificar» con valor vacío. El formulario MUST tener un botón de envío con texto que describe la acción (por ejemplo "Registrar libro"). Su envío SHALL procesarse con JavaScript sin recargar la página y sus opciones SHALL generarse desde los datos locales. Los `select` de editorial y género MUST NOT declarar opciones estáticas en el marcado: SHALL declararse vacíos y poblarse con JavaScript al cargar la página.

#### Scenario: Campos del libro
- **WHEN** se inspecciona el formulario de alta de libro
- **THEN** existen los seis controles con sus `name` de dominio y un botón "Registrar libro"

#### Scenario: Opción Sin clasificar
- **WHEN** se despliega el selector de género
- **THEN** aparece la opción «Sin clasificar» con valor vacío además de los géneros de ejemplo

#### Scenario: Varios autores
- **WHEN** el usuario tilda dos casillas de autores
- **THEN** ambas quedan tildadas simultáneamente

#### Scenario: Selectores sin opciones estáticas
- **WHEN** se inspecciona `#libro-editorial` y `#libro-genero` en el marcado HTML
- **THEN** ambos están vacíos y sus opciones provienen de JavaScript a partir de los datos locales

### Requirement: Listado de libros registrados
La vista Libros SHALL mostrar una tabla de libros registrados con encabezados de columna para título, ISBN, editorial, género, autores y precio, y un cuerpo (`id="tabla-libros-cuerpo"`) que SHALL declararse vacío en el marcado HTML y cuyas filas SHALL generarse desde los datos locales por JavaScript al cargar la página. Un libro sin género MUST mostrar «Sin clasificar». Las filas SHALL actualizarse tras cada alta registrada.

#### Scenario: Tabla de libros
- **WHEN** se lee la tabla de libros
- **THEN** tiene título (caption) y encabezados en todas sus columnas, y las filas corresponden a los libros de ejemplo del catálogo

#### Scenario: Filas generadas desde los datos
- **WHEN** se carga la vista Libros
- **THEN** las filas de `#tabla-libros-cuerpo` se crean desde el array de libros y no provienen de marcado estático

### Requirement: Listado de clientes registrados
La vista Clientes SHALL mostrar una tabla de clientes con encabezados para nombre completo y email, y un cuerpo (`id="tabla-clientes-cuerpo"`) que SHALL declararse vacío en el marcado HTML y cuyas filas SHALL generarse desde los datos locales por JavaScript al cargar la página, mostrando los clientes ficticios del modelo. Las filas SHALL actualizarse tras cada alta registrada.

#### Scenario: Tabla de clientes
- **WHEN** se lee la tabla de clientes
- **THEN** muestra encabezados de columna y tres clientes ficticios

#### Scenario: Filas generadas desde los datos
- **WHEN** se carga la vista Clientes
- **THEN** las filas de `#tabla-clientes-cuerpo` se crean desde el array de clientes y no provienen de marcado estático
