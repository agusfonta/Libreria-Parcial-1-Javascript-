// Librería Pampa - lógica de la aplicación (Ejercicios 3 a 6).
// Nota para Ej. 4/5: los mensajes con `hidden` y aria-live deben recibir su texto DESPUÉS de quitar `hidden`,
// para que los lectores de pantalla lo anuncien.

// Modelo de datos local del dominio. Los `id` son estables y coinciden con los
// `value` del contrato HTML que consumen los Ejercicios 4 a 6.
const editoriales = [
  { id: "ed-1", nombre: "Sudamericana" },
  { id: "ed-2", nombre: "Alfaguara" },
];

const generos = [
  { id: "gen-1", nombre: "Novela" },
  { id: "gen-2", nombre: "Cuento" },
];

const autores = [
  { id: "aut-1", nombre: "Julio Cortázar" },
  { id: "aut-2", nombre: "Jorge Luis Borges" },
  { id: "aut-3", nombre: "Adolfo Bioy Casares" },
];

const clientes = [
  { id: "cli-1", nombre: "Ana Gómez", email: "ana.gomez@example.com" },
  { id: "cli-2", nombre: "Bruno Díaz", email: "bruno.diaz@example.com" },
  { id: "cli-3", nombre: "Carla Méndez", email: "carla.mendez@example.com" },
];

const libros = [
  {
    id: "lib-1",
    titulo: "Rayuela",
    isbn: "9780000000011",
    editorialId: "ed-1",
    generoId: "gen-1",
    autorIds: ["aut-1"],
    precio: 1500,
  },
  {
    id: "lib-2",
    titulo: "El Aleph",
    isbn: "9780000000028",
    editorialId: "ed-2",
    generoId: "gen-2",
    autorIds: ["aut-2"],
    precio: 2000,
  },
  {
    id: "lib-3",
    titulo: "Antología fantástica",
    isbn: "9780000000035",
    editorialId: "ed-1",
    generoId: null,
    autorIds: ["aut-2", "aut-3"],
    precio: 2500,
  },
  {
    id: "lib-4",
    titulo: "Ficciones",
    isbn: "9780000000042",
    editorialId: "ed-2",
    generoId: "gen-2",
    autorIds: ["aut-2"],
    precio: 1800,
  },
  {
    id: "lib-5",
    titulo: "Bestiario",
    isbn: "9780000000059",
    editorialId: "ed-1",
    generoId: "gen-2",
    autorIds: ["aut-1"],
    precio: 950,
  },
  {
    id: "lib-6",
    titulo: "El libro de arena",
    isbn: "9780000000066",
    editorialId: "ed-2",
    generoId: "gen-2",
    autorIds: ["aut-2"],
    precio: 500,
  },
];

function resolverEditorial(id) {
  const editorial = editoriales.find((e) => e.id === id);
  return editorial ? editorial.nombre : "";
}

function resolverGenero(id) {
  if (id === null) {
    return "Sin clasificar";
  }
  const genero = generos.find((g) => g.id === id);
  return genero ? genero.nombre : "";
}

function resolverAutores(ids) {
  return ids
    .map((id) => {
      const autor = autores.find((a) => a.id === id);
      return autor ? autor.nombre : null;
    })
    .filter((nombre) => nombre !== null)
    .join(", ");
}

