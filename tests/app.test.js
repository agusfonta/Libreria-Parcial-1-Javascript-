const test = require("node:test");
const assert = require("node:assert");

const app = require("../js/app.js");

test("el módulo se carga en Node sin errores", () => {
  assert.strictEqual(typeof app.inicializar, "function");
});

test("las colecciones del modelo existen con la cantidad mínima", () => {
  assert.ok(app.libros.length >= 6, "debe haber al menos 6 libros");
  assert.ok(app.editoriales.length >= 2, "debe haber al menos 2 editoriales");
  assert.ok(app.generos.length >= 2, "debe haber al menos 2 géneros");
  assert.ok(app.autores.length >= 3, "debe haber al menos 3 autores");
  assert.ok(app.clientes.length >= 3, "debe haber al menos 3 clientes");
});

test("cada elemento tiene id string no vacío y sin repetidos", () => {
  for (const coleccion of [app.libros, app.editoriales, app.generos, app.autores, app.clientes]) {
    const ids = coleccion.map((elemento) => elemento.id);
    for (const id of ids) {
      assert.strictEqual(typeof id, "string");
      assert.ok(id.length > 0);
    }
    assert.strictEqual(new Set(ids).size, ids.length, "no debe haber ids repetidos");
  }
});

test("integridad referencial: editorial y autores de cada libro existen", () => {
  const idsEditoriales = new Set(app.editoriales.map((e) => e.id));
  const idsAutores = new Set(app.autores.map((a) => a.id));
  for (const libro of app.libros) {
    assert.ok(idsEditoriales.has(libro.editorialId), `editorialId ${libro.editorialId} inexistente`);
    assert.ok(Array.isArray(libro.autorIds) && libro.autorIds.length >= 1, "autorIds debe tener al menos un autor");
    for (const autorId of libro.autorIds) {
      assert.ok(idsAutores.has(autorId), `autor ${autorId} inexistente`);
    }
  }
});

test("integridad referencial: generoId es null o un género existente", () => {
  const idsGeneros = new Set(app.generos.map((g) => g.id));
  for (const libro of app.libros) {
    if (libro.generoId !== null) {
      assert.ok(idsGeneros.has(libro.generoId), `generoId ${libro.generoId} inexistente`);
    }
    assert.notStrictEqual(libro.generoId, "Sin clasificar", "los datos no deben guardar el texto de presentación");
  }
});

test("validarIntegridadReferencial() no reporta problemas con el modelo de ejemplo", () => {
  assert.deepStrictEqual(app.validarIntegridadReferencial(), []);
});

test("formatearPrecio formatea miles con punto y decimales con coma", () => {
  assert.strictEqual(app.formatearPrecio(1500), "$ 1.500,00");
  assert.strictEqual(app.formatearPrecio(3000), "$ 3.000,00");
});

test("formatearPrecio siempre muestra dos decimales", () => {
  assert.strictEqual(app.formatearPrecio(500), "$ 500,00");
  assert.strictEqual(app.formatearPrecio(950), "$ 950,00");
});

test("resolverEditorial devuelve el nombre de la editorial por id", () => {
  assert.strictEqual(app.resolverEditorial("ed-1"), "Sudamericana");
  assert.strictEqual(app.resolverEditorial("ed-2"), "Alfaguara");
});

test("resolverGenero devuelve el nombre o «Sin clasificar» cuando es null", () => {
  assert.strictEqual(app.resolverGenero("gen-1"), "Novela");
  assert.strictEqual(app.resolverGenero("gen-2"), "Cuento");
  assert.strictEqual(app.resolverGenero(null), "Sin clasificar");
});

test("resolverAutores devuelve un autor o varios autores unidos", () => {
  assert.strictEqual(app.resolverAutores(["aut-1"]), "Julio Cortázar");
  assert.strictEqual(app.resolverAutores(["aut-2", "aut-3"]), "Jorge Luis Borges, Adolfo Bioy Casares");
});

test("construirVistaFicha resuelve y formatea los seis campos de un libro", () => {
  const ficha = app.construirVistaFicha({
    id: "lib-1",
    titulo: "Rayuela",
    isbn: "978-0-00-000001-1",
    editorialId: "ed-1",
    generoId: "gen-1",
    autorIds: ["aut-1"],
    precio: 1500,
  });
  assert.strictEqual(ficha.titulo, "Rayuela");
  assert.strictEqual(ficha.isbn, "978-0-00-000001-1");
  assert.strictEqual(ficha.editorial, "Sudamericana");
  assert.strictEqual(ficha.genero, "Novela");
  assert.strictEqual(ficha.autores, "Julio Cortázar");
  assert.strictEqual(ficha.precio, "$ 1.500,00");
});

