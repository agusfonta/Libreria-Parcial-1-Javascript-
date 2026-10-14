# Spec Delta

## Purpose

Define el comportamiento operativo de las altas de libros y clientes: validaciones de cada formulario, envío sin recarga, identificadores e integridad de los registros nuevos, generación de las opciones del formulario desde los datos locales y repoblado de los listados, el catálogo y los selects de ventas tras cada alta.

## ADDED Requirements

### Requirement: Envío del formulario de libro
`#form-libro` SHALL procesar el envío con JavaScript: el envío nativo MUST cancelarse con `preventDefault` y un libro nuevo MUST agregarse al modelo únicamente cuando todas sus validaciones pasan. Cuando alguna validación falla, el formulario MUST quedar en pantalla con los mensajes de error y MUST NOT agregar el libro.

#### Scenario: Envío sin recarga
- **WHEN** se envía el formulario de libro con datos válidos
- **THEN** la página no se recarga y el libro queda agregado al modelo de datos

#### Scenario: Rechazo sin alta
- **WHEN** una o más validaciones del libro fallan
- **THEN** se muestran los mensajes de error junto al formulario y el libro no se agrega

### Requirement: Validaciones de los campos del libro
Las validaciones del libro SHALL cubrir: título no vacío, ISBN no vacío, precio numérico mayor que cero, editorial existente en los datos locales, al menos un autor seleccionado, cada autor seleccionado existente en los datos locales y género opcional que, cuando se asigna, MUST existir en los datos locales. Cada rechazo MUST informar un mensaje de texto junto al formulario que identifica el campo con problema.

#### Scenario: Título e ISBN obligatorios
- **WHEN** el título o el ISBN quedan vacíos o contienen solo espacios
- **THEN** el envío se rechaza con un mensaje junto al formulario y no se agrega el libro

#### Scenario: Precio numérico y positivo
- **WHEN** el precio no es numérico o es menor o igual a cero
- **THEN** el envío se rechaza con un mensaje junto al formulario

#### Scenario: Editorial obligatoria y existente
- **WHEN** la editorial seleccionada está vacía o no corresponde a una editorial de los datos locales
- **THEN** el envío se rechaza con un mensaje junto al formulario

#### Scenario: Al menos un autor
- **WHEN** el control de autores no tiene ninguna selección
- **THEN** el envío se rechaza con un mensaje junto al formulario

#### Scenario: Autores existentes
- **WHEN** entre los autores seleccionados hay uno que no existe en los datos locales
- **THEN** el envío se rechaza con un mensaje junto al formulario

#### Scenario: Género opcional
- **WHEN** el selector de género queda en «Sin clasificar» (valor vacío)
- **THEN** el envío puede proceder y el libro se guarda sin género asignado

#### Scenario: Género asignado existente
- **WHEN** el género seleccionado no existe en los datos locales
- **THEN** el envío se rechaza con un mensaje junto al formulario

### Requirement: Unicidad del ISBN
El ISBN del libro nuevo SHALL compararse con los ISBN ya registrados normalizando ambos lados de la comparación: MUST remover espacios y guiones y MUST ignorar mayúsculas y minúsculas. No se valida el dígito verificador.

#### Scenario: ISBN duplicado con separadores distintos
- **WHEN** se registra un ISBN que, sin espacios ni guiones, coincide con uno ya registrado
- **THEN** el envío se rechaza con un mensaje de ISBN duplicado

#### Scenario: ISBN distinto se acepta
- **WHEN** el ISBN normalizado no coincide con el de ningún libro registrado
- **THEN** la validación de ISBN pasa

### Requirement: Identificadores de los registros nuevos
Cada libro y cliente nuevo SHALL recibir un identificador único con el mismo prefijo y formato que los existentes (`lib-N`, `cli-N`), asignando el siguiente número disponible sin colisionar con los identificadores ya presentes en la colección.

#### Scenario: Siguiente número disponible para un libro
- **WHEN** se registra un libro nuevo existiendo `lib-1` a `lib-6`
- **THEN** el libro recibe `id` igual a `lib-7`

#### Scenario: Siguiente número disponible para un cliente
- **WHEN** se registra un cliente nuevo existiendo `cli-1` a `cli-3`
- **THEN** el cliente recibe `id` igual a `cli-4`

#### Scenario: Sin colisiones en altas consecutivas
- **WHEN** se registran varios libros o clientes seguidos
- **THEN** cada registro recibe un `id` distinto de todos los anteriores

### Requirement: Integridad de los datos de alta
El precio del libro SHALL guardarse como número, nunca como texto. El ISBN SHALL guardarse normalizado (sin espacios ni guiones, en minúsculas, conservando la X de ISBN-10). El género ausente MUST guardarse como `generoId` con valor `null` y «Sin clasificar» MUST NOT almacenarse como valor de datos.

