// Creates the static cache 'restRevStaticCache-v1'
var staticCacheName = 'restRevStaticCache-v1';

// Installs the service worker and adds to cache 
// all of the assets listed after cache.addAll
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(staticCacheName).then(cache => {
          return cache.addAll([
            '/index.html',
            '/data/restaurants.json',
            '/restaurant.html?id=1',
            '/restaurant.html?id=2',
            '/restaurant.html?id=3',
            '/restaurant.html?id=4',
            '/restaurant.html?id=5',
            '/restaurant.html?id=6',
            '/restaurant.html?id=7',
            '/restaurant.html?id=8',
            '/restaurant.html?id=9',
            '/restaurant.html?id=10',
            '/css/styles.css',
            '/js/dbhelper.js',
            '/js/main.js',
            '/js/restaurant_info.js',
            '/img/icon.png'
          ]).catch(error => {
            console.log('Error in caches.open: ' + error);
          });
        })
    );
  });

  // Cache and return requests, also caches new requests
  // cumulatively (as the user navigates through the pages)
  self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if(response) {
              return response;
            } 
            return fetch(event.request).then(
              function(response) {
                if(!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }
                let responseToCache = response.clone();
                caches.open(staticCacheName)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });

                return response;
              }
            );
        })
    );
  });

  // Updates the service worker and deletes any old
  // caches not found in 'cacheWhitelist'.
  self.addEventListener('activate', event => {
    var cacheWhitelist = ['restRevStaticCache-v1'];
  
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });