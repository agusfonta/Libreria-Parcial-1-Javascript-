# Prompts — Actividades 3 y 4 (TPI)

> Archivo con los prompts del TPI. La Actividad 3 está abajo; la Actividad 4 (solo `propose`) al final.

---

## Prompt — Actividad 3 (Ejercicio 3 del TPI)

> Copiá el bloque de abajo y pegálo como prompt para ejecutar la Actividad 3 con SDD (OPSX / OpenSpec) + Active Stack.
>
> **Actividad 3 = Ejercicio 3 del TPI**: «Datos locales, catálogo y filtro».
> Consigna tomada del TPI completo (TPI: frontend de una librería, Programación III, UTN). El PDF `docs/Repaso Primer Parcial libreria Javascript.pdf` no tiene capa de texto (es vectorial), por eso este prompt se basa en el texto del TPI aportado por el usuario.

```text
Rol: Orquestador SDD (OPSX / OpenSpec) + Active Stack. Vas a implementar la
ACTIVIDAD 3 (Ejercicio 3: "Datos locales, catálogo y filtro") del TPI "Frontend de una
librería" (Programación III, UTN) sobre el repo Libreria-Parcial-1-Javascript
(HTML/CSS/JS nativos). Delegá el trabajo pesado a subagentes; mantené tu hilo fino.

OBJETIVO DE LA ACTIVIDAD 3
Modelo de datos local en JS, generación del catálogo desde el array de libros y filtro
por título, sin librerías, frameworks, CDNs ni build (se abre index.html directo en el
navegador). No se requiere fetch ni ABM de editoriales/géneros/autores.

CONSIGNA (criterios de aceptación — Ejercicio 3 del TPI)
1. Modelo de datos en js/app.js: libros, editoriales, géneros, autores y clientes
   representados con arrays de objetos con IDENTIFICADORES ESTABLES (id numérico o slug).
2. Conjunto inicial (datos ficticios), mínimo: 6 libros, 2 editoriales, 2 géneros,
   3 autores y 3 clientes.
3. Integridad referencial:
   - Cada libro referencia UNA editorial existente (p. ej. editorialId).
   - Cada libro referencia UNO O MÁS autores existentes (p. ej. autorIds[]).
   - El género es OPCIONAL; si está asignado, corresponde a un género existente.
4. JavaScript genera el catálogo A PARTIR DEL ARRAY DE LIBROS (render dinámico), y las
   fichas se insertan en <ul id="lista-catalogo"> mostrando los 6 datos rotulados
   (título, ISBN, editorial, género, autores, precio).
   - Precio con formato moneda argentina, 2 decimales (ej: "$ 1.500,00").
   - Varios autores: mostrar todos.
   - Sin género: mostrar "Sin clasificar".
5. Filtro por <input id="busqueda-titulo"> sobre el título, con TODAS estas reglas:
   - Ignora diferencias entre mayúsculas y minúsculas.
   - Busca coincidencias parciales (substring).
   - Elimina espacios sobrantes en los extremos de la búsqueda (trim).
   - Búsqueda vacía → muestra todo el catálogo.
   - Búsqueda sin coincidencias → mensaje claro (usa #mensaje-catalogo-sin-resultados).
6. Estados: usa los mensajes ya existentes #mensaje-catalogo-vacio y
   #mensaje-catalogo-sin-resultados (en el HTML con atributo hidden).
7. Buenas prácticas: se usan EVENTOS (p. ej. input) y funciones con responsabilidades
   reconocibles (separar datos, render, filtrado, formato). Los datos escritos por
   usuarios se insertan como TEXTO en el DOM (textContent), nunca como HTML crudo.
8. Quitar el aviso "Maqueta de Etapa 1: el buscador aún no filtra los libros" SOLO de la
   vista Catálogo (index.html:32), porque esa interacción ya funciona.
9. No tocar los id/name/values del contrato HTML (los consumen los ejercicios 4 a 6).

FUERA DE ALCANCE (no hacer en este change)
- Altas/bajas/modificaciones de libros, clientes, ventas (Ejercicios 4 y 5).
- Validación de formularios, localStorage/persistencia, README final (Ejercicios 4-6).
- fetch, backend, servidor, API, login.

PREPARAR EL TERRENO PARA EJ. 4-6 (reglas de diseño, sin implementarlos)
- Guardar `precio` como NÚMERO en los datos; formatear "$ 1.500,00" solo al mostrarlo.
  (Ej. 4 valida "precio numérico > 0" y Ej. 5 calcula cantidades × precio.)
- Guardar `isbn` como string tal cual (sin normalizar); el Ej. 4 lo compara sin
  espacios ni guiones.
- IDs estables de editorial/género/autor son los que usarán los selectores del Ej. 4:
  que `editorialId`, `generoId` (opcional) y `autorIds[]` referencien esos ids.
- Modelar el género ausente como `generoId: null` (no como texto "Sin clasificar" en los
  datos); "Sin clasificar" es solo la etiqueta de presentación / opción del selector.
- Separar funciones reutilizables (formateo de precio, resolver editorial/géneros/autores,
  render) para que Ej. 4-6 las reutilicen.

FLUJO OBLIGATORIO (respetá el orden, consultá estado real antes de cada paso)
0. Estado: `openspec list --json` y `openspec status --change <name> --json`. No adivines
   artefactos.
1. PROPOSE (modelo opus): /opsx:propose ejercicio-3-datos-catalogo-filtro
   - Artefactos en español; headings y SHALL/MUST en inglés (openspec/config.yaml).
   - Capabilities: nueva `datos-catalogo-filtro` + MODIFIED de `vista-catalogo`.
   - OJO validador: un bloque MODIFIED no puede eliminar scenarios que la spec
     principal todavía tiene; agregá solo lo nuevo o ajustá el scenario existente.
   - `openspec validate --strict` debe pasar.
2. APPLY (modelo sonnet) con TDD ESTRICTO (Strict TDD Mode activo):
   - SAFETY NET primero; RED → GREEN → TRIANGULATE (≥2 casos por comportamiento:
     happy path + borde) → REFACTOR.
   - Casos de borde a cubrir: búsqueda vacía (muestra todo), solo espacios (muestra
     todo), mayúsculas/minúsculas mezcladas, coincidencia parcial, sin coincidencias
     (mensaje), libro sin género ("Sin clasificar"), libro con varios autores, y
     formato de precio con miles y 2 decimales.
   - Si no hay runner JS configurado, proponer el más liviano posible sin
     dependencias de runtime (prompt al usuario antes de instalar nada).
   - Reportar tabla de evidencia TDD.
3. ARCHIVE (modelo haiku) SOLO cuando apply esté verificado: /opsx:archive.
   Sincroniza delta specs a openspec/specs/.

REGLAS DURAS
- Sin librerías/frameworks/CDNs. Comentarios solo si se piden.
- Nombres de dominio en español; funciones con responsabilidad única y clara.
- Tras cada acción, mem_save en engram con topic_key "opsx/ejercicio-3-datos-catalogo-filtro/<fase>".
- Al cerrar, mem_session_summary.

ENTREGABLE FINAL
- Change propuesto, implementado y validado; resumen de archivos cambiados
  (js/app.js, index.html), evidencia TDD, y checklist de verificación manual en navegador
  (array con 6 libros/2 editoriales/2 géneros/3 autores/3 clientes, referencias válidas,
  filtrar por título insensible a mayúsculas, trim, búsqueda vacía, sin resultados,
  sin género, varios autores, formato de precio).
```

