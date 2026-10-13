# Spec Delta

## Purpose

Garantizar que, con los estilos aplicados, todos los controles interactivos se recorren y operan con el teclado y muestran siempre un indicador de foco claramente visible.

## ADDED Requirements

### Requirement: Foco visible en todos los controles
Todo elemento enfocable (enlace para saltar al contenido, enlaces de navegación, enlaces de detalle, `input`, `select`, `button` y contenedores de scroll de tablas enfocables) SHALL mostrar un indicador de foco con `:focus-visible` de al menos 2 px de grosor y contraste de al menos 3:1 contra el fondo adyacente. Los estilos MUST NOT eliminar el contorno de foco (`outline: none` o equivalente) sin reemplazarlo por un indicador visible.

#### Scenario: Foco visible por control
- **WHEN** se recorre la página con Tab y, en cada parada, se consulta `getComputedStyle(document.activeElement).outlineStyle` y `outlineWidth`
- **THEN** en todos los controles el estilo es distinto de `none` y el grosor es de al menos 2 px

#### Scenario: Foco sobre fondos oscuros
- **WHEN** un enlace de la navegación de la cabecera (fondo oscuro) recibe foco por teclado
- **THEN** el indicador de foco usa un color con contraste de al menos 3:1 contra el fondo de la cabecera

#### Scenario: Sin supresión del contorno
- **WHEN** se busca `outline: none` u `outline: 0` en `css/`
- **THEN** no aparece ninguna regla que lo aplique a un estado `:focus` o `:focus-visible` sin un indicador alternativo

### Requirement: Recorrido completo con teclado
Con los estilos aplicados, todos los controles SHALL seguir siendo alcanzables con Tab y Shift+Tab en un orden coherente con la lectura visual, y operables con Enter/Espacio; ningún control MUST quedar oculto, recortado o tapado por otro elemento al recibir foco.

#### Scenario: Enlace para saltar al contenido
- **WHEN** se carga la página y se presiona Tab una vez
- **THEN** el enlace "Saltar al contenido principal" se vuelve visible en pantalla con foco visible, y al presionar Enter el foco pasa al contenido principal

#### Scenario: Orden de tabulación coherente a 320 px y 1280 px
- **WHEN** se recorre la página completa con Tab a 320 px y luego a 1280 px
- **THEN** el orden de foco coincide con el orden visual de lectura y cada control enfocado queda visible dentro del viewport

#### Scenario: Tablas desplazables con teclado
- **WHEN** a 320 px, en un navegador que vuelve enfocables por teclado los contenedores de scroll sin controles internos (Chrome 130 o posterior, Firefox), el contenedor de la tabla de libros recibe foco con Tab y se presionan las flechas izquierda/derecha
- **THEN** la tabla se desplaza dentro de su contenedor y el contenedor muestra el indicador de foco visible

#### Scenario: Controles dentro de una tabla desplazable
- **WHEN** a 320 px se llega con Tab a un botón "Quitar …" o a un enlace "Ver detalle …" que está fuera de la parte visible de su tabla
- **THEN** el contenedor se desplaza hasta mostrar el control enfocado con su indicador de foco visible
