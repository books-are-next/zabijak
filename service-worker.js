/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-03aca24';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./resources.html","./zabijak_001.html","./zabijak_002.html","./zabijak_005.html","./zabijak_006.html","./zabijak_007.html","./zabijak_008.html","./zabijak_009.html","./zabijak_010.html","./zabijak_011.html","./zabijak_012.html","./zabijak_013.html","./zabijak_014.html","./zabijak_015.html","./zabijak_016.html","./zabijak_017.html","./resources/image001_fmt.jpeg","./resources/image002_fmt.jpeg","./resources/index.xml","./resources/obalka_zabijak_fmt.jpeg","./resources/upoutavka_eknihy_fmt.jpeg","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
