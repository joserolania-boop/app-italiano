/* ═══════════════════════════════════════════════════════════
   Referencia rapida de italiano — chuletas imprescindibles
   Se muestran en la zona de lecciones para refrescar conocimiento
   ═══════════════════════════════════════════════════════════ */

const QUICK_REFERENCE = [
    {
        id: "essere-avere",
        icon: "🔑",
        title: "Essere & Avere",
        subtitle: "Los dos verbos clave",
        blocks: [
            {
                heading: "ESSERE (ser/estar)",
                table: [
                    ["io", "sono"],
                    ["tu", "sei"],
                    ["lui/lei", "è"],
                    ["noi", "siamo"],
                    ["voi", "siete"],
                    ["loro", "sono"]
                ]
            },
            {
                heading: "AVERE (tener/haber)",
                table: [
                    ["io", "ho"],
                    ["tu", "hai"],
                    ["lui/lei", "ha"],
                    ["noi", "abbiamo"],
                    ["voi", "avete"],
                    ["loro", "hanno"]
                ]
            },
            {
                note: "La h de avere es muda: ho, hai, ha, hanno se pronuncian o, ai, a, anno."
            }
        ]
    },
    {
        id: "presente",
        icon: "🟢",
        title: "Presente regular",
        subtitle: "-are · -ere · -ire",
        blocks: [
            {
                heading: "Terminaciones",
                table: [
                    ["io", "-o · -o · -o"],
                    ["tu", "-i · -i · -i"],
                    ["lui/lei", "-a · -e · -e"],
                    ["noi", "-iamo · -iamo · -iamo"],
                    ["voi", "-ate · -ete · -ite"],
                    ["loro", "-ano · -ono · -ono"]
                ]
            },
            {
                heading: "Ejemplo: parlare / prendere / dormire",
                table: [
                    ["io", "parlo · prendo · dormo"],
                    ["tu", "parli · prendi · dormi"],
                    ["lui/lei", "parla · prende · dorme"],
                    ["noi", "parliamo · prendiamo · dormiamo"],
                    ["voi", "parlate · prendete · dormite"],
                    ["loro", "parlano · prendono · dormono"]
                ]
            },
            { note: "Muchos verbos en -ire añaden -isc-: finire → io finisco, tu finisci, lui finisce, loro finiscono." }
        ]
    },
    {
        id: "articoli",
        icon: "📰",
        title: "Artículos",
        subtitle: "il, lo, la, i, gli, le",
        blocks: [
            {
                heading: "Determinados (el/la/los/las)",
                table: [
                    ["il", "masc. + consonante → il libro"],
                    ["lo", "masc. + s+cons, z, gn, ps → lo studente"],
                    ["l'", "ante vocal → l'amico, l'ora"],
                    ["la", "fem. + consonante → la casa"],
                    ["i", "plural de il → i libri"],
                    ["gli", "plural de lo / l' → gli studenti"],
                    ["le", "plural fem. → le case"]
                ]
            },
            {
                heading: "Indeterminados (un/una)",
                table: [
                    ["un", "masc. → un libro, un amico"],
                    ["uno", "masc. + s+cons, z... → uno studente"],
                    ["una", "fem. → una casa"],
                    ["un'", "fem. ante vocal → un'amica"]
                ]
            }
        ]
    },
    {
        id: "preposizioni",
        icon: "🔗",
        title: "Preposiciones",
        subtitle: "Articuladas (di+il=del)",
        blocks: [
            {
                heading: "Preposiciones simples",
                table: [
                    ["di", "de"],
                    ["a", "a / en (ciudad)"],
                    ["da", "de / desde / en casa de"],
                    ["in", "en"],
                    ["con", "con"],
                    ["su", "sobre"],
                    ["per", "por / para"],
                    ["tra/fra", "entre"]
                ]
            },
            {
                heading: "Articuladas (con il / la / lo...)",
                table: [
                    ["di + il", "del · di+la = della"],
                    ["a + il", "al · a+la = alla"],
                    ["da + il", "dal · da+la = dalla"],
                    ["in + il", "nel · in+la = nella"],
                    ["su + il", "sul · su+la = sulla"]
                ]
            },
            { note: "vado a Roma (ciudad) pero vado in Italia (país). a casa, in centro, al bar." }
        ]
    },
    {
        id: "pronomi",
        icon: "👥",
        title: "Pronombres",
        subtitle: "Sujeto y objeto",
        blocks: [
            {
                heading: "Sujeto",
                table: [
                    ["io", "yo"],
                    ["tu", "tú"],
                    ["lui / lei", "él / ella · Lei = usted"],
                    ["noi", "nosotros"],
                    ["voi", "vosotros"],
                    ["loro", "ellos/ellas"]
                ]
            },
            {
                heading: "Objeto directo / indirecto",
                table: [
                    ["mi", "me / a mí"],
                    ["ti", "te / a ti"],
                    ["lo / la", "lo / la"],
                    ["gli / le", "le (a él) / le (a ella)"],
                    ["ci", "nos"],
                    ["vi", "os"],
                    ["li / le", "los / las"]
                ]
            },
            { note: "El pronombre suele ir DELANTE del verbo: ti amo, lo vedo, mi piace." }
        ]
    },
    {
        id: "passato",
        icon: "⏪",
        title: "Passato prossimo",
        subtitle: "Hablar del pasado",
        blocks: [
            {
                heading: "Fórmula",
                table: [
                    ["estructura", "avere/essere + participio"],
                    ["con avere", "ho mangiato (he comido)"],
                    ["con essere", "sono andato/a (he ido)"]
                ]
            },
            {
                heading: "Participios irregulares frecuentes",
                table: [
                    ["fare", "fatto"],
                    ["essere", "stato"],
                    ["prendere", "preso"],
                    ["vedere", "visto"],
                    ["dire", "detto"],
                    ["aprire", "aperto"],
                    ["leggere", "letto"],
                    ["scrivere", "scritto"]
                ]
            },
            { note: "Con essere, el participio concuerda: lei è andata, loro sono andati. Verbos de movimiento y reflexivos usan essere." }
        ]
    },
    {
        id: "sintassi",
        icon: "🧩",
        title: "Sintaxis y orden",
        subtitle: "Cómo montar la frase",
        blocks: [
            {
                heading: "Orden básico",
                table: [
                    ["afirmativa", "Sujeto + Verbo + Complemento"],
                    ["ejemplo", "Marco mangia la pizza"],
                    ["sujeto omitido", "Mangio la pizza (yo)"],
                    ["negativa", "non + verbo → non mangio"],
                    ["pregunta", "mismo orden + ¿? → Mangi la pizza?"]
                ]
            },
            {
                heading: "El adjetivo concuerda y suele ir DETRÁS",
                table: [
                    ["masc. sing.", "un libro rosso"],
                    ["fem. sing.", "una casa rossa"],
                    ["masc. pl.", "i libri rossi"],
                    ["fem. pl.", "le case rosse"]
                ]
            },
            { note: "Bello, buono, grande pueden ir delante: un bel film, un buon caffè." }
        ]
    },
    {
        id: "plurali",
        icon: "🔢",
        title: "Plurales",
        subtitle: "-o→-i, -a→-e",
        blocks: [
            {
                heading: "Regla general",
                table: [
                    ["-o → -i", "libro → libri"],
                    ["-a → -e", "casa → case"],
                    ["-e → -i", "chiave → chiavi (m. y f.)"]
                ]
            },
            {
                heading: "Cuidado",
                table: [
                    ["-co/-go", "amico → amici, lago → laghi"],
                    ["-ca/-ga", "amica → amiche, riga → righe"],
                    ["-cia/-gia", "arancia → arance"],
                    ["invariables", "città, caffè, film, sport"]
                ]
            }
        ]
    },
    {
        id: "irregolari",
        icon: "⚡",
        title: "Verbos irregulares",
        subtitle: "Los que más se usan",
        blocks: [
            {
                heading: "Presente (io / tu / lui / noi / voi / loro)",
                table: [
                    ["andare", "vado, vai, va, andiamo, andate, vanno"],
                    ["fare", "faccio, fai, fa, facciamo, fate, fanno"],
                    ["dare", "do, dai, dà, diamo, date, danno"],
                    ["stare", "sto, stai, sta, stiamo, state, stanno"],
                    ["venire", "vengo, vieni, viene, veniamo, venite, vengono"],
                    ["uscire", "esco, esci, esce, usciamo, uscite, escono"]
                ]
            },
            { note: "andare = ir, fare = hacer, stare = estar/quedarse. Stare se usa para 'estar' en muchos contextos: come stai? (¿cómo estás?)." }
        ]
    },
    {
        id: "modali",
        icon: "🎯",
        title: "Verbos modales",
        subtitle: "potere, volere, dovere",
        blocks: [
            {
                heading: "Conjugación en presente",
                table: [
                    ["potere (poder)", "posso, puoi, può, possiamo, potete, possono"],
                    ["volere (querer)", "voglio, vuoi, vuole, vogliamo, volete, vogliono"],
                    ["dovere (deber)", "devo, devi, deve, dobbiamo, dovete, devono"],
                    ["sapere (saber)", "so, sai, sa, sappiamo, sapete, sanno"]
                ]
            },
            { note: "Se construyen con infinitivo: posso entrare? (¿puedo entrar?), voglio mangiare (quiero comer), devo studiare (debo estudiar)." }
        ]
    },
    {
        id: "imperfetto",
        icon: "🕰️",
        title: "Imperfetto",
        subtitle: "Pasado descriptivo / costumbre",
        blocks: [
            {
                heading: "Terminaciones (-are / -ere / -ire)",
                table: [
                    ["io", "-avo · -evo · -ivo"],
                    ["tu", "-avi · -evi · -ivi"],
                    ["lui/lei", "-ava · -eva · -iva"],
                    ["noi", "-avamo · -evamo · -ivamo"],
                    ["voi", "-avate · -evate · -ivate"],
                    ["loro", "-avano · -evano · -ivano"]
                ]
            },
            {
                heading: "Ejemplo: parlare / essere",
                table: [
                    ["parlare", "parlavo, parlavi, parlava..."],
                    ["essere (irreg.)", "ero, eri, era, eravamo, eravate, erano"]
                ]
            },
            { note: "Úsalo para descripciones y acciones habituales en el pasado: da piccolo giocavo sempre (de pequeño jugaba siempre)." }
        ]
    },
    {
        id: "futuro",
        icon: "🚀",
        title: "Futuro",
        subtitle: "Hablar de lo que vendrá",
        blocks: [
            {
                heading: "Terminaciones (sobre la raíz)",
                table: [
                    ["io", "-ò → parlerò"],
                    ["tu", "-ai → parlerai"],
                    ["lui/lei", "-à → parlerà"],
                    ["noi", "-emo → parleremo"],
                    ["voi", "-ete → parlerete"],
                    ["loro", "-anno → parleranno"]
                ]
            },
            {
                heading: "Irregulares frecuentes",
                table: [
                    ["essere", "sarò, sarai, sarà..."],
                    ["avere", "avrò, avrai, avrà..."],
                    ["andare", "andrò...  ·  fare → farò"],
                    ["venire", "verrò  ·  volere → vorrò"]
                ]
            }
        ]
    },
    {
        id: "condizionale",
        icon: "🌤️",
        title: "Condicional",
        subtitle: "Cortesía y deseos (-ría)",
        blocks: [
            {
                heading: "Terminaciones",
                table: [
                    ["io", "-ei → vorrei"],
                    ["tu", "-esti → vorresti"],
                    ["lui/lei", "-ebbe → vorrebbe"],
                    ["noi", "-emmo → vorremmo"],
                    ["voi", "-este → vorreste"],
                    ["loro", "-ebbero → vorrebbero"]
                ]
            },
            { note: "Vorrei un caffè = querría/quisiera un café. Es la forma educada por excelencia. Potrei...? = ¿podría...?" }
        ]
    },
    {
        id: "numeri",
        icon: "🔟",
        title: "Números",
        subtitle: "0 a 100 y más",
        blocks: [
            {
                heading: "0 - 20",
                table: [
                    ["0-5", "zero, uno, due, tre, quattro, cinque"],
                    ["6-10", "sei, sette, otto, nove, dieci"],
                    ["11-15", "undici, dodici, tredici, quattordici, quindici"],
                    ["16-20", "sedici, diciassette, diciotto, diciannove, venti"]
                ]
            },
            {
                heading: "Decenas y cientos",
                table: [
                    ["30 / 40 / 50", "trenta, quaranta, cinquanta"],
                    ["60 / 70", "sessanta, settanta"],
                    ["80 / 90 / 100", "ottanta, novanta, cento"],
                    ["1000", "mille (pl. mila → duemila)"]
                ]
            },
            { note: "21 = ventuno, 28 = ventotto (se elide la vocal). 23 = ventitré (con acento)." }
        ]
    },
    {
        id: "interrogativi",
        icon: "❓",
        title: "Interrogativos",
        subtitle: "Hacer preguntas",
        blocks: [
            {
                heading: "Palabras clave",
                table: [
                    ["chi?", "¿quién?"],
                    ["che / cosa?", "¿qué?"],
                    ["dove?", "¿dónde?"],
                    ["quando?", "¿cuándo?"],
                    ["perché?", "¿por qué? / porque"],
                    ["come?", "¿cómo?"],
                    ["quanto?", "¿cuánto?"],
                    ["quale?", "¿cuál?"]
                ]
            },
            { note: "Dov'è il bagno? (¿dónde está el baño?), quanto costa? (¿cuánto cuesta?), perché vale para preguntar y responder." }
        ]
    },
    {
        id: "espressioni",
        icon: "💬",
        title: "Expresiones útiles",
        subtitle: "Para sobrevivir en Italia",
        blocks: [
            {
                heading: "Saludos y cortesía",
                table: [
                    ["ciao / salve", "hola (informal / neutro)"],
                    ["buongiorno", "buenos días"],
                    ["buonasera", "buenas tardes/noches"],
                    ["per favore", "por favor"],
                    ["grazie / prego", "gracias / de nada"],
                    ["scusa / scusi", "perdona / perdone"]
                ]
            },
            {
                heading: "Frases prácticas",
                table: [
                    ["non capisco", "no entiendo"],
                    ["puoi ripetere?", "¿puedes repetir?"],
                    ["come si dice...?", "¿cómo se dice...?"],
                    ["quanto costa?", "¿cuánto cuesta?"],
                    ["il conto, per favore", "la cuenta, por favor"]
                ]
            }
        ]
    },
    {
        id: "ci-ne",
        icon: "🪄",
        title: "Ci & Ne",
        subtitle: "Las dos partículas mágicas",
        blocks: [
            {
                heading: "CI (lugar / 'ahí')",
                table: [
                    ["vado a Roma → ci vado", "voy ahí"],
                    ["c'è / ci sono", "hay (sing. / plural)"],
                    ["pensare a → ci penso", "lo pienso"]
                ]
            },
            {
                heading: "NE (cantidad / 'de eso')",
                table: [
                    ["quanti? → ne voglio due", "quiero dos (de eso)"],
                    ["parlare di → ne parlo", "hablo de ello"],
                    ["ho del pane → ne ho", "tengo (de eso)"]
                ]
            },
            { note: "Son muy frecuentes en el habla real. Ce ne sono = hay (de eso). Non ne ho = no tengo (de eso)." }
        ]
    }
];

if (typeof window !== "undefined") {
    window.QUICK_REFERENCE = QUICK_REFERENCE;
}
