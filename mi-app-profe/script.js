let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];

mostrarAlumnos();

function agregarAlumno() {
  let nombre = document.getElementById("nombre").value;
  let nota = document.getElementById("nota").value;

  if (nombre === "" || nota === "") return;

  alumnos.push({ nombre, nota });

  guardarDatos();
  mostrarAlumnos();
}

function mostrarAlumnos() {
  let lista = document.getElementById("lista");
  lista.innerHTML = "";

  alumnos.forEach((alumno, index) => {
    let li = document.createElement("li");
    li.textContent = alumno.nombre + " - Nota: " + alumno.nota;

    // Botón eliminar 👇
    let btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => eliminarAlumno(index);

    li.appendChild(btn);
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
