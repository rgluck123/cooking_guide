/* global workbox, importScripts */
// Service Worker with Workbox injection point
// Workbox will inject the precache manifest here
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.4.1/workbox-sw.js');

if (workbox) {
  // Precache manifest injected by Workbox injectManifest
  workbox.precaching.precacheAndRoute([{"revision":"8c87866c116680004390aad33f7a631a","url":"manifest.json"},{"revision":"424d37c70798cf4cef6802a001acd335","url":"index.html"},{"revision":"3b4fcfcf393eca4d264dca4a4663bc37","url":"icons.svg"},{"revision":"7e840862161341271697daa99a40d76b","url":"favicon.svg"},{"revision":"78c1dc67cc2846b5f74216c475082664","url":"images/authentic-lebanese-chicken-steps/cook-the-rice.png"},{"revision":"5e665ce672754cd214a5201a5a220709","url":"assets/index-ZGQ431pU.css"},{"revision":"92d50f69e8c5abf43cdaf6af5083dd18","url":"assets/index-DspoJRUl.js"}] || []);

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
