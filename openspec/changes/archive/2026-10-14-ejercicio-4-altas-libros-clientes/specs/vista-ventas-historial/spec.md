# Spec Delta

## MODIFIED Requirements

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
