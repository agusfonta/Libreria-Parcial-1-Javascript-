# vista-ventas-historial Specification

## Purpose
Define la vista Ventas (selección de cliente, composición de renglones y resumen) y la vista Historial (listado de ventas con acceso al detalle de sus renglones), con datos estáticos de ejemplo.

## Requirements

### Requirement: Selección de cliente y composición de renglones
La vista Ventas SHALL contener un formulario (`id="form-venta"`) con un selector de cliente (`id="venta-cliente"`) con opción inicial vacía y opciones de clientes con valores `cli-N`, un selector de libro (`id="venta-libro"`) con valores `lib-N`, un campo de cantidad (`id="venta-cantidad"`, número entero, mínimo 1, paso 1) y un botón "Agregar renglón" (`id="btn-agregar-renglon"`, `type="button"`). Cada control MUST tener etiqueta asociada. Sus opciones se repueblan desde los datos tras cada alta.

#### Scenario: Controles de venta
- **WHEN** se inspecciona el formulario de venta
- **THEN** existen el selector de cliente, el selector de libro, la cantidad y el botón "Agregar renglón"

#### Scenario: Agregar renglón no envía
- **WHEN** se activa el botón "Agregar renglón" en Etapa 1
- **THEN** el formulario no se envía ni recarga la página

#### Scenario: Opciones repobladas tras un alta
- **WHEN** se registra un libro o un cliente nuevo
- **THEN** el selector correspondiente del formulario de venta incluye la opción del registro nuevo junto con su opción inicial vacía, sin recargar la página

### Requirement: Renglones y resumen de la venta
La vista Ventas SHALL mostrar una tabla de renglones con encabezados libro, cantidad, precio unitario, subtotal y acciones, con cuerpo `id="venta-renglones-cuerpo"`. Cada renglón MUST mostrar libro, cantidad, precio unitario y subtotal con dos decimales, y ofrecer un botón para quitar el renglón cuyo texto identifica el libro. El total MUST mostrarse en un elemento `output` (`id="venta-total"`). El formulario MUST ofrecer un botón de envío "Confirmar venta".

#### Scenario: Venta de ejemplo
- **WHEN** se lee el resumen de la venta en Etapa 1
- **THEN** muestra dos unidades de un libro a $ 1.500,00 (subtotal $ 3.000,00), una unidad de otro a $ 2.000,00 (subtotal $ 2.000,00) y total $ 5.000,00

#### Scenario: Quitar renglón identificable
- **WHEN** un lector de pantalla anuncia el botón de quitar de un renglón
- **THEN** el nombre del botón incluye el título del libro de ese renglón

### Requirement: Estados de la venta
La vista Ventas SHALL incluir, ocultos inicialmente, un mensaje de venta sin renglones y un contenedor de mensaje de resultado (venta confirmada o rechazada).

#### Scenario: Mensajes de venta ocultos
- **WHEN** se carga la página con la venta de ejemplo
- **THEN** ni el mensaje de venta vacía ni el de resultado son visibles

### Requirement: Historial de ventas
La vista Historial SHALL mostrar una tabla con encabezados identificador, fecha, cliente, total y detalle, con cuerpo `id="historial-cuerpo"`, y al menos una venta de ejemplo (`V-0001`). Cada fila MUST ofrecer acceso a su detalle mediante un control cuyo texto identifica la venta (por ejemplo "Ver detalle de V-0001"). El historial MUST NOT ofrecer controles de edición ni eliminación. MUST existir un mensaje de historial vacío oculto inicialmente.

#### Scenario: Fila de historial
- **WHEN** se lee la fila de V-0001
- **THEN** muestra identificador, fecha, cliente, total $ 5.000,00 y un acceso "Ver detalle de V-0001"

#### Scenario: Sin edición
- **WHEN** se recorre la vista Historial
- **THEN** no existen botones para editar ni eliminar ventas

### Requirement: Detalle de una venta
La vista Historial SHALL contener un bloque de detalle (`id="detalle-venta"`) que, para la venta de ejemplo, muestra sus datos generales y una tabla de renglones con libro, cantidad, precio unitario y subtotal, más el total, con precios como valores históricos de la venta.

#### Scenario: Acceso al detalle
- **WHEN** el usuario activa "Ver detalle de V-0001"
- **THEN** llega al bloque de detalle con los dos renglones (3000 y 2000) y el total $ 5.000,00
