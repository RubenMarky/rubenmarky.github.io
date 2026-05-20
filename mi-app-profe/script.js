let alumnos = [];

function agregarAlumno() {
  let nombre = document.getElementById("nombre").value;
  let nota = document.getElementById("nota").value;

  if(nombre === "" || nota === "") return;

  alumnos.push({ nombre, nota });

  mostrarAlumnos();
}

function mostrarAlumnos() {
  let lista = document.getElementById("lista");
  lista.innerHTML = "";

  alumnos.forEach(alumno => {
    let li = document.createElement("li");
    li.textContent = alumno.nombre + " - Nota: " + alumno.nota;
    lista.appendChild(li);
  });
}