#### Scenario: Precio almacenado como número
- **WHEN** se registra un libro con un precio válido
- **THEN** en el modelo de datos su `precio` es de tipo número

#### Scenario: ISBN normalizado al guardar
- **WHEN** se registra un ISBN con guiones o espacios
- **THEN** el modelo lo guarda sin separadores, en minúsculas y conservando la X de ISBN-10, y la comparación de unicidad lo normaliza

#### Scenario: Género ausente como null
- **WHEN** el libro se registra con la opción «Sin clasificar»
- **THEN** su `generoId` queda con valor `null` en el modelo

### Requirement: Validaciones del formulario de cliente
Las validaciones del cliente SHALL cubrir: nombre completo no vacío, email no vacío con formato válido y que ningún otro cliente tenga el mismo email comparado con `trim` e insensible a mayúsculas y minúsculas. Cada rechazo MUST informar un mensaje de texto junto al formulario.

#### Scenario: Nombre completo obligatorio
- **WHEN** el nombre completo está vacío o contiene solo espacios
- **THEN** el envío se rechaza con un mensaje junto al formulario

#### Scenario: Email con formato inválido
- **WHEN** el email no tiene formato válido (por ejemplo, le falta el `@` o el dominio)
- **THEN** el envío se rechaza con un mensaje junto al formulario

#### Scenario: Email duplicado normalizado
- **WHEN** ya existe un cliente con el mismo email ignorando espacios sobrantes y diferencias entre mayúsculas y minúsculas
- **THEN** el envío se rechaza con un mensaje de email duplicado

#### Scenario: Email único aceptado
- **WHEN** el email es válido y no coincide con el de ningún cliente existente tras normalizarlo
- **THEN** la validación de email pasa

### Requirement: Envío del formulario de cliente
`#form-cliente` SHALL procesar el envío con JavaScript: el envío nativo MUST cancelarse con `preventDefault` y un cliente nuevo MUST agregarse al modelo únicamente cuando todas sus validaciones pasan. Los errores MUST mostrarse en `#mensaje-cliente-resultado`, junto al formulario.

#### Scenario: Envío sin recarga del cliente
- **WHEN** se envía el formulario de cliente con datos válidos
- **THEN** la página no se recarga y el cliente queda agregado al modelo de datos

#### Scenario: Rechazo sin alta de cliente
- **WHEN** una o más validaciones del cliente fallan
- **THEN** se muestran los mensajes de error junto al formulario y el cliente no se agrega

### Requirement: Opciones del formulario desde los datos locales
Las opciones de `#libro-editorial` y `#libro-genero` SHALL generarse desde las colecciones locales de editoriales y géneros, y las casillas de autor de `#libro-autores` desde la colección de autores, usando `value` con los identificadores estables (`ed-N`/`gen-N`/`aut-N`). Cada autor SHALL ser una casilla (`type="checkbox"`, `name="autores"`) con su etiqueta, para tildar varios a la vez. Género MUST conservar «Sin clasificar» (valor vacío).

#### Scenario: Editorial y género desde los datos
- **WHEN** se carga la página
- **THEN** las opciones de editorial y género del formulario coinciden con las colecciones locales de datos

#### Scenario: Autores como casillas
- **WHEN** se carga la página
- **THEN** el contenedor `#libro-autores` contiene una casilla por cada autor de los datos y permite tildar varios a la vez

#### Scenario: Opción Sin clasificar presente
- **WHEN** se despliega el selector de género del formulario
- **THEN** aparece la opción «Sin clasificar» con valor vacío además de los géneros de los datos

### Requirement: Repoblado de listados y opciones relacionadas
Después de cada alta exitosa, JavaScript SHALL actualizar sin recargar la página los cuerpos `#tabla-libros-cuerpo` y `#tabla-clientes-cuerpo`, las fichas del catálogo y las opciones de `#venta-libro` y `#venta-cliente`. En los selectores de ventas MUST actualizarse únicamente las opciones, conservando su opción inicial vacía y el resto de la estructura del formulario.

#### Scenario: Tabla de libros actualizada
- **WHEN** se registra un libro nuevo
- **THEN** aparece una fila nueva en `#tabla-libros-cuerpo` sin recargar la página

#### Scenario: Tabla de clientes actualizada
- **WHEN** se registra un cliente nuevo
- **THEN** aparece una fila nueva en `#tabla-clientes-cuerpo` sin recargar la página

#### Scenario: Catálogo actualizado
- **WHEN** se registra un libro nuevo
- **THEN** el catálogo muestra una ficha más correspondiente al libro agregado

#### Scenario: Selects de ventas repoblados
- **WHEN** se registra un libro nuevo o un cliente nuevo
- **THEN** `#venta-libro` o `#venta-cliente` incluyen la opción del registro nuevo junto con su opción inicial vacía

#### Scenario: Alta sin recarga mantiene la vista
- **WHEN** se completa un alta correcta
- **THEN** la página no se recarga y el resto de la vista conserva su estado
