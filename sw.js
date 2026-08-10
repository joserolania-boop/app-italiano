/* Service Worker — Maestro Italiano
   Cachea el app-shell para uso offline. Estrategia:
   - Navegacion/HTML: network-first (para recibir actualizaciones).
   - Resto de recursos propios: network-first tambien, con la cache como
     respaldo solo si falla la red.
   Antes los ficheros propios (JS/CSS) iban con stale-while-revalidate: si un
   despliegue cambiaba el contenido de un fichero sin cambiar su "?v=" en
   index.html, esa URL exacta seguia sirviendo la copia vieja de la cache y
   la version nueva solo se guardaba para la carga SIGUIENTE, no la actual.
   Eso es justo lo que se veia como "sale la version antigua antes que la
   nueva". Con la app cambiando cada dia, la frescura importa mas que ahorrar
   una peticion de red. */

const CACHE_NAME = "maestro-italiano-v7";
const APP_SHELL = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./enhancements.js",
    "./m1-exercises.js",
    "./italy-assets.js",
    "./quick-reference.js",
    "./Roadmap_Maestro_Italiano.md",
    "./manifest.webmanifest",
    "./icons/icon.svg",
    "./assets/bg-colosseo.jpg",
    "./assets/bg-venezia.jpg",
    "./assets/bg-firenze.jpg",
    "./assets/bg-toscana.jpg",
    "./assets/bg-amalfi.jpg",
    "./assets/bg-pisa.jpg",
    "./assets/bg-roma.jpg",
    "./assets/bg-cinqueterre.jpg",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
            .catch(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);
    const sameOrigin = url.origin === self.location.origin;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy)).catch(() => {});
                    return response;
                })
                .catch(() => caches.match("./index.html").then((cached) => cached || caches.match("./")))
        );
        return;
    }

    if (!sameOrigin) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response && response.status === 200) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});
