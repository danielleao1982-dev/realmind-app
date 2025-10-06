
const CACHE='realmind-v3';
const ASSETS=[
 './','./index.html','./login.html','./cadastro.html','./menu.html',
 './teste.html','./relaxamento.html','./jogos.html','./diario.html','./apoio.html',
 './manifest.json','./icon-192.png','./icon-512.png'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))) });
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))) });
