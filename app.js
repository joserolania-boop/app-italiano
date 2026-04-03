const STORAGE_KEY = "maestro-italiano-v6";
const STREAK_DAY_MS = 24 * 60 * 60 * 1000;
const KIND_WEIGHTS = {
    translation: 0.32,
    cloze: 0.24,
    choice: 0.12,
    conversation: 0.22,
    shadowing: 0.10,
};
const DEFAULT_PASS_PERCENTAGE = 72;

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
        renderAll();
        showApp();
    } catch (error) {
        showFatalError(error?.message || "No se pudo iniciar la app.");
    }
}

function cacheDom() {
    dom.splash = document.getElementById("splash-screen");
    dom.app = document.getElementById("app");

    dom.streakDisplay = document.getElementById("streak-display");
    dom.resetBtn = document.getElementById("reset-btn");

    dom.progressFill = document.getElementById("progress-fill");
    dom.progressLabel = document.getElementById("progress-label");

    dom.moduleTabs = document.getElementById("module-tabs");
    dom.levelGrid = document.getElementById("level-grid");

    dom.lessonSection = document.getElementById("lesson-section");
    dom.lessonTitle = document.getElementById("lesson-title");
    dom.lessonObjective = document.getElementById("lesson-objective");
    dom.immersiveText = document.getElementById("immersive-text");
    dom.immersiveSpeak = document.getElementById("immersive-speak");
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
    return value ? String(value).trim() : "";
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

    updateStreakForToday();
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
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function updateStreakForToday() {
    const now = new Date();
    const todayKey = dateKey(now);

    if (!state.lastStudyDate) {
        state.lastStudyDate = todayKey;
        state.streakDays = Math.max(1, state.streakDays || 0);
        return;
    }

    if (state.lastStudyDate === todayKey) {
        return;
    }

    const last = new Date(state.lastStudyDate + "T00:00:00");
    const diffDays = Math.round((new Date(todayKey + "T00:00:00") - last) / STREAK_DAY_MS);

    if (diffDays === 1) {
        state.streakDays = Math.max(1, state.streakDays + 1);
    } else {
        state.streakDays = 1;
    }

    state.lastStudyDate = todayKey;
}

function dateKey(dateObj) {
    return dateObj.toISOString().slice(0, 10);
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

    state.data.modules.forEach((mod) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `module-tab ${mod.id === state.activeModuleId ? "active" : ""}`.trim();

        const done = mod.levels.filter((level) => state.completedLevelIds.includes(level.id)).length;

        btn.innerHTML = `${mod.id} <span class="tab-progress">${done}/${mod.levels.length}</span>`;
        btn.addEventListener("click", () => {
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

function renderLevelGrid() {
    dom.levelGrid.innerHTML = "";

    const module = getActiveModule();
    if (!module) {
        return;
    }

    module.levels.forEach((level) => {
        const isCompleted = state.completedLevelIds.includes(level.id);
        const isActive = level.id === state.activeLevelId;

        const card = document.createElement("button");
        card.type = "button";
        card.className = `level-card ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`.trim();

        card.innerHTML = `
            <div class="level-card-id">${level.id}</div>
            <div class="level-card-obj">${level.objective || "Sin objetivo"}</div>
        `;

        card.addEventListener("click", () => {
            state.activeLevelId = level.id;
            persistState();
            renderLevelGrid();
            renderLesson();
            dom.lessonSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        dom.levelGrid.appendChild(card);
    });
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
    dom.immersiveText.textContent = level.immersiveInput || "Sin texto de practica para este nivel.";
    dom.helpGrammar.textContent = simplifyGrammar(level.grammar);
    dom.helpPatch.textContent = buildPatchCoaching(level.patchPriority);

    dom.notesArea.value = state.notesByLevel[level.id] || "";
    renderLearningGuide(level);

    renderExerciseArea(level);
}

function renderLearningGuide(level) {
    const guide = getLearningGuide(level.id);
    const levelState = getExerciseState(level.id);

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
    dom.checkBtn.disabled = false;
    dom.retryBtn.disabled = false;

    const levelExerciseState = getExerciseState(level.id);
    const lastResult = levelExerciseState.lastResult || null;

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

function getExercisePack(levelId) {
    if (typeof EXERCISE_BANK !== "undefined") {
        return EXERCISE_BANK[levelId] || null;
    }
    if (typeof M1_EXERCISE_BANK === "undefined") {
        return null;
    }
    return M1_EXERCISE_BANK[levelId] || null;
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

    state.exerciseByLevel[level.id] = {
        ...levelState,
        lastResult: {
            perDrill,
            totalScore,
            maxScore: pack.drills.length,
            ...summary,
        },
    };

    persistState();
    renderLesson();
}

function onRetryExercises() {
    const level = getActiveLevel();
    if (!level) return;

    const pack = getExercisePack(level.id);
    if (!pack || !pack.drills?.length) return;

    state.exerciseByLevel[level.id] = { responses: {}, lastResult: null };
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

    if (!state.completedLevelIds.includes(level.id)) {
        state.completedLevelIds.push(level.id);
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
        alert("Enhorabuena. Has completado todos los niveles disponibles.");
    }
}

function onBackToLevels() {
    dom.levelGrid.scrollIntoView({ behavior: "smooth", block: "start" });
}

function onSpeakImmersive() {
    const level = getActiveLevel();
    if (!level) return;
    speakItalian(level.immersiveInput || "");
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

    if (!isPrecisionLevel && hits === expectedTokens.length && expectedTokens.length > 0) {
        return {
            score: 0.7,
            status: "partial",
            label: "Casi",
            feedback,
            answer: accepted[0] || "",
        };
    }

    if (isPrecisionLevel && hits === expectedTokens.length && expectedTokens.length > 0 && enoughLength && hasEnoughVariety && hasStructure) {
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

    if (!normalized) {
        return {
            score: 0,
            status: "fail",
            label: "Vacio",
            feedback,
            answer: buildConversationAnswer(expectedTokens, expectedStructures),
        };
    }

    if (ratio === 1 && words.length >= minWords && hasEnoughVariety && successStructure && (!isExpertLevel || hasLinking)) {
        return {
            score: 1,
            status: "success",
            label: "Muy bien",
            feedback: isExpertLevel ? "Respuesta completa, cohesionada y con control suficiente para el tramo final." : isAdvancedLevel ? "Respuesta completa y con estructura suficiente para este nivel." : "Respuesta completa para este nivel.",
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

function hasLinkedProduction(rawResponse, normalized) {
    if ((String(rawResponse || "").match(/[.!?;:]/g) || []).length >= 1) {
        return true;
    }
    const linkingMarkers = [
        "che",
        "perche",
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
        "benche",
        "inoltre",
        "infine",
        "in primo luogo",
        "in secondo luogo",
        "in breve",
        "ovvero",
        "cioe",
        "in realta",
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

    if (!("speechSynthesis" in window)) {
        alert("Tu navegador no soporta audio de voz integrado.");
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    utterance.rate = 0.92;

    const voices = window.speechSynthesis.getVoices();
    const italianVoice = voices.find((voice) => String(voice.lang).toLowerCase().startsWith("it"));
    if (italianVoice) {
        utterance.voice = italianVoice;
    }

    if (levelId && drillId) {
        utterance.onend = () => {
            const current = getDrillResponse(levelId, drillId) || { listened: false, guided: false, free: false };
            saveDrillResponse(levelId, drillId, { ...current, listened: true });
            renderLesson();
        };
    }

    window.speechSynthesis.speak(utterance);
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
