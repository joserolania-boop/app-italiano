# Roadmap Maestro de Aprendizaje Acelerado de Italiano A1-C2

## Motor PAL

**Unidad de progresion:** 10 modulos x 10 niveles = 100 niveles operativos.

**Bancos lexicos por modulo:**

| Modulo | Banco de frecuencia |
| --- | --- |
| M1 | palabras 1-500 |
| M2 | palabras 501-1000 |
| M3 | palabras 1001-1500 |
| M4 | palabras 1501-2000 |
| M5 | palabras 2001-2500 |
| M6 | palabras 2501-3000 |
| M7 | palabras 3001-3500 |
| M8 | palabras 3501-4000 |
| M9 | palabras 4001-4500 |
| M10 | palabras 4501-5000 |

**Sesion neurodidactica fija por nivel:**

1. `Primer recall` 3 min sin apoyo.
2. `Input comprensible` 7 min con audio + texto.
3. `Shadowing` 5 min.
4. `Recuperacion activa` 6 min.
5. `Output guiado` 6 min.
6. `Self-Refine + patch` 3 min.

**Leyenda de ejercicios:** `TI` = traduccion inversa, `CH` = completar huecos, `CR` = conversacion en tiempo real, `SH` = shadowing, `MP` = minimal pairs.

## Fase 1. Diagnostico y Planificacion PAL

| Modulo | Rango | Foco tecnico | Logica SRS de desbloqueo |
| --- | --- | --- | --- |
| M1 | A1.1-A1.10 | fonetica, articulos, presente basico | `unlock = R24 >= 0.90 && Pron >= 0.85 && Lat <= 4.0 && PatchDebt <= 3 durante 2 sesiones` |
| M2 | A1.11-A2.0 | rutina, modales, reflexivos, passato prossimo inicial | `unlock = mean(R10m,R24,R72) >= 0.88 && Prod >= 0.78 && WER <= 0.18 && PatchDebt <= 3` |
| M3 | A2.1-A2.10 | narracion, casa, viaje, contraste temporal | `unlock = R7d >= 0.86 && StoryRetell >= 0.80 && MorphAcc >= 0.84 && SelfRepair >= 2` |
| M4 | A2.11-B1.0 | servicios, imperativo, pronombres, cortesia | `unlock = R7d >= 0.88 && DialogScore >= 0.82 && TurnLatency <= 3.5 && ErrorDrift <= 0.12` |
| M5 | B1.1-B1.10 | hipotaxis inicial, relativo, futuro, opinion | `unlock = R14d >= 0.87 && ClauseControl >= 0.84 && LexFlex >= 0.80 && PatchDebt <= 2` |
| M6 | B1.11-B2.0 | congiuntivo, pasiva, hipotetico 2, discurso referido | `unlock = R14d >= 0.89 && ModeSelection >= 0.85 && InfoDensity >= 0.82 && RepairLatency <= 2.8` |
| M7 | B2.1-B2.10 | cliticos avanzados, ci/ne, cohesion, registro | `unlock = R21d >= 0.88 && Cohesion >= 0.86 && CliticAcc >= 0.87 && FossilizedErrors <= 1` |
| M8 | B2.11-C1.0 | argumentacion, abstraccion, nominalizacion | `unlock = R21d >= 0.90 && ArgumentScore >= 0.88 && RegisterFit >= 0.86 && PatchDebt <= 1` |
| M9 | C1.1-C1.10 | matiz pragmatica, ironia, estilo, idiomaticidad | `unlock = R30d >= 0.90 && PragmaticFit >= 0.89 && StyleShift >= 0.88 && SelfEdit >= 0.90` |
| M10 | C1.11-C2.10 | dominio experto, variacion, mediacion, precision total | `unlock = R90d >= 0.90 && Transfer >= 0.95 && Debate >= 0.92 && StyleShift >= 0.90 && PatchDebt == 0` |

### Pseudocodigo maestro

```text
for nivel in plan_italiano:
    medir(R10m, R24h, R72h, R7d, R14d, R21d, R30d, R90d segun modulo)
    medir(pronunciacion, latencia, precision_morfologica, control_pragmatico)
    detectar_errores_es_hablante()
    generar_patch_correctivo()
    if regla_modulo(nivel.modulo) == True:
        desbloquear(nivel + 1)
    else:
        reciclar_items_fallidos(intervalo = SRS_adaptativo)
```

## Fase 2. Modulo de Refinamiento Self-Refine

| Error frecuente ES->IT | Detector | Patch automatico |
| --- | --- | --- |
| omision o mal uso de articulos | compara patron `DET + N` esperado vs producido | `microexplicacion + 6 MP + CH de contraste il/la/i/le/un/una` |
| confusion `essere` / `stare` | clasifica predicado por estado permanente, ubicacion o estado transitorio | `tabla contraste + TI de 8 frases + retest 10m` |
| preposiciones `a/in/da/di` | evalua verbo + regimen | `mapa verbo-preposicion + CR de 3 turnos + retest 24h` |
| auxiliar erroneo en passato prossimo | detecta verbo de movimiento/cambio de estado | `lista essenziali con essere + SH + CH` |
| calcos del espanol en posesivos | revisa uso de articulo con posesivo | `regla minima + MP + TI` |
| orden de cliticos | detecta secuencia invalida `mi lo`, `gli la` mal posicionada | `plantilla clitica + arrastre visual + CR` |
| genero/numero | compara rasgos del nombre y adjetivo | `recoloreado morfologico + CH de concordancia` |
| abuso de infinitivo por falta de modo | detecta contextos de congiuntivo/condizionale | `if trigger then rewrite + explicacion de disparador` |
| falsos amigos | busca lemas de alto riesgo | `alerta + definicion corta + TI contrastiva` |
| prosodia espanola | analiza tonicidad y duracion silabica | `audio mas lento + SH 2x + feedback de acento` |

### Bucle de autocritica

```text
errores = detectar(salida_usuario)
rankear(errores, por = impacto_comunicativo * frecuencia)
for error in top_3:
    explicar_contraste(error, ES, IT)
    reescribir_version_correcta()
    generar_patch(error)
    programar_revision(error, [10m, 24h, 72h, 7d])
if tasa_error_top_3 < 0.08 durante 3 sesiones:
    cerrar_patch()
```

## Fase 3. Arquitectura de Contenido Multimodal

### M1. Fundacion fonologica y supervivencia inmediata

