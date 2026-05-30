/* Service Worker — Maestro Italiano
   Cachea el app-shell para uso offline. Estrategia:
   - Navegacion/HTML: network-first (para recibir actualizaciones).
   - Resto de recursos propios: stale-while-revalidate. */

const CACHE_NAME = "maestro-italiano-v6";
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
        caches.match(request).then((cached) => {
            const network = fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || network;
        })
    );
});
