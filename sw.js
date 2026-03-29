// This is a basic Service Worker to make Nebulabs OS 2 installable
const CACHE_NAME = 'nebulabs-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
});

self.addEventListener('fetch', (event) => {
  // This allows the app to load from the cache/network
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