| Nivel | Objetivo | XML gramatica | XML audio | Input inmersivo | Ejercicios evolutivos | Patch prioritario | Prompt diario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M1-L1 | saludar y presentarse | `<grammatica foco="essere + io/tu" transferencia="no omitir sujeto cuando ayude a fijar paradigma"/>` | `<audio accento="RAI neutro" velocidad="0.72x" pausa="380ms" enfasis="saludos"/>` | `Io sono Luca. Entro nel bar, saluto Anna e chiedo un caffe.` | `TI 4; CH 6; CR 2 turnos; SH 2` | articulos basicos | `Activa IT-M1-L1: audio lento RAI, historia, TI, CH, CR y patch para articulos.` |
| M1-L2 | identificar personas y objetos | `<grammatica foco="articoli determinativi + questo" transferencia="evitar cero articulo"/>` | `<audio accento="RAI neutro" velocidad="0.74x" pausa="360ms" enfasis="articulos"/>` | `Questa e la casa di Marco. Il tavolo e piccolo, la porta e aperta.` | `TI 5; CH 6; CR 2; SH 2; MP il/la` | genero nominal | `Activa IT-M1-L2: usa articoli, objetos de casa y corrige genero.` |
| M1-L3 | numeros, edad, nacionalidad | `<grammatica foco="avere + numeri + essere di" transferencia="no calcar edad con essere"/>` | `<audio accento="RAI neutro" velocidad="0.76x" pausa="340ms" enfasis="numeri"/>` | `Giulia ha venti anni. E spagnola e oggi compra due libri.` | `TI 5; CH 8; CR 3; SH 2` | `avere` para edad | `Activa IT-M1-L3: entrena edad, numeros y nacionalidad con SRS.` |
| M1-L4 | negacion y preguntas simples | `<grammatica foco="non + inversione prosodica" transferencia="evitar orden espanol marcado"/>` | `<audio accento="RAI neutro" velocidad="0.78x" pausa="330ms" enfasis="domande"/>` | `Paolo non lavora oggi. Va al mercato? Si, ma non compra carne.` | `TI 6; CH 6; CR 3; SH 2` | negacion preverbial | `Activa IT-M1-L4: preguntas simples, negacion y roleplay de mercado.` |
| M1-L5 | verbos regulares en presente | `<grammatica foco="-are/-ere/-ire presente" transferencia="fijar desinencias por persona"/>` | `<audio accento="RAI neutro" velocidad="0.80x" pausa="320ms" enfasis="desinenze"/>` | `Io lavoro in centro, tu studi a casa, noi apriamo il negozio alle otto.` | `TI 6; CH 8; CR 3; SH 3` | desinencias | `Activa IT-M1-L5: presente regular, shadowing y correccion de desinencias.` |
| M1-L6 | familia y posesion | `<grammatica foco="possessivi + parentela" transferencia="articulo con posesivo salvo parentela singular"/>` | `<audio accento="Firenze standard" velocidad="0.82x" pausa="310ms" enfasis="possessivi"/>` | `Mia sorella vive qui. Il mio amico arriva con sua madre.` | `TI 6; CH 8; CR 3; SH 3; MP mio/il mio` | posesivos | `Activa IT-M1-L6: familia, posesivos y patch de articulo con posesivo.` |
| M1-L7 | tiempo basico y rutina diaria | `<grammatica foco="ore + avverbi di frequenza" transferencia="fijar a/all' alle"/>` | `<audio accento="Firenze standard" velocidad="0.84x" pausa="300ms" enfasis="ritmo diario"/>` | `Alle sette mi alzo, alle otto bevo un caffe e poi vado al lavoro.` | `TI 6; CH 8; CR 4; SH 3` | preposicion con horas | `Activa IT-M1-L7: rutina con horas, audio progresivo y autocorreccion.` |
| M1-L8 | ubicacion y preposiciones basicas | `<grammatica foco="a/in/su/con" transferencia="evitar sobregeneralizar en"/>` | `<audio accento="Firenze standard" velocidad="0.86x" pausa="290ms" enfasis="preposizioni"/>` | `Il libro e sul tavolo, la borsa e in macchina e Luca e al lavoro.` | `TI 7; CH 8; CR 4; SH 3` | `a/in` | `Activa IT-M1-L8: preposiciones basicas, TI y roleplay espacial.` |
| M1-L9 | pedir comida y objetos | `<grammatica foco="vorrei + per favore" transferencia="automatizar formula cortese"/>` | `<audio accento="Roma soft" velocidad="0.88x" pausa="280ms" enfasis="cortesia"/>` | `Al bar Sara dice: vorrei un panino e un'acqua. Il cameriere sorride.` | `TI 7; CH 8; CR 4; SH 3` | cortesia formulaica | `Activa IT-M1-L9: pedidos de bar, CH y conversacion rapida.` |
| M1-L10 | consolidacion A1 inicial | `<grammatica foco="reciclaje M1" transferencia="cerrar errores top-3"/>` | `<audio accento="Roma soft" velocidad="0.90x" pausa="260ms" enfasis="fluidez"/>` | `Marco arriva presto, ordina, parla con due amici e poi torna a casa contento.` | `TI 8; CH 10; CR 5; SH 3; test SRS` | error top-3 M1 | `Activa IT-M1-L10: examen M1 completo con patch adaptativo.` |

### M2. Rutina, modales y pasado inicial

| Nivel | Objetivo | XML gramatica | XML audio | Input inmersivo | Ejercicios evolutivos | Patch prioritario | Prompt diario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M2-L1 | verbos reflexivos | `<grammatica foco="verbi riflessivi" transferencia="no omitir particula mi/ti/si"/>` | `<audio accento="Roma soft" velocidad="0.90x" pausa="250ms" enfasis="riflessivi"/>` | `Mi sveglio tardi, mi lavo in fretta e mi preparo per uscire.` | `TI 6; CH 8; CR 4; SH 3` | reflexivos | `Activa IT-M2-L1: reflexivos cotidianos y patch de particulas.` |
| M2-L2 | modales de necesidad y posibilidad | `<grammatica foco="dovere/potere/volere" transferencia="modale + infinito"/>` | `<audio accento="Roma soft" velocidad="0.92x" pausa="245ms" enfasis="modali"/>` | `Devo partire presto ma posso passare da te piu tardi.` | `TI 6; CH 8; CR 4; SH 3` | modal + infinitivo | `Activa IT-M2-L2: modales, roleplay de agenda y autocorreccion.` |
| M2-L3 | gustos y preferencias | `<grammatica foco="piacere" transferencia="reestructurar sujeto experiencial"/>` | `<audio accento="Milano neutro" velocidad="0.94x" pausa="240ms" enfasis="piacere"/>` | `Mi piace questo quartiere. Mi piacciono i parchi e i piccoli cinema.` | `TI 6; CH 8; CR 4; SH 3; MP piace/piacciono` | concordancia con `piacere` | `Activa IT-M2-L3: piacere, TI y minimal pairs.` |
| M2-L4 | comida y cantidades | `<grammatica foco="partitivi + molto/poco" transferencia="evitar calcado directo de quantificadores"/>` | `<audio accento="Milano neutro" velocidad="0.96x" pausa="235ms" enfasis="quantita"/>` | `Nel frigo c'e poco latte, ma ci sono molte verdure e un po' di pane.` | `TI 7; CH 8; CR 4; SH 3` | partitivos | `Activa IT-M2-L4: cantidades, frigo y patch de partitivos.` |
| M2-L5 | pasado con avere | `<grammatica foco="passato prossimo con avere" transferencia="participio regolare"/>` | `<audio accento="Milano neutro" velocidad="0.98x" pausa="230ms" enfasis="passato"/>` | `Ieri ho chiamato mia zia, ho cucinato e ho studiato fino a tardi.` | `TI 7; CH 10; CR 4; SH 3` | participio regular | `Activa IT-M2-L5: passato con avere y evaluacion SRS.` |
| M2-L6 | pasado con essere | `<grammatica foco="passato prossimo con essere" transferencia="concordancia del participio"/>` | `<audio accento="Milano neutro" velocidad="1.00x" pausa="225ms" enfasis="essere"/>` | `Siamo arrivati presto e Maria e rimasta in ufficio fino alle sei.` | `TI 7; CH 10; CR 4; SH 3` | auxiliar + acuerdo | `Activa IT-M2-L6: movimento/cambio de estado con essere.` |
| M2-L7 | lugares de la ciudad | `<grammatica foco="ci sono / c'e" transferencia="distincion singular-plural"/>` | `<audio accento="Bologna light" velocidad="1.00x" pausa="220ms" enfasis="citta"/>` | `In piazza c'e una banca e ci sono due negozi molto antichi.` | `TI 7; CH 8; CR 5; SH 3` | `c'e/ci sono` | `Activa IT-M2-L7: ciudad, localizacion y patch de c'e.` |
| M2-L8 | direcciones y movimiento | `<grammatica foco="andare a/in, venire da" transferencia="regimen preposicional"/>` | `<audio accento="Bologna light" velocidad="1.02x" pausa="215ms" enfasis="movimento"/>` | `Vado in stazione, poi vengo da te e infine torno a casa in bus.` | `TI 8; CH 8; CR 5; SH 3` | preposiciones de movimiento | `Activa IT-M2-L8: moverte por la ciudad con roleplay guiado.` |
| M2-L9 | planes inmediatos | `<grammatica foco="futuro prossimo contestuale" transferencia="oggi/domani + presente/futuro"/>` | `<audio accento="Bologna light" velocidad="1.04x" pausa="210ms" enfasis="pianificazione"/>` | `Domani parto presto, incontro Laura e ceniamo vicino al fiume.` | `TI 8; CH 8; CR 5; SH 3` | temporalidad inmediata | `Activa IT-M2-L9: planifica manana y corrige marcadores temporales.` |
| M2-L10 | consolidacion A2 inicial | `<grammatica foco="reciclaje M2" transferencia="cerrar passato/reflexivi/preposizioni"/>` | `<audio accento="Bologna light" velocidad="1.05x" pausa="205ms" enfasis="stabilizzazione"/>` | `Ieri mi sono svegliato presto, sono andato al mercato e ho comprato tutto per la cena.` | `TI 8; CH 10; CR 5; SH 4; test SRS` | top-3 M2 | `Activa IT-M2-L10: examen M2 con diagnostico y patch automatico.` |

