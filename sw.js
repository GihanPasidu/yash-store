// YashStore Service Worker for better caching control

// Cache version - change this when you update your site
const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `yashstore-${CACHE_VERSION}`;

// Resources that should be pre-cached
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/products.html',
  '/product-details.html',
  '/cart.html',
  '/checkout.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/products-data.js'
];

// Install event - precache critical resources
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Pre-caching resources');
        return cache.addAll(PRECACHE_URLS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('yashstore-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('Service Worker activated with cache:', CACHE_NAME);
      return self.clients.claim();
    })
  );
});

// Fetch event - network-first strategy for HTML, cache-first for assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip for API requests or non-GET requests
  if (event.request.method !== 'GET') return;
  
  // For HTML pages - use network-first strategy
  if (event.request.headers.get('Accept')?.includes('text/html') || 
      url.pathname.endsWith('.html') || 
      url.pathname === '/') {
    
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Save the fresh response in cache
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  } 
  // For assets - use cache-first strategy
  else {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              // Save successful responses in cache
              if (response.ok) {
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, clonedResponse);
                });
              }
              return response;
            });
        })
    );
  }
});
