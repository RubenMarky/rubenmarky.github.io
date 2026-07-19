
(function () {
  "use strict";

  // Fecha y hora oficiales FIFA: domingo 19 de julio de 2026, 16:00 hs (Argentina).
  // Fija — no se recalcula "a partir de hoy", así se evita el salto de día.
  var TARGET_TIME = new Date(2026, 6, 19, 16, 0, 0, 0).getTime();

  var state = {
    votes: { A: 152, D: 58, B: 141 },
    myVote: null,
    tab: "A",
    golesA: 0,
    golesB: 0,
    matchEnded: false,
    photoIndex: 0,
  };

  var photoFiles = [
    "img/imagen01.png", "img/imagen02.png", "img/imagen03.png", "img/imagen04.png",
    "img/imagen05.png", "img/imagen06.png", "img/imagen07.png", "img/imagen08.png",
    "img/imagen09.png", "img/imagen10.png", "img/imagen11.png", "img/imagen12.png"
  ];
  var photoLabels = [
    "Entrenamiento", "Concentración", "Estadio", "Hinchada", "Previa", "Selección",
    "Entrenamiento", "Concentración", "Estadio", "Hinchada", "Previa", "Selección"
  ];

  function pad(n) { return String(n).padStart(2, "0"); }

  // ---------- Cuenta regresiva / marcador ----------
  function renderCountdown() {
    var now = Date.now();
    var diff = Math.max(0, Math.floor((TARGET_TIME - now) / 1000));
    var started = diff <= 0;

    document.getElementById("countdownView").classList.toggle("hidden", started);
    document.getElementById("scoreView").classList.toggle("hidden", !started);

    if (!started) {
      document.getElementById("dd").textContent = pad(Math.floor(diff / 86400));
      document.getElementById("hh").textContent = pad(Math.floor((diff % 86400) / 3600));
      document.getElementById("mm").textContent = pad(Math.floor((diff % 3600) / 60));
      document.getElementById("ss").textContent = pad(diff % 60);
    } else {
      var minutesElapsed = Math.min(99, Math.floor((now - TARGET_TIME) / 60000) + 1);
      document.getElementById("golesA").textContent = state.golesA;
      document.getElementById("golesB").textContent = state.golesB;
      document.getElementById("matchMinute").textContent = state.matchEnded ? "FINAL" : minutesElapsed + "'";
    }
  }

  // ---------- Votación ----------
  function renderVotes() {
    var v = state.votes;
    var total = v.A + v.D + v.B;
    var pctA = Math.round((v.A / total) * 100);
    var pctD = Math.round((v.D / total) * 100);
    var pctB = 100 - pctA - pctD;

    document.getElementById("totalVotos").textContent = total + " votos";
    document.getElementById("pctA").textContent = pctA + "%";
    document.getElementById("pctD").textContent = pctD + "%";
    document.getElementById("pctB").textContent = pctB + "%";
    document.getElementById("barA").style.width = pctA + "%";
    document.getElementById("barD").style.width = pctD + "%";
    document.getElementById("barB").style.width = pctB + "%";

    document.getElementById("voteA").classList.toggle("selected-arg", state.myVote === "A");
    document.getElementById("voteDraw").classList.toggle("selected-draw", state.myVote === "D");
    document.getElementById("voteB").classList.toggle("selected-esp", state.myVote === "B");
  }

  function vote(key) {
    if (state.myVote) state.votes[state.myVote] -= 1;
    state.votes[key] += 1;
    state.myVote = key;
    renderVotes();
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
    document.getElementById("viewerImg").src = src;
    document.getElementById("viewerLabel").textContent = "Imagen " + pad(i + 1) + " · " + photoLabels[i % photoLabels.length];
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

  // Expuesto por si se quiere disparar un gol manualmente desde consola/futura UI:
  // window.registrarGol("A") o window.registrarGol("B")
  window.registrarGol = function (equipo) {
    if (equipo === "A") state.golesA += 1; else state.golesB += 1;
    renderCountdown();
    playGoalSound();
    playCrowdCheer();
    playApplause();
  };

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", function () {
    trackVisit();
    renderCountdown();
    renderVotes();
    renderViewer();
    renderGalleryGrid();
    setInterval(renderCountdown, 1000);

    document.getElementById("darkToggle").addEventListener("click", toggleDark);
    document.getElementById("voteA").addEventListener("click", function () { vote("A"); });
    document.getElementById("voteDraw").addEventListener("click", function () { vote("D"); });
    document.getElementById("voteB").addEventListener("click", function () { vote("B"); });
    document.getElementById("tabArgBtn").addEventListener("click", function () { setTab("A"); });
    document.getElementById("tabEspBtn").addEventListener("click", function () { setTab("B"); });
    document.getElementById("prevPhoto").addEventListener("click", prevPhoto);
    document.getElementById("nextPhoto").addEventListener("click", nextPhoto);
    document.getElementById("lightbox").addEventListener("click", closeLightbox);
    document.getElementById("lightboxImg").addEventListener("click", function (e) { e.stopPropagation(); });
  });
})();
