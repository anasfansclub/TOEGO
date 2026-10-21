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

// Service Worker ko turant active karo
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const messaging = firebase.messaging();

// ✅ BACKGROUND MESSAGE HANDLER (Data-Only Payload)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);
  
  const data = payload.data || {};

  // Agar data khali hai toh default message dikhao
  const title = data.title || 'TOEGO Alert!';
  const body = data.body || 'Check out our new offers!';
  const image = data.image || '';
  const clickUrl = data.url || 'https://toego.in/shop-home.html';
  
  // ✅ AAPKA LOGO YAHAN SET HAI
  const LOGO_URL = 'https://res.cloudinary.com/kshufv2s/image/upload/v1792601941/511898-50kb_rriscx.jpg';

  const options = {
    body: body,
    icon: LOGO_URL,    // Bada logo
    badge: LOGO_URL,   // Chhota logo (Status bar)
    image: image || undefined, // Bada banner image (agar admin se upload kiya ho)
    data: { url: clickUrl },
    vibrate: [200, 100, 200],
    requireInteraction: false, 
    tag: 'toego-notif'
  };

  // Promise return karna zaroori hai warna Android me notification nahi aati
  return self.registration.showNotification(title, options);
});

// ✅ Notification Click Handler
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
