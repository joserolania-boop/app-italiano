/* ═══════════════════════════════════════════════════════════
   Maestro Italiano — Capa moderna 2026
   Gamificacion (logros), modo oscuro, pronunciacion por voz,
   test de nivel, panel de estadisticas y soporte PWA offline.
   Depende de funciones y `state` globales definidos en app.js.
   ═══════════════════════════════════════════════════════════ */

// ─── Logros ───
const ACHIEVEMENTS = [
    { id: "first-step", icon: "🚀", title: "Primer paso", desc: "Completa tu primer nivel.", test: (s) => s.completedLevelIds.length >= 1 },
    { id: "five-levels", icon: "🖐️", title: "En marcha", desc: "Completa 5 niveles.", test: (s) => s.completedLevelIds.length >= 5 },
    { id: "module-1", icon: "📗", title: "Modulo M1 superado", desc: "Completa los 10 niveles del modulo M1.", test: (s) => countModuleDone(s, 1) >= 10 },
    { id: "ten-levels", icon: "🔟", title: "Constancia", desc: "Completa 10 niveles.", test: (s) => s.completedLevelIds.length >= 10 },
    { id: "quarter", icon: "🏔️", title: "A un cuarto de C2", desc: "Completa 25 niveles.", test: (s) => s.completedLevelIds.length >= 25 },
    { id: "half", icon: "⛰️", title: "Mitad del camino", desc: "Completa 50 niveles.", test: (s) => s.completedLevelIds.length >= 50 },
    { id: "all-levels", icon: "👑", title: "Maestro Italiano", desc: "Completa los 100 niveles.", test: (s) => s.completedLevelIds.length >= 100 },
    { id: "streak-3", icon: "🔥", title: "Racha de 3", desc: "Estudia 3 dias seguidos.", test: (s) => s.streakDays >= 3 },
    { id: "streak-7", icon: "🔥", title: "Semana perfecta", desc: "Estudia 7 dias seguidos.", test: (s) => s.streakDays >= 7 },
    { id: "streak-30", icon: "🌟", title: "Mes imparable", desc: "Estudia 30 dias seguidos.", test: (s) => s.streakDays >= 30 },
    { id: "xp-100", icon: "⚡", title: "100 XP", desc: "Acumula 100 XP en total.", test: (s) => s.xp >= 100 },
    { id: "xp-500", icon: "⚡", title: "500 XP", desc: "Acumula 500 XP en total.", test: (s) => s.xp >= 500 },
    { id: "xp-1000", icon: "💥", title: "1000 XP", desc: "Acumula 1000 XP en total.", test: (s) => s.xp >= 1000 },
    { id: "goal-day", icon: "🎯", title: "Objetivo cumplido", desc: "Alcanza tu meta diaria de XP.", test: (s) => Number(s.xpByDate[new Date().toISOString().slice(0, 10)] || 0) >= (s.dailyGoal || 40) },
];

function countModuleDone(s, moduleNumber) {
    return s.completedLevelIds.filter((id) => Number((/M(\d+)-/.exec(id) || [])[1]) === moduleNumber).length;
}

// ─── Efectos de sonido (Web Audio, sin archivos) ───
let audioCtx = null;
function getAudioCtx() {
    if (audioCtx) return audioCtx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
    return audioCtx;
}

function playTone(freq, startTime, duration, type, gainPeak) {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak || 0.12, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
}

function playSfx(kind) {
    if (state && state.soundOff) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    if (kind === "correct") {
        playTone(587.33, t, 0.18, "triangle", 0.14);      // Re
        playTone(880, t + 0.09, 0.22, "triangle", 0.14);  // La
    } else if (kind === "wrong") {
        playTone(220, t, 0.22, "sawtooth", 0.10);
        playTone(155, t + 0.1, 0.28, "sawtooth", 0.09);
    } else if (kind === "levelup") {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => playTone(f, t + i * 0.11, 0.3, "triangle", 0.15));
    } else if (kind === "click") {
        playTone(660, t, 0.06, "square", 0.06);
    } else if (kind === "xp") {
        playTone(987.77, t, 0.12, "sine", 0.10);
    }
}

