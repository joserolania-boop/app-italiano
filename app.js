const STORAGE_KEY = "maestro-italiano-v6";
const STREAK_DAY_MS = 24 * 60 * 60 * 1000;
const KIND_WEIGHTS = {
    translation: 0.32,
    cloze: 0.24,
    choice: 0.12,
    conversation: 0.22,
    shadowing: 0.10,
    tiles: 0.10, // calentamiento de reconocimiento: cuenta poco, no es produccion
};
const DEFAULT_PASS_PERCENTAGE = 72;
const DEFAULT_DAILY_GOAL = 40;
const FREE_MODULE_COUNT = 10; // Todos los modulos libres — donacion voluntaria via Ko-fi

// Ligas estilo apps 2026: el rango se decide por XP total acumulado.
const LEAGUES = [
    { id: "principiante", name: "Principiante", icon: "🌱", minXp: 0 },
    { id: "bronce", name: "Bronce", icon: "🥉", minXp: 150 },
    { id: "plata", name: "Plata", icon: "🥈", minXp: 400 },
    { id: "oro", name: "Oro", icon: "🥇", minXp: 800 },
    { id: "zafiro", name: "Zafiro", icon: "💎", minXp: 1400 },
    { id: "rubi", name: "Rubí", icon: "❤️‍🔥", minXp: 2200 },
    { id: "maestro", name: "Maestro", icon: "👑", minXp: 3400 },
];

const state = {
    data: null,
    activeModuleId: null,
    activeLevelId: null,
    completedLevelIds: [],
    notesByLevel: {},
    exerciseByLevel: {},
    reviewByLevel: {},
    streakDays: 0,
    lastStudyDate: null,
    xp: 0,
    dailyGoal: DEFAULT_DAILY_GOAL,
    xpByDate: {},
    achievements: [],
    speechByLevel: {},
    theme: "light",
    placementDone: false,
    placementLevelId: null,
    soundOff: false,
    isPremium: false,
};
const dom = {};

window.addEventListener("error", (event) => {
    showFatalError(event.error?.message || event.message || "Error inesperado de JavaScript.");
});

window.addEventListener("unhandledrejection", (event) => {
    showFatalError(event.reason?.message || String(event.reason || "Promesa rechazada sin control."));
});

document.addEventListener("DOMContentLoaded", init);

async function init() {
    cacheDom();
    bindEvents();

    try {
        const roadmapText = await loadRoadmap();
        state.data = parseRoadmap(roadmapText);
        hydrateStateFromStorage();
        if (typeof applyTheme === "function") {
            applyTheme(state.theme);
        }
        renderAll();
        showApp();
        if (typeof initEnhancements === "function") {
            initEnhancements();
        }
    } catch (error) {
        showFatalError(error?.message || "No se pudo iniciar la app.");
    }
}

function cacheDom() {
    dom.splash = document.getElementById("splash-screen");
    dom.app = document.getElementById("app");

    dom.streakDisplay = document.getElementById("streak-display");
    dom.resetBtn = document.getElementById("reset-btn");
    dom.xpDisplay = document.getElementById("xp-display");
    dom.leaguePill = document.getElementById("league-pill");
    dom.goalRingFill = document.getElementById("goal-ring-fill");
    dom.goalRingLabel = document.getElementById("goal-ring-label");
    dom.goalRingBtn = document.getElementById("goal-ring-btn");

    dom.progressFill = document.getElementById("progress-fill");
    dom.progressLabel = document.getElementById("progress-label");

    dom.moduleTabs = document.getElementById("module-tabs");
    dom.levelGrid = document.getElementById("level-grid");

    dom.lessonSection = document.getElementById("lesson-section");
    dom.lessonTitle = document.getElementById("lesson-title");
    dom.lessonObjective = document.getElementById("lesson-objective");
    dom.immersiveText = document.getElementById("immersive-text");
    dom.immersiveSpeak = document.getElementById("immersive-speak");
    dom.immersiveRecord = document.getElementById("immersive-record");
    dom.immersivePron = document.getElementById("immersive-pron");
    dom.helpGrammar = document.getElementById("help-grammar");
    dom.helpPatch = document.getElementById("help-patch");
    dom.pretestQuestion = document.getElementById("pretest-question");
    dom.pretestInput = document.getElementById("pretest-input");
    dom.pretestCheckBtn = document.getElementById("pretest-check-btn");
    dom.pretestFeedback = document.getElementById("pretest-feedback");
    dom.theoryRule = document.getElementById("theory-rule");
    dom.theoryContrast = document.getElementById("theory-contrast");
    dom.theoryExample = document.getElementById("theory-example");
    dom.theoryMistake = document.getElementById("theory-mistake");
    dom.theoryFormula = document.getElementById("theory-formula");
    dom.theoryUsage = document.getElementById("theory-usage");
    dom.theoryAssumptions = document.getElementById("theory-assumptions");
    dom.theoryChecklist = document.getElementById("theory-checklist");
    dom.theoryReferenceBox = document.getElementById("theory-reference-box");
    dom.theoryReferenceList = document.getElementById("theory-reference-list");

    dom.backToLevels = document.getElementById("back-to-levels");

    dom.checkBtn = document.getElementById("check-btn");
    dom.retryBtn = document.getElementById("retry-btn");
    dom.exercisesList = document.getElementById("exercises-list");
    dom.noExercisesMsg = document.getElementById("no-exercises-msg");

    dom.scoreBar = document.getElementById("score-bar");
    dom.scoreText = document.getElementById("score-text");
    dom.scoreFill = document.getElementById("score-fill");

    dom.completeBtn = document.getElementById("complete-btn");
    dom.completeHint = document.getElementById("complete-hint");

    dom.notesArea = document.getElementById("notes-area");
}

function bindEvents() {
    dom.resetBtn.addEventListener("click", onResetProgress);
    dom.backToLevels.addEventListener("click", onBackToLevels);
    dom.immersiveSpeak.addEventListener("click", onSpeakImmersive);
    dom.pretestInput.addEventListener("input", onPretestInput);
    dom.pretestCheckBtn.addEventListener("click", onPretestCheck);
    dom.checkBtn.addEventListener("click", onCheckExercises);
    dom.retryBtn.addEventListener("click", onRetryExercises);
    dom.completeBtn.addEventListener("click", onCompleteLevel);
    dom.notesArea.addEventListener("input", onNotesInput);

    // ── Premium / Ko-fi ──
    document.getElementById("kofi-header-btn")?.addEventListener("click", showUnlockModal);
    document.getElementById("unlock-code-btn")?.addEventListener("click", onActivateCode);
    document.getElementById("unlock-code-input")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") onActivateCode();
    });
    document.querySelectorAll("[data-close-modal]").forEach((el) => {
        el.addEventListener("click", (e) => {
            const modal = e.target.closest(".modal");
            if (modal) modal.classList.add("hidden");
        });
    });
}

function showUnlockModal() {
    const modal = document.getElementById("unlock-modal");
    if (!modal) return;
    const fb = document.getElementById("unlock-code-feedback");
    if (fb) { fb.textContent = ""; fb.className = "unlock-code-feedback hidden"; }
    const input = document.getElementById("unlock-code-input");
    if (input) input.value = "";
    modal.classList.remove("hidden");
    setTimeout(() => input?.focus(), 80);
}

async function onActivateCode() {
    const input = document.getElementById("unlock-code-input");
    const fb = document.getElementById("unlock-code-feedback");
    const btn = document.getElementById("unlock-code-btn");
    if (!input || !fb) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
        fb.textContent = "Introduce un código.";
        fb.className = "unlock-code-feedback error";
        return;
    }

    btn.disabled = true;
    btn.textContent = "Verificando...";
    fb.textContent = "";
    fb.className = "unlock-code-feedback hidden";

    try {
        const resp = await fetch(`/unlock?code=${encodeURIComponent(code)}`);
        const json = await resp.json().catch(() => ({}));
        if (resp.ok && json.valid) {
            state.isPremium = true;
            persistState();
            renderModuleTabs();
            renderLevelGrid();
            document.getElementById("unlock-modal")?.classList.add("hidden");
            if (typeof showToast === "function") {
                showToast("¡Curso desbloqueado! 🎉", "Acceso completo M1–M10 activado.", "xp");
            }
        } else {
            fb.textContent = json.message || "Código no válido. Revísalo e inténtalo de nuevo.";
            fb.className = "unlock-code-feedback error";
        }
    } catch {
        fb.textContent = "Error de red. Comprueba tu conexión e inténtalo de nuevo.";
        fb.className = "unlock-code-feedback error";
    } finally {
        btn.disabled = false;
        btn.textContent = "Activar";
    }
}

async function loadRoadmap() {
    const response = await fetch("./Roadmap_Maestro_Italiano.md");
    if (!response.ok) {
        throw new Error(`No se pudo cargar Roadmap_Maestro_Italiano.md (HTTP ${response.status}).`);
    }
    return response.text();
}