test("construirVistaFicha muestra «Sin clasificar» y todos los autores", () => {
  const ficha = app.construirVistaFicha({
    id: "lib-3",
    titulo: "Antología fantástica",
    isbn: "978-0-00-000003-5",
    editorialId: "ed-1",
    generoId: null,
    autorIds: ["aut-2", "aut-3"],
    precio: 2500,
  });
  assert.strictEqual(ficha.genero, "Sin clasificar");
  assert.strictEqual(ficha.autores, "Jorge Luis Borges, Adolfo Bioy Casares");
  assert.strictEqual(ficha.precio, "$ 2.500,00");
});

test("filtrarPorTitulo devuelve solo los libros cuyo título contiene el término", () => {
  const resultados = app.filtrarPorTitulo(app.libros, "aleph");
  assert.deepStrictEqual(resultados.map((l) => l.id), ["lib-2"]);
});

test("filtrarPorTitulo ignora mayúsculas, minúsculas y espacios sobrantes", () => {
  const minusculas = app.filtrarPorTitulo(app.libros, "rayuela").map((l) => l.id);
  const mayusculas = app.filtrarPorTitulo(app.libros, "RAYUELA").map((l) => l.id);
  const mezcladas = app.filtrarPorTitulo(app.libros, "RaYuElA").map((l) => l.id);
  const conEspacios = app.filtrarPorTitulo(app.libros, "  rayuela  ").map((l) => l.id);
  assert.deepStrictEqual(minusculas, ["lib-1"]);
  assert.deepStrictEqual(mayusculas, minusculas);
  assert.deepStrictEqual(mezcladas, minusculas);
  assert.deepStrictEqual(conEspacios, minusculas);
});

test("filtrarPorTitulo con búsqueda vacía o solo espacios muestra todo", () => {
  assert.strictEqual(app.filtrarPorTitulo(app.libros, "").length, app.libros.length);
  assert.strictEqual(app.filtrarPorTitulo(app.libros, "   ").length, app.libros.length);
});

test("filtrarPorTitulo devuelve lista vacía cuando no hay coincidencias", () => {
  assert.deepStrictEqual(app.filtrarPorTitulo(app.libros, "zzzz"), []);
});

test("filtrarPorTitulo ignora los acentos del título y de la búsqueda", () => {
  assert.deepStrictEqual(app.filtrarPorTitulo(app.libros, "antologia").map((l) => l.id), ["lib-3"]);
  assert.deepStrictEqual(app.filtrarPorTitulo(app.libros, "ANTOLOGÍA").map((l) => l.id), ["lib-3"]);
  assert.deepStrictEqual(app.filtrarPorTitulo(app.libros, "  Antología  ").map((l) => l.id), ["lib-3"]);
});

test("el modelo incluye un libro con varios autores y uno sin género", () => {
  assert.ok(app.libros.some((l) => l.autorIds.length > 1), "debe haber un libro con más de un autor");
  assert.ok(app.libros.some((l) => l.generoId === null), "debe haber un libro sin género");
  assert.ok(app.libros.every((l) => typeof l.precio === "number"), "el precio debe ser número");
});

test("generarSiguienteId devuelve lib-7 existiendo lib-1 a lib-6", () => {
  assert.strictEqual(app.generarSiguienteId(app.libros, "lib"), "lib-7");
});

test("normalizarIsbn iguala el mismo ISBN con guiones y con espacios", () => {
  assert.strictEqual(app.normalizarIsbn("978-0-00-000001-1"), app.normalizarIsbn("978 0 00 000001 1"));
});

test("generarSiguienteId devuelve cli-4 existiendo cli-1 a cli-3", () => {
  assert.strictEqual(app.generarSiguienteId(app.clientes, "cli"), "cli-4");
});

test("generarSiguienteId ignora los ids con un prefijo distinto", () => {
  const coleccion = [{ id: "lib-9" }, { id: "ed-7" }, { id: "cli-2" }, { id: "x" }];
  assert.strictEqual(app.generarSiguienteId(coleccion, "cli"), "cli-3");
});

test("generarSiguienteId ignora ids con sufijo no numérico", () => {
  const coleccion = [{ id: "lib-a" }, { id: "lib-4" }, { id: "lib-" }];
  assert.strictEqual(app.generarSiguienteId(coleccion, "lib"), "lib-5");
});