---

## Prompt — Actividad 4 (Ejercicio 4 del TPI) — SOLO `propose`

> Copiá el bloque de abajo. Este prompt genera **únicamente el propose** (artefactos de planificación) para que lo revises; después vos corrés `apply` y `archive` a mano.

```text
Rol: Orquestador SDD (OPSX / OpenSpec) + Active Stack. Fase: PROPOSE únicamente.
Vas a proponer el change de la ACTIVIDAD 4 (Ejercicio 4: "Alta de libros y clientes") del
TPI "Frontend de una librería" (Programación III, UTN) sobre el repo
Libreria-Parcial-1-Javascript (HTML/CSS/JS nativos). NO implementes, NO apliques, NO
archives: el único entregable son los artefactos de planificación para que el usuario los
revise; el resto lo corre el usuario a mano.

ASOCIACIÓN CON LOS CHANGES ANTERIORES (no romper)
- Los Ejercicios 1-3 ya están archivados y sus specs sincronizadas en openspec/specs/
  (estructura HTML, CSS, modelo de datos, render del catálogo y filtro por título).
- Reutilizá el modelo de datos y los helpers ya existentes en js/app.js: arrays
  libros / editoriales / generos / autores / clientes, y funciones resolverEditorial,
  resolverGenero, resolverAutores, formatearPrecio, normalizarTexto, construirVistaFicha,
  renderizarCatalogo.
- Respetá el contrato HTML existente (NO cambies id/name/value):
  - Libros: form#form-libro; campos #libro-titulo, #libro-isbn, #libro-precio,
    #libro-editorial (select), #libro-genero (select, option value="" = "Sin clasificar"),
    #libro-autores (select multiple); resultado #mensaje-libro-resultado;
    tabla #tabla-libros-cuerpo; vacío #mensaje-libros-vacio.
  - Clientes: form#form-cliente; #cliente-nombre, #cliente-email;
    resultado #mensaje-cliente-resultado; tabla #tabla-clientes-cuerpo;
    vacío #mensaje-clientes-vacio.
- Hoy esos dos formularios están declarados como maqueta; este change los vuelve operativos.

CONSIGNA (criterios de aceptación — Ejercicio 4 del TPI)
FORMULARIO DE LIBROS
1. Permite registrar título, ISBN, precio y las relaciones con editorial, género y autores.
2. Las opciones se generan a partir de los datos locales: editorial y género con selectores
   (select), autores con selector múltiple (select multiple) o controles equivalentes.
3. El selector de género incluye la opción "Sin clasificar" (ausencia de género; value="").
4. Validaciones (mensajes con texto, cerca del formulario):
   - título y ISBN no vacíos;
   - ISBN no debe existir ya en el conjunto local, comparándolo SIN espacios ni guiones
     (no se implementa dígito de control);
   - precio numérico y mayor que cero;
   - la editorial y TODOS los autores seleccionados deben existir en los datos locales;
   - al menos un autor seleccionado;
   - el género puede quedar sin asignar; si se asigna, debe existir en los datos locales.
FORMULARIO DE CLIENTES
5. Permite registrar nombre completo y email (sin campo de apellido separado).
6. Validaciones:
   - nombre completo y email no vacíos;
   - email con formato válido;
   - no debe existir otro cliente con el mismo email, comparado sin espacios exteriores y
     sin distinguir mayúsculas de minúsculas.
COMPORTAMIENTO DE ENVÍO
7. Se controla el envío con preventDefault; se muestran errores cerca del formulario y solo
   se agrega el registro si TODAS las comprobaciones pasan.
8. Tras un alta correcta, el listado y las OPCIONES RELACIONADAS se actualizan sin recargar
   la página: repoblar #tabla-libros-cuerpo / #tabla-clientes-cuerpo, el catálogo de la
   vista Catálogo y los selects que listan datos (p. ej. #venta-libro y #venta-cliente).
   (Solo se actualizan las opciones; la lógica de venta es del Ejercicio 5.)
9. No se exige editar ni eliminar registros.

MODELO / INTEGRIDAD (coherente con el Ej. 3)
- Cada alta nueva recibe un ID estable y único (p. ej. lib-7, cli-4) sin colisionar.
- Precio se guarda como NÚMERO; ISBN como string tal cual (la comparación normaliza sin
  espacios ni guiones).
- Género ausente = generoId null; "Sin clasificar" es solo la opción/label.

FUERA DE ALCANCE (no incluir en este change)
- Lógica de ventas, renglones, totales e historial inmutable (Ejercicio 5).
- localStorage/persistencia y README final (Ejercicio 6).
- fetch / backend / login / edición / eliminación.

FLUJO — SOLO PASO 1 (PROPOSE)
0. Estado: `openspec list --json` y `openspec status --change <name> --json` (no adivines
   artefactos).
1. PROPOSE (modelo opus): /opsx:propose ejercicio-4-altas-libros-clientes
   - Artefactos en español; headings y SHALL/MUST en inglés (openspec/config.yaml).
   - Capabilities sugeridas: nueva `altas-libros-clientes`; MODIFIED de `vista-altas`
     (formularios operativos, quitar avisos de maqueta de Libros index.html:47 y Clientes
     index.html:139, mensajes de error/estado); MODIFIED de `vista-ventas-historial` solo
     para el origen dinámico de las opciones de sus selects.
   - OJO validador: un bloque MODIFIED no puede eliminar scenarios que la spec principal
     todavía tiene.
   - `openspec validate --strict` debe pasar.
   - DEJAR el change en estado "propuesto": NO ejecutar apply ni archive, NO escribir
     código de producción todavía.

REGLAS
- Sin librerías/frameworks/CDNs. Sin comentarios salvo que se pidan.
- Nombres de dominio y de UI en español; funciones con responsabilidad única.
- Al terminar, mem_save con topic_key "opsx/ejercicio-4-altas-libros-clientes/propose".

ENTREGABLE (para revisión manual del usuario)
- Ruta del change creado y lista de artefactos (proposal, design, tasks, delta specs) con
  su estado.
- Resultado de `openspec validate --strict`.
- Resumen de alcance y decisiones de diseño pendientes de aprobación.
- Próximos pasos que el usuario correrá a mano (apply → archive), sin ejecutarlos.
```
