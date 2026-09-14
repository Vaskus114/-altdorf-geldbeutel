const CACHE = "altdorf-geldbeutel-core-v23-storage-ios-fix";
const CORE_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./wfrp1e-data.js"
];
const OPTIONAL_FILES = [
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
    await Promise.all(CORE_FILES.map(async url => {
      const response = await fetch(url, {cache:"reload"});
      if (!response.ok) throw new Error(`Core-Datei konnte nicht gecacht werden: ${url}`);
      await cache.put(url, response);
    }));
    await Promise.allSettled(OPTIONAL_FILES.map(async url => {
      try {
        const response = await fetch(url, {cache:"reload"});
        if (response.ok) await cache.put(url, response);
      } catch (_) {
        // Optionale Design-Assets dürfen die Installation nicht komplett verhindern.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

const cachedIgnoringQuery = request => caches.match(request, {ignoreSearch:true});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE);
          cache.put("./index.html", response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        return (await caches.match("./index.html", {ignoreSearch:true})) || (await caches.match("./", {ignoreSearch:true}));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await cachedIgnoringQuery(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (_) {
      return new Response("Offline", {status:503, statusText:"Offline"});
    }
  })());
});