### M3. Narracion controlada y vida cotidiana expandida

| Nivel | Objetivo | XML gramatica | XML audio | Input inmersivo | Ejercicios evolutivos | Patch prioritario | Prompt diario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M3-L1 | imperfecto descriptivo | `<grammatica foco="imperfetto" transferencia="separar fondo de evento"/>` | `<audio accento="Firenze standard" velocidad="1.00x" pausa="205ms" enfasis="descrizione"/>` | `Da bambino vivevo vicino al mare e passavo i pomeriggi in strada con gli amici.` | `TI 7; CH 8; CR 5; SH 3` | imperfetto vs presente | `Activa IT-M3-L1: descripcion del pasado con correccion contrastiva.` |
| M3-L2 | contraste passato/imperfetto | `<grammatica foco="evento vs contesto" transferencia="no usar un unico pasado para todo"/>` | `<audio accento="Firenze standard" velocidad="1.02x" pausa="200ms" enfasis="contrasto"/>` | `Mentre studiavo, e arrivato un messaggio e tutto e cambiato.` | `TI 8; CH 8; CR 5; SH 3` | contraste temporal | `Activa IT-M3-L2: narracion de interrupciones con patch temporal.` |
| M3-L3 | casa y mantenimiento | `<grammatica foco="dovere + oggetti domestici" transferencia="lexico funcional"/>` | `<audio accento="Firenze standard" velocidad="1.03x" pausa="198ms" enfasis="casa"/>` | `La caldaia non funzionava bene, cosi abbiamo chiamato un tecnico.` | `TI 8; CH 8; CR 5; SH 3` | orden nominal | `Activa IT-M3-L3: problemas de casa con roleplay tecnico.` |
| M3-L4 | salud y sensaciones | `<grammatica foco="stare bene/male, mi fa male" transferencia="essere/stare"/>` | `<audio accento="Roma soft" velocidad="1.04x" pausa="195ms" enfasis="salute"/>` | `Da due giorni sto male, mi fa male la gola e bevo solo te caldo.` | `TI 8; CH 8; CR 5; SH 3` | `stare` | `Activa IT-M3-L4: sintomas, farmacia y patch essere/stare.` |
| M3-L5 | compras y comparacion | `<grammatica foco="comparativi" transferencia="piu...di/che"/>` | `<audio accento="Roma soft" velocidad="1.05x" pausa="190ms" enfasis="comparativi"/>` | `Questo mercato e piu economico di quello, ma e meno vicino a casa.` | `TI 8; CH 8; CR 5; SH 3; MP di/che` | comparativos | `Activa IT-M3-L5: compara tiendas y productos con minimal pairs.` |
| M3-L6 | trabajo y estudio | `<grammatica foco="perche / siccome / quindi" transferencia="cohesion causal"/>` | `<audio accento="Roma soft" velocidad="1.06x" pausa="188ms" enfasis="cause-effetto"/>` | `Studio la sera perche di giorno lavoro, quindi organizzo tutto con attenzione.` | `TI 8; CH 8; CR 5; SH 3` | conectores basicos | `Activa IT-M3-L6: causa-efecto y cohesion en discurso corto.` |
| M3-L7 | vacaciones y viajes | `<grammatica foco="mezzi di trasporto + prenotazioni" transferencia="andare in/a"/>` | `<audio accento="Milano neutro" velocidad="1.07x" pausa="186ms" enfasis="viaggio"/>` | `Abbiamo prenotato un treno notturno e siamo partiti con due valigie leggere.` | `TI 8; CH 8; CR 5; SH 3` | transporte + prep | `Activa IT-M3-L7: viaje en tren, reservas y patch preposicional.` |
| M3-L8 | pronombres directos | `<grammatica foco="lo/la/li/le" transferencia="colocacion preverbal"/>` | `<audio accento="Milano neutro" velocidad="1.08x" pausa="184ms" enfasis="clitici"/>` | `Ho visto il film? Si, l'ho visto ieri e l'ho consigliato a tutti.` | `TI 8; CH 10; CR 5; SH 4` | cliticos directos | `Activa IT-M3-L8: cliticos directos con recast automatico.` |
| M3-L9 | pronombres indirectos | `<grammatica foco="gli/le + dare/portare" transferencia="leismo y orden"/>` | `<audio accento="Milano neutro" velocidad="1.09x" pausa="182ms" enfasis="indiretti"/>` | `A Chiara piace il libro, quindi le porto la mia copia domani.` | `TI 8; CH 10; CR 5; SH 4` | indirectos | `Activa IT-M3-L9: indirectos y roleplay de favores.` |
| M3-L10 | consolidacion A2 alto | `<grammatica foco="reciclaje M3" transferencia="cerrar tiempos y cliticos"/>` | `<audio accento="Milano neutro" velocidad="1.10x" pausa="180ms" enfasis="narrativa"/>` | `Mentre tornavamo a casa, ci ha chiamati Lucia e ci ha raccontato una notizia inattesa.` | `TI 10; CH 10; CR 6; SH 4; test SRS` | top-3 M3 | `Activa IT-M3-L10: test narrativo, cliticos y contraste temporal.` |

### M4. Interaccion social, servicios y cortesia funcional

