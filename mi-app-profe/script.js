// 1. SELECTORES DEL DOM
const inputBuscador = document.getElementById('buscador');
const formulario = document.getElementById('formulario-alumno');
const inputNombre = document.getElementById('nombre');
const inputNota = document.getElementById('nota');
const listaAlumnos = document.getElementById('lista');
const totalAlumnosTxt = document.getElementById('total-alumnos');
const promedioGrupalTxt = document.getElementById('promedio-grupal');

// 2. ESTADO DE LA APLICACIÓN (Cargar desde localStorage o iniciar vacío)
let alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];

// 3. FUNCIONES

// Guarda la lista actualizada en el navegador
function guardarEnLocalStorage() {
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
}

// Calcula las estadísticas del curso (Total de alumnos y promedio general)
function actualizarEstadisticas() {
    // Actualizar cantidad total
    if (totalAlumnosTxt) {
        totalAlumnosTxt.textContent = alumnos.length;
    }

    // Calcular promedio general
    if (alumnos.length === 0) {
        if (promedioGrupalTxt) promedioGrupalTxt.textContent = "0.0";
        return;
    }
    const suma = alumnos.reduce((total, alumno) => total + alumno.nota, 0);
    const promedio = (suma / alumnos.length).toFixed(1);
    
    if (promedioGrupalTxt) {
        promedioGrupalTxt.textContent = promedio;
    }
}

// Renderiza los alumnos en la interfaz de usuario
function mostrarAlumnos() {
    // Limpiar el contenedor antes de renderizar
    listaAlumnos.innerHTML = '';

    // Si no hay alumnos, mostrar un mensaje amigable
    if (alumnos.length === 0) {
        listaAlumnos.innerHTML = `<li class="lista-vacia">No hay alumnos registrados aún.</li>`;
        actualizarEstadisticas();
        return;
    }

    // Generar los elementos de la lista de forma dinámica
    alumnos.forEach((alumno, index) => {
        const li = document.createElement('li');
        li.classList.add('alumno-item');

        // Condición visual: nota de 4.0 o superior aprueba (puedes cambiarla según tu sistema)
        const esAprobado = alumno.nota >= 4.0;
        const claseEstado = esAprobado ? 'nota-aprobado' : 'nota-reprobado';

        li.innerHTML = `
            <div class="alumno-info">
                <span class="alumno-nombre">${alumno.nombre}</span>
                <span class="alumno-nota ${claseEstado}">Nota: ${alumno.nota.toFixed(1)}</span>
            </div>
            <button class="btn-eliminar" onclick="eliminarAlumno(${index})" title="Eliminar alumno">❌</button>
        `;
        
        listaAlumnos.appendChild(li);
    });

    actualizarEstadisticas();
}

// Registra un nuevo estudiante
function registrarAlumno(e) {
    e.preventDefault(); // Detener la recarga automática del formulario

    const nombre = inputNombre.value.trim();
    const nota = parseFloat(inputNota.value);

    // Validación de seguridad adicional
    if (nombre === '' || isNaN(nota) || nota < 0 || nota > 10) {
        alert('Por favor, ingresa datos válidos. La nota debe ser de 0 a 10.');
        return;
    }

    // Guardar en la estructura de datos
    const nuevoAlumno = { nombre, nota };
    alumnos.push(nuevoAlumno);

    // Persistir y refrescar interfaz
    guardarEnLocalStorage();
    mostrarAlumnos();

    // Limpiar campos del formulario automáticamente
    formulario.reset();
    inputNombre.focus(); // Devolver el foco al nombre para agilidad
}

// Elimina un estudiante de la lista por su índice
window.eliminarAlumno = function(index) {
    // Confirmación opcional para evitar accidentes
    if (confirm(`¿Estás seguro de que deseas eliminar este registro?`)) {
        alumnos.splice(index, 1);
        guardarEnLocalStorage();
        mostrarAlumnos();
    }
}

// 4. INICIALIZACIÓN DE EVENTOS
formulario.addEventListener('submit', registrarAlumno);

// Cargar la aplicación al iniciar la página
document.addEventListener('DOMContentLoaded', mostrarAlumnos);

