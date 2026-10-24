/* global workbox, importScripts */
// Service Worker with Workbox injection point
// Workbox will inject the precache manifest here
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.4.1/workbox-sw.js');

if (workbox) {
  // Precache manifest injected by Workbox injectManifest
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Skip waiting on install
  self.addEventListener('install', (event) => {
    self.skipWaiting();
  });

  // Claim clients on activate
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  // Network first strategy for HTML pages (better for SPA routing)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        }),
      ],
    })
  );

  // Cache first for static assets (JS, CSS)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.CacheFirst({
      cacheName: 'static-resources',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        }),
      ],
    })
  );

  // Cache first for images
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        }),
      ],
    })
  );

  // Network first for external APIs (Unsplash images)
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://images.unsplash.com',
    new workbox.strategies.NetworkFirst({
      cacheName: 'external-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        }),
      ],
    })
  );

  console.log('Workbox initialized');
} else {
  console.log('Workbox not available');
}
