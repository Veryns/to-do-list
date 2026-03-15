const CACHE_NAME = 'todo-cache-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// Install service worker
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Fetching assets
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});