// ─── Confeti (Canvas, sin librerias) ───
function fireConfetti(intensity) {
    if (typeof document === "undefined") return;
    const scale = Math.max(0.2, Math.min(1.5, intensity || 0.7));
    let canvas = document.getElementById("confetti-canvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "confetti-canvas";
        canvas.className = "confetti-canvas";
        document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
    };
    resize();
    const colors = ["#2d7a4f", "#e07030", "#f1c40f", "#3498db", "#e74c3c", "#ffffff"];
    const count = Math.round(140 * scale);
    const W = canvas.width;
    const H = canvas.height;
    const parts = Array.from({ length: count }, () => ({
        x: W / 2 + (Math.random() - 0.5) * W * 0.3,
        y: H * 0.35 + (Math.random() - 0.5) * 80 * dpr,
        vx: (Math.random() - 0.5) * 16 * dpr,
        vy: (Math.random() * -14 - 4) * dpr,
        size: (Math.random() * 7 + 4) * dpr,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        life: 0,
    }));
    const gravity = 0.45 * dpr;
    let raf;
    const start = performance.now();
    const tick = (now) => {
        ctx.clearRect(0, 0, W, H);
        let alive = false;
        const elapsed = now - start;
        for (const p of parts) {
            p.vy += gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.99;
            p.rot += p.vr;
            const alpha = Math.max(0, 1 - elapsed / 2600);
            if (p.y < H + 40 && alpha > 0) alive = true;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        }
        if (alive) {
            raf = requestAnimationFrame(tick);
        } else {
            ctx.clearRect(0, 0, W, H);
            cancelAnimationFrame(raf);
        }
    };
    raf = requestAnimationFrame(tick);
}

// ─── Celebracion al completar un nivel ───
function celebrateLevel(level, xpGain) {
    playSfx("levelup");
    fireConfetti(0.9);
    const overlay = document.getElementById("celebrate-overlay");
    const card = document.getElementById("celebrate-card");
    if (!overlay || !card) return;
    const phrases = ["Bravissimo!", "Fantastico!", "Perfetto!", "Eccellente!", "Magnifico!"];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    card.innerHTML = `
        <div class="celebrate-emoji">🎉</div>
        <h2 class="celebrate-title">${escapeHtml(phrase)}</h2>
        <p class="celebrate-sub">Has completado <strong>${escapeHtml(level.id)}</strong></p>
        <div class="celebrate-xp">+${xpGain} XP</div>
        <button id="celebrate-continue" class="btn btn-accent btn-lg" type="button">Continuar</button>
    `;
    overlay.classList.remove("hidden");
    requestAnimationFrame(() => overlay.classList.add("show"));
    const close = () => {
        overlay.classList.remove("show");
        setTimeout(() => overlay.classList.add("hidden"), 300);
    };
    const btn = document.getElementById("celebrate-continue");
    if (btn) btn.addEventListener("click", close, { once: true });
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
    setTimeout(close, 4500);
}

function toggleSound() {
    state.soundOff = !state.soundOff;
    persistState();
    const btn = document.getElementById("sound-btn");
    if (btn) btn.textContent = state.soundOff ? "🔇" : "🔊";
    if (!state.soundOff) playSfx("click");
}

// ─── Mascota (Leo, il leone di San Marco) ───
const MASCOT_PHRASES = ["Andiamo!", "Bravo!", "Forza!", "Benissimo!", "Continua così!", "Perfetto!", "Dai dai!", "Che bello!"];
// Frases con traduccion para cuando pinchas a Leo
const MASCOT_CLICK_PHRASES = [
    "Ciao! (¡Hola!)",
    "Sono Leo, il leone!",
    "Impariamo l'italiano! (Aprendamos italiano)",
    "Roma non fu fatta in un giorno",
    "Mangia bene, ridi spesso",
    "La dolce vita ti aspetta!",
    "Ce la puoi fare! (¡Tú puedes!)",
    "Un caffè e via! (¡Un café y a por ello!)",
    "Che meraviglia! (¡Qué maravilla!)",
    "Piano piano si va lontano",
    "Sei bravissimo!",
    "Forza, amico mio!"
];
let mascotBubbleTimer = null;
let mascotClickIndex = 0;

