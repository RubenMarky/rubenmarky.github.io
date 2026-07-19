(function () {
  "use strict";

  // Fecha y hora oficiales FIFA: domingo 19 de julio de 2026, 16:00 hs (Argentina).
  // Fija — no se recalcula "a partir de hoy", así se evita el salto de día.
  var TARGET_TIME = new Date(2026, 6, 19, 16, 0, 0, 0).getTime();

  var state = {
    tab: "A",
    golesA: 0,
    golesB: 1,
    matchEnded: true,
    matchStarted: true,
    photoIndex: 0,
  };

  var photoFiles = [
    "img/imagen01.png", "img/imagen02.png", "img/imagen03.png", "img/imagen04.png",
    "img/imagen05.png", "img/imagen06.png", "img/imagen07.png", "img/imagen08.png",
    "img/imagen09.png", "img/imagen10.png", "img/imagen11.png", "img/imagen12.png"
  ];
  var photoCaptions = [
    { title: "El Choque de Dos Mundos por la Gloria Eterna", desc: "Argentina y España se miden frente a frente en la final más esperada del planeta. Dos estilos, una sola copa." },
    { title: "Los Elegidos para la Batalla", desc: "El listado completo y los dorsales oficiales de los futbolistas convocados para defender sus colores en el campo de juego." },
    { title: "El Gran Teatro del Fútbol Mundial", desc: "Capacidad, tecnología e ingeniería de vanguardia. Conocemos a fondo el imponente estadio que albergará la batalla final." },
    { title: "Artillería Pesada en Acción", desc: "Repasamos la tabla de los máximos artilleros de la Albiceleste. Los nombres que mantienen viva la ilusión del título." },
    { title: "La Final en Números", desc: "Datos, asistencias y minutos jugados. La estadística individual bajo la lupa para entender las claves tácticas del encuentro." },
    { title: "Orgullo, Pasión y Fútbol", desc: "La identidad que trasciende la cancha. Un homenaje gráfico a los valores y la cultura que definen nuestra esencia futbolera." },
    { title: "El Pueblo del Fútbol", desc: "Una marea que no para de alentar. El color y el grito sagrado de las gradas que empujan al equipo hacia la victoria." },
    { title: "Unidos por un Mismo Objetivo", desc: "El enfoque, el compañerismo y la determinación de la delegación en la antesala del pitazo inicial." },
    { title: "Tensión Máxima sobre el Césped", desc: "El marcador no da tregua en un duelo táctico al límite. Cada jugada puede cambiar el destino del campeonato mundial." },
    { title: "El Galardón Más Codiciado del Planeta", desc: "Conoce la historia y el deseo de levantar el tesoro más importante del deporte rey, directo hacia la cuarta estrella." },
    { title: "Vive la Experiencia Multivía", desc: "Estadísticas en vivo, eSports y transmisiones en directo. Todo el análisis interactivo de la final a un solo clic de distancia." },
    { title: "La Firma del Campeón", desc: "Cerramos nuestra cobertura especial con el sello inconfundible de una pasión que no conoce fronteras." }
  ];

  function pad(n) { return String(n).padStart(2, "0"); }

  // ---------- Cuenta regresiva / marcador ----------
  function renderCountdown() {
    document.getElementById("countdownView").classList.add("hidden");
    document.getElementById("scoreView").classList.remove("hidden");
    document.getElementById("golesA").textContent = state.golesA;
    document.getElementById("golesB").textContent = state.golesB;
    document.getElementById("matchMinute").textContent = "FINAL";
  }

  // ---------- Planteles (tabs) ----------
  function setTab(tab) {
    state.tab = tab;
    document.getElementById("squadArg").classList.toggle("hidden", tab !== "A");
    document.getElementById("squadEsp").classList.toggle("hidden", tab !== "B");
    document.getElementById("tabArgBtn").classList.toggle("active", tab === "A");
    document.getElementById("tabEspBtn").classList.toggle("active", tab === "B");
  }

  // ---------- Galería ----------
  function renderGalleryGrid() {
    var grid = document.getElementById("galleryGrid");
    grid.innerHTML = photoFiles.map(function (src, i) {
      var label = "Imagen " + pad(i + 1);
      var selected = i === state.photoIndex ? " selected" : "";
      return '<div class="gallery-thumb' + selected + '" data-index="' + i + '">' +
        '<img src="' + src + '" alt="' + label + '">' +
        '<div class="gallery-thumb-label">' + label + '</div></div>';
    }).join("");

    Array.prototype.forEach.call(grid.querySelectorAll(".gallery-thumb"), function (el) {
      el.addEventListener("click", function () {
        state.photoIndex = parseInt(el.getAttribute("data-index"), 10);
        renderViewer();
        renderGalleryGrid();
        openLightbox();
      });
    });
  }

  function renderViewer() {
    var i = state.photoIndex;
    var src = photoFiles[i];
    var caption = photoCaptions[i % photoCaptions.length];
    document.getElementById("viewerImg").src = src;
    document.getElementById("viewerTitle").textContent = caption.title;
    document.getElementById("viewerDesc").textContent = caption.desc;
    document.getElementById("viewerLabel").textContent = "Imagen " + pad(i + 1);
    document.getElementById("lightboxImg").src = src;
  }

  function openLightbox() {
    document.getElementById("lightbox").classList.remove("hidden");
  }
  function closeLightbox() {
    document.getElementById("lightbox").classList.add("hidden");
  }

  function prevPhoto() {
    state.photoIndex = (state.photoIndex - 1 + photoFiles.length) % photoFiles.length;
    renderViewer();
    renderGalleryGrid();
  }
  function nextPhoto() {
    state.photoIndex = (state.photoIndex + 1) % photoFiles.length;
    renderViewer();
    renderGalleryGrid();
  }

  // ---------- Visitas ----------
  function trackVisit() {
    try {
      var nuevas = (parseInt(localStorage.getItem("argesp-visitas"), 10) || 0) + 1;
      localStorage.setItem("argesp-visitas", String(nuevas));
      document.getElementById("visitas").textContent = nuevas;
    } catch (e) { /* sin almacenamiento */ }
  }

  // ---------- Modo oscuro/claro ----------
  function toggleDark() {
    var isLight = document.body.classList.toggle("light");
    document.getElementById("darkToggle").textContent = isLight ? "🌙" : "☀️";
  }

  // ---------- Confetti de festejo (lluvia continua e infinita al iniciar) ----------
  function activarFestejoFinal() {
      const countdownView = document.getElementById("countdownView");
      const scoreView = document.getElementById("scoreView");

      if (countdownView) countdownView.classList.add("hidden");
      if (scoreView) scoreView.classList.remove("hidden");

      const wrappersBanderas = document.querySelectorAll(".flag-custom-wrapper");
      wrappersBanderas.forEach(wrapper => {
          wrapper.classList.add("pulse-glow");
      });

      const duracionFestejo = Infinity;
      const finAnimacion = Date.now() + duracionFestejo;

      const intervaloPapelitos = setInterval(() => {
          if (Date.now() > finAnimacion) {
              return clearInterval(intervaloPapelitos);
          }

          confetti({
              particleCount: 4,
              angle: 60,
              spread: 55,
              origin: { x: 0, y: 0.8 },
              colors: ['#00a8e8', '#ffffff', '#ff0055', '#ffdca0']
          });

          confetti({
              particleCount: 4,
              angle: 120,
              spread: 55,
              origin: { x: 1, y: 0.8 },
              colors: ['#00a8e8', '#ffffff', '#ff0055', '#ffdca0']
          });
      }, 150);
  }

  // ---------- Sonidos de gol (corneta + rugido de tribuna + aplausos) ----------
  function playGoalSound() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var horn = ctx.createOscillator();
      var hornGain = ctx.createGain();
      horn.type = "sawtooth";
      horn.frequency.setValueAtTime(220, ctx.currentTime);
      horn.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      horn.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
      hornGain.gain.setValueAtTime(0, ctx.currentTime);
      hornGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.03);
      hornGain.gain.setValueAtTime(0.22, ctx.currentTime + 0.6);
      hornGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.9);
      horn.connect(hornGain);
      hornGain.connect(ctx.destination);
      horn.start(ctx.currentTime);
      horn.stop(ctx.currentTime + 0.9);

      var dur = 1.6;
      var buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      var noise = ctx.createBufferSource();
      noise.buffer = buf;
      var filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 800;
      filter.Q.value = 0.6;
      var noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.25);
      noiseGain.gain.setValueAtTime(0.18, ctx.currentTime + 0.9);
      noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + dur);
    } catch (e) { /* audio no disponible */ }
  }

  function playCrowdCheer() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var dur = 2.6;
      var buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      var noise = ctx.createBufferSource();
      noise.buffer = buf;
      var bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(600, ctx.currentTime);
      bandpass.frequency.linearRampToValueAtTime(1800, ctx.currentTime + 0.4);
      bandpass.frequency.linearRampToValueAtTime(1100, ctx.currentTime + dur);
      bandpass.Q.value = 0.7;
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + 1.6);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);
      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + dur);
    } catch (e) { /* audio no disponible */ }
  }

  function playApplause() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var dur = 1.8;
      var master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.15);
      master.gain.setValueAtTime(0.28, ctx.currentTime + dur - 0.5);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
      master.connect(ctx.destination);
      var clapCount = 90;
      for (var i = 0; i < clapCount; i++) {
        var t = ctx.currentTime + Math.random() * dur;
        var clapDur = 0.03 + Math.random() * 0.02;
        var buf = ctx.createBuffer(1, ctx.sampleRate * clapDur, ctx.sampleRate);
        var data = buf.getChannelData(0);
        for (var j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * (1 - j / data.length);
        var src = ctx.createBufferSource();
        src.buffer = buf;
        var bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 1800 + Math.random() * 1400;
        bp.Q.value = 0.9;
        var g = ctx.createGain();
        g.gain.value = 0.5 + Math.random() * 0.5;
        src.connect(bp);
        bp.connect(g);
        g.connect(master);
        src.start(t);
        src.stop(t + clapDur);
      }
    } catch (e) { /* audio no disponible */ }
  }



  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", function () {
    trackVisit();
    renderCountdown();
    renderViewer();
    renderGalleryGrid();

    document.getElementById("darkToggle").addEventListener("click", toggleDark);
    document.getElementById("tabArgBtn").addEventListener("click", function () { setTab("A"); });
    document.getElementById("tabEspBtn").addEventListener("click", function () { setTab("B"); });
    document.getElementById("prevPhoto").addEventListener("click", prevPhoto);
    document.getElementById("nextPhoto").addEventListener("click", nextPhoto);
    document.getElementById("lightbox").addEventListener("click", closeLightbox);
    document.getElementById("lightboxImg").addEventListener("click", function (e) { e.stopPropagation(); });
  });
})();

