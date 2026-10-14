# datos-catalogo-filtro Specification

## Purpose
Define el modelo de datos local del dominio de la librería (libros, editoriales, géneros, autores y clientes) con identificadores estables e integridad referencial, además de la generación del catálogo a partir del array de libros, el formato de precio en moneda argentina y el filtro por título con sus estados de vacío y sin resultados.

## Requirements

### Requirement: Modelo de datos local del dominio
`js/app.js` SHALL declarar cinco colecciones —`libros`, `editoriales`, `generos`, `autores` y `clientes`— como arrays de objetos. Cada elemento MUST tener un identificador estable en formato slug (por ejemplo `lib-1`, `ed-2`, `aut-3`), único dentro de su colección.

#### Scenario: Colecciones iniciales mínimas
- **WHEN** se inspecciona el modelo de datos
- **THEN** existen al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios

#### Scenario: Identificadores estables
- **WHEN** se recorre cualquier colección del modelo
- **THEN** cada elemento tiene un `id` de tipo string no vacío y sin repetidos dentro de su colección

### Requirement: Integridad referencial de los libros
Cada libro SHALL referenciar una editorial existente mediante `editorialId`, uno o más autores existentes mediante `autorIds` (array con al menos un elemento) y un género existente mediante `generoId` o `null` cuando no tiene género. El modelo MUST NOT almacenar textos de presentación como «Sin clasificar» en `generoId`.

#### Scenario: Editorial y autores válidos
- **WHEN** se resuelve la editorial y los autores de cualquier libro del modelo
- **THEN** cada `editorialId` y cada `autorIds[]` encuentra su elemento en las colecciones de editoriales y autores

#### Scenario: Género opcional
- **WHEN** un libro no tiene género asignado
- **THEN** su `generoId` es `null` y el libro sigue siendo válido

#### Scenario: Género asignado existente
- **WHEN** un libro tiene un `generoId` distinto de `null`
- **THEN** ese identificador corresponde a un género existente en la colección de géneros

### Requirement: Generación dinámica del catálogo
JavaScript SHALL generar el catálogo a partir del array de libros, insertando una ficha por libro dentro de `<ul id="lista-catalogo">`. Cada ficha MUST mostrar, rotulados, los seis datos: título, ISBN, editorial, género, autores y precio. Cuando un libro tiene varios autores, todos MUST mostrarse.

#### Scenario: Fichas generadas desde el array
- **WHEN** se carga la vista Catálogo
- **THEN** la cantidad de fichas del listado coincide con la cantidad de libros del modelo de datos

#### Scenario: Datos rotulados por ficha
- **WHEN** se lee cualquier ficha generada
- **THEN** se identifican los seis datos rotulados (título, ISBN, editorial, género, autores y precio)

#### Scenario: Varios autores
- **WHEN** un libro tiene más de un autor referenciado
- **THEN** la ficha muestra el nombre de todos sus autores

#### Scenario: Género ausente
- **WHEN** un libro tiene `generoId` igual a `null`
- **THEN** la ficha muestra el texto «Sin clasificar» en el lugar del género

### Requirement: Formato de precio en moneda argentina
El modelo SHALL almacenar `precio` como número. Al mostrarlo, JavaScript MUST formatearlo como moneda argentina con dos decimales, separador de miles de punto y separador decimal de coma (por ejemplo «$ 1.500,00»).

#### Scenario: Precio con miles
- **WHEN** se muestra un libro cuyo precio es 1500
- **THEN** el precio visible es «$ 1.500,00»

#### Scenario: Precio sin miles
- **WHEN** se muestra un libro cuyo precio es 500
- **THEN** el precio visible es «$ 500,00»

### Requirement: Filtro por título
La vista Catálogo SHALL filtrar el listado por título al recibir el evento `input` sobre `#busqueda-titulo`. El filtro MUST ignorar mayúsculas y minúsculas, MUST ignorar las diferencias de acentos (diacríticos) entre la búsqueda y el título, MUST buscar coincidencias parciales del texto en el título y MUST recortar los espacios sobrantes de los extremos de la búsqueda (`trim`). Una búsqueda vacía MUST mostrar todo el catálogo.

#### Scenario: Coincidencia parcial
- **WHEN** se escribe una parte del título de un libro
- **THEN** se muestran los libros cuyo título contiene esa parte

#### Scenario: Insensible a mayúsculas y minúsculas
- **WHEN** se escribe la búsqueda en mayúsculas, en minúsculas o mezclando ambas
- **THEN** el resultado del filtro es el mismo para las variantes que difieren solo en el caso

#### Scenario: Espacios sobrantes recortados
- **WHEN** la búsqueda tiene espacios al inicio o al final
- **THEN** el filtro usa el texto ya recortado y encuentra las mismas coincidencias

#### Scenario: Acentos ignorados
- **WHEN** se busca un título escribiendo sus letras sin acentos (por ejemplo `antologia`) con cualquier combinación de mayúsculas y minúsculas
- **THEN** el término encuentra el mismo libro que su versión con acentos (`Antología`)

#### Scenario: Búsqueda vacía
- **WHEN** el campo de búsqueda está vacío o solo contiene espacios
- **THEN** el listado vuelve a mostrar todos los libros del catálogo

### Requirement: Estados del catálogo durante el filtro
Cuando ninguna coincidencia del filtro corresponde a un libro, JavaScript SHALL mostrar el mensaje `#mensaje-catalogo-sin-resultados`. Cuando el modelo de datos no tiene libros, JavaScript SHALL mostrar `#mensaje-catalogo-vacio`. En caso contrario MUST mantener ambos mensajes ocultos.

#### Scenario: Sin coincidencias
- **WHEN** la búsqueda no coincide con ningún título del catálogo
- **THEN** se muestra `#mensaje-catalogo-sin-resultados` y el listado queda sin fichas

#### Scenario: Catálogo vacío
- **WHEN** el modelo de datos no contiene libros
- **THEN** se muestra `#mensaje-catalogo-vacio` y se oculta el mensaje de búsqueda sin resultados

#### Scenario: Con resultados se ocultan los mensajes
- **WHEN** el filtro tiene coincidencias o la búsqueda está vacía con libros cargados
- **THEN** ambos mensajes permanecen ocultos

### Requirement: Inserción segura de datos de usuario
JavaScript MUST insertar el texto proveniente de los datos y de la búsqueda del usuario en el DOM mediante `textContent` (texto plano), sin interpretar HTML ni usar `innerHTML` con contenido no controlado.

#### Scenario: Texto con caracteres de HTML
- **WHEN** un título contiene caracteres como `<` o `&`
- **THEN** la ficha los muestra como texto literal y no como marcado HTML