function bounceMascot(phrase) {
    const mascot = document.getElementById("path-mascot");
    if (!mascot) return;
    const body = mascot.querySelector(".mascot-body");
    const bubble = document.getElementById("mascot-bubble");

    if (body) {
        body.classList.remove("hop");
        // Reinicia la animacion
        void body.offsetWidth;
        body.classList.add("hop");
    }
    if (bubble) {
        const text = phrase || MASCOT_PHRASES[Math.floor(Math.random() * MASCOT_PHRASES.length)];
        bubble.textContent = text;
        bubble.classList.add("show");
        if (mascotBubbleTimer) clearTimeout(mascotBubbleTimer);
        mascotBubbleTimer = setTimeout(() => bubble.classList.remove("show"), 2600);
    }
}

function onMascotClick() {
    // Recorre las frases en orden para que siempre diga algo nuevo
    const phrase = MASCOT_CLICK_PHRASES[mascotClickIndex % MASCOT_CLICK_PHRASES.length];
    mascotClickIndex += 1;
    bounceMascot(phrase);
    if (typeof playSfx === "function") playSfx("click");
}

// ─── Fondo animado con siluetas SVG de monumentos ───
function buildItalyBackground() {
    const bg = document.getElementById("italy-bg");
    if (!bg || typeof PATH_MONUMENTS === "undefined") return;
    bg.innerHTML = "";
    const colors = ["#009246", "#ce2b37", "#c98a4e", "#3b9be0"];
    const config = [
        { ix: "7%", delay: "0s", dur: "30s", size: "44px" },
        { ix: "19%", delay: "7s", dur: "36s", size: "34px" },
        { ix: "31%", delay: "13s", dur: "32s", size: "40px" },
        { ix: "44%", delay: "4s", dur: "38s", size: "48px" },
        { ix: "57%", delay: "10s", dur: "34s", size: "36px" },
        { ix: "69%", delay: "17s", dur: "31s", size: "42px" },
        { ix: "81%", delay: "3s", dur: "37s", size: "38px" },
        { ix: "92%", delay: "12s", dur: "33s", size: "44px" }
    ];
    config.forEach((c, i) => {
        const span = document.createElement("span");
        span.className = "italy-icon";
        span.style.setProperty("--ix", c.ix);
        span.style.setProperty("--idelay", c.delay);
        span.style.setProperty("--idur", c.dur);
        span.style.setProperty("--isize", c.size);
        span.style.color = colors[i % colors.length];
        span.innerHTML = PATH_MONUMENTS[i % PATH_MONUMENTS.length];
        bg.appendChild(span);
    });
}

// ─── Carrusel de fondos reales de Italia (crossfade sutil) ───
const LESSON_BACKGROUNDS = [
    "./assets/bg-colosseo.jpg",
    "./assets/bg-venezia.jpg",
    "./assets/bg-firenze.jpg",
    "./assets/bg-toscana.jpg",
    "./assets/bg-amalfi.jpg",
    "./assets/bg-pisa.jpg",
    "./assets/bg-roma.jpg",
    "./assets/bg-cinqueterre.jpg"
];
let lessonBgOrder = [];
let lessonBgPos = 0;
let lessonBgActive = "a";
let lessonBgTimer = null;

