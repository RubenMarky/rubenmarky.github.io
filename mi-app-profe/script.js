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

// Renderiza los alumnos en la interfaz de usuario (soporta filtros)
function mostrarAlumnos(textoFiltro = '') {
    // Limpiar el contenedor antes de renderizar
    listaAlumnos.innerHTML = '';

    // Filtrar el arreglo original según lo que escriba el usuario
    const alumnosFiltrados = alumnos.filter(alumno => 
        alumno.nombre.toLowerCase().includes(textoFiltro.toLowerCase())
    );

    // Si no hay alumnos en el arreglo general
    if (alumnos.length === 0) {
        listaAlumnos.innerHTML = `<li class="lista-vacia">No hay alumnos registrados aún.</li>`;
        actualizarEstadisticas();
        return;
    }

    // Si el filtro no coincide con ningún estudiante
    if (alumnosFiltrados.length === 0) {
        listaAlumnos.innerHTML = `<li class="lista-vacia">No se encontraron alumnos que coincidan con "${textoFiltro}".</li>`;
        return; 
        // Nota: No llamamos a actualizarEstadisticas() aquí para que el promedio global del curso no se altere al buscar
    }

    // Generar los elementos usando la lista filtrada
    alumnosFiltrados.forEach((alumno) => {
        // Encontrar el índice real en el arreglo original para que el botón eliminar borre al alumno correcto
        const indexReal = alumnos.findIndex(a => a === alumno);

        const li = document.createElement('li');
        li.classList.add('alumno-item');

        const esAprobado = alumno.nota >= 4.0;
        const claseEstado = esAprobado ? 'nota-aprobado' : 'nota-reprobado';

        li.innerHTML = `
            <div class="alumno-info">
                <span class="alumno-nombre">${alumno.nombre}</span>
                <span class="alumno-nota ${claseEstado}">Nota: ${alumno.nota.toFixed(1)}</span>
            </div>
            <button class="btn-eliminar" onclick="eliminarAlumno(${indexReal})" title="Eliminar alumno">❌</button>
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

// Escuchar la escritura en la barra de búsqueda
inputBuscador.addEventListener('input', (e) => {
    const texto = e.target.value;
    mostrarAlumnos(texto);
});