function formatearPrecio(valor) {
  const numero = Number(valor).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$ ${numero}`;
}

function normalizarTexto(texto) {
  return String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filtrarPorTitulo(libros, termino) {
  const busqueda = normalizarTexto(termino).trim();
  if (busqueda === "") {
    return libros.slice();
  }
  return libros.filter((libro) => normalizarTexto(libro.titulo).includes(busqueda));
}

function construirVistaFicha(libro) {
  return {
    id: libro.id,
    titulo: libro.titulo,
    isbn: libro.isbn,
    editorial: resolverEditorial(libro.editorialId),
    genero: resolverGenero(libro.generoId),
    autores: resolverAutores(libro.autorIds),
    precio: formatearPrecio(libro.precio),
  };
}

function validarIntegridadReferencial() {
  const problemas = [];
  const idsEditoriales = new Set(editoriales.map((e) => e.id));
  const idsAutores = new Set(autores.map((a) => a.id));
  const idsGeneros = new Set(generos.map((g) => g.id));

  for (const libro of libros) {
    if (!idsEditoriales.has(libro.editorialId)) {
      problemas.push(`El libro ${libro.id} referencia una editorial inexistente (${libro.editorialId}).`);
    }
    if (!Array.isArray(libro.autorIds) || libro.autorIds.length < 1) {
      problemas.push(`El libro ${libro.id} no tiene ningún autor.`);
    } else {
      for (const autorId of libro.autorIds) {
        if (!idsAutores.has(autorId)) {
          problemas.push(`El libro ${libro.id} referencia un autor inexistente (${autorId}).`);
        }
      }
    }
    if (libro.generoId !== null && !idsGeneros.has(libro.generoId)) {
      problemas.push(`El libro ${libro.id} referencia un género inexistente (${libro.generoId}).`);
    }
  }

  return problemas;
}

function crearFicha(libro) {
  const vista = construirVistaFicha(libro);

  const articulo = document.createElement("article");
  articulo.className = "ficha";

  const titulo = document.createElement("h3");
  titulo.textContent = vista.titulo;
  articulo.appendChild(titulo);

  const listaDatos = document.createElement("dl");
  listaDatos.className = "lista-datos";

  const campos = [
    ["Título", vista.titulo],
    ["ISBN", vista.isbn],
    ["Editorial", vista.editorial],
    ["Género", vista.genero],
    ["Autores", vista.autores],
    ["Precio", vista.precio],
  ];

  for (const [etiqueta, valor] of campos) {
    const termino = document.createElement("dt");
    termino.textContent = etiqueta;
    const definicion = document.createElement("dd");
    definicion.textContent = valor;
    listaDatos.appendChild(termino);
    listaDatos.appendChild(definicion);
  }

  articulo.appendChild(listaDatos);

  const item = document.createElement("li");
  item.appendChild(articulo);
  return item;
}

function actualizarEstado(librosVisibles) {
  const mensajeVacio = document.getElementById("mensaje-catalogo-vacio");
  const mensajeSinResultados = document.getElementById("mensaje-catalogo-sin-resultados");
  const hayLibros = libros.length > 0;
  const hayResultados = librosVisibles.length > 0;

  mensajeVacio.hidden = hayLibros;
  mensajeSinResultados.hidden = !(hayLibros && !hayResultados);
}

function renderizarCatalogo(librosVisibles) {
  const lista = document.getElementById("lista-catalogo");
  lista.replaceChildren();

  for (const libro of librosVisibles) {
    lista.appendChild(crearFicha(libro));
  }

  actualizarEstado(librosVisibles);
}

function normalizarIsbn(isbn) {
  return String(isbn ?? "")
    .replace(/[\s-]/g, "")
    .toLowerCase();
}

function extraerSufijoNumerico(id, prefijoConGuion) {
  if (!id.startsWith(prefijoConGuion)) {
    return null;
  }
  const sufijo = id.slice(prefijoConGuion.length);
  return /^\d+$/.test(sufijo) ? Number(sufijo) : null;
}

function generarSiguienteId(coleccion, prefijo) {
  const prefijoConGuion = `${prefijo}-`;
  let maximo = 0;

  for (const elemento of coleccion) {
    const numero = extraerSufijoNumerico(String(elemento.id), prefijoConGuion);
    if (numero !== null && numero > maximo) {
      maximo = numero;
    }
  }

  return `${prefijoConGuion}${maximo + 1}`;
}

const MENSAJE_TITULO_OBLIGATORIO = "El título es obligatorio.";
const MENSAJE_ISBN_OBLIGATORIO = "El ISBN es obligatorio.";
const MENSAJE_ISBN_DUPLICADO = "Ya existe un libro con ese ISBN.";
const MENSAJE_PRECIO_INVALIDO = "El precio debe ser un número mayor que cero.";
const MENSAJE_EDITORIAL_INVALIDA = "Seleccioná una editorial válida.";
const MENSAJE_AUTORES_OBLIGATORIOS = "Seleccioná al menos un autor.";
const MENSAJE_AUTOR_INEXISTENTE = "Uno de los autores seleccionados no existe.";
const MENSAJE_GENERO_INEXISTENTE = "El género seleccionado no existe.";

const MENSAJE_CLIENTE_NOMBRE_OBLIGATORIO = "El nombre completo es obligatorio.";
const MENSAJE_CLIENTE_EMAIL_OBLIGATORIO = "El email es obligatorio.";
const MENSAJE_CLIENTE_EMAIL_INVALIDO = "El email no tiene un formato válido.";
const MENSAJE_CLIENTE_EMAIL_DUPLICADO = "Ya existe un cliente con ese email.";

function normalizarEmail(email) {
  return String(email ?? "")
    .trim()
    .toLowerCase();
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizarEmail(email));
}

function validarCliente(datos, clientesExistentes) {
  const errores = [];
  const nombreCompleto = String(datos.nombreCompleto ?? "").trim();
  const email = normalizarEmail(datos.email);

  if (nombreCompleto === "") {
    errores.push(MENSAJE_CLIENTE_NOMBRE_OBLIGATORIO);
  }

  if (email === "") {
    errores.push(MENSAJE_CLIENTE_EMAIL_OBLIGATORIO);
  } else if (!emailValido(email)) {
    errores.push(MENSAJE_CLIENTE_EMAIL_INVALIDO);
  } else if (clientesExistentes.some((cliente) => normalizarEmail(cliente.email) === email)) {
    errores.push(MENSAJE_CLIENTE_EMAIL_DUPLICADO);
  }

  return errores;
}


function crearLibro(datos, coleccion) {
  const titulo = String(datos.titulo ?? "").trim();
  const precio = Number(datos.precio);
  const generoId = datos.generoId !== "" && datos.generoId != null ? datos.generoId : null;
  const autorIds = Array.isArray(datos.autorIds) ? datos.autorIds : [];
  return {
    id: generarSiguienteId(coleccion, "lib"),
    titulo: titulo,
    isbn: normalizarIsbn(datos.isbn),
    editorialId: datos.editorialId,
    generoId: generoId,
    autorIds: autorIds,
    precio: precio,
  };
}

function validarLibro(datos) {
  const errores = [];
  const titulo = String(datos.titulo ?? "").trim();
  const isbn = String(datos.isbn ?? "").trim();
  const precio = Number(datos.precio);
  const generoId = datos.generoId ?? null;
  const autorIds = Array.isArray(datos.autorIds) ? datos.autorIds : [];

  if (titulo === "") {
    errores.push(MENSAJE_TITULO_OBLIGATORIO);
  }

  if (isbn === "") {
    errores.push(MENSAJE_ISBN_OBLIGATORIO);
  } else {
    const isbnNormalizado = normalizarIsbn(isbn);
    if (libros.some((libro) => normalizarIsbn(libro.isbn) === isbnNormalizado)) {
      errores.push(MENSAJE_ISBN_DUPLICADO);
    }
  }

  if (!Number.isFinite(precio) || precio <= 0) {
    errores.push(MENSAJE_PRECIO_INVALIDO);
  }

  if (!editoriales.some((editorial) => editorial.id === datos.editorialId)) {
    errores.push(MENSAJE_EDITORIAL_INVALIDA);
  }

  if (autorIds.length < 1) {
    errores.push(MENSAJE_AUTORES_OBLIGATORIOS);
  } else {
    const idsAutores = new Set(autores.map((autor) => autor.id));
    if (autorIds.some((id) => !idsAutores.has(id))) {
      errores.push(MENSAJE_AUTOR_INEXISTENTE);
    }
  }

  if (generoId !== null && !generos.some((genero) => genero.id === generoId)) {
    errores.push(MENSAJE_GENERO_INEXISTENTE);
  }

  return errores;
}

function crearOpcion(valor, texto) {
  const option = document.createElement("option");
  option.value = valor;
  option.textContent = texto;
  return option;
}

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function obtenerIdsSeleccionados(casillas) {
  return Array.from(casillas)
    .filter((casilla) => casilla.checked)
    .map((casilla) => casilla.value);
}

// tipo: "ok" o "error". Aplica la clase del contrato CSS (mensaje--ok / mensaje--error).
function mostrarMensaje(contenedor, texto, tipo = "ok") {
  if (!contenedor) {
    return;
  }
  contenedor.classList.toggle("mensaje--error", tipo === "error");
  contenedor.classList.toggle("mensaje--ok", tipo !== "error");
  contenedor.hidden = false;
  contenedor.textContent = texto;
}

function poblarOpcionesFormularioLibro() {
  const selectEditorial = document.getElementById("libro-editorial");
  const selectGenero = document.getElementById("libro-genero");
  const grupoAutores = document.getElementById("libro-autores");

  if (selectEditorial) {
    selectEditorial.replaceChildren();
    selectEditorial.appendChild(crearOpcion("", "Seleccioná una editorial"));
    for (const editorial of editoriales) {
      selectEditorial.appendChild(crearOpcion(editorial.id, editorial.nombre));
    }
  }

  if (selectGenero) {
    selectGenero.replaceChildren();
    selectGenero.appendChild(crearOpcion("", "Sin clasificar"));
    for (const genero of generos) {
      selectGenero.appendChild(crearOpcion(genero.id, genero.nombre));
    }
  }

  if (grupoAutores) {
    grupoAutores.replaceChildren();
    for (const autor of autores) {
      const casilla = document.createElement("input");
      casilla.type = "checkbox";
      casilla.name = "autores";
      casilla.value = autor.id;
      casilla.id = `libro-autor-${autor.id}`;

      const etiqueta = document.createElement("label");
      etiqueta.setAttribute("for", casilla.id);
      etiqueta.textContent = autor.nombre;

      grupoAutores.appendChild(casilla);
      grupoAutores.appendChild(etiqueta);
    }
  }
}

function renderizarTablaLibros() {
  const cuerpo = document.getElementById("tabla-libros-cuerpo");
  if (!cuerpo) {
    return;
  }

  cuerpo.replaceChildren();
  for (const libro of libros) {
    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(libro.titulo));
    fila.appendChild(crearCelda(libro.isbn));
    fila.appendChild(crearCelda(resolverEditorial(libro.editorialId)));
    fila.appendChild(crearCelda(resolverGenero(libro.generoId)));
    fila.appendChild(crearCelda(resolverAutores(libro.autorIds)));
    fila.appendChild(crearCelda(formatearPrecio(libro.precio)));
    cuerpo.appendChild(fila);
  }

  const mensajeVacio = document.getElementById("mensaje-libros-vacio");
  if (mensajeVacio) {
    mensajeVacio.hidden = libros.length > 0;
  }
}

function renderizarTablaClientes() {
  const cuerpo = document.getElementById("tabla-clientes-cuerpo");
  if (!cuerpo) {
    return;
  }

  cuerpo.replaceChildren();
  for (const cliente of clientes) {
    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(cliente.nombre));
    fila.appendChild(crearCelda(cliente.email));
    cuerpo.appendChild(fila);
  }

  const mensajeVacio = document.getElementById("mensaje-clientes-vacio");
  if (mensajeVacio) {
    mensajeVacio.hidden = clientes.length > 0;
  }
}

// Reconstruye un selector conservando la opción elegida si sigue existiendo.
function reconstruirSelector(select, textoVacio, elementos, obtenerTexto) {
  const seleccionado = select.value;
  select.replaceChildren();
  select.appendChild(crearOpcion("", textoVacio));
  for (const elemento of elementos) {
    select.appendChild(crearOpcion(elemento.id, obtenerTexto(elemento)));
  }
  if (elementos.some((elemento) => elemento.id === seleccionado)) {
    select.value = seleccionado;
  }
}

function refrescarOpcionesRelacionadas() {
  const selectVentaLibro = document.getElementById("venta-libro");
  const selectVentaCliente = document.getElementById("venta-cliente");

  if (selectVentaLibro) {
    reconstruirSelector(selectVentaLibro, "Seleccioná un libro", libros, (libro) => libro.titulo);
  }

  if (selectVentaCliente) {
    reconstruirSelector(
      selectVentaCliente,
      "Seleccioná un cliente",
      clientes,
      (cliente) => `${cliente.nombre} (${cliente.email})`
    );
  }
}

// ---------------------------------------------------------------------------
// Ejercicio 5: venta simulada e historial
// ---------------------------------------------------------------------------

// Ventas confirmadas. Cada renglón guarda una copia del título y del precio
// unitario al momento de confirmar: el historial nunca vuelve a leer el catálogo.
const ventas = [];

// Renglones de la venta en curso (todavía no confirmada): { libroId, cantidad }.
// La cantidad se guarda como texto para conservar un valor inválido mientras
// se edita y rechazarlo al confirmar.
const renglonesVenta = [];

const MENSAJE_VENTA_CLIENTE_OBLIGATORIO = "Seleccioná un cliente.";
const MENSAJE_VENTA_CLIENTE_INEXISTENTE = "El cliente seleccionado no existe.";
const MENSAJE_VENTA_LIBRO_OBLIGATORIO = "Seleccioná un libro.";
const MENSAJE_VENTA_LIBRO_INEXISTENTE = "Uno de los libros seleccionados no existe.";
const MENSAJE_VENTA_CANTIDAD_INVALIDA = "La cantidad debe ser un número entero mayor que cero.";
const MENSAJE_VENTA_RENGLON_INVALIDO =
  "Hay renglones con cantidades inválidas: cada cantidad debe ser un número entero mayor que cero.";
const MENSAJE_VENTA_LIBRO_DUPLICADO =
  "Ese libro ya está en la venta. Modificá la cantidad en su renglón en lugar de agregarlo otra vez.";
const MENSAJE_VENTA_SIN_RENGLONES = "La venta no tiene renglones. Agregá al menos un libro.";

function cantidadValida(valor) {
  const texto = String(valor ?? "").trim();
  return /^\d+$/.test(texto) && Number(texto) > 0;
}

function redondearImporte(valor) {
  return Math.round(valor * 100) / 100;
}

function calcularSubtotal(cantidad, precioUnitario) {
  return redondearImporte(Number(cantidad) * Number(precioUnitario));
}

function calcularTotal(renglones) {
  return redondearImporte(renglones.reduce((suma, renglon) => suma + renglon.subtotal, 0));
}

// Total de la venta en curso: suma solo los renglones con cantidad válida.
function calcularTotalEnCurso(renglones, catalogo) {
  let total = 0;
  for (const renglon of renglones) {
    const libro = catalogo.find((l) => l.id === renglon.libroId);
    if (libro && cantidadValida(renglon.cantidad)) {
      total += calcularSubtotal(renglon.cantidad, libro.precio);
    }
  }
  return redondearImporte(total);
}

function validarRenglonNuevo(renglones, libroId, cantidad, catalogo) {
  const errores = [];

  if (!libroId) {
    errores.push(MENSAJE_VENTA_LIBRO_OBLIGATORIO);
  } else if (!catalogo.some((libro) => libro.id === libroId)) {
    errores.push(MENSAJE_VENTA_LIBRO_INEXISTENTE);
  } else if (renglones.some((renglon) => renglon.libroId === libroId)) {
    errores.push(MENSAJE_VENTA_LIBRO_DUPLICADO);
  }

  if (!cantidadValida(cantidad)) {
    errores.push(MENSAJE_VENTA_CANTIDAD_INVALIDA);
  }

  return errores;
}

function validarVenta(clienteId, renglones, listaClientes, catalogo) {
  const errores = [];

  if (!clienteId) {
    errores.push(MENSAJE_VENTA_CLIENTE_OBLIGATORIO);
  } else if (!listaClientes.some((cliente) => cliente.id === clienteId)) {
    errores.push(MENSAJE_VENTA_CLIENTE_INEXISTENTE);
  }

  if (renglones.length === 0) {
    errores.push(MENSAJE_VENTA_SIN_RENGLONES);
    return errores;
  }

  if (renglones.some((renglon) => !cantidadValida(renglon.cantidad))) {
    errores.push(MENSAJE_VENTA_RENGLON_INVALIDO);
  }

  if (renglones.some((renglon) => !catalogo.some((libro) => libro.id === renglon.libroId))) {
    errores.push(MENSAJE_VENTA_LIBRO_INEXISTENTE);
  }

  return errores;
}

// Arma la venta confirmada copiando los datos descriptivos y el precio vigente.
// Se llama solo cuando validarVenta() no devolvió errores.
function crearVenta(clienteId, renglones, listaClientes, catalogo, ventasExistentes, fecha = new Date()) {
  const cliente = listaClientes.find((c) => c.id === clienteId);

  const renglonesConfirmados = renglones.map((renglon) => {
    const libro = catalogo.find((l) => l.id === renglon.libroId);
    const cantidad = Number(renglon.cantidad);
    const precioUnitario = Number(libro.precio);
    return {
      libroId: libro.id,
      titulo: libro.titulo,
      isbn: libro.isbn,
      cantidad: cantidad,
      precioUnitario: precioUnitario,
      subtotal: calcularSubtotal(cantidad, precioUnitario),
    };
  });

  return {
    id: generarSiguienteId(ventasExistentes, "ven"),
    fecha: fecha.toISOString(),
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    clienteEmail: cliente.email,
    renglones: renglonesConfirmados,
    total: calcularTotal(renglonesConfirmados),
  };
}

function formatearFecha(fechaIso) {
  return new Date(fechaIso).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function textoSubtotalEnCurso(cantidad, precio) {
  return cantidadValida(cantidad) ? formatearPrecio(calcularSubtotal(cantidad, precio)) : "Cantidad inválida";
}

function actualizarTotalVenta() {
  const salidaTotal = document.getElementById("venta-total");
  if (salidaTotal) {
    salidaTotal.textContent = formatearPrecio(calcularTotalEnCurso(renglonesVenta, libros));
  }
}

function quitarRenglonVenta(libroId) {
  const indice = renglonesVenta.findIndex((renglon) => renglon.libroId === libroId);
  if (indice === -1) {
    return;
  }
  const libro = libros.find((l) => l.id === libroId);
  renglonesVenta.splice(indice, 1);
  renderizarRenglonesVenta();

  // El botón quitado desaparece: se devuelve el foco al selector de libros.
  const selectLibro = document.getElementById("venta-libro");
  if (selectLibro) {
    selectLibro.focus();
  }
  mostrarMensaje(
    document.getElementById("mensaje-venta-resultado"),
    `Se quitó «${libro ? libro.titulo : libroId}» de la venta.`
  );
}

function crearFilaRenglonVenta(renglon) {
  const libro = libros.find((l) => l.id === renglon.libroId);
  const titulo = libro ? libro.titulo : "Libro inexistente";
  const precio = libro ? libro.precio : 0;

  const fila = document.createElement("tr");
  fila.appendChild(crearCelda(titulo));

  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.min = "1";
  inputCantidad.step = "1";
  inputCantidad.className = "campo-control campo-control--compacto";
  inputCantidad.value = renglon.cantidad;
  inputCantidad.setAttribute("aria-label", `Cantidad de ${titulo}`);
  const celdaCantidad = document.createElement("td");
  celdaCantidad.appendChild(inputCantidad);
  fila.appendChild(celdaCantidad);

  fila.appendChild(crearCelda(formatearPrecio(precio)));

  const celdaSubtotal = crearCelda(textoSubtotalEnCurso(renglon.cantidad, precio));
  fila.appendChild(celdaSubtotal);

  inputCantidad.addEventListener("input", () => {
    renglon.cantidad = inputCantidad.value;
    inputCantidad.setAttribute("aria-invalid", String(!cantidadValida(renglon.cantidad)));
    celdaSubtotal.textContent = textoSubtotalEnCurso(renglon.cantidad, precio);
    actualizarTotalVenta();
  });

  const botonQuitar = document.createElement("button");
  botonQuitar.type = "button";
  botonQuitar.className = "btn btn--peligro";
  botonQuitar.textContent = `Quitar ${titulo}`;
  botonQuitar.addEventListener("click", () => quitarRenglonVenta(renglon.libroId));
  const celdaAcciones = document.createElement("td");
  celdaAcciones.appendChild(botonQuitar);
  fila.appendChild(celdaAcciones);

  return fila;
}

function renderizarRenglonesVenta() {
  const cuerpo = document.getElementById("venta-renglones-cuerpo");
  if (!cuerpo) {
    return;
  }

  cuerpo.replaceChildren();
  for (const renglon of renglonesVenta) {
    cuerpo.appendChild(crearFilaRenglonVenta(renglon));
  }

  const mensajeVacio = document.getElementById("mensaje-venta-vacia");
  if (mensajeVacio) {
    mensajeVacio.hidden = renglonesVenta.length > 0;
  }

  actualizarTotalVenta();
}

function crearCeldaFecha(fechaIso) {
  const celda = document.createElement("td");
  const tiempo = document.createElement("time");
  tiempo.dateTime = fechaIso;
  tiempo.textContent = formatearFecha(fechaIso);
  celda.appendChild(tiempo);
  return celda;
}

function renderizarHistorial() {
  const cuerpo = document.getElementById("historial-cuerpo");
  if (!cuerpo) {
    return;
  }

  cuerpo.replaceChildren();
  for (const venta of ventas) {
    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(venta.id));
    fila.appendChild(crearCeldaFecha(venta.fecha));
    fila.appendChild(crearCelda(venta.clienteNombre));
    fila.appendChild(crearCelda(formatearPrecio(venta.total)));

    const botonDetalle = document.createElement("button");
    botonDetalle.type = "button";
    botonDetalle.className = "btn btn--secundario";
    botonDetalle.textContent = `Ver detalle de ${venta.id}`;
    botonDetalle.addEventListener("click", () => mostrarDetalleVenta(venta.id));
    const celdaDetalle = document.createElement("td");
    celdaDetalle.appendChild(botonDetalle);
    fila.appendChild(celdaDetalle);

    cuerpo.appendChild(fila);
  }

  const mensajeVacio = document.getElementById("mensaje-historial-vacio");
  if (mensajeVacio) {
    mensajeVacio.hidden = ventas.length > 0;
  }
}

// Muestra los renglones guardados en la venta (precio histórico), sin consultar el catálogo.
function mostrarDetalleVenta(ventaId) {
  const venta = ventas.find((v) => v.id === ventaId);
  const detalle = document.getElementById("detalle-venta");
  if (!venta || !detalle) {
    return;
  }

  const titulo = document.getElementById("titulo-detalle-venta");
  titulo.textContent = `Detalle de la venta ${venta.id}`;
  document.getElementById("detalle-venta-caption").textContent = `Renglones de la venta ${venta.id}`;

  const fecha = document.getElementById("detalle-venta-fecha");
  fecha.dateTime = venta.fecha;
  fecha.textContent = formatearFecha(venta.fecha);

  document.getElementById("detalle-venta-cliente").textContent =
    `${venta.clienteNombre} (${venta.clienteEmail})`;

  const cuerpo = document.getElementById("detalle-venta-renglones");
  cuerpo.replaceChildren();
  for (const renglon of venta.renglones) {
    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(renglon.titulo));
    fila.appendChild(crearCelda(String(renglon.cantidad)));
    fila.appendChild(crearCelda(formatearPrecio(renglon.precioUnitario)));
    fila.appendChild(crearCelda(formatearPrecio(renglon.subtotal)));
    cuerpo.appendChild(fila);
  }

  document.getElementById("detalle-venta-total").textContent = formatearPrecio(venta.total);

  detalle.hidden = false;
  titulo.focus();
}

// ---------------------------------------------------------------------------
// Ejercicio 6: persistencia en localStorage
// ---------------------------------------------------------------------------

// Cada colección se guarda como JSON (array) bajo su propia clave.
const CLAVES_ALMACENAMIENTO = {
  libros: "libreriaPampa.libros",
  clientes: "libreriaPampa.clientes",
  ventas: "libreriaPampa.ventas",
};

const AVISO_SIN_GUARDAR =
  " Atención: no se pudo guardar en este navegador; el cambio se perderá al recargar.";

function obtenerAlmacenamiento() {
  try {
    return typeof localStorage !== "undefined" && localStorage ? localStorage : null;
  } catch (error) {
    return null;
  }
}

// Devuelve el array guardado, o null si la clave no existe o su contenido no es válido.
function leerColeccion(almacenamiento, clave) {
  try {
    const texto = almacenamiento.getItem(clave);
    if (texto === null) {
      return null;
    }
    const datos = JSON.parse(texto);
    return Array.isArray(datos) ? datos : null;
  } catch (error) {
    return null;
  }
}

function guardarColeccion(clave, coleccion, almacenamiento = obtenerAlmacenamiento()) {
  if (!almacenamiento) {
    return false;
  }
  try {
    almacenamiento.setItem(clave, JSON.stringify(coleccion));
    return true;
  } catch (error) {
    return false;
  }
}

// Primer inicio: guarda los ejemplos. Siguientes: reemplaza los ejemplos por lo
// guardado (no los suma), así no se duplican al recargar.
function cargarDatosGuardados(almacenamiento = obtenerAlmacenamiento()) {
  if (!almacenamiento) {
    return;
  }

  const colecciones = [
    [CLAVES_ALMACENAMIENTO.libros, libros],
    [CLAVES_ALMACENAMIENTO.clientes, clientes],
    [CLAVES_ALMACENAMIENTO.ventas, ventas],
  ];

  for (const [clave, coleccion] of colecciones) {
    const guardados = leerColeccion(almacenamiento, clave);
    if (guardados === null) {
      guardarColeccion(clave, coleccion, almacenamiento);
    } else {
      coleccion.splice(0, coleccion.length, ...guardados);
    }
  }
}

// ---------------------------------------------------------------------------
// Inicialización de cada vista
// ---------------------------------------------------------------------------

function aplicarFiltroCatalogo() {
  const buscador = document.getElementById("busqueda-titulo");
  if (buscador) {
    renderizarCatalogo(filtrarPorTitulo(libros, buscador.value));
  }
}

function inicializarCatalogo(buscador) {
  buscador.addEventListener("input", aplicarFiltroCatalogo);
  aplicarFiltroCatalogo();
}

function inicializarFormularioLibro(formLibro) {
  const mensajeLibro = document.getElementById("mensaje-libro-resultado");

  poblarOpcionesFormularioLibro();
  renderizarTablaLibros();

  formLibro.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const datos = {
      titulo: document.getElementById("libro-titulo").value,
      isbn: document.getElementById("libro-isbn").value,
      precio: document.getElementById("libro-precio").value,
      editorialId: document.getElementById("libro-editorial").value,
      generoId: document.getElementById("libro-genero").value || null,
      autorIds: obtenerIdsSeleccionados(
        document.querySelectorAll('#libro-autores input[name="autores"]')
      ),
    };

    const errores = validarLibro(datos);
    if (errores.length > 0) {
      mostrarMensaje(mensajeLibro, errores.join("\n"), "error");
      return;
    }

    const nuevoLibro = crearLibro(datos, libros);

    libros.push(nuevoLibro);
    const guardado = guardarColeccion(CLAVES_ALMACENAMIENTO.libros, libros);
    formLibro.reset();
    renderizarTablaLibros();
    aplicarFiltroCatalogo();
    refrescarOpcionesRelacionadas();
    mostrarMensaje(
      mensajeLibro,
      `Libro registrado con el identificador ${nuevoLibro.id}.${guardado ? "" : AVISO_SIN_GUARDAR}`
    );
  });
}

function inicializarFormularioCliente(formCliente) {
  const mensajeCliente = document.getElementById("mensaje-cliente-resultado");

  renderizarTablaClientes();

  formCliente.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const datos = {
      nombreCompleto: document.getElementById("cliente-nombre").value,
      email: document.getElementById("cliente-email").value,
    };

    const errores = validarCliente(datos, clientes);
    if (errores.length > 0) {
      mostrarMensaje(mensajeCliente, errores.join("\n"), "error");
      return;
    }

    const nuevoCliente = {
      id: generarSiguienteId(clientes, "cli"),
      nombre: datos.nombreCompleto.trim(),
      email: datos.email.trim(),
    };

    clientes.push(nuevoCliente);
    const guardado = guardarColeccion(CLAVES_ALMACENAMIENTO.clientes, clientes);
    formCliente.reset();
    renderizarTablaClientes();
    refrescarOpcionesRelacionadas();
    mostrarMensaje(
      mensajeCliente,
      `Cliente registrado con el identificador ${nuevoCliente.id}.${guardado ? "" : AVISO_SIN_GUARDAR}`
    );
  });
}

function agregarRenglonDesdeFormulario() {
  const selectLibro = document.getElementById("venta-libro");
  const inputCantidad = document.getElementById("venta-cantidad");
  const mensajeVenta = document.getElementById("mensaje-venta-resultado");

  const errores = validarRenglonNuevo(renglonesVenta, selectLibro.value, inputCantidad.value, libros);
  if (errores.length > 0) {
    mostrarMensaje(mensajeVenta, errores.join("\n"), "error");
    return;
  }

  const libro = libros.find((l) => l.id === selectLibro.value);
  renglonesVenta.push({ libroId: libro.id, cantidad: String(Number(inputCantidad.value)) });
  renderizarRenglonesVenta();

  selectLibro.value = "";
  inputCantidad.value = "1";
  selectLibro.focus();
  mostrarMensaje(mensajeVenta, `Se agregó «${libro.titulo}» a la venta.`);
}

function confirmarVenta(formVenta) {
  const mensajeVenta = document.getElementById("mensaje-venta-resultado");
  const clienteId = document.getElementById("venta-cliente").value;

  const errores = validarVenta(clienteId, renglonesVenta, clientes, libros);
  if (errores.length > 0) {
    mostrarMensaje(mensajeVenta, `No se confirmó la venta.\n${errores.join("\n")}`, "error");
    return;
  }

  const venta = crearVenta(clienteId, renglonesVenta, clientes, libros, ventas);
  ventas.push(venta);
  const guardado = guardarColeccion(CLAVES_ALMACENAMIENTO.ventas, ventas);

  renglonesVenta.length = 0;
  formVenta.reset();
  renderizarRenglonesVenta();
  renderizarHistorial();
  mostrarMensaje(
    mensajeVenta,
    `Venta ${venta.id} confirmada para ${venta.clienteNombre} por un total de ${formatearPrecio(venta.total)}.` +
      (guardado ? "" : AVISO_SIN_GUARDAR)
  );
}

function inicializarVentas(formVenta) {
  renderizarRenglonesVenta();

  document.getElementById("btn-agregar-renglon").addEventListener("click", agregarRenglonDesdeFormulario);

  // Enter dentro de un campo no confirma la venta: en "Cantidad" agrega el renglón.
  formVenta.addEventListener("keydown", (evento) => {
    if (evento.key !== "Enter" || evento.target.tagName !== "INPUT") {
      return;
    }
    evento.preventDefault();
    if (evento.target.id === "venta-cantidad") {
      agregarRenglonDesdeFormulario();
    }
  });

  formVenta.addEventListener("submit", (evento) => {
    evento.preventDefault();
    confirmarVenta(formVenta);
  });
}

function inicializar() {
  const buscador = document.getElementById("busqueda-titulo");
  const formLibro = document.getElementById("form-libro");
  const formCliente = document.getElementById("form-cliente");
  const formVenta = document.getElementById("form-venta");

  if (!buscador && !formLibro && !formCliente && !formVenta) {
    return;
  }

  cargarDatosGuardados();
  refrescarOpcionesRelacionadas();

  if (formLibro) {
    inicializarFormularioLibro(formLibro);
  }
  if (formCliente) {
    inicializarFormularioCliente(formCliente);
  }
  if (formVenta) {
    inicializarVentas(formVenta);
  }
  renderizarHistorial();
  if (buscador) {
    inicializarCatalogo(buscador);
  }
}

if (typeof document !== "undefined") {
  inicializar();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    inicializar,
    formatearPrecio,
    resolverEditorial,
    resolverGenero,
    resolverAutores,
    filtrarPorTitulo,
    normalizarTexto,
    normalizarIsbn,
    generarSiguienteId,
    validarLibro,
    validarCliente,
    crearLibro,
    emailValido,
    construirVistaFicha,
    renderizarCatalogo,
    actualizarEstado,
    mostrarMensaje,
    obtenerIdsSeleccionados,
    poblarOpcionesFormularioLibro,
    renderizarTablaLibros,
    renderizarTablaClientes,
    refrescarOpcionesRelacionadas,
    validarIntegridadReferencial,
    cantidadValida,
    calcularSubtotal,
    calcularTotal,
    calcularTotalEnCurso,
    validarRenglonNuevo,
    validarVenta,
    crearVenta,
    leerColeccion,
    guardarColeccion,
    cargarDatosGuardados,
    CLAVES_ALMACENAMIENTO,
    libros,
    editoriales,
    generos,
    autores,
    clientes,
    ventas,
  };
}
