# Spec Delta

## Purpose

Establece las reglas transversales de accesibilidad del marcado (etiquetas, botones, tablas, validez) y la convención de mensajes de estado y avisos de maqueta que comparten todas las vistas.

## ADDED Requirements

### Requirement: Etiquetas asociadas a cada campo
Todo control de formulario (`input`, `select`, `textarea`) SHALL tener una etiqueta `label` visible asociada mediante `for`/`id`. Los grupos de controles relacionados MUST agruparse con `fieldset` y `legend` cuando corresponda.

#### Scenario: Campo sin etiqueta
- **WHEN** se recorre cada control de la página en el árbol de accesibilidad
- **THEN** ninguno carece de nombre accesible proveniente de su `label`

#### Scenario: Clic en la etiqueta
- **WHEN** el usuario hace clic en el texto de una etiqueta
- **THEN** el foco pasa al control asociado

### Requirement: Botones con texto descriptivo
Todo botón SHALL tener un texto visible que describe su acción (verbo + objeto). MUST NOT existir botones con textos genéricos como "OK", "Enviar" o solo íconos. Cada botón MUST declarar su `type` explícitamente.

#### Scenario: Textos de botones
- **WHEN** se listan los botones de la página
- **THEN** cada uno describe su acción (por ejemplo "Registrar libro", "Agregar renglón", "Confirmar venta") y tiene `type` explícito

### Requirement: Tablas con encabezados
Toda tabla de datos SHALL tener `caption`, `thead` con celdas `th` y `scope="col"`, y `tbody` para sus filas.

#### Scenario: Estructura de tabla
- **WHEN** se inspecciona cualquier tabla
- **THEN** tiene título, encabezados de columna asociados y cuerpo separado

### Requirement: Mensajes de estado
La página SHALL contener mensajes para listas vacías, búsqueda sin resultados y operaciones correctas o rechazadas. Los mensajes de lista vacía y sin resultados MUST ser párrafos ocultos con `hidden` en el estado inicial con datos. Los mensajes de resultado de operaciones MUST ser contenedores con `role="status"` y `aria-live` ocultos con `hidden`, preparados para que JavaScript los muestre. Los mensajes MUST comunicarse con texto y no depender solo del color.

#### Scenario: Estado inicial
- **WHEN** se carga la página
- **THEN** ningún mensaje de estado es visible y todos existen en el código fuente

#### Scenario: Cobertura de mensajes
- **WHEN** se revisa el código fuente
- **THEN** existen mensajes de lista vacía para catálogo, libros, clientes, renglones e historial; de búsqueda sin resultados; y de resultado para las altas de libro y cliente y para la venta

### Requirement: Identificación de maqueta
Cada vista con controles aún no funcionales SHALL mostrar un aviso visible que indique que es una maqueta de Etapa 1 y qué interacciones aún no funcionan.

#### Scenario: Aviso por vista
- **WHEN** se recorre cada vista
- **THEN** las vistas con controles pendientes muestran un aviso de maqueta legible

### Requirement: HTML válido y operable por teclado
El documento SHALL validar sin errores en el validador W3C (Nu HTML Checker) y todos los controles interactivos MUST ser alcanzables y operables con Tab, Shift+Tab y Enter en un orden coherente con la lectura.

#### Scenario: Validación W3C
- **WHEN** se valida `index.html` en el Nu HTML Checker
- **THEN** el informe muestra 0 errores

#### Scenario: Recorrido por teclado
- **WHEN** se recorre la página solo con Tab y Shift+Tab
- **THEN** el foco pasa por el enlace de salto, el menú y los controles de cada vista en orden, sin detenerse en elementos ocultos
