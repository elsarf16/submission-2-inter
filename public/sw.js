const STATIC_CACHE = "static-cache-v3";
const DYNAMIC_CACHE = "dynamic-cache-v3";

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE
          ) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {

  // API
  if (event.request.url.includes("story-api.dicoding.dev")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) =>
            cache.put(event.request, clone)
          );
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((res) =>
            res ||
            new Response(
              JSON.stringify({
                error: "Offline",
                listStory: [],
              }),
              { headers: { "Content-Type": "application/json" } }
            )
          )
        )
    );
    return;
  }

  // PAGE & ASSET
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((res) => {
            const clone = res.clone();
            caches.open(DYNAMIC_CACHE).then((cache) =>
              cache.put(event.request, clone)
            );
            return res;
          })
          .catch(() => {
            if (event.request.mode === "navigate") {
              return caches.match('/index.html');
            }
          })
      );
    })
  );
});

// PUSH
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "You have a new message",
      icon: "/assets/img/home1.png",
      badge: "/assets/img/home1.png",
    })
  );
});
