/* ═══════════════════════════════════════════════════════════
   Assets vectoriales de Maestro Italiano
   Monumentos italianos en estilo line-art (sin emojis genericos)
   ═══════════════════════════════════════════════════════════ */

const SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';

// Cada nodo del sendero = un monumento o simbolo italiano dibujado a mano.
const PATH_MONUMENTS = [
    // 1. Coliseo
    SVG_OPEN + '<path d="M4 19h16"/><path d="M5 19v-8a7 4.5 0 0 1 14 0v8"/><path d="M5 13h14"/><path d="M9 19v-5M12 19v-6M15 19v-5"/></svg>',
    // 2. Torre de Pisa (inclinada)
    SVG_OPEN + '<path d="M9 21 11 4"/><path d="M13.5 20.6 15.5 3.6"/><path d="M10.4 8.8 14.9 8"/><path d="M10 12.5 14.4 11.7"/><path d="M9.6 16.2 14 15.4"/><path d="M10.8 4.6c0-1.4 3-1.8 3.4-.6"/><path d="M8.5 21h6"/></svg>',
    // 3. Duomo (iglesia con cupula)
    SVG_OPEN + '<path d="M4 20h16"/><path d="M6 20v-7l6-4 6 4v7"/><path d="M9.5 13a2.5 2.5 0 0 1 5 0"/><path d="M12 9V5"/><path d="M10.5 5h3"/><path d="M10 20v-3a2 2 0 0 1 4 0v3"/></svg>',
    // 4. Arena de Verona (anfiteatro oval)
    SVG_OPEN + '<ellipse cx="12" cy="13" rx="8.5" ry="5"/><ellipse cx="12" cy="13" rx="4" ry="2.3"/><path d="M3.6 11.5 7.9 11M16.1 11l4.3.5M3.6 14.5l4.3.5M16.1 15.5l4.3-1"/><path d="M12 8V6"/></svg>',
    // 5. Fontana di Trevi (fuente)
    SVG_OPEN + '<path d="M4 21h16"/><path d="M6 21v-4h12v4"/><path d="M8 17v-3h8v3"/><path d="M12 14v-3"/><path d="M12 11c0-2 2-2 2-3.5M12 11c0-2-2-2-2-3.5"/><circle cx="12" cy="6.5" r="1"/></svg>',
    // 6. Mascara veneciana (teatro)
    SVG_OPEN + '<path d="M5 8c4-2 10-2 14 0 .4 5.5-3 12-7 12S4.6 13.5 5 8Z"/><path d="M8.5 10.5c.8-.7 2.2-.7 3 0M12.5 10.5c.8-.7 2.2-.7 3 0"/><path d="M9 6V4M15 6V4"/></svg>',
    // 7. Gondola
    SVG_OPEN + '<path d="M2.5 15c5 3.5 14 3.5 19 0"/><path d="M4 15c2.5-2 13.5-2 16 0"/><path d="M6 13.5V8"/><path d="M6 8h3l-1 2H6"/><path d="M18.5 13.5c1.5-1.5 1.5-3 .5-4.5"/></svg>',
    // 8. Puente (Rialto / Ponte Vecchio)
    SVG_OPEN + '<path d="M3 17h18"/><path d="M3 17v-2a9 6 0 0 1 18 0v2"/><path d="M3 14.2h18"/><path d="M7 17v-2.8M12 17v-3M17 17v-2.8"/></svg>',
    // 9. David (estatua)
    SVG_OPEN + '<circle cx="12" cy="5" r="2"/><path d="M12 7v7"/><path d="M9.5 9 12 11l2.5-1.5"/><path d="M10 21l2-7 2 7"/><path d="M8 21h8"/></svg>',
    // 10. Trofeo / copa final
    SVG_OPEN + '<path d="M8 21h8"/><path d="M12 17.5V21"/><path d="M7 4h10v4.5a5 5 0 0 1-10 0Z"/><path d="M7 6H4.5v1A3 3 0 0 0 7.5 10M17 6h2.5v1A3 3 0 0 1 16.5 10"/></svg>'
];

// Estrella para niveles completados
const ITALY_STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.6 6.8 19.2l1-5.8L3.6 9.3l5.8-.8z"/></svg>';

if (typeof window !== "undefined") {
    window.PATH_MONUMENTS = PATH_MONUMENTS;
    window.ITALY_STAR = ITALY_STAR;
}
