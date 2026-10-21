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

// ✅ Service Worker ko turant activate karo
self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const messaging = firebase.messaging();

// ✅ Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);
  
  const title = payload.notification?.title || payload.data?.title || 'TOEGO';
  const body = payload.notification?.body || payload.data?.body || '';
  const image = payload.notification?.image || payload.data?.image || '';
  const clickUrl = payload.data?.url || payload.fcmOptions?.link || '/shop-home.html';

  const options = {
    body: body,
    icon: 'https://toego.in/favicon-32x32.png',
    badge: 'https://toego.in/favicon-32x32.png',
    image: image || undefined,
    data: { url: clickUrl },
    vibrate: [200, 100, 200],
    requireInteraction: false,
    tag: 'toego-notif',
    renotify: true
  };

  // ✅ CRITICAL: showNotification ka promise RETURN karo
  return self.registration.showNotification(title, options);
});

// ✅ Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickUrl = event.notification.data?.url || '/shop-home.html';
  
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