| Nivel | Objetivo | XML gramatica | XML audio | Input inmersivo | Ejercicios evolutivos | Patch prioritario | Prompt diario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M4-L1 | imperativo informal | `<grammatica foco="imperativo tu/noi" transferencia="formas irregulares frequenti"/>` | `<audio accento="Roma soft" velocidad="1.05x" pausa="178ms" enfasis="istruzioni"/>` | `Prendi il biglietto, aspetta qui e poi seguimi fino alla fermata.` | `TI 8; CH 8; CR 5; SH 3` | imperativos irregulares | `Activa IT-M4-L1: instrucciones e imperativo con revision SRS.` |
| M4-L2 | cortesia formal | `<grammatica foco="Lei cortese + condizionale" transferencia="cambio de registro"/>` | `<audio accento="Torino neutro" velocidad="1.06x" pausa="176ms" enfasis="registro formale"/>` | `Scusi, potrebbe aiutarmi? Vorrei sapere dov'e l'ufficio postale.` | `TI 8; CH 8; CR 5; SH 3` | registro formal | `Activa IT-M4-L2: roleplay formal en oficina y patch de cortesia.` |
| M4-L3 | medico y farmacia | `<grammatica foco="sintomi + consigli con dovere" transferencia="mi fa male / devo"/>` | `<audio accento="Torino neutro" velocidad="1.07x" pausa="174ms" enfasis="medico"/>` | `Il medico dice che devo riposare e che non devo lavorare per due giorni.` | `TI 8; CH 8; CR 5; SH 3` | consejo modal | `Activa IT-M4-L3: consulta medica y autocorreccion modal.` |
| M4-L4 | hotel y reclamaciones | `<grammatica foco="c'e stato un problema" transferencia="reclamo controlado"/>` | `<audio accento="Torino neutro" velocidad="1.08x" pausa="172ms" enfasis="reclamo"/>` | `In camera c'era rumore e non funzionava l'aria, cosi ho chiesto un cambio.` | `TI 8; CH 8; CR 6; SH 3` | pasado + reclamacion | `Activa IT-M4-L4: reclamacion hotelera con roleplay adaptativo.` |
| M4-L5 | comparativos y superlativos | `<grammatica foco="piu/meno/il piu" transferencia="grado correcto"/>` | `<audio accento="Torino neutro" velocidad="1.09x" pausa="170ms" enfasis="valutazione"/>` | `Tra i tre ristoranti, questo e il piu tranquillo e il meno caro.` | `TI 8; CH 8; CR 6; SH 3` | superlativos | `Activa IT-M4-L5: comparar opciones y justificar la eleccion.` |
| M4-L6 | ci y ne iniciales | `<grammatica foco="ci locativo, ne partitivo" transferencia="evitar omision por interferencia"/>` | `<audio accento="Bologna light" velocidad="1.10x" pausa="168ms" enfasis="ci/ne"/>` | `Vai spesso al museo? Si, ci vado ogni mese e ne parlo sempre.` | `TI 8; CH 10; CR 6; SH 4` | `ci/ne` | `Activa IT-M4-L6: entrena ci/ne con recasts y contraste.` |
| M4-L7 | pronombres combinados iniciales | `<grammatica foco="me lo, te la" transferencia="orden fijo clitico"/>` | `<audio accento="Bologna light" velocidad="1.11x" pausa="166ms" enfasis="clitici doppi"/>` | `Se vuoi il documento, te lo mando subito e te ne spiego il contenuto.` | `TI 8; CH 10; CR 6; SH 4` | orden de cliticos | `Activa IT-M4-L7: cliticos dobles y simulacion de oficina.` |
| M4-L8 | futuro simple | `<grammatica foco="futuro semplice" transferencia="valor de prediccion y plan"/>` | `<audio accento="Bologna light" velocidad="1.12x" pausa="164ms" enfasis="futuro"/>` | `Tra un anno lavorero a Milano e vivro vicino al parco centrale.` | `TI 8; CH 8; CR 6; SH 4` | futuro vs presente | `Activa IT-M4-L8: planes futuros con feedback de modo verbal.` |
| M4-L9 | condicional de cortesia | `<grammatica foco="vorrei/potrei/dovrei" transferencia="automatizacion cortese"/>` | `<audio accento="Bologna light" velocidad="1.13x" pausa="162ms" enfasis="condizionale"/>` | `Vorrei cambiare tavolo e potrei pagare con carta se possibile.` | `TI 8; CH 8; CR 6; SH 4` | condicional cortesia | `Activa IT-M4-L9: restaurante formal con condicional de cortesia.` |
| M4-L10 | consolidacion B1 umbral | `<grammatica foco="reciclaje M4" transferencia="cerrar ci/ne y cortesia"/>` | `<audio accento="Bologna light" velocidad="1.14x" pausa="160ms" enfasis="interazione"/>` | `Alla reception ho spiegato il problema, me l'hanno risolto e alla fine ne sono uscito soddisfatto.` | `TI 10; CH 10; CR 6; SH 4; test SRS` | top-3 M4 | `Activa IT-M4-L10: examen funcional B1 con diagnostico conversacional.` |

### M5. Produccion extendida y control de opinion

| Nivel | Objetivo | XML gramatica | XML audio | Input inmersivo | Ejercicios evolutivos | Patch prioritario | Prompt diario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M5-L1 | relativos basicos | `<grammatica foco="che/cui" transferencia="unir clausulas sin calcado espanol"/>` | `<audio accento="Milano neutro" velocidad="1.10x" pausa="158ms" enfasis="relativi"/>` | `Il libro che leggo parla di una citta in cui nessuno dorme presto.` | `TI 8; CH 8; CR 6; SH 4` | relativos | `Activa IT-M5-L1: relativos y cohesion escrita/oral.` |
| M5-L2 | opinion estructurada | `<grammatica foco="secondo me / penso che" transferencia="disparador de congiuntivo futuro"/>` | `<audio accento="Milano neutro" velocidad="1.11x" pausa="156ms" enfasis="opinione"/>` | `Secondo me il quartiere sta cambiando e penso che presto diventera piu vivo.` | `TI 8; CH 8; CR 6; SH 4` | opinion + modo | `Activa IT-M5-L2: expresa opinion y prepara congiuntivo.` |
| M5-L3 | conectores argumentativos | `<grammatica foco="inoltre/tuttavia/percio" transferencia="cohesion formal"/>` | `<audio accento="Milano neutro" velocidad="1.12x" pausa="154ms" enfasis="connettivi"/>` | `Il progetto costa molto; tuttavia puo migliorare il quartiere e, inoltre, creare lavoro.` | `TI 8; CH 8; CR 6; SH 4` | conectores | `Activa IT-M5-L3: argumenta con conectores y patch de cohesion.` |
| M5-L4 | impersonal si | `<grammatica foco="si impersonale" transferencia="evitar sujeto generico espanol"/>` | `<audio accento="Firenze standard" velocidad="1.13x" pausa="152ms" enfasis="si impersonale"/>` | `In questa citta si mangia tardi e si parla molto per strada.` | `TI 8; CH 8; CR 6; SH 4` | `si impersonale` | `Activa IT-M5-L4: costumbres y patch impersonal.` |
| M5-L5 | periodo ipotetico tipo 1 | `<grammatica foco="se + presente, futuro" transferencia="condicional impropio"/>` | `<audio accento="Firenze standard" velocidad="1.14x" pausa="150ms" enfasis="ipotesi"/>` | `Se finisco presto, usciremo insieme e vedremo il nuovo museo.` | `TI 8; CH 8; CR 6; SH 4` | secuencia correcta | `Activa IT-M5-L5: hipotesis real y roleplay de planes.` |
| M5-L6 | discurso indirecto basico | `<grammatica foco="ha detto che" transferencia="deixis temporal"/>` | `<audio accento="Firenze standard" velocidad="1.15x" pausa="148ms" enfasis="discorso riferito"/>` | `Marta ha detto che arrivava tardi ma che poi ci avrebbe chiamati.` | `TI 8; CH 8; CR 6; SH 4` | cambios de tiempo | `Activa IT-M5-L6: discurso referido con seguimiento SRS.` |
| M5-L7 | pronombres relativos avanzados | `<grammatica foco="il quale / cui" transferencia="precision formal"/>` | `<audio accento="Roma soft" velocidad="1.16x" pausa="146ms" enfasis="registro medio-alto"/>` | `Il documento, di cui tutti parlano, contiene dati molto utili.` | `TI 8; CH 8; CR 6; SH 4` | `di cui` | `Activa IT-M5-L7: documentos, relativo formal y patch di cui.` |
| M5-L8 | narracion de experiencias | `<grammatica foco="sequenza narrativa B1" transferencia="cohesion temporal"/>` | `<audio accento="Roma soft" velocidad="1.17x" pausa="144ms" enfasis="racconto"/>` | `Quando sono arrivato in Italia, non capivo tutto, ma ogni giorno parlavo con piu sicurezza.` | `TI 10; CH 8; CR 6; SH 4` | cohesion temporal | `Activa IT-M5-L8: autobiografia guiada con correccion temporal.` |
| M5-L9 | congiuntivo presente inicial | `<grammatica foco="penso che sia" transferencia="activar disparadores"/>` | `<audio accento="Roma soft" velocidad="1.18x" pausa="142ms" enfasis="congiuntivo"/>` | `Penso che sia una buona idea e spero che tutti capiscano il progetto.` | `TI 10; CH 10; CR 6; SH 4` | disparadores congiuntivo | `Activa IT-M5-L9: congiuntivo presente con parches automáticos.` |
| M5-L10 | consolidacion B1 pleno | `<grammatica foco="reciclaje M5" transferencia="cerrar relativos, ipotesi, congiuntivo inicial"/>` | `<audio accento="Roma soft" velocidad="1.19x" pausa="140ms" enfasis="output esteso"/>` | `Se il quartiere cambiera davvero, penso che molti giovani vi troveranno nuove opportunita.` | `TI 10; CH 10; CR 7; SH 4; test SRS` | top-3 M5 | `Activa IT-M5-L10: examen B1 con opinion, hipotesis y congiuntivo.` |

