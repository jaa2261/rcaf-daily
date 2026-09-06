const CACHE_NAME = 'five-daily-v7';
const EXERCISE_IMAGES = Array.from({ length: 6 }, (_, chart) =>
  Array.from({ length: 5 }, (_, exercise) =>
    `./assets/exercises/chart-${chart + 1}-exercise-${exercise + 1}.png`
  )
).flat();
const XBX_IMAGES = Array.from({ length: 4 }, (_, chart) =>
  Array.from({ length: 10 }, (_, exercise) =>
    `./assets/xbx/chart-${chart + 1}-exercise-${exercise + 1}.png`
  )
).flat();

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/app-icon.svg',
  ...EXERCISE_IMAGES,
  ...XBX_IMAGES
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache =>
    Promise.all(APP_SHELL.map(url => cache.add(url).catch(() => null)))
  ));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match('./index.html');
        try {
          const response = await fetch(event.request);
          if (response.ok) {
            await cache.put('./index.html', response.clone());
            return response;
          }
          return cached || response;
        } catch (_) {
          return cached || Response.error();
        }
      })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (!response || response.status !== 200) return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }))
  );
});
