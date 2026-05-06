// Service Worker with Workbox injection point
// Workbox will inject the precache manifest here
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.4.1/workbox-sw.js');

if (workbox) {
  // Precache manifest injected by Workbox injectManifest
  workbox.precaching.precacheAndRoute([{"revision":"5c1dc8ca11dd7f81fa8f2b6a9cd38405","url":"manifest.json"},{"revision":"9558c71fee418e08a6195fef78be9f73","url":"index.html"},{"revision":"3b4fcfcf393eca4d264dca4a4663bc37","url":"icons.svg"},{"revision":"7e840862161341271697daa99a40d76b","url":"favicon.svg"},{"revision":"4371390f86b2f81fb1b100f5e68061c8","url":"assets/index-D9B-ojsT.js"},{"revision":"28e106128433182ae28d13ce81330d44","url":"assets/index-BPAhezWZ.css"}] || []);

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