### M6. Precision modal, congiuntivo y estructuras complejas

| Nivel | Objetivo | XML gramatica | XML audio | Input inmersivo | Ejercicios evolutivos | Patch prioritario | Prompt diario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M6-L1 | congiuntivo con duda | `<grammatica foco="non credo che + congiuntivo" transferencia="modo dependiente"/>` | `<audio accento="Torino neutro" velocidad="1.16x" pausa="138ms" enfasis="dubbio"/>` | `Non credo che il direttore sappia tutto, ma temo che capisca il problema.` | `TI 10; CH 10; CR 6; SH 4` | duda + congiuntivo | `Activa IT-M6-L1: duda, congiuntivo y patch de disparadores.` |
| M6-L2 | congiuntivo pasado | `<grammatica foco="penso che abbia fatto" transferencia="auxiliar + participio en subordinada"/>` | `<audio accento="Torino neutro" velocidad="1.17x" pausa="136ms" enfasis="congiuntivo passato"/>` | `Penso che abbia scelto bene, anche se nessuno l'ha detto apertamente.` | `TI 10; CH 10; CR 6; SH 4` | forma compuesta | `Activa IT-M6-L2: congiuntivo pasado con recasts inmediatos.` |
| M6-L3 | pasiva | `<grammatica foco="essere + participio / venire" transferencia="agente expreso u omitido"/>` | `<audio accento="Torino neutro" velocidad="1.18x" pausa="134ms" enfasis="passiva"/>` | `Il progetto e stato approvato ieri ed e stato presentato ai residenti.` | `TI 10; CH 8; CR 6; SH 4` | pasiva | `Activa IT-M6-L3: transforma activa/pasiva y corrige concordancia.` |
| M6-L4 | gerundio y simultaneidad | `<grammatica foco="stare + gerundio / gerundio modale" transferencia="simultaneidad real"/>` | `<audio accento="Bologna light" velocidad="1.19x" pausa="132ms" enfasis="gerundio"/>` | `Sto leggendo il rapporto camminando lentamente verso la stazione.` | `TI 10; CH 8; CR 6; SH 4` | gerundio | `Activa IT-M6-L4: acciones simultaneas y patch gerundio.` |
| M6-L5 | periodo ipotetico tipo 2 | `<grammatica foco="se + imperfetto, condizionale" transferencia="secuencia irreal"/>` | `<audio accento="Bologna light" velocidad="1.20x" pausa="130ms" enfasis="ipotetico 2"/>` | `Se avessi piu tempo, seguirei un corso serale di cucina italiana.` | `TI 10; CH 10; CR 6; SH 4` | hipotesis irreal | `Activa IT-M6-L5: hipotetico 2 con contraste estructural.` |
| M6-L6 | concesion y contraste | `<grammatica foco="benche/nonostante" transferencia="modo tras concesivas"/>` | `<audio accento="Bologna light" velocidad="1.21x" pausa="128ms" enfasis="concessione"/>` | `Benche piova, il mercato resta pieno e tutti continuano a discutere.` | `TI 10; CH 8; CR 6; SH 4` | concesiva + modo | `Activa IT-M6-L6: concesion, congiuntivo y cohesion argumental.` |
| M6-L7 | discurso referido avanzado | `<grammatica foco="mi ha spiegato che..." transferencia="ajuste deictico"/>` | `<audio accento="Milano neutro" velocidad="1.22x" pausa="126ms" enfasis="riferito"/>` | `Il tecnico mi ha spiegato che il sistema avrebbe richiesto un aggiornamento urgente.` | `TI 10; CH 8; CR 7; SH 4` | deixis | `Activa IT-M6-L7: reporte indirecto y patch de tiempos.` |
| M6-L8 | infinitivas y verbos de percepcion | `<grammatica foco="vedere qualcuno fare" transferencia="no insertar preposiciones espurias"/>` | `<audio accento="Milano neutro" velocidad="1.23x" pausa="124ms" enfasis="percezione"/>` | `Ho visto i ragazzi entrare in silenzio e uscire molto piu tranquilli.` | `TI 10; CH 8; CR 7; SH 4` | infinitiva | `Activa IT-M6-L8: percepcion y estructuras infinitivas.` |
| M6-L9 | sintetizar informacion | `<grammatica foco="riassunto con gerarchie informative" transferencia="densidad sin perder claridad"/>` | `<audio accento="Milano neutro" velocidad="1.24x" pausa="122ms" enfasis="sintesi"/>` | `In breve, il piano riduce i costi, migliora i servizi e rafforza la rete locale.` | `TI 10; CH 8; CR 7; SH 4` | condensacion | `Activa IT-M6-L9: resume informacion y mide densidad informativa.` |
| M6-L10 | consolidacion B2 umbral | `<grammatica foco="reciclaje M6" transferencia="cerrar congiuntivo, passiva e ipotetico 2"/>` | `<audio accento="Milano neutro" velocidad="1.25x" pausa="120ms" enfasis="precisione"/>` | `Se il piano fosse stato discusso prima, credo che sarebbe stato accolto meglio dai cittadini.` | `TI 10; CH 10; CR 7; SH 4; test SRS` | top-3 M6 | `Activa IT-M6-L10: examen B2 inicial con modos y estructuras complejas.` |

