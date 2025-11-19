const CACHE_NAME = 'calendar-generator-v1';
const urlsToCache = [
  '/calendar-generator/',
  '/calendar-generator/index.html',
  // Динамические ресурсы будут кешироваться по мере использования
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Стратегия кеширования: Network First, fallback to Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Если получили ответ, клонируем его и кешируем
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Если сеть недоступна, возвращаем из кеша
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          // Возвращаем базовую страницу для навигационных запросов
          if (event.request.mode === 'navigate') {
            return caches.match('/calendar-generator/index.html');
          }
        });
      })
  );
});
