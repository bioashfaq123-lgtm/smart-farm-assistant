// Smart Farm Assistant - Service Worker for Offline PWA Capabilities
const CACHE_NAME = "smart-farm-v3";
const OFFLINE_URLS = [
  "/",
  "/demo",
  "/offline-demo.html",
  "/tools",
  "/advisory",
  "/iot",
  "/market",
  "/insights",
  "/manifest.json",
  "/icon.svg"
];

// Detect localhost / local development environment
const isLocalhost =
  typeof self !== "undefined" &&
  self.location &&
  (self.location.hostname === "localhost" ||
    self.location.hostname === "127.0.0.1" ||
    self.location.hostname.endsWith(".local"));

if (isLocalhost) {
  // In development: never cache or intercept. Clean up any existing caches and unregister.
  self.addEventListener("install", () => {
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => Promise.all(cacheNames.map((c) => caches.delete(c))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.claim())
    );
  });
} else {
  // Production PWA lifecycle
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(OFFLINE_URLS);
      })
    );
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        );
      })
    );
    self.clients.claim();
  });

  self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    // Never intercept API requests with service worker cache
    if (url.pathname.startsWith("/api/")) {
      return;
    }

    // For HTML navigation requests: NETWORK-FIRST strategy with offline fallback
    // This prevents stale HTML from requesting outdated Next.js CSS/JS chunk hashes!
    if (event.request.mode === "navigate") {
      event.respondWith(
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const resClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, resClone);
              });
            }
            return networkResponse;
          })
          .catch(async () => {
            // Offline fallback: check cache for the requested route, or fall back to /offline-demo.html or /
            const cachedPage = await caches.match(event.request);
            if (cachedPage) return cachedPage;
            const offlineDemo = await caches.match("/offline-demo.html");
            if (offlineDemo) return offlineDemo;
            return caches.match("/");
          })
      );
      return;
    }

    // For static assets (CSS, JS, images, fonts): Cache-first with background revalidation
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse);
                });
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(event.request);
      })
    );
  });
}