function parseRoadmap(text) {
    const normalizedText = String(text || "").replace(/\r\n/g, "\n");
    const moduleSummaryBlock = sliceBetween(normalizedText, "## Fase 1. Diagnostico y Planificacion PAL", "### Pseudocodigo maestro");
    const moduleSummaries = parseMarkdownTable(moduleSummaryBlock).map((row) => ({
        id: safeCell(row, "Modulo"),
        range: safeCell(row, "Rango"),
        focus: safeCell(row, "Foco tecnico"),
    }));

    const moduleSections = [...normalizedText.matchAll(/###\s+(M\d+)\.\s+([^\n]+)\n\n([\s\S]*?)(?=\n###\s+M\d+\.|\n##\s+Regla de uso diario|$)/g)];

    const modules = [];
    const levels = [];

    moduleSections.forEach((match) => {
        const moduleId = (match[1] || "").trim();
        const moduleTitle = (match[2] || "").trim();
        const rows = parseMarkdownTable(match[3] || "");
        const summary = moduleSummaries.find((item) => item.id === moduleId);

        const moduleLevels = rows.map((row) => ({
            id: safeCell(row, "Nivel"),
            moduleId,
            moduleTitle,
            objective: safeCell(row, "Objetivo"),
            grammar: safeCell(row, "XML gramatica"),
            immersiveInput: safeCell(row, "Input inmersivo"),
            patchPriority: safeCell(row, "Patch prioritario"),
        })).filter((level) => level.id);

        modules.push({
            id: moduleId,
            title: moduleTitle,
            range: summary?.range || "",
            focus: summary?.focus || "",
            levels: moduleLevels,
        });

        levels.push(...moduleLevels);
    });

    if (!modules.length || !levels.length) {
        throw new Error("No se detectaron modulos o niveles validos en el roadmap.");
    }

    return { modules, levels };
}

function parseMarkdownTable(block) {
    const lines = String(block || "")
        .split(/\r?\n/)
        .filter((line) => line.trim().startsWith("|"));

    if (lines.length < 3) {
        return [];
    }

    const headers = splitTableLine(lines[0]);
    return lines.slice(2).map((line) => {
        const cells = splitTableLine(line);
        return headers.reduce((acc, header, index) => {
            acc[header] = cells[index] || "";
            return acc;
        }, {});
    });
}

function splitTableLine(line) {
    return line
        .trim()
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());
}

function sliceBetween(text, startMarker, endMarker) {
    const start = text.indexOf(startMarker);
    if (start === -1) {
        return "";
    }
    const end = text.indexOf(endMarker, start);
    if (end === -1) {
        return "";
    }
    return text.slice(start, end);
}

function safeCell(row, key) {
    const value = row?.[key];
    if (!value) {
        return "";
    }
    // Las celdas del roadmap vienen en markdown envueltas en comillas invertidas
    // (`texto`). Sin quitarlas se mostraban literalmente en la frase del nivel.
    return String(value).trim().replace(/^`+|`+$/g, "").trim();
}

function hydrateStateFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
        try {
            const saved = JSON.parse(raw);
            state.activeModuleId = saved.activeModuleId || null;
            state.activeLevelId = saved.activeLevelId || null;
            state.completedLevelIds = Array.isArray(saved.completedLevelIds) ? saved.completedLevelIds : [];
            state.notesByLevel = saved.notesByLevel || {};
            state.exerciseByLevel = saved.exerciseByLevel || {};
            state.reviewByLevel = saved.reviewByLevel || {};
            state.streakDays = Number(saved.streakDays || 0);
            state.lastStudyDate = saved.lastStudyDate || null;
            state.xp = Number(saved.xp || 0);
            state.dailyGoal = Number(saved.dailyGoal || DEFAULT_DAILY_GOAL);
            state.xpByDate = saved.xpByDate || {};
            state.achievements = Array.isArray(saved.achievements) ? saved.achievements : [];
            state.speechByLevel = saved.speechByLevel || {};
            state.theme = saved.theme === "dark" ? "dark" : "light";
            state.placementDone = Boolean(saved.placementDone);
            state.placementLevelId = saved.placementLevelId || null;
            state.soundOff = Boolean(saved.soundOff);
            state.isPremium = Boolean(saved.isPremium);
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    const firstModule = state.data.modules[0];
    const firstLevel = state.data.levels[0];

    const validModule = state.data.modules.some((mod) => mod.id === state.activeModuleId);
    if (!validModule) {
        state.activeModuleId = firstModule?.id || null;
    }

    const validLevel = state.data.levels.some((level) => level.id === state.activeLevelId);
    if (!validLevel) {
        state.activeLevelId = firstLevel?.id || null;
    }

    refreshStreakOnLoad();
    persistState();
}

function persistState() {
    const snapshot = {
        activeModuleId: state.activeModuleId,
        activeLevelId: state.activeLevelId,
        completedLevelIds: state.completedLevelIds,
        notesByLevel: state.notesByLevel,
        exerciseByLevel: state.exerciseByLevel,
        reviewByLevel: state.reviewByLevel,
        streakDays: state.streakDays,
        lastStudyDate: state.lastStudyDate,
        xp: state.xp,
        dailyGoal: state.dailyGoal,
        xpByDate: state.xpByDate,
        achievements: state.achievements,
        speechByLevel: state.speechByLevel,
        theme: state.theme,
        placementDone: state.placementDone,
        placementLevelId: state.placementLevelId,
        soundOff: state.soundOff,
        isPremium: state.isPremium,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function daysBetween(fromKey, toKey) {
    return Math.round((new Date(`${toKey}T00:00:00`) - new Date(`${fromKey}T00:00:00`)) / STREAK_DAY_MS);
}

// Al abrir la app SOLO se comprueba si la racha se ha roto. Nunca se incrementa:
// abrir la app no es estudiar. La racha sube en registerStudyToday(), que se
// dispara al ganar XP (es decir, al practicar de verdad).
function refreshStreakOnLoad() {
    if (!state.lastStudyDate) {
        state.streakDays = 0;
        return;
    }
    const todayKey = dateKey(new Date());
    if (state.lastStudyDate === todayKey) {
        return;
    }
    if (daysBetween(state.lastStudyDate, todayKey) > 1) {
        state.streakDays = 0;
    }
}

// Se llama cuando el usuario practica de verdad.
function registerStudyToday() {
    const todayKey = dateKey(new Date());
    if (state.lastStudyDate === todayKey) {
        return false;
    }
    const continua = state.lastStudyDate && daysBetween(state.lastStudyDate, todayKey) === 1;
    state.streakDays = continua ? (state.streakDays || 0) + 1 : 1;
    state.lastStudyDate = todayKey;
    return true;
}

// Fecha LOCAL, no UTC: con toISOString() estudiar de noche contaba como el dia
// anterior en cualquier huso al este de Greenwich y rompia la racha sin motivo.
function dateKey(dateObj) {
    const anio = dateObj.getFullYear();
    const mes = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dia = String(dateObj.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}

function renderAll() {
    renderTopBar();
    renderProgress();
    renderModuleTabs();
    renderLevelGrid();
    renderLesson();
}

function renderTopBar() {
    dom.streakDisplay.textContent = `🔥 ${state.streakDays} dia${state.streakDays === 1 ? "" : "s"}`;

    if (dom.xpDisplay) {
        dom.xpDisplay.textContent = `⚡ ${state.xp} XP`;
    }

    const league = getCurrentLeague();
    if (dom.leaguePill) {
        dom.leaguePill.textContent = `${league.icon} ${league.name}`;
        dom.leaguePill.title = nextLeagueHint(league);
    }

    renderDailyGoalRing();
}

function getCurrentLeague() {
    let current = LEAGUES[0];
    for (const league of LEAGUES) {
        if (state.xp >= league.minXp) {
            current = league;
        }
    }
    return current;
}

function nextLeagueHint(currentLeague) {
    const idx = LEAGUES.findIndex((league) => league.id === currentLeague.id);
    const next = LEAGUES[idx + 1];
    if (!next) {
        return "Has alcanzado la liga maxima. ¡Enhorabuena!";
    }
    const remaining = Math.max(0, next.minXp - state.xp);
    return `Te faltan ${remaining} XP para la liga ${next.name}.`;
}

function getTodayXp() {
    return Number(state.xpByDate[dateKey(new Date())] || 0);
}

function renderDailyGoalRing() {
    if (!dom.goalRingFill || !dom.goalRingLabel) {
        return;
    }
    const goal = Math.max(10, state.dailyGoal || DEFAULT_DAILY_GOAL);
    const todayXp = getTodayXp();
    const pct = Math.min(100, Math.round((todayXp / goal) * 100));
    const circumference = 2 * Math.PI * 15.9155;
    dom.goalRingFill.style.strokeDasharray = `${circumference}`;
    dom.goalRingFill.style.strokeDashoffset = `${circumference * (1 - pct / 100)}`;
    dom.goalRingFill.classList.toggle("complete", pct >= 100);
    dom.goalRingLabel.textContent = pct >= 100 ? "✓" : `${pct}%`;
    if (dom.goalRingBtn) {
        dom.goalRingBtn.title = `Meta diaria: ${todayXp}/${goal} XP hoy`;
    }
}

// ─── XP y logros ───
function awardXp(amount, reason) {
    const gain = Math.max(0, Math.round(amount || 0));
    if (!gain) {
        return;
    }
    const today = dateKey(new Date());
    const beforeGoalMet = getTodayXp() >= (state.dailyGoal || DEFAULT_DAILY_GOAL);

    state.xp += gain;
    state.xpByDate[today] = Number(state.xpByDate[today] || 0) + gain;

    // Practicar de verdad es lo que mantiene viva la racha, no abrir la app.
    const rachaSubio = registerStudyToday();

    persistState();
    renderTopBar();

    if (rachaSubio && typeof showToast === "function") {
        showToast(`🔥 Racha de ${state.streakDays} día${state.streakDays === 1 ? "" : "s"}`, "Sigue mañana para no perderla", "goal");
    }

    if (typeof showToast === "function") {
        showToast(`+${gain} XP`, reason || "", "xp");
    }

    const afterGoalMet = getTodayXp() >= (state.dailyGoal || DEFAULT_DAILY_GOAL);
    if (!beforeGoalMet && afterGoalMet && typeof showToast === "function") {
        showToast("🎯 Meta diaria conseguida", `Has llegado a ${state.dailyGoal} XP hoy`, "goal");
    }

    checkAchievements();
}

function checkAchievements() {
    if (typeof ACHIEVEMENTS === "undefined") {
        return;
    }
    ACHIEVEMENTS.forEach((achievement) => {
        if (state.achievements.includes(achievement.id)) {
            return;
        }
        let unlocked = false;
        try {
            unlocked = achievement.test(state);
        } catch {
            unlocked = false;
        }
        if (unlocked) {
            state.achievements.push(achievement.id);
            persistState();
            if (typeof showToast === "function") {
                showToast(`${achievement.icon} Logro: ${achievement.title}`, achievement.desc, "achievement");
            }
        }
    });
}

function renderProgress() {
    const total = state.data.levels.length;
    const done = state.completedLevelIds.length;
    const pct = Math.min(100, Math.round((done / total) * 100));

    dom.progressFill.style.width = `${pct}%`;
    dom.progressLabel.textContent = `${done} / ${total} niveles`;
}

function renderModuleTabs() {
    dom.moduleTabs.innerHTML = "";

    state.data.modules.forEach((mod, modIndex) => {
        const isLocked = !state.isPremium && modIndex >= FREE_MODULE_COUNT;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `module-tab ${mod.id === state.activeModuleId ? "active" : ""} ${isLocked ? "locked" : ""}`.trim();

        const done = mod.levels.filter((level) => state.completedLevelIds.includes(level.id)).length;
        const lockBadge = isLocked ? `<span class="tab-lock">🔒</span>` : "";

        btn.innerHTML = `${mod.id} ${lockBadge}<span class="tab-progress">${isLocked ? "Premium" : `${done}/${mod.levels.length}`}</span>`;
        btn.addEventListener("click", () => {
            if (isLocked) {
                showUnlockModal();
                return;
            }
            state.activeModuleId = mod.id;
            const firstLevel = mod.levels[0];
            if (firstLevel) {
                state.activeLevelId = firstLevel.id;
            }
            persistState();
            renderModuleTabs();
            renderLevelGrid();
            renderLesson();
        });

        dom.moduleTabs.appendChild(btn);
    });
}

const PATH_ICONS = ["🏛️", "🗼", "⛪", "🏟️", "⛲", "🎭", "🚤", "🌉", "🗿", "🏆"];
const PATH_OFFSETS = [0, 1, 2, 1, 0, -1, -2, -1, 0, 1];

function getPathIcon(index, isCompleted) {
    if (isCompleted && typeof ITALY_STAR === "string") return ITALY_STAR;
    if (typeof PATH_MONUMENTS !== "undefined" && PATH_MONUMENTS[index % PATH_MONUMENTS.length]) {
        return PATH_MONUMENTS[index % PATH_MONUMENTS.length];
    }
    // Fallback a emoji si el archivo de assets no cargo
    return isCompleted ? "⭐" : (PATH_ICONS[index % PATH_ICONS.length] || "📘");
}

function renderLevelGrid() {
    dom.levelGrid.innerHTML = "";

    const module = getActiveModule();
    if (!module) {
        return;
    }

    const modIndex = state.data.modules.findIndex((m) => m.id === module.id);
    const isModuleLocked = !state.isPremium && modIndex >= FREE_MODULE_COUNT;

    // Si el modulo entero esta bloqueado, mostrar banner en vez del camino.
    if (isModuleLocked) {
        const banner = document.createElement("div");
        banner.className = "premium-banner";
        banner.innerHTML = `
            <div class="premium-banner-icon">🔒</div>
            <h3 class="premium-banner-title">Contenido Premium</h3>
            <p class="premium-banner-desc">Este módulo forma parte del curso completo.<br>Desbloquea <strong>M3 – M10</strong> (80 niveles, B1 → C2) con un pago único.</p>
            <button type="button" class="btn btn-premium" id="unlock-from-grid">Ver opciones de acceso</button>
        `;
        dom.levelGrid.appendChild(banner);
        document.getElementById("unlock-from-grid")?.addEventListener("click", showUnlockModal);
        return;
    }

    const path = document.createElement("div");
    path.className = "lesson-path";

    module.levels.forEach((level, index) => {
        const isCompleted = state.completedLevelIds.includes(level.id);
        const isActive = level.id === state.activeLevelId;
        const bloqueado = !estaDesbloqueado(level.id);

        const row = document.createElement("div");
        row.className = "path-row";
        const offset = PATH_OFFSETS[index % PATH_OFFSETS.length];
        row.style.setProperty("--path-offset", offset);

        let stateClass = "future";
        if (bloqueado) stateClass = "bloqueado";
        if (isCompleted) stateClass = "completed";
        if (isActive) stateClass = "active";

        const icon = getPathIcon(index, isCompleted);
        const bubbleText = isCompleted ? "REPASAR" : "EMPEZAR";

        const node = document.createElement("button");
        node.type = "button";
        node.className = `path-node ${stateClass}`;
        node.setAttribute("aria-label", `${level.id} — ${level.objective || ""}`);
        node.innerHTML = `
            ${isActive ? `<span class="path-bubble">${bubbleText}</span>` : ""}
            <span class="path-node-inner">
                <span class="path-node-icon">${icon}</span>
            </span>
            <span class="path-node-id">${level.id.split("-").pop()}</span>
        `;

        node.addEventListener("click", () => {
            if (bloqueado) {
                leoDice("Prima questo!");
                if (typeof showToast === "function") {
                    showToast("🔒 Nivel bloqueado", "Termina el nivel anterior para abrir este", "goal");
                }
                return;
            }
            state.activeLevelId = level.id;
            reiniciarSesion();
            persistState();
            renderLevelGrid();
            renderLesson();
            leoAlAzar(LEO_BIENVENIDA, "celebra");
            if (typeof bounceMascot === "function") bounceMascot();
            dom.lessonSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        row.appendChild(node);
        path.appendChild(row);
    });

    dom.levelGrid.appendChild(path);
}

function renderLesson() {
    const level = getActiveLevel();
    if (!level) {
        dom.lessonSection.classList.add("hidden");
        return;
    }

    dom.lessonSection.classList.remove("hidden");

    dom.lessonTitle.textContent = level.id;
    dom.lessonObjective.textContent = level.objective || "";
    // La frase del nivel usa el EJEMPLO de la teoria, no el input inmersivo: son
    // frases distintas con la misma gramatica. El input inmersivo se reutilizaba
    // tal cual en los ejercicios (71% de solape medio, 71 niveles por encima del
    // 60%), asi que daba la respuesta hecha. Con el ejemplo baja al 25%.
    dom.immersiveText.textContent = fraseDelNivel(level);
    dom.helpGrammar.textContent = simplifyGrammar(level.grammar);
    dom.helpPatch.textContent = buildPatchCoaching(level.patchPriority);

    dom.notesArea.value = state.notesByLevel[level.id] || "";
    renderLearningGuide(level);

    renderExerciseArea(level);
}

function renderLearningGuide(level) {
    const guide = getLearningGuide(level.id);
    const levelState = getExerciseState(level.id);
    const support = buildTheorySupport(level, guide);

    dom.pretestQuestion.textContent = guide?.pretest?.question || "Piensa como responderias antes de estudiar este nivel.";
    dom.pretestInput.value = levelState.pretestResponse || "";
    dom.pretestFeedback.classList.add("hidden");
    dom.pretestFeedback.innerHTML = "";

    if (levelState.pretestChecked && guide?.pretest) {
        dom.pretestFeedback.innerHTML = buildPretestFeedback(level.id, guide.pretest);
        dom.pretestFeedback.classList.remove("hidden");
    }

    dom.theoryRule.textContent = guide?.theory?.rule || simplifyGrammar(level.grammar);
    dom.theoryContrast.textContent = guide?.theory?.contrast || "Compara esta estructura con el espanol antes de responder.";
    dom.theoryExample.textContent = guide?.theory?.example || (level.immersiveInput || "Sin ejemplo disponible.");
    dom.theoryMistake.textContent = guide?.theory?.mistake || (level.patchPriority || "No repitas el error mas frecuente del nivel.");
    dom.theoryFormula.textContent = support.formula;
    dom.theoryUsage.textContent = support.usage;
    renderTheoryList(dom.theoryAssumptions, support.assumptions);
    renderTheoryList(dom.theoryChecklist, support.checklist);
    renderTheoryReferences(level, guide);
}

function renderTheoryList(container, items) {
    container.innerHTML = "";
    (items || []).filter(Boolean).forEach((item) => {
        const entry = document.createElement("li");
        entry.textContent = item;
        container.appendChild(entry);
    });
}

function buildTheorySupport(level, guide) {
    const attributes = extractXmlAttributes(level.grammar);
    const focus = cleanGrammarText(attributes.foco || "");
    const transfer = cleanGrammarText(attributes.transferencia || "");
    const example = guide?.theory?.example || level.immersiveInput || "Sin ejemplo disponible.";
    const rule = guide?.theory?.rule || simplifyGrammar(level.grammar);
    const contrast = guide?.theory?.contrast || transfer || "el italiano no siempre copia el espanol palabra por palabra";
    const mistake = guide?.theory?.mistake || level.patchPriority || "no responder con una estructura incompleta";
    const moduleNumber = getModuleNumber(level.id);

    return {
        formula: buildTheoryFormula(focus, example, rule),
        usage: buildTheoryUsage(level.objective, moduleNumber),
        assumptions: buildTheoryAssumptions({ focus, contrast, mistake }),
        checklist: buildTheoryChecklist({ focus, example, mistake, moduleNumber }),
    };
}

function buildTheoryFormula(focus, example, rule) {
    const shortExample = firstSentence(example);
    if (focus) {
        return `Piensa primero en este molde: ${focus}. Si dudas, copia una frase corta como ${shortExample}`;
    }
    return `${rule} Si dudas, apóyate en este ejemplo: ${shortExample}`;
}

function buildTheoryUsage(objective, moduleNumber) {
    const cleanObjective = String(objective || "").trim().toLowerCase();
    const closing = moduleNumber >= 5
        ? "Empieza por una version corta correcta y luego ampliala con una segunda idea."
        : "Empieza por una frase corta y correcta antes de complicarla.";

    if (cleanObjective) {
        return `Usalo cuando quieras ${cleanObjective}. ${closing}`;
    }

    return `Usalo en respuestas del tipo que practica este nivel. ${closing}`;
}

function buildTheoryAssumptions(context) {
    const items = [];

    if (context.contrast) {
        items.push(`No supongas que funciona igual que en espanol: ${context.contrast}`);
    }
    if (context.focus) {
        items.push(`No des por sabida la estructura central: ${context.focus}`);
    }
    if (context.mistake) {
        items.push(`Antes de responder, bloquea este error: ${context.mistake}`);
    }

    return items.slice(0, 3);
}

function buildTheoryChecklist(context) {
    const items = [];

    if (context.focus) {
        items.push(`He usado la estructura principal del nivel: ${context.focus}.`);
    }
    if (context.example) {
        items.push(`Mi respuesta se parece al molde del ejemplo y no a una traduccion palabra por palabra.`);
    }
    if (context.mistake) {
        items.push(`He revisado este punto conflictivo: ${context.mistake}.`);
    }

    if (context.moduleNumber >= 5) {
        items.push("He unido las ideas con una estructura clara y no he respondido de forma demasiado telegráfica.");
    } else {
        items.push("He escrito una frase completa con verbo y no solo palabras sueltas.");
    }

    return items.slice(0, 4);
}

function firstSentence(text) {
    const cleanText = String(text || "").trim();
    if (!cleanText) {
        return "Sin ejemplo disponible.";
    }

    const firstChunk = cleanText.split(/[.!?]/)[0]?.trim();
    return firstChunk ? `${firstChunk}.` : cleanText;
}

function renderTheoryReferences(level, guide) {
    const references = getTheoryReferences(level, guide);

    dom.theoryReferenceList.innerHTML = "";

    if (!references.length) {
        dom.theoryReferenceBox.classList.add("hidden");
        dom.theoryReferenceBox.open = false;
        return;
    }

    references.forEach((reference) => {
        dom.theoryReferenceList.appendChild(buildReferenceCard(reference));
    });

    dom.theoryReferenceBox.classList.remove("hidden");
}

function getTheoryReferences(level, guide) {
    const bank = typeof GRAMMAR_REFERENCE_BANK !== "undefined" ? GRAMMAR_REFERENCE_BANK : null;
    if (!bank) {
        return [];
    }

    const explicitKeys = Array.isArray(guide?.referenceKeys) ? guide.referenceKeys : [];
    const keys = explicitKeys.length ? explicitKeys : inferTheoryReferenceKeys(level, guide);

    return [...new Set(keys)]
        .map((key) => bank[key])
        .filter(Boolean)
        .slice(0, 2);
}

function inferTheoryReferenceKeys(level, guide) {
    const haystack = normalizeText([
        level?.objective,
        level?.grammar,
        level?.patchPriority,
        guide?.theory?.rule,
        guide?.theory?.contrast,
        guide?.theory?.mistake,
    ].filter(Boolean).join(" "));

    const matchers = [
        { key: "articoli-base", terms: ["articol", "determinativi", "zero articolo", "articulos basicos"] },
        { key: "essere-presente", terms: ["essere", "sono +", "io/tu"] },
        { key: "avere-edad", terms: ["avere", "eta", "anni"] },
        { key: "ore-e-rutina", terms: ["ore", "rutina", "alle ", "tempo basico"] },
        { key: "presente-regolare", terms: ["-are", "-ere", "-ire", "presente"] },
        { key: "verbi-irregolari-base", terms: ["irregolar", "vado", "faccio", "vengo"] },
        { key: "preposizioni-semplici", terms: ["a/in/su/con", "a/in", "preposizioni basiche", "movimiento"] },
        { key: "preposizioni-articolate", terms: ["al, del, nel, sul", "preposiciones articuladas", "al cinema", "nel bar"] },
        { key: "plurale-e-concordanza", terms: ["plural", "concordancia", "genero/numero"] },
        { key: "cortesia-vorrei", terms: ["vorrei", "per favore", "cortesia", "condizionale"] },
        { key: "riflessivi-base", terms: ["riflessivi", "mi alzo", "particula reflexiva"] },
        { key: "modali-base", terms: ["dovere", "potere", "volere", "modale"] },
        { key: "passato-prossimo-avere", terms: ["passato prossimo con avere", "participio regolare"] },
        { key: "passato-prossimo-essere", terms: ["passato prossimo con essere", "movimiento frecuentes usan essere", "concordancia del participio"] },
        { key: "ce-ci-sono", terms: ["c'è", "ci sono", "existencia"] },
        { key: "comparativi-superlativi", terms: ["comparativi", "superlativo", "più", "meno"] },
        { key: "clitici-diretti", terms: ["lo/la/li/le", "pronombres directos", "cliticos directos"] },
        { key: "clitici-indiretti", terms: ["gli/le", "indirectos", "destinatario"] },
        { key: "ci-ne", terms: ["ci/ne", "ci suele", "ne puede"] },
        { key: "futuro-semplice", terms: ["futuro semplice", "futuro simple"] },
        { key: "congiuntivo-trigger", terms: ["congiuntivo", "penso che", "spero che", "non credo che", "temo che"] },
    ];

    return matchers
        .filter((matcher) => matcher.terms.some((term) => haystack.includes(normalizeText(term))))
        .map((matcher) => matcher.key);
}

function buildReferenceCard(reference) {
    const card = document.createElement("article");
    card.className = "reference-card";

    const header = document.createElement("div");
    header.className = "reference-card-header";
    header.innerHTML = `
        <span class="reference-type">${escapeHtml(reference.type || "Referencia")}</span>
        <h4>${escapeHtml(reference.title || "Referencia util")}</h4>
    `;
    card.appendChild(header);

    if (reference.summary) {
        const summary = document.createElement("p");
        summary.className = "reference-summary";
        summary.textContent = reference.summary;
        card.appendChild(summary);
    }

    if (Array.isArray(reference.entries) && reference.entries.length) {
        const rows = document.createElement("div");
        rows.className = "reference-rows";

        reference.entries.forEach((entry) => {
            const row = document.createElement("div");
            row.className = "reference-row";
            row.innerHTML = `
                <span class="reference-row-key">${escapeHtml(entry[0] || "")}</span>
                <span class="reference-row-value">${escapeHtml(entry[1] || "")}</span>
            `;
            rows.appendChild(row);
        });

        card.appendChild(rows);
    }

    if (Array.isArray(reference.examples) && reference.examples.length) {
        const examples = document.createElement("ul");
        examples.className = "reference-examples";

        reference.examples.forEach((example) => {
            const item = document.createElement("li");
            item.textContent = example;
            examples.appendChild(item);
        });

        card.appendChild(examples);
    }

    if (reference.note) {
        const note = document.createElement("p");
        note.className = "reference-note";
        note.textContent = reference.note;
        card.appendChild(note);
    }

    return card;
}

// ─── Sesion paso a paso (un ejercicio por pantalla) ───
// Antes se soltaban los 5 ejercicios en una pared vertical y habia que
// scrollear la teoria entera para llegar. Eso parecia deberes. Ahora se va de
// uno en uno, con correccion inmediata, como en las apps de idiomas.
let pasoActual = 0;
let resultadoDelPaso = null;

function reiniciarSesion() {
    pasoActual = 0;
    resultadoDelPaso = null;
}

// Leo reacciona a lo que acabas de hacer, en vez de soltar frases al azar.
const LEO_ACIERTO = ["Bravissimo!", "Perfetto!", "Che bello!", "Continua così!", "Sei un mito!"];
const LEO_FALLO = ["Dai, ci sei quasi!", "Niente paura!", "Piano piano...", "Riprova, amico!"];

// Leo habla y ADEMAS se mueve. Antes solo cambiaba el texto de un bocadillo
// diminuto, asi que no se notaba que estuviera reaccionando a nada.
function leoDice(frase, animacion) {
    const burbuja = document.getElementById("mascot-bubble");
    if (burbuja) {
        burbuja.textContent = frase;
        burbuja.classList.add("show");
        clearTimeout(leoDice._t);
        leoDice._t = setTimeout(() => burbuja.classList.remove("show"), 3800);
    }
    const cuerpo = document.querySelector(".mascot-body");
    if (cuerpo && animacion) {
        cuerpo.classList.remove("celebra", "anima");
        void cuerpo.offsetWidth; // reinicia la animacion
        cuerpo.classList.add(animacion);
        setTimeout(() => cuerpo.classList.remove(animacion), 800);
    }
}

// Frases por momento, para que acompane el recorrido en vez de repetir lo mismo.
const LEO_BIENVENIDA = ["Andiamo! (¡Vamos!)", "Cominciamo! (¡Empezamos!)", "Pronto? (¿Listo?)"];
const LEO_LECCION = ["Attento! (¡Atento!)", "Guarda bene! (¡Fíjate bien!)", "Questo è importante!"];
const LEO_NIVEL_HECHO = ["Bravissimo! Livello finito!", "Che campione! (¡Qué campeón!)", "Ottimo lavoro! (¡Buen trabajo!)"];

function leoAlAzar(lista, animacion) {
    leoDice(lista[Math.floor(Math.random() * lista.length)], animacion);
}

// Frase que se muestra y se escucha en la cabecera del nivel.
function fraseDelNivel(level) {
    const ejemplo = getLearningGuide(level.id)?.theory?.example;
    return ejemplo || level.immersiveInput || "Sin texto de practica para este nivel.";
}

// Un nivel se abre cuando has terminado el anterior. Antes se podia pinchar
// M10-L10 el primer dia, asi que la progresion no significaba nada.
// Excepcion: el test de nivel puede colocarte mas adelante, y todo lo anterior
// a ese punto de partida queda abierto para que no te encierre.
function estaDesbloqueado(levelId) {
    const niveles = state.data?.levels || [];
    const idx = niveles.findIndex((l) => l.id === levelId);
    if (idx <= 0) {
        return true;
    }
    if (state.completedLevelIds.includes(levelId)) {
        return true;
    }
    if (state.completedLevelIds.includes(niveles[idx - 1].id)) {
        return true;
    }
    // Punto de partida elegido con el test de nivel.
    const inicio = niveles.findIndex((l) => l.id === state.placementLevelId);
    return inicio >= 0 && idx <= inicio;
}

// ─── Ejercicios de CONJUGAR y de VOCABULARIO ───
// El temario cubre bien la gramatica, pero no habia ni un solo ejercicio de
// conjugar un verbo ni de vocabulario (contados: 0 y 0). Se generan a partir de
// las tablas de los cuadros de referencia, que ya traen los datos reales, y se
// montan como cloze y choice para no anadir renderizado ni evaluacion nuevos.
function filasUtiles(ficha) {
    return (ficha?.entries || []).filter(
        (f) => Array.isArray(f) && f.length >= 2 && String(f[0]).trim() && String(f[1]).trim()
    );
}

// Conjugacion -> cloze: "io ___ · tu ___ · lui/lei ___"
function construirDrillConjugacion(levelId, ficha) {
    const filas = filasUtiles(ficha).filter((f) => !String(f[1]).includes("/"));
    if (filas.length < 3) {
        return null;
    }
    const elegidas = barajaEstable(filas, `${levelId}:conj`).slice(0, 3);
    return {
        id: "conj-1",
        kind: "cloze",
        label: "VB",
        prompt: `Conjuga · ${ficha.title}`,
        sentence: elegidas.map((f) => `${String(f[0]).trim()} ___`).join("   ·   "),
        blanks: elegidas.map((f) => String(f[1]).trim()),
        feedback: `Repasa el cuadro «${ficha.title}». Estas formas hay que tenerlas automatizadas.`,
    };
}

// Vocabulario -> choice: elegir el equivalente, con distractores de la misma ficha.
function construirDrillVocabulario(levelId, ficha) {
    const filas = filasUtiles(ficha);
    if (filas.length < 3) {
        return null;
    }
    const mezcladas = barajaEstable(filas, `${levelId}:voc`);
    const buena = mezcladas[0];
    const opciones = barajaEstable(
        [String(buena[1]).trim(), String(mezcladas[1][1]).trim(), String(mezcladas[2][1]).trim()],
        `${levelId}:opts`
    );
    if (new Set(opciones).size < 3) {
        return null; // sin distractores distintos no hay ejercicio real
    }
    return {
        id: "voc-1",
        kind: "choice",
        label: "VOC",
        prompt: `¿Qué corresponde a «${String(buena[0]).trim()}»?`,
        options: opciones,
        answer: String(buena[1]).trim(),
        feedback: `Vocabulario del cuadro «${ficha.title}».`,
    };
}

// La sesion mezcla LECCIONES obligatorias con los ejercicios, en vez de
// examinar directamente. Antes la app pedia producir sin haber ensenado nada:
// la teoria estaba en un panel aparte que se podia saltar entero.
function construirPasos(levelId, pack) {
    const teoria = getLearningGuide(levelId)?.theory || {};
    const drills = Array.isArray(pack?.drills) ? pack.drills : [];
    const pasos = [];

    if (teoria.rule) {
        pasos.push({
            tipo: "leccion",
            titulo: "La regla de este nivel",
            cuerpo: teoria.rule,
            ejemplo: teoria.example || "",
            conTabla: true, // adjunta el cuadro de conjugacion si el nivel tiene uno
        });
    }

    // Justo tras la leccion, practica lo que la tabla acaba de ensenar.
    const nivel = (state.data?.levels || []).find((l) => l.id === levelId);
    const fichas = nivel ? getTheoryReferences(nivel, getLearningGuide(levelId)) : [];
    // El banco marca cada ficha con su tipo: las de "Conjugacion" dan ejercicio
    // de verbos; las de "Lista" (expresiones, numeros...) dan el de vocabulario.
    const fichaVerbos = fichas.find((f) => f.type === "Conjugacion");
    const fichaVocab = fichas.find((f) => f.type === "Lista" || f.type === "Articulos");

    if (fichaVerbos) {
        const d = construirDrillConjugacion(levelId, fichaVerbos);
        if (d) pasos.push({ tipo: "ejercicio", drill: d });
    }
    if (fichaVocab) {
        const d = construirDrillVocabulario(levelId, fichaVocab);
        if (d) pasos.push({ tipo: "ejercicio", drill: d });
    }

    drills.forEach((drill, i) => {
        pasos.push({ tipo: "ejercicio", drill });
        // A mitad de camino, recordatorio del fallo tipico antes de seguir.
        if (i === 1 && teoria.mistake) {
            pasos.push({
                tipo: "leccion",
                titulo: "Ojo con este error",
                cuerpo: teoria.mistake,
                ejemplo: teoria.contrast || "",
            });
        }
    });

    return pasos;
}

function renderPasoSesion(level, pack) {
    const pasos = construirPasos(level.id, pack);
    const paso = pasos[pasoActual];
    const total = pasos.length;

    const barra = document.createElement("div");
    barra.className = "sesion-progreso";
    pasos.forEach((p, i) => {
        const tramo = document.createElement("span");
        const estado = i < pasoActual ? "hecho" : i === pasoActual ? "activo" : "";
        tramo.className = `tramo ${estado} ${p.tipo === "leccion" ? "leccion" : ""}`.trim();
        barra.appendChild(tramo);
    });
    dom.exercisesList.appendChild(barra);

    // Paso de LECCION: se lee y se sigue, no se evalua, pero no se puede saltar.
    if (paso.tipo === "leccion") {
        const tarjeta = document.createElement("article");
        tarjeta.className = "leccion-card";
        tarjeta.innerHTML = `
            <span class="leccion-badge">Lección</span>
            <h4 class="leccion-titulo">${paso.titulo}</h4>
            <p class="leccion-cuerpo">${paso.cuerpo}</p>
        `;
        if (paso.ejemplo) {
            const ej = document.createElement("p");
            ej.className = "leccion-ejemplo";
            ej.textContent = paso.ejemplo;
            tarjeta.appendChild(ej);

            const oir = document.createElement("button");
            oir.type = "button";
            oir.className = "btn btn-outline btn-sm";
            oir.textContent = "🔊 Escuchar";
            oir.addEventListener("click", () => speakItalian(paso.ejemplo, level.id, "leccion"));
            tarjeta.appendChild(oir);
        }

        // La tabla de conjugacion del nivel, dentro de la leccion. Una regla en
        // prosa ("usa essere") ensena menos que ver sono/sei/è/siamo/siete/sono.
        if (paso.conTabla) {
            const refs = getTheoryReferences(level, getLearningGuide(level.id));
            if (refs.length) {
                const caja = document.createElement("div");
                caja.className = "leccion-tabla";
                caja.appendChild(buildReferenceCard(refs[0]));
                tarjeta.appendChild(caja);
            }
        }
        dom.exercisesList.appendChild(tarjeta);

        const seguir = document.createElement("button");
        seguir.type = "button";
        seguir.className = "btn btn-accent btn-lg sesion-accion";
        seguir.textContent = "Entendido";
        seguir.addEventListener("click", () => {
            leoAlAzar(LEO_LECCION, "anima");
            pasoActual += 1;
            resultadoDelPaso = null;
            if (pasoActual >= total) {
                onCheckExercises();
                return;
            }
            renderAll();
        });
        dom.exercisesList.appendChild(seguir);
        return;
    }

    const drill = paso.drill;
    dom.exercisesList.appendChild(buildExerciseCard(level.id, drill, resultadoDelPaso));

    if (resultadoDelPaso) {
        const aviso = document.createElement("div");
        aviso.className = `sesion-feedback ${resultadoDelPaso.status}`;
        const titulo = resultadoDelPaso.status === "success" ? "¡Correcto!" : resultadoDelPaso.status === "partial" ? "Casi" : "No exactamente";
        aviso.innerHTML = `<strong>${titulo}</strong><span>${resultadoDelPaso.feedback || ""}</span>`;
        if (resultadoDelPaso.status !== "success" && resultadoDelPaso.answer) {
            const sol = document.createElement("span");
            sol.className = "sesion-solucion";
            sol.textContent = `Solución: ${resultadoDelPaso.answer}`;
            aviso.appendChild(sol);
        }
        dom.exercisesList.appendChild(aviso);
    }

    const accion = document.createElement("button");
    accion.type = "button";
    accion.className = resultadoDelPaso ? "btn btn-success btn-lg sesion-accion" : "btn btn-accent btn-lg sesion-accion";
    accion.textContent = resultadoDelPaso
        ? (pasoActual + 1 < total ? "Continuar" : "Ver resultado")
        : "Comprobar";
    accion.addEventListener("click", () => {
        if (resultadoDelPaso) {
            pasoActual += 1;
            resultadoDelPaso = null;
            if (pasoActual >= total) {
                onCheckExercises();
                return;
            }
            renderAll();
            return;
        }
        const respuesta = getDrillResponse(level.id, drill.id);
        resultadoDelPaso = evaluateDrill(level.id, drill, respuesta);
        const acerto = resultadoDelPaso.status === "success";
        leoAlAzar(acerto ? LEO_ACIERTO : LEO_FALLO, acerto ? "celebra" : "anima");
        renderAll();
    });
    dom.exercisesList.appendChild(accion);
}

function renderExerciseArea(level) {
    const pack = getExercisePack(level.id);
    const dueReviews = getDueReviews(level.id);

    dom.exercisesList.innerHTML = "";

    if (!pack || !Array.isArray(pack.drills) || !pack.drills.length) {
        dom.noExercisesMsg.classList.remove("hidden");
        dom.checkBtn.disabled = true;
        dom.retryBtn.disabled = true;
        dom.scoreBar.classList.add("hidden");
        dom.completeBtn.disabled = false;
        dom.completeHint.textContent = buildReviewSuffix(
            "Este nivel no tiene ejercicios interactivos. Puedes completar cuando termines la practica de escucha y repeticion.",
            dueReviews
        );
        return;
    }

    dom.noExercisesMsg.classList.add("hidden");
    dom.retryBtn.disabled = false;

    const levelExerciseState = getExerciseState(level.id);
    const lastResult = levelExerciseState.lastResult || null;

    // Modo sesion: un ejercicio por pantalla mientras quedan pasos por hacer.
    // Al terminar todos se cae al resumen de siempre (lastResult).
    const totalPasos = construirPasos(level.id, pack).length;
    if (pasoActual < totalPasos) {
        dom.checkBtn.classList.add("hidden");
        dom.scoreBar.classList.add("hidden");
        dom.completeBtn.disabled = true;
        dom.completeHint.textContent = buildReviewSuffix(
            `Paso ${pasoActual + 1} de ${totalPasos}. Lecciones y ejercicios, uno a uno.`,
            dueReviews
        );
        renderPasoSesion(level, pack);
        return;
    }

    dom.checkBtn.classList.remove("hidden");
    dom.checkBtn.disabled = false;

    pack.drills.forEach((drill) => {
        const result = lastResult?.perDrill?.[drill.id] || null;
        const card = buildExerciseCard(level.id, drill, result);
        dom.exercisesList.appendChild(card);
    });

    if (lastResult) {
        renderScore(lastResult);
        dom.completeBtn.disabled = !lastResult.canAdvance;
        dom.completeHint.textContent = buildReviewSuffix(lastResult.nextStep, dueReviews);
    } else {
        dom.scoreBar.classList.add("hidden");
        dom.completeBtn.disabled = true;
        const requirements = getLearningRequirements(level.id, pack);
        dom.completeHint.textContent = buildReviewSuffix(
            `Para avanzar necesitas dominar la base del nivel: ${requirements.passPercentage}% global y sin fallar ${requirements.requiredKindsLabel}.`,
            dueReviews
        );
    }
}

function buildExerciseCard(levelId, drill, result) {
    const wrapper = document.createElement("article");
    wrapper.className = "exercise-card";

    const statusClass = result ? statusToClass(result.status) : "pending";
    const statusText = result ? result.label : "Pendiente";
    const typeClass = typeToClass(drill.kind);

    const header = document.createElement("div");
    header.className = "exercise-card-header";
    header.innerHTML = `
        <span class="exercise-type ${typeClass}">${drill.label || "EJ"}</span>
        <span class="exercise-status ${statusClass}">${statusText}</span>
    `;
    wrapper.appendChild(header);

    const prompt = document.createElement("p");
    prompt.className = "exercise-prompt";
    prompt.textContent = drill.prompt || "Sin enunciado";
    wrapper.appendChild(prompt);

    const response = getDrillResponse(levelId, drill.id);

    if (drill.kind === "translation" || drill.kind === "conversation") {
        const textarea = document.createElement("textarea");
        textarea.className = "exercise-input textarea";
        textarea.placeholder = drill.kind === "translation"
            ? "Escribe tu traduccion en italiano..."
            : "Escribe tu respuesta en italiano...";
        textarea.value = response || "";
        textarea.addEventListener("input", () => saveDrillResponse(levelId, drill.id, textarea.value));
        wrapper.appendChild(textarea);
    }

    if (drill.kind === "tiles") {
        // La respuesta guardada son INDICES de drill.words, no palabras: asi las
        // palabras repetidas ("e", "la") funcionan bien como fichas separadas.
        const elegidas = Array.isArray(response) ? [...response] : [];

        const zonaRespuesta = document.createElement("div");
        zonaRespuesta.className = "tiles-answer";

        const banco = document.createElement("div");
        banco.className = "tiles-bank";

        const pintar = () => {
            zonaRespuesta.innerHTML = "";
            banco.innerHTML = "";

            if (!elegidas.length) {
                const pista = document.createElement("span");
                pista.className = "tiles-placeholder";
                pista.textContent = "Toca las palabras en orden...";
                zonaRespuesta.appendChild(pista);
            }

            elegidas.forEach((indice, posicion) => {
                const ficha = document.createElement("button");
                ficha.type = "button";
                ficha.className = "tile tile-selected";
                ficha.textContent = (drill.words || [])[indice] || "";
                ficha.addEventListener("click", () => {
                    elegidas.splice(posicion, 1);
                    saveDrillResponse(levelId, drill.id, [...elegidas]);
                    pintar();
                });
                zonaRespuesta.appendChild(ficha);
            });

            (drill.words || []).forEach((palabra, indice) => {
                if (elegidas.includes(indice)) {
                    return;
                }
                const ficha = document.createElement("button");
                ficha.type = "button";
                ficha.className = "tile";
                ficha.textContent = palabra;
                ficha.addEventListener("click", () => {
                    elegidas.push(indice);
                    saveDrillResponse(levelId, drill.id, [...elegidas]);
                    pintar();
                });
                banco.appendChild(ficha);
            });
        };

        pintar();
        wrapper.appendChild(zonaRespuesta);
        wrapper.appendChild(banco);
    }

    if (drill.kind === "cloze") {
        const sentence = document.createElement("p");
        sentence.className = "exercise-sentence";
        sentence.textContent = drill.sentence || "";
        wrapper.appendChild(sentence);

        const group = document.createElement("div");
        group.className = "blank-group";

        const values = Array.isArray(response) ? response : Array((drill.blanks || []).length).fill("");

        (drill.blanks || []).forEach((_, i) => {
            const input = document.createElement("input");
            input.type = "text";
            input.className = "exercise-input";
            input.placeholder = `Hueco ${i + 1}`;
            input.value = values[i] || "";
            input.addEventListener("input", () => {
                const next = Array.isArray(getDrillResponse(levelId, drill.id))
                    ? [...getDrillResponse(levelId, drill.id)]
                    : Array((drill.blanks || []).length).fill("");
                next[i] = input.value;
                saveDrillResponse(levelId, drill.id, next);
            });
            group.appendChild(input);
        });

        wrapper.appendChild(group);
    }

    if (drill.kind === "choice") {
        const select = document.createElement("select");
        select.className = "exercise-select";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Selecciona una opcion";
        select.appendChild(placeholder);

        (drill.options || []).forEach((optionValue) => {
            const opt = document.createElement("option");
            opt.value = optionValue;
            opt.textContent = optionValue;
            select.appendChild(opt);
        });

        select.value = response || "";
        select.addEventListener("change", () => saveDrillResponse(levelId, drill.id, select.value));

        wrapper.appendChild(select);
    }

    if (drill.kind === "shadowing") {
        const box = document.createElement("div");
        box.className = "shadowing-box";

        const sentence = document.createElement("p");
        sentence.className = "exercise-sentence";
        sentence.textContent = drill.speakText || "";
        box.appendChild(sentence);

        const help = document.createElement("p");
        help.className = "shadowing-help";
        help.textContent = "Shadowing = escucha la frase, repitela siguiendo el ritmo y despues repitela sin mirar.";
        box.appendChild(help);

        const speakBtn = document.createElement("button");
        speakBtn.type = "button";
        speakBtn.className = "btn btn-outline btn-sm speak-btn";
        speakBtn.textContent = "🔊 Escuchar";
        speakBtn.addEventListener("click", () => speakItalian(drill.speakText || "", levelId, drill.id));
        box.appendChild(speakBtn);

        const current = response || { listened: false, guided: false, free: false };
        const guidedBtn = document.createElement("button");
        guidedBtn.type = "button";
        guidedBtn.className = "btn btn-ghost btn-sm";
        guidedBtn.textContent = current.guided ? "Repeticion guiada hecha" : "Marcar repeticion guiada";
        guidedBtn.addEventListener("click", () => {
            const now = getDrillResponse(levelId, drill.id) || { listened: false, guided: false, free: false };
            saveDrillResponse(levelId, drill.id, { ...now, guided: !now.guided });
            renderLesson();
        });
        box.appendChild(guidedBtn);

        const speechSupported = typeof isSpeechRecognitionSupported === "function" && isSpeechRecognitionSupported();

        if (speechSupported) {
            // Repeticion sin apoyo VALIDADA por voz real: solo se marca si la
            // pronunciacion alcanza un umbral, no por autodeclaracion.
            const pronFeedback = document.createElement("div");
            pronFeedback.className = "pron-feedback hidden";

            const recordBtn = document.createElement("button");
            recordBtn.type = "button";
            recordBtn.className = current.free ? "btn btn-ghost btn-sm" : "btn btn-accent btn-sm";
            recordBtn.textContent = current.free ? "✓ Sin apoyo verificada — repetir" : "🎤 Repetir sin apoyo (puntua tu voz)";
            recordBtn.addEventListener("click", () => {
                startPronunciationCheck(drill.speakText || "", recordBtn, pronFeedback, (score) => {
                    const now = getDrillResponse(levelId, drill.id) || { listened: false, guided: false, free: false };
                    if (score >= 60) {
                        saveDrillResponse(levelId, drill.id, { ...now, listened: true, free: true });
                        renderLesson();
                    } else {
                        saveDrillResponse(levelId, drill.id, { ...now, free: false });
                    }
                });
            });
            box.appendChild(recordBtn);
            box.appendChild(pronFeedback);
        } else {
            // Sin micro disponible: se mantiene la autodeclaracion como respaldo.
            const freeBtn = document.createElement("button");
            freeBtn.type = "button";
            freeBtn.className = "btn btn-ghost btn-sm";
            freeBtn.textContent = current.free ? "Repeticion sin apoyo hecha" : "Marcar repeticion sin apoyo";
            freeBtn.addEventListener("click", () => {
                const now = getDrillResponse(levelId, drill.id) || { listened: false, guided: false, free: false };
                saveDrillResponse(levelId, drill.id, { ...now, free: !now.free });
                renderLesson();
            });
            box.appendChild(freeBtn);

            const hint = document.createElement("p");
            hint.className = "shadowing-help";
            hint.textContent = "Tu navegador no permite puntuar la voz; marca el paso de forma manual tras repetir en voz alta.";
            box.appendChild(hint);
        }

        wrapper.appendChild(box);
    }

    if (result) {
        const feedback = document.createElement("div");
        feedback.className = `feedback-box ${feedbackClass(result.status)}`;
        feedback.innerHTML = `
            ${result.feedback || ""}
            ${result.answer ? `<span class="expected-answer">Respuesta esperada: ${escapeHtml(result.answer)}</span>` : ""}
        `;
        wrapper.appendChild(feedback);
    }

    return wrapper;
}

function renderScore(result) {
    dom.scoreBar.classList.remove("hidden", "good", "ok", "low");

    let mode = "low";
    if (result.weightedPercentage >= 84) {
        mode = "good";
    } else if (result.canAdvance) {
        mode = "ok";
    }

    dom.scoreBar.classList.add(mode);
    dom.scoreText.textContent = `Dominio ${result.weightedPercentage}% · Base ${result.foundationPercentage}% · Produccion ${result.productionPercentage}%`;
    dom.scoreFill.style.width = `${result.weightedPercentage}%`;
}

function statusToClass(status) {
    if (status === "success") return "correct";
    if (status === "partial") return "partial";
    return "wrong";
}

function feedbackClass(status) {
    if (status === "success") return "correct-fb";
    if (status === "partial") return "partial-fb";
    return "wrong-fb";
}

function typeToClass(kind) {
    if (kind === "translation") return "ti";
    if (kind === "cloze") return "ch";
    if (kind === "conversation") return "cr";
    if (kind === "choice") return "mp";
    if (kind === "shadowing") return "sh";
    if (kind === "tiles") return "op";
    if (kind === "conjugation") return "vb";
    return "ti";
}

function simplifyGrammar(rawXml) {
    const attributes = extractXmlAttributes(rawXml);
    const focus = cleanGrammarText(attributes.foco || "");
    const transfer = cleanGrammarText(attributes.transferencia || "");

    if (!focus && !transfer) {
        return "Repasa la estructura principal de este nivel.";
    }

    const parts = [];
    if (focus) {
        parts.push(`Hoy fijas: ${focus}.`);
    }
    if (transfer) {
        parts.push(`Evita: ${transfer}.`);
    }
    return parts.join(" ");
}

function buildPatchCoaching(patchPriority) {
    const text = String(patchPriority || "").trim();
    if (!text) {
        return "Corrige primero el error que más se repite antes de avanzar.";
    }
    return `Tu error clave aqui es: ${text}. Corrigelo antes de intentar ir mas rapido.`;
}

function extractXmlAttributes(rawXml) {
    const attributes = {};
    String(rawXml || "").replace(/(\w+)="([^"]*)"/g, (_, key, value) => {
        attributes[key] = value;
        return "";
    });
    return attributes;
}

function cleanGrammarText(text) {
    return String(text || "")
        .replace(/\bno\b\s*/i, "")
        .replace(/\s+/g, " ")
        .trim();
}

function getLearningRequirements(levelId, pack) {
    const match = /M(\d+)-L(\d+)/.exec(levelId || "");
    const moduleNumber = Number(match?.[1] || 1);
    const lessonNumber = Number(match?.[2] || 1);
    let passPercentage = DEFAULT_PASS_PERCENTAGE;

    if (moduleNumber === 1 && lessonNumber >= 8) {
        passPercentage = 76;
    } else if (moduleNumber >= 10) {
        passPercentage = 88;
    } else if (moduleNumber >= 9) {
        passPercentage = 84;
    } else if (moduleNumber >= 2) {
        passPercentage = 80;
    }

    const kinds = new Set((pack?.drills || []).map((drill) => drill.kind));
    const requiredKinds = ["translation", "cloze", "conversation"].filter((kind) => kinds.has(kind));
    const minByKind = {
        translation: 0.7,
        cloze: 0.7,
        conversation: 0.65,
        shadowing: kinds.has("shadowing") ? 1 : 0,
    };

    if (moduleNumber >= 10) {
        minByKind.translation = 0.8;
        minByKind.cloze = 0.8;
        minByKind.conversation = 0.78;
    } else if (moduleNumber >= 9) {
        minByKind.translation = 0.75;
        minByKind.cloze = 0.75;
        minByKind.conversation = 0.72;
    }

    return {
        passPercentage,
        requiredKinds,
        minByKind,
        requiredKindsLabel: requiredKinds.map(kindLabel).join(", "),
    };
}

function kindLabel(kind) {
    if (kind === "translation") return "traduccion";
    if (kind === "cloze") return "huecos";
    if (kind === "conversation") return "produccion";
    if (kind === "shadowing") return "shadowing";
    if (kind === "choice") return "seleccion";
    return kind;
}

function getActiveModule() {
    return state.data.modules.find((mod) => mod.id === state.activeModuleId) || null;
}

function getActiveLevel() {
    return state.data.levels.find((level) => level.id === state.activeLevelId) || null;
}

function getNextLevel(currentLevelId) {
    const idx = state.data.levels.findIndex((level) => level.id === currentLevelId);
    if (idx === -1) {
        return null;
    }
    return state.data.levels[idx + 1] || null;
}

// ─── Fichas tactiles (ordenar palabras) ───
// Fase de RECONOCIMIENTO antes de la de produccion. Se generan solas a partir
// de las respuestas correctas que ya existen en el banco, asi que no hay que
// escribir contenido nuevo. Solo en los modulos bajos: a partir de M5 (B1) se
// espera que el alumno ya produzca sin apoyo.
const TILES_HASTA_MODULO = 4;
const TILES_DISTRACTORES = ["molto", "sempre", "anche", "poi", "quando", "però", "così", "bene"];

function numeroDeModulo(levelId) {
    const m = /^M(\d+)/.exec(String(levelId || ""));
    return m ? Number(m[1]) : 99;
}

// Trocea en palabras conservando los acentos (normalizeText los borraria).
function palabrasDeFrase(frase) {
    return String(frase || "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}' ]/gu, " ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean);
}

// Baraja estable: la misma frase da siempre el mismo orden, para que las fichas
// no salten de sitio cada vez que se repinta la pantalla.
function barajaEstable(items, semilla) {
    let h = 0;
    for (const ch of String(semilla)) {
        h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    }
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
        h = (h * 1103515245 + 12345) >>> 0;
        const j = h % (i + 1);
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

function construirDrillTiles(levelId, drillTraduccion) {
    const objetivo = (drillTraduccion.accepted || [])[0];
    const palabras = palabrasDeFrase(objetivo);
    if (palabras.length < 3 || palabras.length > 12) {
        return null;
    }

    const distractores = TILES_DISTRACTORES
        .filter((w) => !palabras.includes(w.toLowerCase()))
        .slice(0, palabras.length > 6 ? 3 : 2);

    const fuente = String(drillTraduccion.prompt || "").replace(/^Traduce al italiano:\s*/i, "").trim();

    return {
        id: `${drillTraduccion.id}-tiles`,
        kind: "tiles",
        label: "OP",
        prompt: fuente ? `Ordena las palabras: ${fuente}` : "Ordena las palabras para formar la frase.",
        accepted: drillTraduccion.accepted || [],
        words: barajaEstable([...palabras, ...distractores], `${levelId}:${drillTraduccion.id}`),
        feedback: "Toca las fichas en orden. Vuelve a tocar una ficha colocada para quitarla.",
    };
}

function conFichasTactiles(levelId, pack) {
    if (!pack || !Array.isArray(pack.drills) || numeroDeModulo(levelId) > TILES_HASTA_MODULO) {
        return pack;
    }
    const drills = [];
    pack.drills.forEach((drill) => {
        if (drill.kind === "translation") {
            const tiles = construirDrillTiles(levelId, drill);
            if (tiles) {
                drills.push(tiles);
            }
        }
        drills.push(drill);
    });
    return { ...pack, drills };
}

function getExercisePack(levelId) {
    if (typeof EXERCISE_BANK !== "undefined") {
        return conFichasTactiles(levelId, EXERCISE_BANK[levelId] || null);
    }
    if (typeof M1_EXERCISE_BANK === "undefined") {
        return null;
    }
    return conFichasTactiles(levelId, M1_EXERCISE_BANK[levelId] || null);
}

function getLearningGuide(levelId) {
    if (typeof LEVEL_LEARNING_GUIDE === "undefined") {
        return null;
    }
    return LEVEL_LEARNING_GUIDE[levelId] || null;
}

function getExerciseState(levelId) {
    return state.exerciseByLevel[levelId] || { responses: {}, lastResult: null };
}

function saveDrillResponse(levelId, drillId, value) {
    const levelState = getExerciseState(levelId);
    state.exerciseByLevel[levelId] = {
        ...levelState,
        responses: {
            ...levelState.responses,
            [drillId]: value,
        },
    };
    persistState();
}

function getDrillResponse(levelId, drillId) {
    return getExerciseState(levelId).responses?.[drillId];
}

function onCheckExercises() {
    const level = getActiveLevel();
    if (!level) return;

    const pack = getExercisePack(level.id);
    if (!pack || !pack.drills?.length) return;

    const levelState = getExerciseState(level.id);
    const perDrill = {};
    let totalScore = 0;

    pack.drills.forEach((drill) => {
        const result = evaluateDrill(level.id, drill, levelState.responses?.[drill.id]);
        perDrill[drill.id] = result;
        totalScore += result.score;
    });
    const summary = buildAttemptSummary(level, pack, perDrill, totalScore);

    const prevBest = Number(levelState.bestWeighted || 0);
    const improved = summary.weightedPercentage > prevBest;

    state.exerciseByLevel[level.id] = {
        ...levelState,
        bestWeighted: Math.max(prevBest, summary.weightedPercentage),
        lastResult: {
            perDrill,
            totalScore,
            maxScore: pack.drills.length,
            ...summary,
        },
    };

    persistState();
    renderLesson();

    // Recompensa por mejorar tu mejor marca, sin permitir farmear repitiendo.
    if (improved) {
        const gain = Math.round(((summary.weightedPercentage - prevBest) / 100) * 12);
        if (gain > 0) {
            awardXp(gain, `Has mejorado en ${level.id}`);
        }
        if (typeof playSfx === "function") {
            playSfx("correct");
        }
        if (summary.canAdvance && typeof fireConfetti === "function") {
            fireConfetti(0.5);
        }
        if (typeof bounceMascot === "function") {
            bounceMascot(summary.canAdvance ? "Bravissimo!" : "Bravo!");
        }
    } else if (typeof playSfx === "function") {
        playSfx(summary.canAdvance ? "correct" : "wrong");
    }
}

function onRetryExercises() {
    const level = getActiveLevel();
    if (!level) return;

    const pack = getExercisePack(level.id);
    if (!pack || !pack.drills?.length) return;

    state.exerciseByLevel[level.id] = { responses: {}, lastResult: null };
    reiniciarSesion();
    persistState();
    renderLesson();
}

function onCompleteLevel() {
    const level = getActiveLevel();
    if (!level) return;

    const pack = getExercisePack(level.id);
    const lastResult = getExerciseState(level.id).lastResult;

    if (pack?.drills?.length) {
        if (!lastResult?.canAdvance) {
            alert(lastResult?.nextStep || "Todavia no cumples el criterio de avance de este nivel.");
            return;
        }
    }

    leoAlAzar(LEO_NIVEL_HECHO, "celebra");

    if (!state.completedLevelIds.includes(level.id)) {
        state.completedLevelIds.push(level.id);
        const scoreBonus = Math.round(((lastResult?.weightedPercentage || 70) / 100) * 20);
        const moduleBonus = getModuleNumber(level.id) * 2;
        const xpGain = 20 + scoreBonus + moduleBonus;
        awardXp(xpGain, `Nivel ${level.id} completado`);
        if (typeof celebrateLevel === "function") {
            celebrateLevel(level, xpGain);
        }
    }
    scheduleReview(level.id, lastResult);

    const next = getNextLevel(level.id);
    if (next) {
        state.activeLevelId = next.id;
        state.activeModuleId = next.moduleId;
    }

    persistState();
    renderAll();

    if (next) {
        dom.lessonSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
        if (typeof fireConfetti === "function") fireConfetti(1);
        alert("Enhorabuena. Has completado todos los niveles disponibles.");
    }
}

function onBackToLevels() {
    dom.levelGrid.scrollIntoView({ behavior: "smooth", block: "start" });
}

function onSpeakImmersive() {
    const level = getActiveLevel();
    if (!level) return;
    speakItalian(fraseDelNivel(level));
}

function onNotesInput() {
    const level = getActiveLevel();
    if (!level) return;
    state.notesByLevel[level.id] = dom.notesArea.value;
    persistState();
}

function onPretestInput() {
    const level = getActiveLevel();
    if (!level) return;
    const levelState = getExerciseState(level.id);
    state.exerciseByLevel[level.id] = {
        ...levelState,
        pretestResponse: dom.pretestInput.value,
        pretestChecked: false,
    };
    persistState();
}

function onPretestCheck() {
    const level = getActiveLevel();
    if (!level) return;
    const guide = getLearningGuide(level.id);
    if (!guide?.pretest) return;
    const levelState = getExerciseState(level.id);
    state.exerciseByLevel[level.id] = {
        ...levelState,
        pretestResponse: dom.pretestInput.value,
        pretestChecked: true,
    };
    persistState();
    dom.pretestFeedback.innerHTML = buildPretestFeedback(level.id, guide.pretest);
    dom.pretestFeedback.classList.remove("hidden");
}

function buildPretestFeedback(levelId, pretest) {
    const response = getExerciseState(levelId).pretestResponse || "";
    const normalized = normalizeText(response);
    const accepted = pretest.accepted || [];
    const isMatch = accepted.some((item) => normalizeText(item) === normalized);
    const verdict = !normalized
        ? "Has llegado sin responder, que tambien vale: ahora compara tu respuesta con el modelo."
        : isMatch
            ? "Buena anticipacion. Ya tenias activada la estructura principal."
            : "Bien: el pretest sirve precisamente para intentar recordar antes de estudiar, aunque no salga perfecto.";
    return `${verdict}<span class="expected-answer">Respuesta modelo: ${escapeHtml(pretest.answer || accepted[0] || "")}</span>`;
}

function onResetProgress() {
    const ok = confirm("Esto borrara tu progreso, respuestas y notas. Quieres continuar?");
    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

function buildAttemptSummary(level, pack, perDrill, totalScore) {
    const requirements = getLearningRequirements(level.id, pack);
    const results = pack.drills.map((drill) => ({ drill, result: perDrill[drill.id] }));
    const byKind = groupScoresByKind(results);
    const weightedPercentage = computeWeightedPercentage(byKind);
    const foundationPercentage = averagePercent([byKind.translation, byKind.cloze, byKind.choice]);
    const productionPercentage = averagePercent([byKind.conversation, byKind.translation]);
    const gateFailures = requirements.requiredKinds.filter((kind) => (byKind[kind] ?? 0) < requirements.minByKind[kind]);
    const shadowingRequired = requirements.minByKind.shadowing > 0;
    const shadowingFailed = shadowingRequired && (byKind.shadowing ?? 0) < requirements.minByKind.shadowing;
    const weakKinds = Object.entries(byKind)
        .filter(([, score]) => typeof score === "number")
        .sort((left, right) => left[1] - right[1])
        .map(([kind]) => kind);
    const canAdvance = weightedPercentage >= requirements.passPercentage && gateFailures.length === 0 && !shadowingFailed;

    return {
        percentage: Math.round((totalScore / pack.drills.length) * 100),
        weightedPercentage,
        foundationPercentage,
        productionPercentage,
        weakKinds,
        canAdvance,
        nextStep: buildAdvanceMessage(requirements, weightedPercentage, gateFailures, shadowingFailed, weakKinds),
    };
}

function groupScoresByKind(results) {
    const buckets = {};

    results.forEach(({ drill, result }) => {
        if (!buckets[drill.kind]) {
            buckets[drill.kind] = [];
        }
        buckets[drill.kind].push(result.score);
    });

    return Object.fromEntries(
        Object.entries(buckets).map(([kind, values]) => [kind, Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2))])
    );
}

function computeWeightedPercentage(byKind) {
    const kinds = Object.keys(byKind);
    const totalWeight = kinds.reduce((sum, kind) => sum + (KIND_WEIGHTS[kind] || 0.1), 0);
    const weightedScore = kinds.reduce((sum, kind) => sum + ((byKind[kind] || 0) * (KIND_WEIGHTS[kind] || 0.1)), 0);
    return Math.round((weightedScore / (totalWeight || 1)) * 100);
}

function averagePercent(values) {
    const filtered = values.filter((value) => typeof value === "number");
    if (!filtered.length) {
        return 0;
    }
    return Math.round((filtered.reduce((sum, value) => sum + value, 0) / filtered.length) * 100);
}

function buildAdvanceMessage(requirements, weightedPercentage, gateFailures, shadowingFailed, weakKinds) {
    if (weightedPercentage >= requirements.passPercentage && gateFailures.length === 0 && !shadowingFailed) {
        return "Dominio suficiente. Ya puedes pasar al siguiente nivel.";
    }

    const reasons = [];
    if (weightedPercentage < requirements.passPercentage) {
        reasons.push(`sube el dominio global a ${requirements.passPercentage}%`);
    }
    if (gateFailures.length) {
        reasons.push(`mejora ${gateFailures.map(kindLabel).join(", ")}`);
    }
    if (shadowingFailed) {
        reasons.push("completa el shadowing con escucha y repeticion");
    }
    if (!reasons.length && weakKinds.length) {
        reasons.push(`refuerza ${kindLabel(weakKinds[0])}`);
    }
    return `Antes de avanzar: ${reasons.join("; ")}.`;
}

function scheduleReview(levelId, result) {
    if (!result) {
        return;
    }
    const today = dateKey(new Date());
    const gapDays = result.weightedPercentage >= 88 ? 3 : result.weightedPercentage >= 80 ? 2 : 1;
    state.reviewByLevel[levelId] = {
        dueOn: addDays(today, gapDays),
        weakKinds: (result.weakKinds || []).slice(0, 2),
        weightedPercentage: result.weightedPercentage,
    };
}

function addDays(dateString, days) {
    const date = new Date(`${dateString}T00:00:00`);
    date.setDate(date.getDate() + days);
    return dateKey(date);
}

function getDueReviews(currentLevelId) {
    const today = dateKey(new Date());
    return Object.entries(state.reviewByLevel)
        .filter(([levelId, review]) => levelId !== currentLevelId && state.completedLevelIds.includes(levelId) && review?.dueOn && review.dueOn <= today)
        .slice(0, 2)
        .map(([levelId]) => levelId);
}

function buildReviewSuffix(message, dueReviews) {
    if (!dueReviews.length) {
        return message;
    }
    return `${message} Repaso recomendado hoy: ${dueReviews.join(", ")}.`;
}

function evaluateDrill(levelId, drill, response) {
    if (drill.kind === "translation") {
        return evaluateFreeText(levelId, response, drill.accepted || [], drill.expectedTokens || [], drill.feedback || "", drill.expectedStructures || []);
    }
    if (drill.kind === "conversation") {
        return evaluateConversation(levelId, response, drill.expectedTokens || [], drill.minWords || 4, drill.feedback || "", drill.expectedStructures || []);
    }
    if (drill.kind === "tiles") {
        return evaluateTiles(response, drill.words || [], drill.accepted || [], drill.feedback || "");
    }
    if (drill.kind === "cloze") {
        return evaluateCloze(response, drill.blanks || [], drill.feedback || "");
    }
    if (drill.kind === "choice") {
        return evaluateChoice(response, drill.answer || "", drill.feedback || "");
    }
    if (drill.kind === "shadowing") {
        return evaluateShadowing(response, drill.feedback || "");
    }

    return {
        score: 0,
        status: "fail",
        label: "Sin evaluar",
        feedback: "Ejercicio no evaluable.",
        answer: "",
    };
}

function evaluateFreeText(levelId, response, accepted, expectedTokens, feedback, expectedStructures) {
    const rawResponse = String(response || "").trim();
    const normalized = normalizeText(rawResponse);
    const words = normalized ? normalized.split(/\s+/).filter(Boolean) : [];
    const uniqueWords = new Set(words).size;
    const moduleNumber = getModuleNumber(levelId);
    const isPrecisionLevel = moduleNumber >= 6;
    const isExpertLevel = moduleNumber >= 10;
    const structureHits = countExpectedMatches(normalized, words, expectedStructures || []);
    const acceptedWordCounts = (accepted || [])
        .map((item) => normalizeText(item).split(/\s+/).filter(Boolean).length)
        .filter(Boolean);
    const targetWordCount = acceptedWordCounts.length ? Math.min(...acceptedWordCounts) : Math.max(expectedTokens.length, 5);
    const enoughLength = words.length >= Math.max(4, targetWordCount - (isExpertLevel ? 0 : isPrecisionLevel ? 1 : 3));
    const varietyRatio = isExpertLevel ? 0.68 : isPrecisionLevel ? 0.6 : 0.45;
    const hasEnoughVariety = uniqueWords >= Math.max(4, Math.floor(words.length * varietyRatio));
    const minStructures = isExpertLevel ? Math.max(1, Math.ceil(expectedStructures.length * 0.7)) : Math.max(1, Math.ceil(expectedStructures.length / 2));
    const hasStructure = !isPrecisionLevel || expectedStructures.length === 0 || structureHits >= minStructures;

    if (!normalized) {
        return {
            score: 0,
            status: "fail",
            label: "Vacio",
            feedback,
            answer: accepted[0] || "",
        };
    }

    if (accepted.some((item) => normalizeText(item) === normalized)) {
        return {
            score: 1,
            status: "success",
            label: "Correcto",
            feedback: "Muy bien. Traduccion correcta.",
            answer: accepted[0] || "",
        };
    }

    const hits = countExpectedMatches(normalized, words, expectedTokens);
    const inOrder = expectedTokensInOrder(words, expectedTokens);
    const closeness = bestAcceptedCloseness(words, accepted);
    const agreementIssues = detectAgreementIssues(normalized);
    const grammarClean = agreementIssues.length === 0;
    const grammarNote = buildGrammarNote(inOrder, agreementIssues);

    // Muy cerca de una respuesta correcta completa y sin errores de concordancia:
    // se acepta como correcta aunque no sea idéntica.
    if (closeness >= 0.86 && inOrder && grammarClean) {
        return {
            score: 1,
            status: "success",
            label: "Correcto",
            feedback: "Muy bien. Traduccion valida.",
            answer: accepted[0] || "",
        };
    }

    if (!isPrecisionLevel && hits === expectedTokens.length && expectedTokens.length > 0) {
        if (inOrder && grammarClean) {
            return {
                score: 0.7,
                status: "partial",
                label: "Casi",
                feedback,
                answer: accepted[0] || "",
            };
        }
        // Palabras correctas pero en orden incorrecto o con error de concordancia.
        return {
            score: 0.4,
            status: "partial",
            label: "Revisa",
            feedback: `${feedback}${grammarNote}`,
            answer: accepted[0] || "",
        };
    }

    if (isPrecisionLevel && hits === expectedTokens.length && expectedTokens.length > 0 && enoughLength && hasEnoughVariety && hasStructure) {
        if (inOrder && grammarClean) {
            return {
                score: 0.6,
                status: "partial",
                label: "Casi",
                feedback: buildTranslationFeedback(feedback, {
                    isPrecisionLevel,
                    enoughLength,
                    hasEnoughVariety,
                    hasStructure,
                    expectedStructures,
                }),
                answer: accepted[0] || "",
            };
        }
        return {
            score: 0.3,
            status: "partial",
            label: "Revisa",
            feedback: `${buildTranslationFeedback(feedback, {
                isPrecisionLevel,
                enoughLength,
                hasEnoughVariety,
                hasStructure,
                expectedStructures,
            })}${grammarNote}`,
            answer: accepted[0] || "",
        };
    }

    if (isPrecisionLevel && hits >= Math.max(2, expectedTokens.length - 1) && (structureHits > 0 || hasEnoughVariety)) {
        return {
            score: 0.3,
            status: "partial",
            label: "Parcial",
            feedback: buildTranslationFeedback(feedback, {
                isPrecisionLevel,
                enoughLength,
                hasEnoughVariety,
                hasStructure,
                expectedStructures,
            }),
            answer: accepted[0] || "",
        };
    }

    return {
        score: hits > 0 ? (isPrecisionLevel ? 0.15 : 0.35) : 0,
        status: hits > 0 ? "partial" : "fail",
        label: hits > 0 ? "Parcial" : "Incorrecto",
        feedback: buildTranslationFeedback(feedback, {
            isPrecisionLevel,
            enoughLength,
            hasEnoughVariety,
            hasStructure,
            expectedStructures,
        }),
        answer: accepted[0] || "",
    };
}

function buildTranslationFeedback(baseFeedback, context) {
    if (!context.isPrecisionLevel) {
        return baseFeedback;
    }
    const notes = [];
    if (!context.enoughLength) {
        notes.push("completa mejor la frase y no la dejes truncada");
    }
    if (!context.hasEnoughVariety) {
        notes.push("evita una traduccion demasiado telegráfica o repetitiva");
    }
    if (!context.hasStructure && context.expectedStructures.length) {
        notes.push(`incluye una estructura del nivel como ${context.expectedStructures.slice(0, 2).join(" / ")}`);
    }
    if (!notes.length) {
        return baseFeedback;
    }
    return `${baseFeedback} Ajuste: ${notes.join("; ")}.`;
}

function evaluateConversation(levelId, response, expectedTokens, minWords, feedback, expectedStructures) {
    const rawResponse = String(response || "").trim();
    const normalized = normalizeText(rawResponse);
    const words = normalized ? normalized.split(/\s+/).filter(Boolean) : [];
    const uniqueWords = new Set(words).size;
    const hits = countExpectedMatches(normalized, words, expectedTokens);
    const ratio = expectedTokens.length ? hits / expectedTokens.length : 0;
    const structureHits = countExpectedMatches(normalized, words, expectedStructures || []);
    const moduleNumber = getModuleNumber(levelId);
    const isAdvancedLevel = moduleNumber >= 5;
    const isExpertLevel = moduleNumber >= 10;
    const hasLinking = hasLinkedProduction(rawResponse, normalized);
    const varietyRatio = isExpertLevel ? 0.68 : isAdvancedLevel ? 0.55 : 0.45;
    const hasEnoughVariety = uniqueWords >= Math.max(4, Math.floor(words.length * varietyRatio));
    const structureGoal = isExpertLevel ? Math.max(1, Math.ceil(expectedStructures.length * 0.7)) : Math.max(1, Math.ceil(expectedStructures.length / 2));
    const successStructure = !isAdvancedLevel || expectedStructures.length === 0 || structureHits >= structureGoal;
    const partialStructure = !isAdvancedLevel || hasLinking || structureHits > 0;
    const conversationAgreementIssues = detectAgreementIssues(normalized);
    const agreementClean = conversationAgreementIssues.length === 0;

    if (!normalized) {
        return {
            score: 0,
            status: "fail",
            label: "Vacio",
            feedback,
            answer: buildConversationAnswer(expectedTokens, expectedStructures),
        };
    }

    if (ratio === 1 && words.length >= minWords && hasEnoughVariety && successStructure && agreementClean && (!isExpertLevel || hasLinking)) {
        return {
            score: 1,
            status: "success",
            label: "Muy bien",
            feedback: isExpertLevel ? "Respuesta completa, cohesionada y con control suficiente para el tramo final." : isAdvancedLevel ? "Respuesta completa y con estructura suficiente para este nivel." : "Respuesta completa para este nivel.",
            answer: buildConversationAnswer(expectedTokens, expectedStructures),
        };
    }

    // Contenido completo pero con un error claro de concordancia: no llega al maximo.
    if (ratio === 1 && words.length >= minWords && hasEnoughVariety && successStructure && !agreementClean) {
        return {
            score: 0.6,
            status: "partial",
            label: "Revisa",
            feedback: `${feedback} Corrige: ${conversationAgreementIssues[0]}.`,
            answer: buildConversationAnswer(expectedTokens, expectedStructures),
        };
    }

    if (ratio >= (isExpertLevel ? 0.7 : 0.5) && words.length >= Math.max(4, minWords - (isExpertLevel ? 1 : 2)) && partialStructure) {
        return {
            score: isAdvancedLevel ? 0.55 : 0.65,
            status: "partial",
            label: "Bien",
            feedback: buildConversationFeedback(feedback, {
                isAdvancedLevel,
                words,
                minWords,
                hasLinking,
                structureHits,
                expectedStructures,
                hasEnoughVariety,
            }),
            answer: buildConversationAnswer(expectedTokens, expectedStructures),
        };
    }

    return {
        score: isAdvancedLevel ? 0.15 : 0.25,
        status: "fail",
        label: "Flojo",
        feedback: buildConversationFeedback(feedback, {
            isAdvancedLevel,
            words,
            minWords,
            hasLinking,
            structureHits,
            expectedStructures,
            hasEnoughVariety,
        }),
        answer: buildConversationAnswer(expectedTokens, expectedStructures),
    };
}

function buildConversationFeedback(baseFeedback, context) {
    const notes = [];
    if (context.words.length < context.minWords) {
        notes.push(`alarga la respuesta hasta al menos ${context.minWords} palabras utiles`);
    }
    if (context.isAdvancedLevel && !context.hasLinking) {
        notes.push("une las ideas con un conector o una subordinada clara");
    }
    if (context.isAdvancedLevel && context.expectedStructures.length && context.structureHits === 0) {
        notes.push(`incluye una estructura del nivel como ${context.expectedStructures.slice(0, 2).join(" / ")}`);
    }
    if (!context.hasEnoughVariety) {
        notes.push("varia mas el vocabulario y evita una respuesta demasiado telegráfica");
    }
    if (!notes.length) {
        return baseFeedback;
    }
    return `${baseFeedback} Ajuste: ${notes.join("; ")}.`;
}

function buildConversationAnswer(expectedTokens, expectedStructures) {
    const parts = [];
    if (expectedTokens?.length) {
        parts.push(expectedTokens.join(", "));
    }
    if (expectedStructures?.length) {
        parts.push(`estructura: ${expectedStructures.join(" / ")}`);
    }
    return parts.join(" | ");
}

function countExpectedMatches(normalized, words, expectedItems) {
    return (expectedItems || []).filter((item) => matchesExpectedItem(normalized, words, item)).length;
}

function matchesExpectedItem(normalized, words, item) {
    const rawItem = String(item || "").trim();
    if (!rawItem) {
        return false;
    }

    if (rawItem.startsWith("-")) {
        const suffix = normalizeText(rawItem).replace(/\s+/g, "");
        return Boolean(suffix) && words.some((word) => word.endsWith(suffix));
    }

    const normalizedItem = normalizeText(rawItem);
    if (!normalizedItem) {
        return false;
    }

    if (normalizedItem.includes(" ")) {
        return normalized.includes(normalizedItem);
    }

    return words.includes(normalizedItem);
}

// ─── Verificacion de orden y concordancia (no solo presencia de palabras) ───

// Comprueba que las palabras clave esperadas aparecen EN ORDEN (subsecuencia),
// no solo presentes. Asi una frase con el orden cambiado deja de puntuar al maximo.
function expectedTokensInOrder(words, expectedTokens) {
    const targets = (expectedTokens || [])
        .map((token) => normalizeText(String(token)))
        .filter((token) => token && !token.includes(" ") && !String(token).startsWith("-"));
    if (!targets.length) {
        return true;
    }
    let idx = 0;
    for (const word of words) {
        if (word === targets[idx]) {
            idx += 1;
            if (idx >= targets.length) {
                return true;
            }
        }
    }
    return idx >= targets.length;
}

// Distancia de edicion a nivel de palabra (no de caracter): mide cuan cerca
// esta la frase del alumno de una respuesta correcta completa.
function wordLevenshtein(a, b) {
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
            row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
            prev = temp;
        }
    }
    return row[n];
}

// Cercania (0..1) de la respuesta a la mejor respuesta aceptada, comparando
// secuencias de palabras. Penaliza orden incorrecto, palabras sobrantes y huecos.
function bestAcceptedCloseness(words, accepted) {
    let best = 0;
    (accepted || []).forEach((item) => {
        const accWords = normalizeText(item).split(/\s+/).filter(Boolean);
        if (!accWords.length) {
            return;
        }
        const distance = wordLevenshtein(words, accWords);
        const similarity = 1 - distance / Math.max(words.length, accWords.length);
        if (similarity > best) {
            best = similarity;
        }
    });
    return best;
}

// Detecta errores de concordancia/elision deterministas del italiano estandar.
// Solo reglas seguras (sin diccionario), para no penalizar de forma injusta.
function detectAgreementIssues(normalized) {
    const issues = [];
    // Elision obligatoria del articulo ante vocal: lo/la + vocal -> l'
    if (/\b(lo|la)\s+[aeiou]/.test(normalized)) {
        issues.push("ante vocal usa l' (l'amico, l'idea), no lo/la separado");
    }
    // Articulo indefinido femenino ante vocal: una + vocal -> un'
    if (/\buna\s+[aeiou]/.test(normalized)) {
        issues.push("ante vocal femenina usa un' (un'amica), no una separado");
    }
    // Preposiciones articuladas no contraidas frecuentes
    if (/\b(di|a|da|in|su)\s+(il|lo|la|i|gli|le)\b/.test(normalized)) {
        issues.push("contrae preposicion + articulo (di+il=del, a+il=al, in+il=nel...)");
    }
    // Repeticion accidental de la misma palabra
    if (/\b(\w+)\s+\1\b/.test(normalized)) {
        issues.push("has repetido una palabra seguida");
    }
    return issues;
}

// Construye una nota de correccion concreta cuando hay fallo de orden o concordancia.
function buildGrammarNote(inOrder, agreementIssues) {
    const notes = [];
    if (!inOrder) {
        notes.push("revisa el orden de las palabras");
    }
    if (agreementIssues && agreementIssues.length) {
        notes.push(agreementIssues[0]);
    }
    if (!notes.length) {
        return "";
    }
    return ` Corrige: ${notes.join("; ")}.`;
}

function hasLinkedProduction(rawResponse, normalized) {
    if ((String(rawResponse || "").match(/[.!?;:]/g) || []).length >= 1) {
        return true;
    }
    const linkingMarkers = [
        "che",
        "perché",
        "quindi",
        "se",
        "quando",
        "mentre",
        "tuttavia",
        "inoltre",
        "pertanto",
        "ciononostante",
        "pur",
        "sebbene",
        "benché",
        "inoltre",
        "infine",
        "in primo luogo",
        "in secondo luogo",
        "in breve",
        "ovvero",
        "cioè",
        "in realtà",
        "secondo me",
        "penso che",
        "spero che",
        "di cui",
        "in cui",
    ];
    return linkingMarkers.some((marker) => normalized.includes(marker));
}

function getModuleNumber(levelId) {
    const match = String(levelId || "").match(/^M(\d+)-L\d+$/);
    return Number(match?.[1] || 0);
}

function evaluateTiles(response, words, accepted, feedback) {
    const indices = Array.isArray(response) ? response : [];
    const frase = indices.map((i) => words[i]).filter(Boolean).join(" ");
    const normalizada = normalizeText(frase);
    const solucion = accepted[0] || "";

    if (!normalizada) {
        return {
            score: 0,
            status: "fail",
            label: "Sin responder",
            feedback: "Toca las fichas para formar la frase.",
            answer: solucion,
        };
    }

    if (accepted.some((item) => normalizeText(item) === normalizada)) {
        return {
            score: 1,
            status: "success",
            label: "Correcto",
            feedback: "Perfecto, orden correcto.",
            answer: solucion,
        };
    }

    // Puntuacion parcial: cuantas palabras estan en su sitio exacto.
    const puestas = normalizada.split(" ");
    const buenas = normalizeText(solucion).split(" ");
    const aciertos = puestas.filter((p, i) => p === buenas[i]).length;
    const ratio = buenas.length ? aciertos / buenas.length : 0;

    return {
        score: ratio >= 0.6 ? ratio : 0,
        status: ratio >= 0.6 ? "partial" : "fail",
        label: ratio >= 0.6 ? "Casi" : "Revisa",
        feedback,
        answer: solucion,
    };
}

function evaluateCloze(response, blanks, feedback) {
    const values = Array.isArray(response) ? response : [];
    const hits = blanks.filter((answer, idx) => normalizeText(answer) === normalizeText(values[idx] || "")).length;

    if (hits === blanks.length && blanks.length > 0) {
        return {
            score: 1,
            status: "success",
            label: "Correcto",
            feedback: "Muy bien. Huecos completados correctamente.",
            answer: blanks.join(" | "),
        };
    }

    if (hits > 0) {
        return {
            score: hits / blanks.length,
            status: "partial",
            label: "Parcial",
            feedback,
            answer: blanks.join(" | "),
        };
    }

    return {
        score: 0,
        status: "fail",
        label: "Incorrecto",
        feedback,
        answer: blanks.join(" | "),
    };
}

function evaluateChoice(response, answer, feedback) {
    if (!response) {
        return {
            score: 0,
            status: "fail",
            label: "Vacio",
            feedback,
            answer,
        };
    }

    if (response === answer) {
        return {
            score: 1,
            status: "success",
            label: "Correcto",
            feedback: "Muy bien. Opcion correcta.",
            answer,
        };
    }

    return {
        score: 0,
        status: "fail",
        label: "Incorrecto",
        feedback,
        answer,
    };
}

function evaluateShadowing(response, feedback) {
    const listened = Boolean(response?.listened);
    const guided = Boolean(response?.guided);
    const free = Boolean(response?.free);

    if (listened && guided && free) {
        return {
            score: 1,
            status: "success",
            label: "Hecho",
            feedback: "Perfecto. Shadowing completado.",
            answer: "Escuchar, repetir con apoyo y repetir sin apoyo",
        };
    }

    if ((listened ? 1 : 0) + (guided ? 1 : 0) + (free ? 1 : 0) >= 2) {
        return {
            score: 0.67,
            status: "partial",
            label: "Casi",
            feedback,
            answer: "Escuchar, repetir con apoyo y repetir sin apoyo",
        };
    }

    if (listened || guided || free) {
        return {
            score: 0.34,
            status: "partial",
            label: "Empezado",
            feedback,
            answer: "Escuchar, repetir con apoyo y repetir sin apoyo",
        };
    }

    return {
        score: 0,
        status: "fail",
        label: "Pendiente",
        feedback,
        answer: "Escuchar, repetir con apoyo y repetir sin apoyo",
    };
}

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9' ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function speakItalian(text, levelId, drillId) {
    if (!text) {
        return;
    }

    const spoken = sanitizeForSpeech(text);
    if (!spoken) {
        return;
    }

    const onDone = () => {
        if (levelId && drillId) {
            const current = getDrillResponse(levelId, drillId) || { listened: false, guided: false, free: false };
            saveDrillResponse(levelId, drillId, { ...current, listened: true });
            renderLesson();
        }
    };

    // 1) Intento principal: voz italiana neuronal en la nube (suena natural).
    //    Si falla (sin internet o bloqueo), cae a la voz local del sistema.
    if (speakWithNeuralVoice(spoken, onDone)) {
        return;
    }

    speakWithLocalVoice(spoken, onDone);
}

