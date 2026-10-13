# mensajes-alternativas-imagen Specification


## Purpose

Asegurar que los mensajes de estado, éxito y error se comprenden sin depender del color, que los mensajes ocultos siguen ocultos con los estilos aplicados, y que las imágenes informativas y decorativas tienen el texto alternativo adecuado.

## Requirements

### Requirement: Mensajes que no dependen solo del color
Cada tipo de mensaje (lista vacía o sin resultados, aviso de maqueta, resultado correcto y resultado de error) SHALL distinguirse por al menos dos señales además del color: su texto, un prefijo o ícono textual y un estilo de borde distinto por tipo. El mensaje de error MUST incluir un prefijo textual que lo identifique como error.

#### Scenario: Mensaje de error identificable en escala de grises
- **WHEN** se muestra temporalmente desde la consola un contenedor de resultado con la variante de error (`hidden = false`, clase `mensaje--error` y un texto) y se emula acromatopsia o se mira en escala de grises
- **THEN** el mensaje se reconoce como error por su prefijo textual visible y su estilo de borde, distinto del de un mensaje correcto

#### Scenario: Mensaje correcto distinguible del error
- **WHEN** se muestra temporalmente un contenedor de resultado con la variante correcta (`mensaje--ok`)
- **THEN** muestra un prefijo textual de éxito y un estilo de borde distinto al de la variante de error

#### Scenario: Aviso de maqueta y mensajes vacíos
- **WHEN** se observan los avisos de maqueta y se muestra temporalmente un mensaje de lista vacía
- **THEN** cada uno tiene un ícono o prefijo textual y un borde propio de su tipo, y su texto es legible con contraste de al menos 4.5:1

### Requirement: Estado oculto preservado
Los elementos con atributo `hidden` SHALL permanecer ocultos con los estilos aplicados, independientemente de las clases que tengan; la hoja de estilos MUST NOT asignar `display` a las clases de mensaje de forma que anule `hidden`.

#### Scenario: Mensajes ocultos al cargar
- **WHEN** se carga la página y se evalúa en consola, para cada elemento `[hidden]`, `getComputedStyle(el).display`
- **THEN** el resultado es `none` para todos

#### Scenario: Mostrar y volver a ocultar
- **WHEN** desde la consola se pone `hidden = false` en un mensaje y luego `hidden = true`
- **THEN** el mensaje se ve con su estilo de tipo y después vuelve a quedar oculto

### Requirement: Texto alternativo de imágenes
Toda imagen informativa SHALL tener un `alt` que describa su información y toda imagen decorativa MUST tener `alt=""` (o implementarse como fondo CSS). Los íconos de los mensajes MUST ser decorativos y no repetir información que ya da el texto del mensaje.

#### Scenario: Documento sin imágenes
- **WHEN** se evalúa `document.querySelectorAll('img, svg, picture, [role="img"]').length` y se lista el contenido de `assets/`
- **THEN** el resultado es 0 y `assets/` no contiene imágenes, y la entrega deja constancia de que el requisito se cumple por no haber imágenes

#### Scenario: Íconos de mensajes decorativos
- **WHEN** se inspecciona cómo se generan los íconos de los mensajes
- **THEN** son contenido CSS generado sin imágenes, y cuando el navegador soporta texto alternativo para `content` el ícono se declara con alternativa vacía o con el prefijo textual equivalente
