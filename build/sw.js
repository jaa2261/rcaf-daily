const CACHE_NAME = 'five-daily-v1';
const EXERCISE_IMAGES = Array.from({ length: 6 }, (_, chart) =>
  Array.from({ length: 5 }, (_, exercise) =>
    `./assets/exercises/chart-${chart + 1}-exercise-${exercise + 1}.png`
  )
).flat();

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/app-icon.svg',
  ...EXERCISE_IMAGES
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
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
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (!response || response.status !== 200) return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }))
  );
});
