let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
let editandoIndex = null;

mostrarAlumnos();

function agregarAlumno() {
  let nombre = document.getElementById("nombre").value;
  let nota = document.getElementById("nota").value;

  if (nombre === "" || nota === "") return;

  if (editandoIndex !== null) {
    // ✏️ Editar
    alumnos[editandoIndex] = { nombre, nota };
    editandoIndex = null;
  } else {
    // ➕ Agregar
    alumnos.push({ nombre, nota });
  }

  guardarDatos();
  mostrarAlumnos();

  // limpiar inputs
  document.getElementById("nombre").value = "";
  document.getElementById("nota").value = "";
}

function mostrarAlumnos() {
  let lista = document.getElementById("lista");
  lista.innerHTML = "";

  alumnos.forEach((alumno, index) => {
    let li = document.createElement("li");
    li.textContent = alumno.nombre + " - Nota: " + alumno.nota;

function eliminarAlumno(index) {
  let confirmar = confirm("¿Estás seguro que querés eliminar este alumno?");

  if (confirmar) {
    alumnos.splice(index, 1);
    guardarDatos();
    mostrarAlumnos();
  }
}

    // ✏️ editar
    let btnEditar = document.createElement("button");
    btnEditar.textContent = "✏️";
    btnEditar.onclick = () => editarAlumno(index);

    li.appendChild(btnEditar);
    li.appendChild(btnEliminar);

    lista.appendChild(li);
  });
}

function guardarDatos() {
  localStorage.setItem("alumnos", JSON.stringify(alumnos));
}

function eliminarAlumno(index) {
  alumnos.splice(index, 1);
  guardarDatos();
  mostrarAlumnos();
}

function editarAlumno(index) {
  let alumno = alumnos[index];

  document.getElementById("nombre").value = alumno.nombre;
  document.getElementById("nota").value = alumno.nota;

  editandoIndex = index;
}