test("dos altas consecutivas no colisionan", () => {
  const coleccion = app.libros.map((l) => ({ id: l.id }));
  const primero = app.generarSiguienteId(coleccion, "lib");
  coleccion.push({ id: primero });
  const segundo = app.generarSiguienteId(coleccion, "lib");
  assert.strictEqual(primero, "lib-7");
  assert.strictEqual(segundo, "lib-8");
  assert.notStrictEqual(primero, segundo);
});

test("normalizarIsbn ignora mayúsculas (x de ISBN-10) y espacios en los extremos", () => {
  assert.strictEqual(app.normalizarIsbn(" 0-8044-2957-X "), "080442957x");
  assert.strictEqual(app.normalizarIsbn("0-8044-2957-X"), app.normalizarIsbn("080442957X"));
});

const libroValido = () => ({
  titulo: "Nuevo libro",
  isbn: "978-0-00-000099-9",
  precio: 1200,
  editorialId: "ed-1",
  generoId: "gen-1",
  autorIds: ["aut-1"],
});

test("validarLibro acepta un libro válido devolviendo []", () => {
  assert.deepStrictEqual(app.validarLibro(libroValido()), []);
});

test("validarLibro rechaza título vacío o solo espacios", () => {
  assert.ok(app.validarLibro({ ...libroValido(), titulo: "" }).some((m) => /título/i.test(m)));
  assert.ok(app.validarLibro({ ...libroValido(), titulo: "   " }).some((m) => /título/i.test(m)));
});

test("validarLibro rechaza ISBN vacío", () => {
  assert.ok(app.validarLibro({ ...libroValido(), isbn: "  " }).some((m) => /isbn/i.test(m)));
});

test("validarLibro rechaza precio no numérico", () => {
  assert.ok(app.validarLibro({ ...libroValido(), precio: "abc" }).some((m) => /precio/i.test(m)));
});

test("validarLibro rechaza precio menor o igual a cero", () => {
  assert.ok(app.validarLibro({ ...libroValido(), precio: 0 }).some((m) => /precio/i.test(m)));
  assert.ok(app.validarLibro({ ...libroValido(), precio: -5 }).some((m) => /precio/i.test(m)));
});

test("validarLibro rechaza un ISBN duplicado aunque cambien los separadores", () => {
  const errores = app.validarLibro({ ...libroValido(), isbn: "978 0 00 000001 1" });
  assert.ok(errores.some((m) => /isbn/i.test(m)));
});

test("validarLibro acepta un ISBN distinto al de los libros existentes", () => {
  assert.deepStrictEqual(app.validarLibro({ ...libroValido(), isbn: "999-9-99-999999-9" }), []);
});

test("validarLibro rechaza editorial vacía o inexistente", () => {
  assert.ok(app.validarLibro({ ...libroValido(), editorialId: "" }).some((m) => /editorial/i.test(m)));
  assert.ok(app.validarLibro({ ...libroValido(), editorialId: "ed-99" }).some((m) => /editorial/i.test(m)));
});

test("validarLibro rechaza cuando no hay ningún autor seleccionado", () => {
  assert.ok(app.validarLibro({ ...libroValido(), autorIds: [] }).some((m) => /autor/i.test(m)));
});

test("validarLibro rechaza cuando algún autor seleccionado no existe", () => {
  assert.ok(
    app.validarLibro({ ...libroValido(), autorIds: ["aut-1", "aut-99"] }).some((m) => /autor/i.test(m))
  );
});

test("validarLibro permite género null (Sin clasificar)", () => {
  assert.deepStrictEqual(app.validarLibro({ ...libroValido(), generoId: null }), []);
});

test("validarLibro rechaza un género inexistente", () => {
  assert.ok(app.validarLibro({ ...libroValido(), generoId: "gen-99" }).some((m) => /género/i.test(m)));
});

test("validarLibro permite varios autores existentes", () => {
  assert.deepStrictEqual(app.validarLibro({ ...libroValido(), autorIds: ["aut-1", "aut-2"] }), []);
});

const clienteValido = () => ({
  nombreCompleto: "Juan Pérez",
  email: "juan.perez@example.com",
});

test("validarCliente acepta un cliente válido devolviendo []", () => {
  assert.deepStrictEqual(app.validarCliente(clienteValido(), app.clientes), []);
});

