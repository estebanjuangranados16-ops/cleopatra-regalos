const CACHE_NAME = 'cleopatra-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Validate URL to prevent SSRF
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const allowedHosts = ['localhost', '127.0.0.1', 'cleopatraregalos.com'];
    const blockedHosts = ['169.254.169.254', '0.0.0.0', '10.', '172.', '192.168.'];
    
    // Block internal/private IPs
    if (blockedHosts.some(blocked => urlObj.hostname.startsWith(blocked))) {
      return false;
    }
    
    // Allow only HTTPS or same origin
    return urlObj.protocol === 'https:' || 
           allowedHosts.some(host => urlObj.hostname.includes(host));
  } catch {
    return false;
  }
};

self.addEventListener('fetch', (event) => {
  // Validate request URL
  if (!isValidUrl(event.request.url)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // Return offline page or default response
        return new Response('Offline', { status: 503 });
      })
  );
});