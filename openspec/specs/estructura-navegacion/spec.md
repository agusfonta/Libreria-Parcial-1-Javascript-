# estructura-navegacion Specification

## Purpose
Define la página de entrada del frontend de la librería, sus regiones semánticas principales y la navegación clara entre las cinco vistas del sistema (Catálogo, Libros, Clientes, Ventas e Historial).

## Requirements

### Requirement: Página de entrada única
El proyecto SHALL tener `index.html` en la raíz como punto de entrada, abrible directamente en el navegador sin servidor, build ni dependencias externas. La página MUST declarar `lang="es"`, codificación UTF-8, `viewport` y un `<title>` que identifique a la librería. La página MUST enlazar una hoja de estilos local (`css/estilos.css`) y un script local (`js/app.js`) cargado de forma diferida, y MUST NOT referenciar librerías, frameworks ni CDNs.

#### Scenario: Apertura directa
- **WHEN** se abre `index.html` con doble clic desde el sistema de archivos
- **THEN** la página se muestra completa sin errores de recursos faltantes y sin solicitudes a dominios externos

#### Scenario: Sin dependencias externas
- **WHEN** se revisan los elementos `link` y `script` del documento
- **THEN** todas las rutas son relativas a archivos del proyecto

### Requirement: Regiones semánticas
La página SHALL contener exactamente un `header` de página con el nombre de la librería, un `nav` principal con nombre accesible y un único `main` que contiene las cinco vistas. Cada vista MUST ser un `section` con un encabezado `h2` visible que la nombra y la etiqueta (`aria-labelledby`).

#### Scenario: Landmarks presentes
- **WHEN** se inspecciona el árbol de accesibilidad de la página
- **THEN** aparecen los landmarks banner, navigation y main, y cinco regiones con los nombres Catálogo, Libros, Clientes, Ventas e Historial

#### Scenario: Jerarquía de encabezados
- **WHEN** se lista el esquema de encabezados del documento
- **THEN** existe un único `h1` y cada vista comienza con un `h2` sin saltos de nivel

### Requirement: Navegación entre vistas
El `nav` SHALL ofrecer un enlace por vista (Catálogo, Libros, Clientes, Ventas, Historial) cuyo destino es el `id` de la sección correspondiente (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`). Los textos de los enlaces MUST coincidir con el nombre de la vista.

#### Scenario: Ir a una vista
- **WHEN** el usuario activa el enlace "Ventas" del menú
- **THEN** la página se posiciona en la sección Ventas y la URL termina en `#ventas`

#### Scenario: Todos los destinos existen
- **WHEN** se recorren los cinco enlaces del menú
- **THEN** cada `href` corresponde a un `id` existente y único en el documento

### Requirement: Enlace para saltar al contenido
La página SHALL incluir como primer elemento enfocable un enlace "Saltar al contenido principal" que apunta al `main`.

#### Scenario: Primer Tab
- **WHEN** el usuario carga la página y presiona Tab una vez
- **THEN** el foco queda en el enlace "Saltar al contenido principal" y al activarlo con Enter el foco o la posición pasan al contenido principal
