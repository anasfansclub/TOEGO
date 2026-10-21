importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyAhxecFY9TwZTYbdCVRAcnp1whI-Uqc-P8",
  authDomain: "toego-ecommerce.firebaseapp.com",
  projectId: "toego-ecommerce",
  storageBucket: "toego-ecommerce.firebasestorage.app",
  messagingSenderId: "234167880880",
  appId: "1:234167880880:web:b89d4b8e5f8cc9af3c3f75"
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title = data.title || 'TOEGO Alert!';
  const body = data.body || 'Check out our new offers!';
  const image = data.image || '';
  const clickUrl = data.url || 'https://toego.in/shop-home.html';
  
  const LOGO_URL = 'https://res.cloudinary.com/kshufv2s/image/upload/v1792601941/511898-50kb_rriscx.jpg';

  const options = {
    body: body,
    icon: LOGO_URL,
    badge: LOGO_URL,
    image: image || undefined,
    data: { url: clickUrl },
    vibrate: [200, 100, 200],
    tag: 'toego-main-notification', // ✅ IMPORTANT: Yeh spam rokega
    renotify: true
  };

  return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickUrl = event.notification.data?.url || 'https://toego.in/shop-home.html';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.indexOf(self.location.origin) !== -1 && 'focus' in client) {
          client.navigate(clickUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(clickUrl);
    })
  );
});