### M7. Cohesion avanzada, cliticos y control de registro

| Nivel | Objetivo | XML gramatica | XML audio | Input inmersivo | Ejercicios evolutivos | Patch prioritario | Prompt diario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M7-L1 | cliticos dobles avanzados | `<grammatica foco="glielo/gliela/gliene" transferencia="orden fijo + fusione"/>` | `<audio accento="Napoli light" velocidad="1.20x" pausa="118ms" enfasis="clitici doppi"/>` | `Il contratto era pronto e gliel'ho inviato appena ho ricevuto l'indirizzo corretto.` | `TI 10; CH 10; CR 7; SH 4` | cliticos dobles | `Activa IT-M7-L1: glielo/gliela con drill intensivo.` |
| M7-L2 | dislocaciones y foco | `<grammatica foco="a me mi / il libro, l'ho letto" transferencia="uso marcado vs error"/>` | `<audio accento="Napoli light" velocidad="1.21x" pausa="116ms" enfasis="focalizzazione"/>` | `Quel quartiere, lo conosco bene: ci ho lavorato per anni.` | `TI 10; CH 8; CR 7; SH 4` | foco/dislocacion | `Activa IT-M7-L2: foco informativo y reescrituras.` |
| M7-L3 | conectores de alto nivel | `<grammatica foco="pertanto/ciononostante/d'altronde" transferencia="registro adecuado"/>` | `<audio accento="Napoli light" velocidad="1.22x" pausa="114ms" enfasis="connettivi alti"/>` | `Il budget era minimo; ciononostante il team ha concluso il lavoro nei tempi.` | `TI 10; CH 8; CR 7; SH 4` | conector-registro | `Activa IT-M7-L3: argumenta con conectores altos y control de registro.` |
| M7-L4 | concordancia a distancia | `<grammatica foco="accordi complessi" transferencia="rasgos distribuidos"/>` | `<audio accento="Firenze standard" velocidad="1.23x" pausa="112ms" enfasis="accordi"/>` | `Le proposte che sono state presentate ieri erano piu convincenti del previsto.` | `TI 10; CH 8; CR 7; SH 4` | acuerdo complejo | `Activa IT-M7-L4: concordancia compleja con coloreado morfologico.` |
| M7-L5 | ne argumental y partitivo | `<grammatica foco="ne ho parlato / ne voglio due" transferencia="funcion doble"/>` | `<audio accento="Firenze standard" velocidad="1.24x" pausa="110ms" enfasis="ne"/>` | `Di quel problema ne abbiamo parlato a lungo e ne servono ancora due esempi chiari.` | `TI 10; CH 10; CR 7; SH 4` | `ne` doble valor | `Activa IT-M7-L5: ne argumental/partitivo con contraste.` |
| M7-L6 | ci textual y idiomatico | `<grammatica foco="ci penso / ci tengo / c'entrano" transferencia="polisemia funcional"/>` | `<audio accento="Firenze standard" velocidad="1.25x" pausa="108ms" enfasis="ci idiomatico"/>` | `Ci tengo a chiarire che questi dati non c'entrano con il caso precedente.` | `TI 10; CH 10; CR 7; SH 4` | `ci` idiomatico | `Activa IT-M7-L6: usos idiomaticos de ci con recasts.` |
| M7-L7 | registro semiformale | `<grammatica foco="scrittura email / richiesta strutturata" transferencia="tono estable"/>` | `<audio accento="Roma soft" velocidad="1.25x" pausa="106ms" enfasis="email professionale"/>` | `Gentile ufficio, desidero segnalare un ritardo e chiedere un riscontro entro venerdi.` | `TI 10; CH 8; CR 7; SH 4` | formula email | `Activa IT-M7-L7: redacta y oraliza una email formal.` |
| M7-L8 | reformulacion precisa | `<grammatica foco="cioe/in altre parole/ovvero" transferencia="parafrasis controlada"/>` | `<audio accento="Roma soft" velocidad="1.26x" pausa="104ms" enfasis="riformulazione"/>` | `Il servizio e discontinuo, cioe non garantisce la stessa qualita in ogni zona.` | `TI 10; CH 8; CR 7; SH 4` | reformulacion | `Activa IT-M7-L8: reformula y sintetiza sin perder precision.` |
| M7-L9 | ironia ligera y implicatura | `<grammatica foco="lettura pragmatica" transferencia="evitar interpretacion literal"/>` | `<audio accento="Roma soft" velocidad="1.27x" pausa="102ms" enfasis="ironia lieve"/>` | `Che organizzazione perfetta, disse Luca guardando la fila bloccata da un'ora.` | `TI 10; CH 8; CR 7; SH 4` | lectura pragmatica | `Activa IT-M7-L9: detecta ironia y explica la implicatura.` |
| M7-L10 | consolidacion B2 pleno | `<grammatica foco="reciclaje M7" transferencia="cerrar clitici, registro y cohesion"/>` | `<audio accento="Roma soft" velocidad="1.28x" pausa="100ms" enfasis="coesione"/>` | `Gliene avevo gia parlato; ciononostante, il responsabile non ci ha dato una risposta chiara.` | `TI 10; CH 10; CR 8; SH 4; test SRS` | top-3 M7 | `Activa IT-M7-L10: examen B2 completo con cohesion y pragmatica.` |

### M8. Argumentacion, abstraccion y densidad C1 inicial

