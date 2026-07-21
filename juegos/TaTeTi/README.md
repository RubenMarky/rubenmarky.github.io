# 🎮 Tatetí Premium (Tic-Tac-Toe Neumorphic Edition)

Un videojuego moderno, elegante y minimalista de Tatetí (Tres en Raya) diseñado bajo la estética **Neumórfica (Neumorphism)** en modo oscuro permanente, enriquecido con efectos de luz neón, sonido sintetizado en tiempo real e inteligencia artificial avanzada.

Este proyecto está construido en un **único archivo standalone (`tateti.html`)**, lo que significa que es 100% autoportante, funciona completamente offline y no requiere de librerías ni conexiones externas para desplegar todo su potencial.

## ✨ Características Principales

*   **Estética Neumórfica Oscura**: Interfaz premium basada en fondos oscuros profundos, relieves físicos simulados mediante sombras meticulosas y acentos neón vibrantes en azul y violeta.
*   **Ecosistema de Tableros Dinámicos**: Permite seleccionar entre tres modalidades de juego con grillas geométricas perfectas que adaptan su tamaño de fuente y SVG de manera automática:
    *   **Clásico (3x3)**: Victoria con 3 en línea.
    *   **Avanzado (4x4)**: Victoria con 4 en línea.
    *   **Experto (5x5)**: Victoria con 4 en línea.
*   **Inteligencia Artificial Avanzada (Vs CPU)**: 
    *   *Fácil*: Movimientos mayormente aleatorios.
    *   *Normal*: Heurística básica de ataque y bloqueo.
    *   *Difícil*: Algoritmo Minimax matemático (imbatible) en 3x3, y una heurística optimizada basada en puntuación de líneas para tableros grandes (4x4/5x5), garantizando jugadas inteligentes en menos de 500ms y sin lag.
*   **Modo de Juego Relámpago (Blitz)**: Activa un temporizador extremo de 5 segundos por turno con una barra de progreso neón que se consume en tiempo real y alertas de sonido.
*   **Sonidos Sintetizados (Web Audio API)**: Genera efectos de audio limpios (blips de movimiento con tonos diferenciados por símbolo, alertas de tiempo, fanfarria de victoria y tono de empate) mediante software nativo del navegador, sin pesar bytes adicionales cargando archivos externos.
*   **Feedback de Impacto Visual (Juice)**:
    *   Indicador de turno activo mediante pulsos de luz neón.
    *   Contadores del marcador con animación de escala (*pop*) al sumar puntos.
    *   Dibujo animado mediante SVG de la línea ganadora exacta sobre el tablero.
    *   Efecto de atenuación en escala de grises del tablero en caso de empate.
    *   Explosión dinámica de confeti neón (rectángulos, círculos y tiras) con gravedad realista que se auto-limpia del DOM para cuidar la memoria.
*   **Perfil y Persistencia Local**: Almacenamiento automatizado mediante `localStorage` que resguarda el nombre del jugador y sus récords (Victorias, Empates, Derrotas) clasificados por cada tamaño de tablero, saltando el login al reiniciar el juego.

## 🛠️ Tecnologías Utilizadas

*   **HTML5**: Estructura semántica, contenedores de vistas y capas de superposición (Overlays).
*   **CSS3**: Animaciones de partículas, variables nativas, filtros de brillo (`box-shadow`/`drop-shadow`), diseño responsivo y cuadrículas CSS Grid rígidas (`aspect-ratio: 1/1`).
*   **JavaScript (ES6+)**: Motores de juego, lógica de turnos, algoritmos de IA, persistencia de datos y manipulación del DOM.
*   **Web Audio API**: Síntesis de ondas de audio en tiempo real para efectos de sonido.

## 🚀 Cómo Ejecutar el Proyecto

Al ser un desarrollo standalone, ponerlo en marcha requiere solo dos pasos:
1. Descarga o genera el archivo `tateti.html`.
2. Haz doble clic sobre el archivo para abrirlo en cualquier navegador web moderno (Chrome, Safari, Edge, Firefox) en tu computadora o dispositivo móvil. ¡Funciona completamente sin internet!

