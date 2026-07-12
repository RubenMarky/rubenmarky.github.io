// 1. SELECTORES DEL DOM (Ajusta los IDs según tu index.html)
const formulario = document.getElementById('formulario-alumno'); // Tu formulario
const inputNombre = document.getElementById('input-nombre');     // Input del nombre
const inputNota = document.getElementById('input-nota');         // Input de la nota
const listaAlumnos = document.getElementById('lista-alumnos');   // Contenedor/Tabla donde se muestran
const promedioGrupalTxt = document.getElementById('promedio-grupal'); // Texto para el promedio total

// 2. ESTADO DE LA APLICACIÓN (Cargar de localStorage o iniciar vacío)
let alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];

// 3. FUNCIONES

// Guarda la lista en el navegador
function guardarEnLocalStorage() {
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
}

// Calcula y muestra el promedio de todo el curso
function actualizarPromedioGeneral() {
    if (alumnos.length === 0) {
        if (promedioGrupalTxt) promedioGrupalTxt.textContent = "0.0";
        return;
    }
    const suma = alumnos.reduce((total, alumno) => total + alumno.nota, 0);
    const promedio = (suma / alumnos.length).toFixed(1);
    if (promedioGrupalTxt) promedioGrupalTxt.textContent = promedio;
}

// Renderiza los alumnos en el HTML
function mostrarAlumnos() {
    // Limpiar contenedor antes de volver a pintar
    listaAlumnos.innerHTML = '';

    alumnos.forEach((alumno, index) => {
        const elemento = document.createElement('div');
        elemento.classList.add('alumno-card');

        // Condición visual: nota mayor o igual a 4 aprueba (puedes cambiar el 4 por un 6 o 7)
        const esAprobado = alumno.nota >= 4;
        const claseEstado = esAprobado ? 'nota-aprobado' : 'nota-reprobado';

        // Estructura interna de cada fila o tarjeta de alumno
        elemento.innerHTML = `
            <span><strong>${alumno.nombre}</strong></span>
            <span class="${claseEstado}">Nota: ${alumno.nota}</span>
            <button onclick="eliminarAlumno(${index})">❌</button>
        `;
        
        listaAlumnos.appendChild(elemento);
    });

    actualizarPromedioGeneral();
}

// Agrega un nuevo alumno
function agregarAlumno(e) {
    e.preventDefault(); // Evitar que la página se recargue

    const nombre = inputNombre.value.trim();
    const nota = parseFloat(inputNota.value);

    // Validación básica
    if (nombre === '' || isNaN(nota) || nota < 0 || nota > 10) {
        alert('Por favor, ingresa un nombre válido y una nota entre 0 y 10.');
        return;
    }

    const nuevoAlumno = { nombre, nota };
    alumnos.push(nuevoAlumno);

    guardarEnLocalStorage();
    mostrarAlumnos();

    // Limpiar formulario
    formulario.reset();
}

// Elimina un alumno por su índice
window.eliminarAlumno = function(index) {
    alumnos.splice(index, 1);
    guardarEnLocalStorage();
    mostrarAlumnos();
}

// 4. EVENTOS Y ARRANQUE
formulario.addEventListener('submit', agregarAlumno);

// Arrancar la app mostrando lo que ya esté guardado
document.addEventListener('DOMContentLoaded', mostrarAlumnos);
