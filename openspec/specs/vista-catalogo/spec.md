# vista-catalogo Specification

## Purpose
Define la vista Catálogo: el título de la librería, el buscador por título y el listado de libros con sus datos visibles, incluida la representación de libros sin género.

## Requirements

### Requirement: Encabezado y buscador del catálogo
La vista Catálogo SHALL mostrar el título de la librería y un buscador por título compuesto por un campo de búsqueda (`type="search"`, `id="busqueda-titulo"`) con etiqueta visible asociada y texto que indique que busca por título. En Etapa 1 el buscador MUST estar identificado como control de maqueta.

#### Scenario: Buscador etiquetado
- **WHEN** se enfoca el campo de búsqueda
- **THEN** su nombre accesible indica que busca libros por título

#### Scenario: Maqueta identificada
- **WHEN** el usuario lee la vista Catálogo en Etapa 1
- **THEN** un aviso visible indica qué controles son maqueta y aún no filtran

### Requirement: Listado de libros del catálogo
La vista Catálogo SHALL presentar los libros como una lista (`id="lista-catalogo"`) donde cada elemento es una ficha de libro que muestra, rotulados, título, ISBN, editorial, género, autores y precio. El precio MUST mostrarse con formato de moneda argentina y dos decimales (por ejemplo "$ 1.500,00"). Cuando un libro tiene varios autores, todos MUST mostrarse.

#### Scenario: Ficha completa
- **WHEN** se lee cualquier ficha del listado
- **THEN** se identifican los seis datos: título, ISBN, editorial, género, autores y precio

#### Scenario: Varios autores
- **WHEN** se lee la ficha del libro de ejemplo con dos autores
- **THEN** ambos autores aparecen en la ficha

#### Scenario: Datos de ejemplo
- **WHEN** se abre la página en Etapa 1
- **THEN** el listado muestra al menos tres libros ficticios estáticos

### Requirement: Libro sin género
Una ficha de libro sin género asignado SHALL mostrar el texto «Sin clasificar» en el lugar del género.

#### Scenario: Género ausente
- **WHEN** se lee la ficha del libro de ejemplo que no tiene género
- **THEN** el dato género muestra «Sin clasificar»

### Requirement: Estados del catálogo
La vista Catálogo SHALL incluir en el marcado un mensaje de catálogo vacío ("No hay libros en el catálogo") y un mensaje de búsqueda sin resultados que mencione que no hay libros cuyo título coincida, ambos ocultos inicialmente (`hidden`) mientras haya libros para mostrar.

#### Scenario: Mensajes ocultos al inicio
- **WHEN** se carga la página con los libros de ejemplo
- **THEN** ninguno de los dos mensajes es visible ni aparece en el árbol de accesibilidad

#### Scenario: Mensaje disponible para JavaScript
- **WHEN** se quita el atributo `hidden` del mensaje de búsqueda sin resultados desde las herramientas del navegador
- **THEN** el mensaje se muestra con texto comprensible sin depender del color