test("validarCliente rechaza nombre completo vacío o solo espacios", () => {
  assert.ok(app.validarCliente({ ...clienteValido(), nombreCompleto: "" }, app.clientes).some((m) => /nombre/i.test(m)));
  assert.ok(app.validarCliente({ ...clienteValido(), nombreCompleto: "   " }, app.clientes).some((m) => /nombre/i.test(m)));
});

test("validarCliente rechaza email vacío", () => {
  assert.ok(app.validarCliente({ ...clienteValido(), email: "" }, app.clientes).some((m) => /email/i.test(m)));
});

test("validarCliente rechaza email sin @", () => {
  assert.ok(app.validarCliente({ ...clienteValido(), email: "juan.example.com" }, app.clientes).some((m) => /email/i.test(m)));
});

test("validarCliente rechaza email sin dominio", () => {
  assert.ok(app.validarCliente({ ...clienteValido(), email: "juan@" }, app.clientes).some((m) => /email/i.test(m)));
});

test("validarCliente rechaza email con solo @", () => {
  assert.ok(app.validarCliente({ ...clienteValido(), email: "@" }, app.clientes).some((m) => /email/i.test(m)));
});

test("validarCliente rechaza email duplicado con trim y sin distinguir mayúsculas", () => {
  const errores = app.validarCliente({ ...clienteValido(), email: " Ana.Gomez@Example.com " }, app.clientes);
  assert.ok(errores.some((m) => /email/i.test(m)));
});

test("validarCliente acepta email único válido", () => {
  assert.deepStrictEqual(
    app.validarCliente({ nombreCompleto: "Laura Ruiz", email: "laura.ruiz@example.org" }, app.clientes),
    []
  );
});

test("obtenerIdsSeleccionados devuelve solo los values de las casillas tildadas", () => {
  const casillas = [
    { value: "aut-1", checked: true },
    { value: "aut-2", checked: false },
    { value: "aut-3", checked: true },
  ];
  assert.deepStrictEqual(app.obtenerIdsSeleccionados(casillas), ["aut-1", "aut-3"]);
});

test("obtenerIdsSeleccionados devuelve [] con lista vacía o sin casillas tildadas", () => {
  assert.deepStrictEqual(app.obtenerIdsSeleccionados([]), []);
  assert.deepStrictEqual(
    app.obtenerIdsSeleccionados([
      { value: "aut-1", checked: false },
      { value: "aut-2", checked: false },
    ]),
    []
  );
});

test("obtenerIdsSeleccionados preserva el orden de las casillas", () => {
  const casillas = [
    { value: "aut-3", checked: true },
    { value: "aut-1", checked: true },
    { value: "aut-2", checked: true },
  ];
  assert.deepStrictEqual(app.obtenerIdsSeleccionados(casillas), ["aut-3", "aut-1", "aut-2"]);
});

test("obtenerIdsSeleccionados devuelve una sola casilla tildada", () => {
  const casillas = [
    { value: "aut-1", checked: false },
    { value: "aut-2", checked: true },
    { value: "aut-3", checked: false },
  ];
  assert.deepStrictEqual(app.obtenerIdsSeleccionados(casillas), ["aut-2"]);
});

test("crearLibro normaliza ISBN con guiones", () => {
  const resultado = app.crearLibro(
    { titulo: " X ", isbn: "978-0-00-000004-2", precio: "1500", editorialId: "ed-1", generoId: "", autorIds: ["aut-1"] },
    app.libros
  );
  assert.equal(resultado.isbn, "9780000000042");
  assert.equal(resultado.titulo, "X");
  assert.equal(resultado.precio, 1500);
  assert.equal(resultado.generoId, null);
  assert.equal(resultado.id, "lib-7");
});

test("crearLibro normaliza ISBN con espacios", () => {
  const resultado = app.crearLibro(
    { titulo: "Libro", isbn: "978 0 00 000004 2", precio: 1000, editorialId: "ed-2", generoId: "", autorIds: ["aut-2"] },
    app.libros
  );
  assert.equal(resultado.isbn, "9780000000042");
});

test("crearLibro normaliza ISBN-10 con X", () => {
  const resultado = app.crearLibro(
    { titulo: "Otro", isbn: "0-8044-2957-X", precio: 500, editorialId: "ed-1", generoId: "gen-1", autorIds: ["aut-1"] },
    app.libros
  );
  assert.equal(resultado.isbn, "080442957x");
  assert.equal(resultado.generoId, "gen-1");
});