| Nivel | Objetivo | XML gramatica | XML audio | Input inmersivo | Ejercicios evolutivos | Patch prioritario | Prompt diario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M8-L1 | tesis y antitesis | `<grammatica foco="da un lato/dall'altro" transferencia="estructura bipolar"/>` | `<audio accento="Torino neutro" velocidad="1.24x" pausa="98ms" enfasis="argomentazione"/>` | `Da un lato il piano riduce i costi; dall'altro rischia di escludere i residenti piu fragili.` | `TI 10; CH 8; CR 8; SH 4` | tesis/antitesis | `Activa IT-M8-L1: construye argumento bipolar y autocorrige cohesion.` |
| M8-L2 | nominalizacion | `<grammatica foco="sviluppare > sviluppo" transferencia="densidad lexica"/>` | `<audio accento="Torino neutro" velocidad="1.25x" pausa="96ms" enfasis="nominalizzazione"/>` | `La riduzione dei tempi di attesa ha favorito una migliore percezione del servizio.` | `TI 10; CH 8; CR 8; SH 4` | nominalizacion | `Activa IT-M8-L2: transforma verbo en nombre y mide densidad.` |
| M8-L3 | matiz evaluativo | `<grammatica foco="sembra / risulta / appare" transferencia="gradacion epistemica"/>` | `<audio accento="Torino neutro" velocidad="1.26x" pausa="94ms" enfasis="sfumatura"/>` | `La misura appare utile, ma risulta ancora poco accessibile ai nuovi arrivati.` | `TI 10; CH 8; CR 8; SH 4` | matiz epistemico | `Activa IT-M8-L3: evalua con matiz y evita afirmacion plana.` |
| M8-L4 | concesion avanzada | `<grammatica foco="pur + gerundio / sebbene" transferencia="compactacion argumental"/>` | `<audio accento="Milano neutro" velocidad="1.27x" pausa="92ms" enfasis="concessione avanzata"/>` | `Pur riconoscendo i progressi, molti residenti continuano a segnalare criticita diffuse.` | `TI 10; CH 8; CR 8; SH 4` | concesion compacta | `Activa IT-M8-L4: concesion avanzada y recasteo sintactico.` |
| M8-L5 | voz media y pasiva alternativa | `<grammatica foco="si passivante" transferencia="elegir forma natural"/>` | `<audio accento="Milano neutro" velocidad="1.28x" pausa="90ms" enfasis="si passivante"/>` | `Nel rapporto si descrivono tre scenari e si evidenziano i rischi principali.` | `TI 10; CH 8; CR 8; SH 4` | `si passivante` | `Activa IT-M8-L5: activa/pasiva/si passivante en contraste.` |
| M8-L6 | sintesis de fuentes | `<grammatica foco="integrazione di due fonti" transferencia="citas indirectas"/>` | `<audio accento="Milano neutro" velocidad="1.29x" pausa="88ms" enfasis="sintesi fonti"/>` | `Secondo il primo studio il quartiere cresce; il secondo, invece, ne sottolinea le disuguaglianze.` | `TI 10; CH 8; CR 8; SH 4` | integracion de fuentes | `Activa IT-M8-L6: fusiona dos fuentes y corrige cohesion.` |
| M8-L7 | inferencia y hedging | `<grammatica foco="potrebbe suggerire / sembra indicare" transferencia="prudencia analitica"/>` | `<audio accento="Firenze standard" velocidad="1.30x" pausa="86ms" enfasis="hedging"/>` | `Questo dato potrebbe suggerire una tendenza, ma non basta a confermare l'ipotesi.` | `TI 10; CH 8; CR 8; SH 4` | hedging | `Activa IT-M8-L7: formula inferencias con prudencia lingüistica.` |
| M8-L8 | discurso academico oral | `<grammatica foco="sequenziatori macrotestuali" transferencia="metadiscurso"/>` | `<audio accento="Firenze standard" velocidad="1.31x" pausa="84ms" enfasis="discorso accademico"/>` | `In primo luogo definisco il problema; in secondo luogo analizzo i dati; infine propongo una lettura.` | `TI 10; CH 8; CR 8; SH 4` | metadiscurso | `Activa IT-M8-L8: mini-presentacion academica con feedback.` |
| M8-L9 | debate estructurado | `<grammatica foco="replica, confutazione, concessione" transferencia="turn-taking alto"/>` | `<audio accento="Firenze standard" velocidad="1.32x" pausa="82ms" enfasis="dibattito"/>` | `Capisco l'obiezione; tuttavia i dati mostrano un impatto che non puo essere ignorato.` | `TI 10; CH 8; CR 8; SH 4` | refutacion elegante | `Activa IT-M8-L9: debate con turnos y patch de refutacion.` |
| M8-L10 | consolidacion C1 umbral | `<grammatica foco="reciclaje M8" transferencia="cerrar nominalizacion, hedging y sintesis"/>` | `<audio accento="Firenze standard" velocidad="1.33x" pausa="80ms" enfasis="densita"/>` | `Pur essendo incompleti, i dati sembrano indicare una trasformazione profonda del contesto urbano.` | `TI 10; CH 10; CR 8; SH 4; test SRS` | top-3 M8 | `Activa IT-M8-L10: examen C1 inicial con argumentacion y sintesis.` |

### M9. Matiz pragmatico, estilo e idiomaticidad

| Nivel | Objetivo | XML gramatica | XML audio | Input inmersivo | Ejercicios evolutivos | Patch prioritario | Prompt diario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M9-L1 | idiomaticidad controlada | `<grammatica foco="fare una figuraccia, cavarsela" transferencia="no traducir literalmente"/>` | `<audio accento="Roma soft" velocidad="1.28x" pausa="78ms" enfasis="idiomi"/>` | `All'inizio pensavo di fare una figuraccia, ma alla fine me la sono cavata bene.` | `TI 10; CH 8; CR 8; SH 4` | idioms | `Activa IT-M9-L1: idiomatiza sin calcarlos del espanol.` |
| M9-L2 | atenuacion y cortesia fina | `<grammatica foco="forse, eventualmente, mi chiedevo se" transferencia="mitigacion pragmatica"/>` | `<audio accento="Roma soft" velocidad="1.29x" pausa="76ms" enfasis="mitigazione"/>` | `Mi chiedevo se fosse eventualmente possibile anticipare l'incontro di mezz'ora.` | `TI 10; CH 8; CR 8; SH 4` | mitigacion | `Activa IT-M9-L2: peticiones sutiles y control pragmatico.` |
| M9-L3 | ironia y doble lectura | `<grammatica foco="contraste tra letterale e inteso" transferencia="leer tono"/>` | `<audio accento="Roma soft" velocidad="1.30x" pausa="74ms" enfasis="doppio senso"/>` | `Ottima idea arrivare senza documenti, commento il funzionario con un sorriso gelido.` | `TI 10; CH 8; CR 8; SH 4` | ironia | `Activa IT-M9-L3: detecta intencion y reformula en tono neutro.` |
| M9-L4 | estilo narrativo alto | `<grammatica foco="periodi ampi e ritmo" transferencia="evitar fragmentacion espanola"/>` | `<audio accento="Torino neutro" velocidad="1.31x" pausa="72ms" enfasis="stile narrativo"/>` | `La citta, avvolta in una luce lattiginosa, sembrava trattenere il respiro prima del temporale.` | `TI 10; CH 8; CR 8; SH 4` | ritmo sintactico | `Activa IT-M9-L4: imita estilo narrativo y corrige cadencia.` |
| M9-L5 | estilo ensayistico | `<grammatica foco="tesi, sviluppo, chiusura" transferencia="macroestructura"/>` | `<audio accento="Torino neutro" velocidad="1.32x" pausa="70ms" enfasis="saggistico"/>` | `Il problema non e solo economico: riguarda anche la memoria, la visibilita e il potere simbolico.` | `TI 10; CH 8; CR 8; SH 4` | macroestructura | `Activa IT-M9-L5: redacta y oraliza un microensayo.` |
| M9-L6 | cambio de registro | `<grammatica foco="colloquiale vs istituzionale" transferencia="shift consciente"/>` | `<audio accento="Torino neutro" velocidad="1.33x" pausa="68ms" enfasis="shift registro"/>` | `Tra amici dico che e un caos; in riunione, che la gestione presenta criticita evidenti.` | `TI 10; CH 8; CR 8; SH 4` | cambio de registro | `Activa IT-M9-L6: reformula el mismo mensaje en dos registros.` |
| M9-L7 | regionalismos controlados | `<grammatica foco="esposizione a variazione" transferencia="comprension sin fossilizar rasgo local"/>` | `<audio accento="Napoli light" velocidad="1.30x" pausa="66ms" enfasis="variazione"/>` | `Al mercato sento voci diverse, ma riesco comunque a seguire il filo della trattativa.` | `TI 10; CH 8; CR 8; SH 4` | comprension regional | `Activa IT-M9-L7: escucha variacion regional y resume en italiano standard.` |
| M9-L8 | mediacion intercultural | `<grammatica foco="spiegare un concetto a due publicos" transferencia="puente conceptual"/>` | `<audio accento="Milano neutro" velocidad="1.34x" pausa="64ms" enfasis="mediazione"/>` | `Spiego il problema ai residenti con parole semplici e ai tecnici con termini piu precisi.` | `TI 10; CH 8; CR 8; SH 4` | mediacion | `Activa IT-M9-L8: explica el mismo concepto a dos audiencias.` |
| M9-L9 | autocorreccion estilistica | `<grammatica foco="tagliare ridondanza e aumentare precisione" transferencia="self-edit"/>` | `<audio accento="Milano neutro" velocidad="1.35x" pausa="62ms" enfasis="editing"/>` | `Rileggo il testo, elimino ripetizioni e scelgo verbi piu netti per chiarire la tesi.` | `TI 10; CH 8; CR 8; SH 4` | self-edit | `Activa IT-M9-L9: edita tu produccion y justifica cada cambio.` |
| M9-L10 | consolidacion C1 pleno | `<grammatica foco="reciclaje M9" transferencia="cerrar idiomaticidad, pragmatica y estilo"/>` | `<audio accento="Milano neutro" velocidad="1.36x" pausa="60ms" enfasis="raffinamento"/>` | `Pur con registri diversi, riesco ormai a sostenere una posizione, sfumarla e difenderla con naturalezza.` | `TI 10; CH 10; CR 8; SH 4; test SRS` | top-3 M9 | `Activa IT-M9-L10: examen C1 completo con estilo, matiz y autocorreccion.` |

