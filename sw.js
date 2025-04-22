// YashStore Service Worker for better caching control

// Cache version - change this when you update your site
const CACHE_VERSION = 'v1.0.2'; // Increment this from the previous version
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

// Fetch event - simplified to prevent caching issues on Netlify
self.addEventListener('fetch', event => {
  // Skip for API requests or non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip service worker for Netlify's redirect-based URLs
  const url = new URL(event.request.url);
  if (url.pathname.includes('/.netlify/')) return;
  
  // Simplified handler - network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Only cache successful responses from our own domain
        if (response.ok && url.origin === self.location.origin) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});
