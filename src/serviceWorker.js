/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
const cacheName = 'v1';

// Call Install Event
self.addEventListener('install', () => {
    console.log('service worker: Installed');
});

// Call Activate Event
self.addEventListener('activate', (e) => {
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cache) => {
                if (cache !== cacheName) {
                    return caches.delete(cache);
                }
                return false;
            })
        ))
    );
});

// Call Fetch Event
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then((res) => {
                // Make copy/clone of response
                const resClone = res.clone();
                // Open cahce
                caches.open(cacheName).then((cache) => {
                    // Add response to cache
                    cache.put(e.request, resClone);
                });
                return res;
            })
            .catch(() => caches.match(e.request).then((res) => res))
    );
});