function shuffleBackgrounds() {
    const arr = LESSON_BACKGROUNDS.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function showLessonBg(src) {
    const layerA = document.getElementById("bg-layer-a");
    const layerB = document.getElementById("bg-layer-b");
    if (!layerA || !layerB) return;
    const incoming = lessonBgActive === "a" ? layerB : layerA;
    const outgoing = lessonBgActive === "a" ? layerA : layerB;
    incoming.style.backgroundImage = `url("${src}")`;
    incoming.classList.add("is-active");
    outgoing.classList.remove("is-active");
    lessonBgActive = lessonBgActive === "a" ? "b" : "a";
}

function rotateLessonBg() {
    if (!lessonBgOrder.length) lessonBgOrder = shuffleBackgrounds();
    lessonBgPos = (lessonBgPos + 1) % lessonBgOrder.length;
    if (lessonBgPos === 0) lessonBgOrder = shuffleBackgrounds();
    showLessonBg(lessonBgOrder[lessonBgPos]);
}

function initLessonBackgrounds() {
    const layerA = document.getElementById("bg-layer-a");
    if (!layerA) return;
    lessonBgOrder = shuffleBackgrounds();
    lessonBgPos = 0;
    // Precargar para que el crossfade no parpadee
    LESSON_BACKGROUNDS.forEach((src) => { const img = new Image(); img.src = src; });
    showLessonBg(lessonBgOrder[0]);
    if (lessonBgTimer) clearInterval(lessonBgTimer);
    lessonBgTimer = setInterval(rotateLessonBg, 14000);
}

// ─── Toast / notificaciones ───
function showToast(title, desc, type) {
    const stack = document.getElementById("toast-stack");
    if (!stack) {
        return;
    }
    const toast = document.createElement("div");
    toast.className = `toast toast-${type || "xp"}`;
    toast.innerHTML = `<strong class="toast-title"></strong>${desc ? '<span class="toast-desc"></span>' : ""}`;
    toast.querySelector(".toast-title").textContent = title;
    if (desc) {
        toast.querySelector(".toast-desc").textContent = desc;
    }
    stack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 350);
    }, 3200);
}

// ─── Modo oscuro ───
function applyTheme(theme) {
    const mode = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", mode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.setAttribute("content", mode === "dark" ? "#11201a" : "#2d7a4f");
    }
    const btn = document.getElementById("theme-btn");
    if (btn) {
        btn.textContent = mode === "dark" ? "☀️" : "🌙";
    }
}

function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme(state.theme);
    persistState();
}

// ─── Reconocimiento de voz (pronunciacion) ───
function getSpeechRecognitionCtor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function isSpeechRecognitionSupported() {
    return Boolean(getSpeechRecognitionCtor());
}

function levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (!m) return n;
    if (!n) return m;
    const row = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) {
        let prev = row[0];
        row[0] = i;
        for (let j = 1; j <= n; j++) {
            const temp = row[j];
            row[j] = Math.min(
                row[j] + 1,
                row[j - 1] + 1,
                prev + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
            prev = temp;
        }
    }
    return row[n];
}

function pronunciationScore(target, transcript) {
    const t1 = normalizeText(target);
    const t2 = normalizeText(transcript);
    if (!t1 || !t2) {
        return 0;
    }
    const charSim = 1 - levenshtein(t1, t2) / Math.max(t1.length, t2.length);
    const words1 = t1.split(/\s+/).filter(Boolean);
    const words2 = new Set(t2.split(/\s+/).filter(Boolean));
    const matched = words1.filter((w) => words2.has(w)).length;
    const wordSim = words1.length ? matched / words1.length : 0;
    return Math.max(0, Math.min(100, Math.round((wordSim * 0.6 + charSim * 0.4) * 100)));
}

let pronunciationBusy = false;

function startPronunciationCheck(targetText, button, feedbackEl, onScore) {
    if (!targetText || pronunciationBusy) {
        return;
    }
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
        return;
    }

    pronunciationBusy = true;
    const originalLabel = button.textContent;
    button.textContent = "🔴 Escuchando...";
    button.disabled = true;
    feedbackEl.classList.add("hidden");

    const recognition = new Ctor();
    recognition.lang = "it-IT";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    let finished = false;
    const cleanup = () => {
        pronunciationBusy = false;
        button.textContent = originalLabel;
        button.disabled = false;
    };

    recognition.onresult = (event) => {
        finished = true;
        const alternatives = Array.from(event.results[0] || []).map((alt) => alt.transcript);
        const best = alternatives.reduce(
            (acc, txt) => {
                const score = pronunciationScore(targetText, txt);
                return score > acc.score ? { score, txt } : acc;
            },
            { score: 0, txt: alternatives[0] || "" }
        );
        renderPronunciationFeedback(feedbackEl, best.score, best.txt, targetText);
        if (typeof onScore === "function") {
            onScore(best.score);
        }
        cleanup();
    };

    recognition.onerror = (event) => {
        finished = true;
        const msg = event.error === "not-allowed"
            ? "Permiso de microfono denegado. Activalo para practicar pronunciacion."
            : "No se pudo capturar el audio. Intentalo de nuevo.";
        feedbackEl.className = "pron-feedback pron-low";
        feedbackEl.textContent = msg;
        feedbackEl.classList.remove("hidden");
        cleanup();
    };

    recognition.onend = () => {
        if (!finished) {
            cleanup();
        }
    };

    try {
        recognition.start();
    } catch {
        cleanup();
    }
}

function renderPronunciationFeedback(feedbackEl, score, transcript, target) {
    let tier = "pron-low";
    let verdict = "Sigue practicando";
    let xp = 2;
    if (score >= 85) {
        tier = "pron-high";
        verdict = "¡Excelente pronunciacion!";
        xp = 10;
    } else if (score >= 60) {
        tier = "pron-mid";
        verdict = "Bien, casi nativo";
        xp = 6;
    }
    feedbackEl.className = `pron-feedback ${tier}`;
    feedbackEl.innerHTML = `
        <div class="pron-score-row">
            <span class="pron-score">${score}%</span>
            <span class="pron-verdict">${escapeHtml(verdict)}</span>
        </div>
        <div class="pron-bar"><div class="pron-bar-fill" style="width:${score}%"></div></div>
        <p class="pron-heard">Te he oido: <em>${escapeHtml(transcript || "(nada)")}</em></p>
        <p class="pron-target">Objetivo: <em>${escapeHtml(target)}</em></p>
    `;
    feedbackEl.classList.remove("hidden");
    if (typeof awardXp === "function") {
        awardXp(xp, "Practica de pronunciacion");
    }
}

// ─── Panel de estadisticas ───
function openStatsModal() {
    renderStatsModal();
    openModal("stats-modal");
}

function renderStatsModal() {
    const body = document.getElementById("stats-body");
    if (!body || !state.data) {
        return;
    }
    const totalLevels = state.data.levels.length;
    const done = state.completedLevelIds.length;
    const league = getCurrentLeague();
    const todayXp = getTodayXp();
    const goal = state.dailyGoal || 40;

    const attempted = Object.values(state.exerciseByLevel).filter((e) => typeof e.bestWeighted === "number");
    const avgAccuracy = attempted.length
        ? Math.round(attempted.reduce((sum, e) => sum + e.bestWeighted, 0) / attempted.length)
        : 0;

    const moduleRows = state.data.modules.map((mod) => {
        const total = mod.levels.length;
        const completed = mod.levels.filter((l) => state.completedLevelIds.includes(l.id)).length;
        const pct = total ? Math.round((completed / total) * 100) : 0;
        return `
            <div class="stat-module">
                <div class="stat-module-top">
                    <span>${escapeHtml(mod.id)} · ${escapeHtml(mod.range || "")}</span>
                    <span>${completed}/${total}</span>
                </div>
                <div class="stat-module-bar"><div style="width:${pct}%"></div></div>
            </div>`;
    }).join("");

    const today = new Date();
    const weekBars = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const key = d.toISOString().slice(0, 10);
        const xp = Number(state.xpByDate[key] || 0);
        const maxXp = Math.max(goal, ...Object.values(state.xpByDate).map(Number), 10);
        const h = Math.max(4, Math.round((xp / maxXp) * 100));
        const label = ["D", "L", "M", "X", "J", "V", "S"][d.getDay()];
        return `<div class="week-bar"><div class="week-bar-fill${xp >= goal ? " hit" : ""}" style="height:${h}%" title="${xp} XP"></div><span>${label}</span></div>`;
    }).join("");

    const achievementsGrid = ACHIEVEMENTS.map((a) => {
        const unlocked = state.achievements.includes(a.id);
        return `
            <div class="achievement ${unlocked ? "unlocked" : "locked"}" title="${escapeHtml(a.desc)}">
                <span class="achievement-icon">${unlocked ? a.icon : "🔒"}</span>
                <span class="achievement-title">${escapeHtml(a.title)}</span>
            </div>`;
    }).join("");

    const unlockedCount = state.achievements.length;

    body.innerHTML = `
        <div class="stat-cards">
            <div class="stat-card"><span class="stat-num">${done}/${totalLevels}</span><span class="stat-label">Niveles</span></div>
            <div class="stat-card"><span class="stat-num">${state.xp}</span><span class="stat-label">XP total</span></div>
            <div class="stat-card"><span class="stat-num">🔥 ${state.streakDays}</span><span class="stat-label">Racha (dias)</span></div>
            <div class="stat-card"><span class="stat-num">${avgAccuracy}%</span><span class="stat-label">Precision media</span></div>
        </div>

        <div class="stat-section">
            <div class="stat-section-head"><h3>Liga actual</h3><span>${league.icon} ${escapeHtml(league.name)}</span></div>
            <p class="stat-hint">${escapeHtml(nextLeagueHint(league))}</p>
        </div>

        <div class="stat-section">
            <div class="stat-section-head"><h3>Meta de hoy</h3><span>${todayXp}/${goal} XP</span></div>
            <button id="edit-goal-btn" class="btn btn-ghost btn-sm" type="button">Cambiar meta diaria</button>
        </div>

        <div class="stat-section">
            <h3>XP de los ultimos 7 dias</h3>
            <div class="week-chart">${weekBars}</div>
        </div>

        <div class="stat-section">
            <h3>Progreso por modulo</h3>
            <div class="stat-modules">${moduleRows}</div>
        </div>

        <div class="stat-section">
            <div class="stat-section-head"><h3>Logros</h3><span>${unlockedCount}/${ACHIEVEMENTS.length}</span></div>
            <div class="achievements-grid">${achievementsGrid}</div>
        </div>
    `;

    const editGoalBtn = document.getElementById("edit-goal-btn");
    if (editGoalBtn) {
        editGoalBtn.addEventListener("click", () => {
            const value = prompt("Meta diaria de XP (entre 10 y 200):", String(state.dailyGoal || 40));
            if (value === null) {
                return;
            }
            const parsed = Math.max(10, Math.min(200, Math.round(Number(value) || 40)));
            state.dailyGoal = parsed;
            persistState();
            renderDailyGoalRing();
            renderStatsModal();
        });
    }
}

// ─── Test de nivel ───
const PLACEMENT_QUESTIONS = [
    { q: "Yo soy Marco.", options: ["Io sono Marco", "Io ho Marco", "Io sto Marco"], answer: "Io sono Marco", module: 1 },
    { q: "Giulia tiene veinte años.", options: ["Giulia è venti anni", "Giulia ha venti anni", "Giulia sta venti anni"], answer: "Giulia ha venti anni", module: 1 },
    { q: "Nosotros vamos al cine.", options: ["Noi andiamo al cinema", "Noi vada al cinema", "Noi andare al cinema"], answer: "Noi andiamo al cinema", module: 3 },
    { q: "Ayer comí una pizza.", options: ["Ieri mangio una pizza", "Ieri ho mangiato una pizza", "Ieri mangiavo una pizza"], answer: "Ieri ho mangiato una pizza", module: 5 },
    { q: "Si tuviera tiempo, viajaría.", options: ["Se avessi tempo, viaggerei", "Se ho tempo, viaggio", "Se avrò tempo, viaggiavo"], answer: "Se avessi tempo, viaggerei", module: 7 },
    { q: "Pienso que sea importante.", options: ["Penso che è importante", "Penso che sia importante", "Penso che era importante"], answer: "Penso che sia importante", module: 7 },
    { q: "El libro fue escrito por ella.", options: ["Il libro è stato scritto da lei", "Il libro ha scritto da lei", "Il libro era scrivendo da lei"], answer: "Il libro è stato scritto da lei", module: 8 },
    { q: "Ojalá hubiera estudiado más.", options: ["Magari avessi studiato di più", "Magari ho studiato di più", "Magari studiavo di più"], answer: "Magari avessi studiato di più", module: 9 },
];

const placementState = { index: 0, correct: 0, maxModuleReached: 1, answered: false };

function openPlacementTest() {
    placementState.index = 0;
    placementState.correct = 0;
    placementState.maxModuleReached = 1;
    placementState.answered = false;
    renderPlacementQuestion();
    openModal("placement-modal");
}

function renderPlacementQuestion() {
    const body = document.getElementById("placement-body");
    if (!body) {
        return;
    }
    const q = PLACEMENT_QUESTIONS[placementState.index];
    const total = PLACEMENT_QUESTIONS.length;
    body.innerHTML = `
        <p class="placement-progress">Pregunta ${placementState.index + 1} de ${total}</p>
        <div class="placement-bar"><div style="width:${Math.round((placementState.index / total) * 100)}%"></div></div>
        <p class="placement-q">Traduce al italiano: <strong>${escapeHtml(q.q)}</strong></p>
        <div class="placement-options">
            ${q.options.map((opt, i) => `<button class="placement-option" type="button" data-i="${i}">${escapeHtml(opt)}</button>`).join("")}
        </div>
        <p class="placement-skip-row"><button id="placement-dont-know" class="btn btn-ghost btn-sm" type="button">No lo sé</button></p>
    `;

    body.querySelectorAll(".placement-option").forEach((btn) => {
        btn.addEventListener("click", () => answerPlacement(q.options[Number(btn.dataset.i)], q));
    });
    const dontKnow = document.getElementById("placement-dont-know");
    if (dontKnow) {
        dontKnow.addEventListener("click", () => answerPlacement(null, q));
    }
}

function answerPlacement(choice, question) {
    if (choice === question.answer) {
        placementState.correct += 1;
        placementState.maxModuleReached = Math.max(placementState.maxModuleReached, question.module);
    }
    placementState.index += 1;
    if (placementState.index >= PLACEMENT_QUESTIONS.length) {
        finishPlacementTest();
    } else {
        renderPlacementQuestion();
    }
}

function finishPlacementTest() {
    const body = document.getElementById("placement-body");
    if (!body) {
        return;
    }
    const correct = placementState.correct;
    // Recomendacion de modulo segun aciertos y dificultad alcanzada.
    let recommendedModule = 1;
    if (correct >= 7) recommendedModule = Math.max(8, placementState.maxModuleReached);
    else if (correct >= 5) recommendedModule = Math.min(7, Math.max(5, placementState.maxModuleReached));
    else if (correct >= 3) recommendedModule = 3;
    else recommendedModule = 1;

    const targetModuleId = `M${recommendedModule}`;
    const mod = state.data.modules.find((m) => m.id === targetModuleId) || state.data.modules[0];
    const firstLevel = mod.levels[0];

    state.placementDone = true;
    persistState();

    body.innerHTML = `
        <div class="placement-result">
            <span class="placement-result-icon">🎯</span>
            <h3>Has acertado ${correct} de ${PLACEMENT_QUESTIONS.length}</h3>
            <p>Tu punto de partida recomendado es <strong>${escapeHtml(mod.id)}</strong> (${escapeHtml(mod.range || "")}).</p>
            <div class="placement-result-actions">
                <button id="placement-go" class="btn btn-accent" type="button">Empezar en ${escapeHtml(firstLevel ? firstLevel.id : mod.id)}</button>
                <button id="placement-start-zero" class="btn btn-ghost" type="button">Prefiero empezar desde M1-L1</button>
            </div>
        </div>
    `;

    const goBtn = document.getElementById("placement-go");
    if (goBtn) {
        goBtn.addEventListener("click", () => {
            state.activeModuleId = mod.id;
            if (firstLevel) {
                state.activeLevelId = firstLevel.id;
            }
            persistState();
            renderAll();
            closeModal("placement-modal");
        });
    }
    const zeroBtn = document.getElementById("placement-start-zero");
    if (zeroBtn) {
        zeroBtn.addEventListener("click", () => closeModal("placement-modal"));
    }
}

// ─── Modales ───
// ─── Consulta rapida: chuletas de gramatica ───
function buildQuickRefBar() {
    const bar = document.getElementById("quickref-bar");
    if (!bar || typeof QUICK_REFERENCE === "undefined") return;
    bar.innerHTML = "";
    QUICK_REFERENCE.forEach((ref) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quickref-chip";
        btn.innerHTML = `<span class="quickref-chip-icon">${ref.icon}</span><span class="quickref-chip-text">${ref.title}</span>`;
        btn.addEventListener("click", () => openQuickRef(ref.id));
        bar.appendChild(btn);
    });
}

function openQuickRef(refId) {
    const ref = (typeof QUICK_REFERENCE !== "undefined") ? QUICK_REFERENCE.find((r) => r.id === refId) : null;
    if (!ref) return;
    const titleEl = document.getElementById("ref-modal-title");
    const body = document.getElementById("ref-body");
    if (titleEl) titleEl.textContent = `${ref.icon} ${ref.title}`;
    if (body) {
        let html = `<p class="ref-subtitle">${ref.subtitle}</p>`;
        ref.blocks.forEach((block) => {
            if (block.note) {
                html += `<p class="ref-note">💡 ${block.note}</p>`;
                return;
            }
            html += `<div class="ref-block">`;
            if (block.heading) html += `<h3 class="ref-heading">${block.heading}</h3>`;
            if (block.table) {
                html += `<table class="ref-table"><tbody>`;
                block.table.forEach((row) => {
                    html += `<tr><th>${row[0]}</th><td>${row[1]}</td></tr>`;
                });
                html += `</tbody></table>`;
            }
            html += `</div>`;
        });
        body.innerHTML = html;
    }
    openModal("ref-modal");
    if (typeof playSfx === "function") playSfx("click");
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove("hidden");
        document.body.classList.add("modal-open");
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add("hidden");
    }
    if (!document.querySelector(".modal:not(.hidden)")) {
        document.body.classList.remove("modal-open");
    }
}

// ─── Inicializacion ───
function initEnhancements() {
    const themeBtn = document.getElementById("theme-btn");
    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }

    buildItalyBackground();
    buildQuickRefBar();
    initLessonBackgrounds();

    const soundBtn = document.getElementById("sound-btn");
    if (soundBtn) {
        soundBtn.textContent = state.soundOff ? "🔇" : "🔊";
        soundBtn.addEventListener("click", toggleSound);
    }

    const statsBtn = document.getElementById("stats-btn");
    if (statsBtn) {
        statsBtn.addEventListener("click", openStatsModal);
    }

    // Saludo inicial de la mascota
    setTimeout(() => bounceMascot("Ciao! Sono Leo"), 1200);

    // Leo habla cada vez que lo pinchas
    const mascot = document.getElementById("path-mascot");
    if (mascot) {
        mascot.addEventListener("click", onMascotClick);
        mascot.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onMascotClick();
            }
        });
    }

    const goalRingBtn = document.getElementById("goal-ring-btn");
    if (goalRingBtn) {
        goalRingBtn.addEventListener("click", openStatsModal);
    }

    const placementBtn = document.getElementById("placement-btn");
    if (placementBtn) {
        placementBtn.addEventListener("click", openPlacementTest);
    }

    const immersiveRecord = document.getElementById("immersive-record");
    if (immersiveRecord) {
        if (!isSpeechRecognitionSupported()) {
            immersiveRecord.classList.add("hidden");
        } else {
            immersiveRecord.addEventListener("click", () => {
                const level = getActiveLevel();
                const feedback = document.getElementById("immersive-pron");
                if (level && feedback) {
                    startPronunciationCheck(level.immersiveInput || "", immersiveRecord, feedback);
                }
            });
        }
    }

    document.querySelectorAll("[data-close-modal]").forEach((el) => {
        el.addEventListener("click", () => {
            const modal = el.closest(".modal");
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            document.querySelectorAll(".modal:not(.hidden)").forEach((m) => closeModal(m.id));
        }
    });

    // Sugerencia de test de nivel la primera vez.
    if (!state.placementDone && state.completedLevelIds.length === 0) {
        const hint = document.getElementById("selector-hint");
        if (hint) {
            hint.textContent = "¿No sabes por dónde empezar? Haz el test de nivel.";
        }
    }

    registerServiceWorker();
}

function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
        return;
    }
    if (location.protocol !== "http:" && location.protocol !== "https:") {
        return;
    }
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch(() => {
            /* offline opcional: si falla, la app sigue funcionando online */
        });
    });
}
