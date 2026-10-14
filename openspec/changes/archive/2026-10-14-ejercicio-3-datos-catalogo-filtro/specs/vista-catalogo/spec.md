# Spec Delta

## MODIFIED Requirements

### Requirement: Encabezado y buscador del catálogo
La vista Catálogo SHALL mostrar el título de la librería y un buscador por título compuesto por un campo de búsqueda (`type="search"`, `id="busqueda-titulo"`) con etiqueta visible asociada y texto que indique que busca por título. El buscador SHALL filtrar el listado de libros por título al escribir y MUST NOT mostrar el aviso de maqueta.

#### Scenario: Buscador etiquetado
- **WHEN** se enfoca el campo de búsqueda
- **THEN** su nombre accesible indica que busca libros por título

#### Scenario: Maqueta identificada
- **WHEN** el usuario lee la vista Catálogo
- **THEN** ya no aparece el aviso que decía que el buscador aún no filtra, porque el filtro por título es operativo

#### Scenario: Buscador operativo
- **WHEN** el usuario escribe texto en el buscador
- **THEN** el listado se reduce a los libros cuyo título coincide con la búsqueda

### Requirement: Listado de libros del catálogo
La vista Catálogo SHALL presentar los libros como una lista (`id="lista-catalogo"`) generada a partir del array de libros del modelo de datos, donde cada elemento es una ficha de libro que muestra, rotulados, título, ISBN, editorial, género, autores y precio. El precio MUST mostrarse con formato de moneda argentina y dos decimales (por ejemplo "$ 1.500,00"). Cuando un libro tiene varios autores, todos MUST mostrarse.

#### Scenario: Ficha completa
- **WHEN** se lee cualquier ficha del listado
- **THEN** se identifican los seis datos: título, ISBN, editorial, género, autores y precio

#### Scenario: Varios autores
- **WHEN** se lee la ficha del libro que tiene dos autores
- **THEN** ambos autores aparecen en la ficha

#### Scenario: Datos de ejemplo
- **WHEN** se abre la página
- **THEN** el listado muestra al menos seis libros ficticios provenientes del modelo de datos

#### Scenario: Listado generado desde los datos
- **WHEN** se carga la vista Catálogo
- **THEN** las fichas se crean desde el array de libros y no provienen de marcado estático

### Requirement: Estados del catálogo
La vista Catálogo SHALL incluir un mensaje de catálogo vacío (`id="mensaje-catalogo-vacio"`) y un mensaje de búsqueda sin resultados (`id="mensaje-catalogo-sin-resultados"`), ambos ocultos inicialmente (`hidden`). JavaScript SHALL mostrarlos y ocultarlos según haya libros en el catálogo y según la búsqueda tenga coincidencias.

#### Scenario: Mensajes ocultos al inicio
- **WHEN** se carga la página con los libros de ejemplo
- **THEN** ninguno de los dos mensajes es visible ni aparece en el árbol de accesibilidad

#### Scenario: Mensaje disponible para JavaScript
- **WHEN** se quita el atributo `hidden` del mensaje de búsqueda sin resultados desde las herramientas del navegador
- **THEN** el mensaje se muestra con texto comprensible sin depender del color

#### Scenario: Mensaje de búsqueda sin resultados
- **WHEN** la búsqueda no coincide con ningún título del catálogo
- **THEN** se muestra `#mensaje-catalogo-sin-resultados` y el listado queda sin fichas

#### Scenario: Mensaje de catálogo vacío
- **WHEN** el modelo de datos no tiene libros
- **THEN** se muestra `#mensaje-catalogo-vacio` y se oculta el mensaje de búsqueda sin resultados
