const CACHE = "realmind-v5-1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./js/app.js",
  "./js/install.js",
  "./css/styles.css",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  e.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(resp => {
      const respClone = resp.clone();
      caches.open(CACHE).then(c => c.put(request, respClone));
      return resp;
    }).catch(() => cached))
  );
});
