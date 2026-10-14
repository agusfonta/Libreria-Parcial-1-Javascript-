// Librería Pampa - lógica de la aplicación. Vacía en el Ejercicio 1; la lógica llega en los Ejercicios 3 a 6.
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
    titulo: "Cuentos de la selva",
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

function mostrarMensaje(contenedor, texto) {
  if (!contenedor) {
    return;
  }
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
}

function refrescarOpcionesRelacionadas() {
  const selectVentaLibro = document.getElementById("venta-libro");
  const selectVentaCliente = document.getElementById("venta-cliente");

  if (selectVentaLibro) {
    selectVentaLibro.replaceChildren();
    selectVentaLibro.appendChild(crearOpcion("", "Seleccioná un libro"));
    for (const libro of libros) {
      selectVentaLibro.appendChild(crearOpcion(libro.id, libro.titulo));
    }
  }

  if (selectVentaCliente) {
    selectVentaCliente.replaceChildren();
    selectVentaCliente.appendChild(crearOpcion("", "Seleccioná un cliente"));
    for (const cliente of clientes) {
      selectVentaCliente.appendChild(crearOpcion(cliente.id, cliente.nombre));
    }
  }
}

function inicializar() {
  const buscador = document.getElementById("busqueda-titulo");
  const formLibro = document.getElementById("form-libro");
  const formCliente = document.getElementById("form-cliente");

  if (!buscador && !formLibro && !formCliente) {
    return;
  }

  const aplicarFiltro = () => {
    if (buscador) {
      renderizarCatalogo(filtrarPorTitulo(libros, buscador.value));
    }
  };

  if (formLibro) {
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
        mostrarMensaje(mensajeLibro, errores.join("\n"));
        return;
      }

      const nuevoLibro = crearLibro(datos, libros);

      libros.push(nuevoLibro);
      formLibro.reset();
      renderizarTablaLibros();
      aplicarFiltro();
      refrescarOpcionesRelacionadas();
      mostrarMensaje(mensajeLibro, `Libro registrado con el identificador ${nuevoLibro.id}.`);
    });
  }

  if (formCliente) {
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
        mostrarMensaje(mensajeCliente, errores.join("\n"));
        return;
      }

      const nuevoCliente = {
        id: generarSiguienteId(clientes, "cli"),
        nombre: datos.nombreCompleto.trim(),
        email: datos.email.trim(),
      };

      clientes.push(nuevoCliente);
      formCliente.reset();
      renderizarTablaClientes();
      refrescarOpcionesRelacionadas();
      mostrarMensaje(mensajeCliente, `Cliente registrado con el identificador ${nuevoCliente.id}.`);
    });
  }

  if (buscador) {
    buscador.addEventListener("input", aplicarFiltro);
    aplicarFiltro();
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
    libros,
    editoriales,
    generos,
    autores,
    clientes,
  };
}
