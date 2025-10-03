
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('realmind-store').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/login.html',
        '/cadastro.html',
        '/menu.html',
        '/teste.html',
        '/relaxamento.html',
        '/jogos.html',
        '/diario.html',
        '/apoio.html',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
