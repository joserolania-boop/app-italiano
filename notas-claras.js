// Explicaciones de cada nivel en lenguaje de aprendiz.
// El temario original venia en telegrafico ("genero nominal", "colocacion
// preverbal", "modo dependiente"), que no le dice nada a quien empieza. Aqui
// cada nivel explica QUE se practica y DONDE se falla, con ejemplos reales.
// Clave -> { practica, ojo }
const NOTAS_CLARAS = {
    // ─── M1 · A1: lo básico para sobrevivir ───
    "M1-L1": { practica: "El verbo essere (ser/estar) con io y tu: io sono, tu sei.", ojo: "En italiano puedes quitar el io, pero al principio dilo: ayuda a fijar la forma." },
    "M1-L2": { practica: "Los artículos il, lo, la y el demostrativo questo.", ojo: "Cada palabra es masculina o femenina, y no siempre coincide con el español: il latte es masculino, la leche es femenina." },
    "M1-L3": { practica: "Números, edad con avere y origen con essere di.", ojo: "La edad va con avere, no con essere: ho venti anni, nunca sono venti anni." },
    "M1-L4": { practica: "Negar con non y preguntar solo cambiando la entonación.", ojo: "El non va siempre justo delante del verbo: non parlo, no parlo non." },
    "M1-L5": { practica: "El presente de los tres grupos: -are, -ere, -ire.", ojo: "Lo que cambia es la terminación, y cada persona tiene la suya. Ahí está casi todo el trabajo." },
    "M1-L6": { practica: "Los posesivos (mio, tuo, suo) y los nombres de familia.", ojo: "El posesivo lleva artículo (il mio libro), salvo con un familiar en singular: mia sorella, sin il." },
    "M1-L7": { practica: "Decir la hora y con qué frecuencia haces las cosas.", ojo: "Las horas van con alle: alle otto. Y se dice sono le due, pero è l'una." },
    "M1-L8": { practica: "Las preposiciones a, in, su y con para situar cosas.", ojo: "a e in no se reparten como en español: se dice in centro, a casa. Hay que memorizarlas de una en una." },
    "M1-L9": { practica: "Pedir con educación: vorrei..., per favore.", ojo: "Vorrei es más educado que voglio. Con voglio suenas brusco al pedir algo." },
    "M1-L10": { practica: "Repaso de todo el módulo 1.", ojo: "Vuelve sobre los tres fallos que más te hayan salido en estos diez niveles." },

    // ─── M2 · A1-A2: la vida diaria y el pasado ───
    "M2-L1": { practica: "Los verbos reflexivos: mi alzo, ti chiami, si sveglia.", ojo: "La partícula (mi, ti, si) va delante del verbo y no se puede quitar." },
    "M2-L2": { practica: "Poder, querer y deber: potere, volere, dovere.", ojo: "Detrás de estos tres verbos, el segundo verbo va en infinitivo: devo andare, no devo vado." },
    "M2-L3": { practica: "Decir que algo te gusta con piacere.", ojo: "Funciona como en español: mi piace il libro (singular), mi piacciono i libri (plural). El verbo concuerda con la cosa, no contigo." },
    "M2-L4": { practica: "Cantidades: del, della, un po' di, molto, poco.", ojo: "Para decir algo de pan se usa del pane. No se puede omitir como en español." },
    "M2-L5": { practica: "El pasado más usado: passato prossimo con avere.", ojo: "Se forma con ho, hai, ha... más el participio: ho mangiato. Las terminaciones regulares son -ato, -uto, -ito." },
    "M2-L6": { practica: "Passato prossimo con essere, para verbos de movimiento y cambio.", ojo: "Con essere, el participio concuerda: Marta è andata, Marco è andato. Con avere no cambia." },
    "M2-L7": { practica: "Decir que hay algo: c'è (uno) y ci sono (varios).", ojo: "C'è va con singular y ci sono con plural. En español vale hay para los dos, en italiano no." },
    "M2-L8": { practica: "Moverse: andare a/in y venire da.", ojo: "Ciudad lleva a (a Roma) y país lleva in (in Italia). Es una regla fija, no depende del contexto." },
    "M2-L9": { practica: "Hablar de planes inmediatos.", ojo: "Para el futuro cercano, el italiano usa el presente: domani vado a Roma. Suena más natural que el futuro." },
    "M2-L10": { practica: "Repaso de todo el módulo 2.", ojo: "Fíjate sobre todo en elegir bien entre avere y essere en el pasado." },

    // ─── M3 · A2: contar el pasado y describir ───
    "M3-L1": { practica: "El imperfetto, para describir cómo eran las cosas.", ojo: "Sirve para lo habitual y para describir, no para un hecho puntual: da bambino andavo al mare." },
    "M3-L2": { practica: "Elegir entre passato prossimo e imperfetto.", ojo: "El hecho concreto va en passato prossimo y el decorado alrededor en imperfetto: mentre leggevo, è arrivato Marco." },
    "M3-L3": { practica: "Hablar de la casa y de lo que hay que hacer en ella.", ojo: "En italiano el adjetivo suele ir detrás: una casa grande, no una grande casa." },
    "M3-L4": { practica: "Cómo te encuentras: sto bene, mi fa male la gola.", ojo: "Para el estado de salud se usa stare, no essere: sto male, no sono male." },
    "M3-L5": { practica: "Comparar: più... di, meno... di, come.", ojo: "Se usa di delante de un nombre y che al comparar dos cualidades." },
    "M3-L6": { practica: "Unir frases: perché, siccome, quindi.", ojo: "Siccome va siempre al principio de la frase, nunca en medio." },
    "M3-L7": { practica: "Transporte y reservas.", ojo: "Se dice in treno, in macchina, pero a piedi. Otra que va de memoria." },
    "M3-L8": { practica: "Los pronombres lo, la, li, le para no repetir el objeto.", ojo: "Van delante del verbo: lo vedo, nunca vedo lo." },
    "M3-L9": { practica: "Los pronombres gli y le, para decir a quién.", ojo: "gli es para él y le para ella. Se confunden mucho." },
    "M3-L10": { practica: "Repaso de todo el módulo 3.", ojo: "Céntrate en los pronombres, que es donde más se falla en este tramo." },

    // ─── M4 · A2-B1: pedir, mandar y ser educado ───
    "M4-L1": { practica: "Dar órdenes o instrucciones a alguien de tú.", ojo: "Algunos son irregulares y hay que sabérselos: va', fa', da', di', sta'." },
    "M4-L2": { practica: "Tratar de usted (Lei) y el condicional de cortesía.", ojo: "Con Lei el verbo va en tercera persona: Lei parla, aunque estés hablando con esa persona." },
    "M4-L3": { practica: "Contar síntomas y dar consejos con dovere.", ojo: "Para aconsejar suena mejor dovresti (deberías) que devi (debes)." },
    "M4-L4": { practica: "Reclamar contando lo que pasó.", ojo: "Para quejarte con educación, el condicional ayuda: vorrei segnalare un problema." },
    "M4-L5": { practica: "El superlativo: il più..., il meno...", ojo: "Lleva artículo delante del più: il ristorante più caro." },
    "M4-L6": { practica: "Las partículas ci (de lugar) y ne (de cantidad).", ojo: "ci sustituye un lugar (ci vado) y ne una cantidad (ne prendo due). Son de las cosas más raras para un hispanohablante." },
    "M4-L7": { practica: "Juntar dos pronombres: me lo, te la, glielo.", ojo: "Al juntarlos, mi se convierte en me y ti en te: me lo dai, no mi lo dai." },
    "M4-L8": { practica: "El futuro: parlerò, andrò, sarò.", ojo: "En italiano el futuro se usa menos que en español para el futuro, y mucho para suponer: saranno le otto (serán las ocho)." },
    "M4-L9": { practica: "Pedir con condicional: vorrei, potrei, dovrei.", ojo: "Es la forma normal de pedir algo sin sonar exigente." },
    "M4-L10": { practica: "Repaso de todo el módulo 4.", ojo: "Repasa sobre todo el orden de los pronombres juntos." },

    // ─── M5 · B1: opinar y argumentar ───
    "M5-L1": { practica: "Unir frases con che y cui.", ojo: "cui se usa después de preposición: la persona con cui parlo." },
    "M5-L2": { practica: "Dar tu opinión: secondo me, penso che.", ojo: "Después de penso che el verbo cambia de forma (congiuntivo): penso che sia, no penso che è." },
    "M5-L3": { practica: "Conectores para argumentar: inoltre, tuttavia, perciò.", ojo: "Van al principio de la frase y ordenan lo que dices. Sin ellos suenas a lista." },
    "M5-L4": { practica: "El si impersonal: in Italia si mangia bene.", ojo: "Equivale al se español de se dice, se come." },
    "M5-L5": { practica: "Condicionales reales: se ho tempo, vengo.", ojo: "Con se de algo posible va presente o futuro, nunca condicional." },
    "M5-L6": { practica: "Contar lo que dijo otro: ha detto che...", ojo: "Al pasar a estilo indirecto, los tiempos cambian hacia atrás." },
    "M5-L7": { practica: "Relativos más finos: il quale, di cui.", ojo: "di cui equivale a del cual/de la cual: il libro di cui parlo." },
    "M5-L8": { practica: "Contar una historia con orden.", ojo: "Marca bien el orden temporal: prima, poi, alla fine." },
    "M5-L9": { practica: "El congiuntivo tras expresiones de duda u opinión.", ojo: "Lo disparan penso che, credo che, spero che, è possibile che." },
    "M5-L10": { practica: "Repaso de todo el módulo 5.", ojo: "Fíjate en cuándo toca congiuntivo y cuándo no." },

    // ─── M6 · B1-B2: matizar y hablar de lo hipotético ───
    "M6-L1": { practica: "Negar una opinión: non credo che sia...", ojo: "Al negar la opinión, el congiuntivo es casi obligatorio." },
    "M6-L2": { practica: "El congiuntivo en pasado: penso che abbia fatto.", ojo: "Se forma con abbia o sia más el participio, igual que el passato prossimo." },
    "M6-L3": { practica: "La pasiva: la lettera è stata scritta.", ojo: "Con venire suena más formal y de proceso: la legge viene applicata." },
    "M6-L4": { practica: "El gerundio: sto leggendo, parlando piano.", ojo: "stare + gerundio es para lo que ocurre ahora mismo, no para lo habitual." },
    "M6-L5": { practica: "Lo imposible o improbable: se avessi tempo, verrei.", ojo: "Va imperfetto de congiuntivo en el se y condicional en la otra parte. Nunca dos condicionales." },
    "M6-L6": { practica: "Conceder: benché piova, esco.", ojo: "benché y nonostante piden congiuntivo detrás, siempre." },
    "M6-L7": { practica: "Contar lo que otro te dijo, con detalle.", ojo: "Cambian también el aquí y el ahora: qui pasa a lì, oggi pasa a quel giorno." },
    "M6-L8": { practica: "Ver u oír a alguien hacer algo: ho visto Marco uscire.", ojo: "El segundo verbo va en infinitivo, sin que." },
    "M6-L9": { practica: "Resumir separando lo importante de lo secundario.", ojo: "Resumir no es acortar: es quedarse con lo que sostiene el texto." },
    "M6-L10": { practica: "Repaso de todo el módulo 6.", ojo: "Repasa cuándo el congiuntivo es obligatorio y cuándo es opcional." },

    // ─── M7 · B2: precisión y naturalidad ───
    "M7-L1": { practica: "Dos pronombres juntos: glielo, gliela, gliene.", ojo: "gli + lo se funden en glielo, todo junto y en una sola palabra." },
    "M7-L2": { practica: "Poner el foco donde quieres: il libro, l'ho letto.", ojo: "Adelantar el objeto y repetirlo con un pronombre es normal y natural en italiano hablado." },
    "M7-L3": { practica: "Conectores de registro alto: pertanto, ciononostante.", ojo: "Son de escrito o de discurso formal. En una conversación normal suenan raros." },
    "M7-L4": { practica: "Concordancias difíciles, con el sujeto lejos del verbo.", ojo: "Cuando la frase se alarga, es fácil perder el hilo y equivocar el número." },
    "M7-L5": { practica: "Los dos usos de ne: ne ho parlato y ne voglio due.", ojo: "Uno sustituye de algo y el otro una cantidad. Son distintos aunque se escriban igual." },
    "M7-L6": { practica: "Expresiones fijas con ci: ci penso, ci tengo, non c'entra.", ojo: "Aquí el ci no significa nada por separado: son bloques que se memorizan enteros." },
    "M7-L7": { practica: "Escribir un correo bien estructurado.", ojo: "Cada registro tiene su fórmula de apertura y de cierre. Copiar el español no funciona." },
    "M7-L8": { practica: "Reformular: cioè, in altre parole, ovvero.", ojo: "Sirven para aclarar lo que acabas de decir sin repetirlo igual." },
    "M7-L9": { practica: "Captar lo que se dice sin decirlo.", ojo: "A veces lo importante no está en las palabras, sino en el tono o en lo que se calla." },
    "M7-L10": { practica: "Repaso de todo el módulo 7.", ojo: "Mira sobre todo el orden y la fusión de los pronombres dobles." },

    // ─── M8 · B2-C1: discurso escrito y académico ───
    "M8-L1": { practica: "Presentar dos caras: da un lato... dall'altro...", ojo: "Es el esqueleto de cualquier texto argumentativo." },
    "M8-L2": { practica: "Convertir verbos en sustantivos: sviluppare a lo sviluppo.", ojo: "Es lo que da ese aire formal al italiano escrito, pero hablando suena artificial." },
    "M8-L3": { practica: "Matizar cuánto te fías: sembra, risulta, appare.", ojo: "No es lo mismo è así que sembra così. Cambia cuánto te comprometes con lo que dices." },
    "M8-L4": { practica: "Conceder en poco espacio: pur + gerundio, sebbene.", ojo: "pur essendo... condensa en dos palabras lo que en español pide una frase entera." },
    "M8-L5": { practica: "El si passivante: nel rapporto si descrivono tre scenari.", ojo: "Suena más natural que la pasiva con essere en textos informativos." },
    "M8-L6": { practica: "Juntar dos fuentes en un solo texto.", ojo: "No es pegar una detrás de otra: hay que decir en qué coinciden y en qué no." },
    "M8-L7": { practica: "Afirmar con cautela: potrebbe suggerire, sembra indicare.", ojo: "En textos serios se evita afirmar tajante lo que no está probado." },
    "M8-L8": { practica: "Ordenar un texto largo con marcas de estructura.", ojo: "Frases del tipo in primo luogo o come si è detto guían al lector." },
    "M8-L9": { practica: "Rebatir sin sonar agresivo.", ojo: "Primero se concede algo al otro y luego se objeta. Así convence más." },
    "M8-L10": { practica: "Repaso de todo el módulo 8.", ojo: "Vigila no pasarte de formal: la nominalización en exceso hace el texto ilegible." },

    // ─── M9 · C1: estilo, ironía y registro ───
    "M9-L1": { practica: "Expresiones hechas: fare una figuraccia, cavarsela.", ojo: "No se traducen palabra por palabra. O te las sabes enteras o mejor no usarlas." },
    "M9-L2": { practica: "Suavizar lo que dices: forse, mi chiedevo se...", ojo: "En italiano se suaviza mucho al pedir o discrepar. Ir de frente suena brusco." },
    "M9-L3": { practica: "Ironía: decir una cosa y dar a entender otra.", ojo: "Depende del tono y del contexto. Mal calculada, ofende." },
    "M9-L4": { practica: "Frases largas con ritmo.", ojo: "Alterna frases largas y cortas. Todas largas cansan, todas cortas suenan a telegrama." },
    "M9-L5": { practica: "Montar un texto: tesis, desarrollo, cierre.", ojo: "El cierre no es repetir la tesis: es cerrar lo que abriste." },
    "M9-L6": { practica: "Cambiar de registro según con quién hables.", ojo: "Lo mismo se dice muy distinto a un amigo que en una oficina." },
    "M9-L7": { practica: "Entender acentos y usos de distintas zonas.", ojo: "Es para comprender, no para imitar. Habla en italiano estándar." },
    "M9-L8": { practica: "Explicar lo mismo a dos públicos distintos.", ojo: "Cambia el vocabulario y los ejemplos, no la información." },
    "M9-L9": { practica: "Revisar y quitar lo que sobra.", ojo: "Corregirse a uno mismo es la habilidad que más separa un C1 de un B2." },
    "M9-L10": { practica: "Repaso de todo el módulo 9.", ojo: "Fíjate en los calcos del español que aún se te escapen." },

    // ─── M10 · C1-C2: dominio ───
    "M10-L1": { practica: "Resumir y adaptar un contenido sin perder nada.", ojo: "Simplificar no es empobrecer: hay que mantener los matices." },
    "M10-L2": { practica: "Rebatir en varios niveles a la vez.", ojo: "Distingue lo que discutes del dato, del razonamiento o de la conclusión." },
    "M10-L3": { practica: "Entender a hablantes de cualquier región.", ojo: "Cambian el acento y algunas palabras, pero la gramática se sostiene." },
    "M10-L4": { practica: "Elegir la palabra exacta entre varias parecidas.", ojo: "En C2 la diferencia ya no es acertar, es elegir la mejor de tres opciones válidas." },
    "M10-L5": { practica: "Textos administrativos e institucionales.", ojo: "Tienen fórmulas fijas. Conviene reconocerlas más que inventarlas." },
    "M10-L6": { practica: "Hablar de la lengua con cautela académica.", ojo: "Se afirma poco y se matiza mucho. Es la norma del género." },
    "M10-L7": { practica: "Lo que se presupone y lo que se insinúa.", ojo: "Mucho del significado real no está escrito en la frase." },
    "M10-L8": { practica: "Hablar seguido cinco o siete minutos.", ojo: "La clave es corregirte sobre la marcha sin cortar el hilo." },
    "M10-L9": { practica: "Pulir el detalle final.", ojo: "A este nivel, lo que queda son calcos del español muy pequeños." },
    "M10-L10": { practica: "Repaso final del recorrido.", ojo: "Si algo se te resiste todavía, ahí es donde hay que volver." },
};

if (typeof window !== "undefined") {
    window.NOTAS_CLARAS = NOTAS_CLARAS;
}
