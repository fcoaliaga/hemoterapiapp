/* Service worker de HemoterapiApp: permite usar la app sin conexión. Generado por build-web.js */
const CACHE = "hemoterapiapp-6b6f948b49ff";
const FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("hemoterapiapp-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
/* Páginas: primero la red (para recibir actualizaciones), y si no hay conexión en 4 s, la copia guardada.
   Resto de archivos: primero la copia guardada. */
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      const cached = () => caches.match("index.html");
      try {
        const net = await Promise.race([
          fetch(req),
          new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 4000)),
        ]);
        if (net.ok) { const c = await caches.open(CACHE); c.put("index.html", net.clone()); }
        return net;
      } catch { return (await cached()) || Response.error(); }
    })());
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
