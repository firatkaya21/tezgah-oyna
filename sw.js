// TEZGÂH çevrimdışı önbelleği: oyun bir kez açıldıktan sonra internet olmadan da çalışır.
// Yeni sürüm yayınlanınca CACHE adı değişir ve eski önbellek silinir.
const CACHE = 'tezgah-v0.23';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './world/units.json', './world/names.json', './world/metrics.json', './world/pts.json'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // önce ağ (güncel sürüm), ağ yoksa önbellek
  e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
});
