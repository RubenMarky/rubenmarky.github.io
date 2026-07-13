// 1. SELECTORES DEL DOM
const formulario = document.getElementById('formulario-alumno');
const inputNombre = document.getElementById('nombre');
const inputNota = document.getElementById('nota');
const checkAsistencia = document.getElementById('asistencia'); // Nuevo
const inputBuscador = document.getElementById('buscador');
const btnExportar = document.getElementById('btn-exportar');
const listaAlumnos = document.getElementById('lista');
const totalAlumnosTxt = document.getElementById('total-alumnos');
const promedioGrupalTxt = document.getElementById('promedio-grupal');

// 2. ESTADO DE LA APLICACIÓN
let alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];

// 3. FUNCIONES

function guardarEnLocalStorage() {
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
}

function actualizarEstadisticas() {
    if (totalAlumnosTxt) totalAlumnosTxt.textContent = alumnos.length;

    if (alumnos.length === 0) {
        if (promedioGrupalTxt) promedioGrupalTxt.textContent = "0.0";
        return;
    }
    const suma = alumnos.reduce((total, alumno) => total + alumno.nota, 0);
    const promedio = (suma / alumnos.length).toFixed(1);
    if (promedioGrupalTxt) promedioGrupalTxt.textContent = promedio;
}

function mostrarAlumnos(textoFiltro = '') {
    listaAlumnos.innerHTML = '';

    const alumnosFiltrados = alumnos.filter(alumno => 
        alumno.nombre.toLowerCase().includes(textoFiltro.toLowerCase())
    );

    if (alumnos.length === 0) {
        listaAlumnos.innerHTML = `<li class="lista-vacia">No hay alumnos registrados aún.</li>`;
        actualizarEstadisticas();
        return;
    }

    if (alumnosFiltrados.length === 0) {
        listaAlumnos.innerHTML = `<li class="lista-vacia">No se encontraron alumnos que coincidan con "${textoFiltro}".</li>`;
        return; 
    }

    alumnosFiltrados.forEach((alumno) => {
        const indexReal = alumnos.findIndex(a => a === alumno);
        const li = document.createElement('li');
        li.classList.add('alumno-item');

        const esAprobado = alumno.nota >= 4.0;
        const claseEstado = esAprobado ? 'nota-aprobado' : 'nota-reprobado';
        
        // Indicador visual de asistencia
        const textoAsistencia = alumno.asistencia ? 'Presente' : 'Ausente';
        const claseAsistencia = alumno.asistencia ? 'asistio-si' : 'asistio-no';

        li.innerHTML = `
            <div class="alumno-info">
                <span class="alumno-nombre">${alumno.nombre}</span>
                <div class="alumno-badges">
                    <span class="alumno-nota ${claseEstado}">Nota: ${alumno.nota.toFixed(1)}</span>
                    <span class="alumno-asistencia ${claseAsistencia}">${textoAsistencia}</span>
                </div>
            </div>
            <button class="btn-eliminar" onclick="eliminarAlumno(${indexReal})" title="Eliminar alumno">❌</button>
        `;
        
        listaAlumnos.appendChild(li);
    });

    actualizarEstadisticas();
}

function registrarAlumno(e) {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const nota = parseFloat(inputNota.value);
    const asistencia = checkAsistencia.checked; // Guardar verdadero/falso

    if (nombre === '' || isNaN(nota) || nota < 0 || nota > 10) {
        alert('Por favor, ingresa datos válidos.');
        return;
    }

    // Objeto actualizado con la propiedad asistencia
    const nuevoAlumno = { nombre, nota, asistencia };
    alumnos.push(nuevoAlumno);

    guardarEnLocalStorage();
    mostrarAlumnos(inputBuscador.value);

    formulario.reset();
    inputNombre.focus();
}

window.eliminarAlumno = function(index) {
    if (confirm(`¿Estás seguro de que deseas eliminar este registro?`)) {
        alumnos.splice(index, 1);
        guardarEnLocalStorage();
        mostrarAlumnos(inputBuscador.value);
    }
}

// Exportación corregida incluyendo la columna Asistencia
function exportarAExcel() {
    if (alumnos.length === 0) {
        alert("No hay alumnos registrados para exportar.");
        return;
    }

    let contenidoCSV = "data:text/csv;charset=utf-8,\uFEFF";
    contenidoCSV += "Nombre Completo;Nota Final;Estado;Asistencia\n";

    alumnos.forEach(alumno => {
        const estado = alumno.nota >= 4.0 ? "Aprobado" : "Reprobado";
        const asistenciaTexto = alumno.asistencia ? "Presente" : "Ausente";
        contenidoCSV += `${alumno.nombre};${alumno.nota.toFixed(1)};${estado};${asistenciaTexto}\n`;
    });

    const URI_codificada = encodeURI(contenidoCSV);
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.setAttribute("href", URI_codificada);
    enlaceDescarga.setAttribute("download", "reporte_notas_asistencia.csv");
    
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
}

// EVENTOS
formulario.addEventListener('submit', registrarAlumno);
inputBuscador.addEventListener('input', (e) => mostrarAlumnos(e.target.value));
btnExportar.addEventListener('click', exportarAExcel);

document.addEventListener('DOMContentLoaded', () => mostrarAlumnos());