// Limpia el texto para que la voz lea solo la frase, sin deletrear comillas,
// guiones u otros simbolos. Conserva letras acentuadas y la puntuacion natural
// (. , ! ?) que el TTS usa como pausas, no como palabras.
function sanitizeForSpeech(text) {
    return String(text)
        // Normalizar apostrofes tipograficos a apostrofo recto
        .replace(/[‘’‚‛´`]/g, "'")
        // Comillas de cita (rectas, tipograficas, angulares)
        .replace(/[«»“”„‟"]/g, " ")
        // Asteriscos, barras, parentesis, corchetes y otros simbolos
        .replace(/[*_~|/\\<>\[\]{}()]/g, " ")
        // Guion largo o suelto entre espacios (raya de dialogo), no el de palabras
        .replace(/\s[-–—]+\s/g, " ")
        // Apostrofo solo si NO esta entre dos letras (conserva la elision: l'amico)
        .replace(/'(?![a-zA-ZàáèéìíòóùúÀÁÈÉÌÍÒÓÙÚ])/g, " ")
        .replace(/(?<![a-zA-ZàáèéìíòóùúÀÁÈÉÌÍÒÓÙÚ])'/g, " ")
        // Puntos suspensivos -> una sola pausa
        .replace(/\.{2,}/g, ".")
        // Quitar espacio sobrante antes de signos de puntuacion
        .replace(/\s+([.,!?;:])/g, "$1")
        // Colapsar espacios sobrantes
        .replace(/\s+/g, " ")
        .trim();
}

// ─── Voz italiana neuronal (nube, sin clave API) ───
// Usa el endpoint TTS de Google a traves de un elemento <audio>. La carga de
// medios no esta sujeta a CORS, por eso funciona desde el navegador. Trocea el
// texto en fragmentos cortos y los encadena para frases largas.
let neuralAudioEl = null;
let neuralTtsAvailable = true; // se desactiva si el endpoint falla una vez

function chunkForTts(text, maxLen) {
    const clean = String(text).replace(/\s+/g, " ").trim();
    if (clean.length <= maxLen) {
        return [clean];
    }
    const parts = [];
    const sentences = clean.split(/(?<=[.!?;:,])\s+/);
    let buffer = "";
    sentences.forEach((piece) => {
        if ((buffer + " " + piece).trim().length <= maxLen) {
            buffer = (buffer ? buffer + " " : "") + piece;
        } else {
            if (buffer) parts.push(buffer);
            if (piece.length <= maxLen) {
                buffer = piece;
            } else {
                // Fragmento aun demasiado largo: cortar por palabras.
                let words = piece.split(" ");
                let line = "";
                words.forEach((w) => {
                    if ((line + " " + w).trim().length <= maxLen) {
                        line = (line ? line + " " : "") + w;
                    } else {
                        if (line) parts.push(line);
                        line = w;
                    }
                });
                buffer = line;
            }
        }
    });
    if (buffer) parts.push(buffer);
    return parts;
}

function buildNeuralTtsUrl(fragment) {
    const q = encodeURIComponent(fragment);
    // Proxy mismo-origen del servidor (evita CORS/ORB). El servidor descarga la
    // voz italiana neuronal y la devuelve como audio/mpeg.
    return `./tts?tl=it&q=${q}`;
}

function speakWithNeuralVoice(text, onDone) {
    if (!neuralTtsAvailable || typeof Audio === "undefined") {
        return false;
    }

    // Detener cualquier voz local en curso.
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    const fragments = chunkForTts(text, 190);
    if (!fragments.length) {
        return false;
    }

    if (!neuralAudioEl) {
        neuralAudioEl = new Audio();
        neuralAudioEl.preload = "auto";
    }
    const audio = neuralAudioEl;
    audio.pause();
    audio.onended = null;
    audio.onerror = null;

    let index = 0;
    let startedOk = false;

    const playNext = () => {
        if (index >= fragments.length) {
            window.__italianVoiceName = "Voz neuronal italiana (nube)";
            updateVoiceTooltips(window.__italianVoiceName);
            onDone && onDone();
            return;
        }
        audio.src = buildNeuralTtsUrl(fragments[index]);
        index += 1;
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
            playPromise.then(() => { startedOk = true; }).catch(() => {
                // El navegador bloqueo la reproduccion o el endpoint fallo.
                if (!startedOk) {
                    neuralTtsAvailable = false;
                    speakWithLocalVoice(text, onDone);
                }
            });
        }
    };

    audio.onended = () => playNext();
    audio.onerror = () => {
        // Primer fragmento fallido => desactivar nube y usar voz local.
        if (!startedOk) {
            neuralTtsAvailable = false;
            speakWithLocalVoice(text, onDone);
        }
    };

    playNext();
    return true;
}

// ─── Voz local del sistema (respaldo offline) ───
let avisoSinVozItaliana = false;

function speakWithLocalVoice(text, onDone) {
    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const italianVoice = pickItalianVoice();

    // Sin voz italiana instalada, el navegador usaba la voz por defecto del
    // sistema (en español o inglés) para leer italiano, y sonaba fatal. Es mejor
    // avisar una vez y no reproducir nada que ensenar una pronunciacion falsa.
    if (!italianVoice) {
        if (!avisoSinVozItaliana) {
            avisoSinVozItaliana = true;
            if (typeof showToast === "function") {
                showToast(
                    "🔇 No hay voz italiana instalada",
                    "Windows: Configuración › Hora e idioma › Voz › Agregar voces › Italiano",
                    "goal"
                );
            }
        }
        onDone && onDone();
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.voice = italianVoice;

    utterance.onend = () => {
        onDone && onDone();
    };

    window.speechSynthesis.speak(utterance);
}

// Selecciona la mejor voz italiana disponible, con preferencia por voces
// naturales/premium. Cachea el resultado y se actualiza cuando el navegador
// termina de cargar la lista de voces (evento voiceschanged).
let cachedItalianVoice = null;

// Nombres de voces italianas de calidad por plataforma (Google / Edge / Apple).
const PREFERRED_ITALIAN_VOICES = [
    "google italiano",
    "isabella",
    "elsa",
    "cosimo",
    "diego",
    "luca",
    "alice",
    "federica",
    "eloisa",
    "giuseppe",
];

function scoreItalianVoice(voice) {
    const name = String(voice.name || "").toLowerCase();
    const lang = String(voice.lang || "").toLowerCase().replace("_", "-");
    let score = 0;
    if (lang === "it-it") score += 40;
    else if (lang.startsWith("it")) score += 30;
    else return -1; // no italiana: descartar
    if (name.includes("natural")) score += 25;
    if (name.includes("online") || name.includes("premium") || name.includes("enhanced")) score += 12;
    const prefIndex = PREFERRED_ITALIAN_VOICES.findIndex((pref) => name.includes(pref));
    if (prefIndex !== -1) score += 20 - prefIndex; // antes en la lista = mejor
    if (voice.localService === false) score += 4; // las de red suelen sonar mejor
    return score;
}

function pickItalianVoice() {
    if (cachedItalianVoice) {
        return cachedItalianVoice;
    }
    if (!("speechSynthesis" in window)) {
        return null;
    }
    const voices = window.speechSynthesis.getVoices() || [];
    let best = null;
    let bestScore = -1;
    voices.forEach((voice) => {
        const score = scoreItalianVoice(voice);
        if (score > bestScore) {
            bestScore = score;
            best = voice;
        }
    });
    if (best && bestScore >= 0) {
        cachedItalianVoice = best;
        // Diagnostico: deja visible que voz se esta usando realmente.
        window.__italianVoiceName = best.name;
        if (console && console.info) {
            console.info("[Maestro Italiano] Voz italiana en uso:", best.name, "(" + best.lang + ")");
        }
        updateVoiceTooltips(best.name);
    }
    return cachedItalianVoice;
}

// Muestra el nombre de la voz activa en el tooltip de los botones de audio.
function updateVoiceTooltips(voiceName) {
    if (!voiceName) {
        return;
    }
    document.querySelectorAll(".speak-btn, #immersive-speak").forEach((btn) => {
        btn.title = "Voz: " + voiceName;
    });
}

// Las voces se cargan de forma asincrona en muchos navegadores.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        cachedItalianVoice = null;
        pickItalianVoice();
    };
}

function showApp() {
    dom.app.classList.remove("hidden");

    // Short delay gives perceived smooth loading.
    setTimeout(() => {
        dom.splash.classList.add("fade-out");
    }, 350);
}

function showFatalError(message) {
    console.error(message);

    if (dom.splash) {
        dom.splash.innerHTML = `
            <div class="splash-inner">
                <h1 class="splash-title">Error al cargar la app</h1>
                <p class="splash-sub" style="max-width:420px; margin-inline:auto;">${escapeHtml(message)}</p>
                <button onclick="location.reload()" class="btn btn-outline" style="margin-top:16px; color:white; border-color:rgba(255,255,255,.5); background:rgba(255,255,255,.15)">
                    Reintentar
                </button>
            </div>
        `;
    }
}

function escapeHtml(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