### M10. Dominio experto, variacion y C2 operativo

| Nivel | Objetivo | XML gramatica | XML audio | Input inmersivo | Ejercicios evolutivos | Patch prioritario | Prompt diario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M10-L1 | mediacion compleja | `<grammatica foco="resumir, reinterpretar, adaptar" transferencia="precision maxima"/>` | `<audio accento="rotativo nord-centro" velocidad="1.34x" pausa="58ms" enfasis="mediazione esperta"/>` | `Trasformo un testo tecnico in una spiegazione accessibile senza perdere le relazioni chiave.` | `TI 10; CH 8; CR 8; SH 4` | simplificacion precisa | `Activa IT-M10-L1: media un texto tecnico para publico general.` |
| M10-L2 | debate experto | `<grammatica foco="confutazione multilivello" transferencia="cohesion bajo presion"/>` | `<audio accento="rotativo nord-centro" velocidad="1.35x" pausa="56ms" enfasis="dibattito esperto"/>` | `Accolgo l'obiezione, ne delimito la portata e poi mostro perche non invalida il quadro generale.` | `TI 10; CH 8; CR 9; SH 4` | refutacion alta | `Activa IT-M10-L2: debate experto con turnos largos y autocritica.` |
| M10-L3 | lectura de variacion regional | `<grammatica foco="comprensione interregionale" transferencia="mapa de rasgos"/>` | `<audio accento="rotativo nord-centro-sud" velocidad="1.36x" pausa="54ms" enfasis="variazione"/>` | `Pur cambiando ritmo e melodia, riconosco il contenuto e ricostruisco l'intenzione del parlante.` | `TI 10; CH 8; CR 8; SH 4` | variacion regional | `Activa IT-M10-L3: escucha tres acentos y sintetiza diferencias.` |
| M10-L4 | precision lexical | `<grammatica foco="scelta lessicale fine" transferencia="evitar sinonimos falsamente equivalentes"/>` | `<audio accento="rotativo nord-centro-sud" velocidad="1.37x" pausa="52ms" enfasis="precisione lessicale"/>` | `Distinguo tra integrazione, inclusione e assimilazione in base al contesto discorsivo.` | `TI 10; CH 8; CR 8; SH 4` | precision lexical | `Activa IT-M10-L4: selecciona el lema exacto y justificalo.` |
| M10-L5 | textos institucionales | `<grammatica foco="burocratico-amministrativo" transferencia="densidad controlada"/>` | `<audio accento="RAI formale" velocidad="1.38x" pausa="50ms" enfasis="istituzionale"/>` | `La presente comunicazione intende chiarire le modalita di accesso al servizio e i relativi requisiti.` | `TI 10; CH 8; CR 8; SH 4` | formula institucional | `Activa IT-M10-L5: interpreta y reproduce registro institucional.` |
| M10-L6 | textos academicos | `<grammatica foco="metalinguaggio e cautela epistemica" transferencia="equilibrio entre densidad y claridad"/>` | `<audio accento="RAI formale" velocidad="1.39x" pausa="48ms" enfasis="accademico"/>` | `L'analisi evidenzia una correlazione robusta, pur senza autorizzare inferenze causali definitive.` | `TI 10; CH 8; CR 8; SH 4` | hedging academico | `Activa IT-M10-L6: produce comentario academico con cautela epistemica.` |
| M10-L7 | interpretacion pragmatica profunda | `<grammatica foco="presuposicion, implicatura, stance" transferencia="lectura fina"/>` | `<audio accento="RAI formale" velocidad="1.40x" pausa="46ms" enfasis="pragmatica profonda"/>` | `Il relatore non contesta i dati in modo diretto, ma ne riduce la portata con una scelta lessicale mirata.` | `TI 10; CH 8; CR 8; SH 4` | stance | `Activa IT-M10-L7: detecta presuposicion e implicatura en discurso experto.` |
| M10-L8 | improvisacion larga | `<grammatica foco="fluidez de 5-7 min con autocontrol" transferencia="mantener precision bajo carga"/>` | `<audio accento="rotativo completo" velocidad="1.41x" pausa="44ms" enfasis="improvvisazione"/>` | `Parlo senza guion, organizzo le idee in tempo reale e corrijo il tiro mentre avanzo.` | `TI 10; CH 8; CR 9; SH 4` | monitoreo en linea | `Activa IT-M10-L8: improvisacion larga con feedback en vivo.` |
| M10-L9 | revision de estilo experto | `<grammatica foco="microedicion de alto nivel" transferencia="eliminar ultimos calcos"/>` | `<audio accento="rotativo completo" velocidad="1.42x" pausa="42ms" enfasis="rifinitura"/>` | `Rendo il testo piu netto, piu elegante e piu coerente senza sacrificarne la precisione concettuale.` | `TI 10; CH 8; CR 8; SH 4` | ultimos calcos | `Activa IT-M10-L9: revisa estilo experto y elimina interferencias.` |
| M10-L10 | certificacion C2 operativa | `<grammatica foco="reciclaje total M10" transferencia="PatchDebt = 0"/>` | `<audio accento="rotativo completo" velocidad="1.44x" pausa="40ms" enfasis="prestazione finale"/>` | `Argomento, sintetizzo, media e riformulo con controllo pragmatico, lessicale e ritmico pienamente stabile.` | `TI 12; CH 12; CR 10; SH 4; test SRS final` | top-3 M10 = 0 | `Activa IT-M10-L10: simulacion C2 total con diagnostico, debate, mediacion y cierre de patches.` |

## Regla de uso diario

Cada manana el usuario debe enviar exactamente el prompt del nivel activo. La IA debe responder con este pipeline:

1. `Checkpoint SRS` del nivel anterior.
2. `Audio TTS` segun etiqueta XML.
3. `Historia de input` del nivel.
4. `TI + CH + CR` en ese orden.
5. `Self-Refine` con top-3 errores.
6. `Decision unlock / recycle` usando la logica del modulo.

## Plantilla universal de ejecucion para la IA

```text
Recibe el prompt diario del nivel activo.
Ejecuta checkpoint SRS.
Lee y aplica <grammatica>.
Genera audio con <audio>.
Presenta el Input inmersivo.
Administra TI, luego CH, luego CR.
Detecta errores tipicos de hispanohablante.
Genera patches correctivos.
Calcula regla de avance.
Si unlock = true, asigna siguiente nivel.
Si unlock = false, recicla items fallidos y reprograma revisiones.
```