// ---------- Votación persistente (simula base de datos + localStorage por usuario) ----------
document.addEventListener("DOMContentLoaded", () => {
    const totalVotosEl = document.getElementById("totalVotos");
    const btnA = document.getElementById("voteA");
    const btnDraw = document.getElementById("voteDraw");
    const btnB = document.getElementById("voteB");

    const pctAEl = document.getElementById("pctA");
    const pctDEl = document.getElementById("pctD");
    const pctBEl = document.getElementById("pctB");

    const barA = document.getElementById("barA");
    const barD = document.getElementById("barD");
    const barB = document.getElementById("barB");

    if (!localStorage.getItem("votos_ARG")) {
        localStorage.setItem("votos_ARG", Math.floor(Math.random() * 500) + 1500);
        localStorage.setItem("votos_EMP", Math.floor(Math.random() * 200) + 500);
        localStorage.setItem("votos_ESP", Math.floor(Math.random() * 500) + 1400);
    }

    function actualizarGraficos() {
        const vA = parseInt(localStorage.getItem("votos_ARG"));
        const vD = parseInt(localStorage.getItem("votos_EMP"));
        const vB = parseInt(localStorage.getItem("votos_ESP"));
        const total = vA + vD + vB;

        totalVotosEl.textContent = `${total.toLocaleString()} votos`;

        const pA = Math.round((vA / total) * 100);
        const pD = Math.round((vD / total) * 100);
        const pB = 100 - (pA + pD);

        pctAEl.textContent = `${pA}%`;
        pctDEl.textContent = `${pD}%`;
        pctBEl.textContent = `${pB}%`;

        barA.style.width = `${pA}%`;
        barD.style.width = `${pD}%`;
        barB.style.width = `${pB}%`;
    }

    const votoEfectuado = localStorage.getItem("usuario_voto_final");
    if (votoEfectuado) {
        desactivarBotones(votoEfectuado);
    }

    function desactivarBotones(votoGanador) {
        [btnA, btnDraw, btnB].forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = "default";
            btn.style.opacity = "0.8";
            if (btn.getAttribute("data-key") === votoGanador) {
                btn.style.borderColor = "#00a8e8";
                btn.style.boxShadow = "0 0 10px rgba(0, 168, 232, 0.2)";
            }
        });
    }

    function procesarVoto(e) {
        if (localStorage.getItem("usuario_voto_final")) return;

        const boton = e.currentTarget;
        const seleccion = boton.getAttribute("data-key");

        if (seleccion === "A") {
            localStorage.setItem("votos_ARG", parseInt(localStorage.getItem("votos_ARG")) + 1);
        } else if (seleccion === "D") {
            localStorage.setItem("votos_EMP", parseInt(localStorage.getItem("votos_EMP")) + 1);
        } else if (seleccion === "B") {
            localStorage.setItem("votos_ESP", parseInt(localStorage.getItem("votos_ESP")) + 1);
        }

        localStorage.setItem("usuario_voto_final", seleccion);
        actualizarGraficos();
        desactivarBotones(seleccion);
    }

    btnA.addEventListener("click", procesarVoto);
    btnDraw.addEventListener("click", procesarVoto);
    btnB.addEventListener("click", procesarVoto);

    actualizarGraficos();
});
