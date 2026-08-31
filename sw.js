const CACHE = "altdorf-geldbeutel-core-v12";
const FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./wfrp1e-data.js",
  "./manifest.webmanifest",
  "./wallet-icon.svg",
  "./coin-gold.png",
  "./coin-silver.png",
  "./coin-brass.png",
  "./parchment.webp",
  "./dark-leather.webp",
  "./button-income.webp",
  "./button-expense.webp",
  "./cinzel-decorative-700.woff2",
  "./im-fell-english-400.woff2",
  "./im-fell-english-italic.woff2"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(FILES.map(async file => {
      try {
        const response = await fetch(file, {cache:"reload"});
        if (response.ok) await cache.put(file, response);
      } catch (_) {}
    }));
  })());
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./")))
  );
});
