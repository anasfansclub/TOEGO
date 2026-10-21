// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// 1. Firebase Config
firebase.initializeApp({
  apiKey: "AIzaSyAhxecFY9TwZTYbdCVRAcnp1whI-Uqc-P8",
  authDomain: "toego-ecommerce.firebaseapp.com",
  projectId: "toego-ecommerce",
  storageBucket: "toego-ecommerce.firebasestorage.app",
  messagingSenderId: "234167880880",
  appId: "1:234167880880:web:b89d4b8e5f8cc9af3c3f75"
});

// 2. Force Service Worker to activate immediately
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const messaging = firebase.messaging();

// 3. Background Message Handler (Mobile + Desktop)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);
  
  // Payload se data extract karein
  const notification = payload.notification || {};
  const data = payload.data || {};
  const webpush = payload.webpush?.notification || {};

  // Fallback logic for title, body, icon
  const title = notification.title || webpush.title || data.title || 'TOEGO Alert!';
  const body = notification.body || webpush.body || data.body || 'Check out our new offers!';
  const image = notification.image || webpush.image || data.image || '';
  const clickUrl = data.url || payload.fcmOptions?.link || 'https://toego.in/shop-home.html';
  
  // ✅ AAPKA LOGO YAHAN SET HAI
  const LOGO_URL = 'https://res.cloudinary.com/kshufv2s/image/upload/v1792601941/511898-50kb_rriscx.jpg';

  const options = {
    body: body,
    icon: LOGO_URL,    // Bada logo (Mobile me left side me dikhta hai)
    badge: LOGO_URL,   // Chhota logo (Status bar me dikhta hai)
    image: image || undefined, // Bada banner image (agar admin se upload kiya ho)
    data: { url: clickUrl },
    vibrate: [200, 100, 200],
    requireInteraction: false, // Notification screen par hold nahi karega, user swipe kar sakta hai
    tag: 'toego-notif'
  };

  // Promise return karna zaroori hai warna Android me notification nahi aati
  return self.registration.showNotification(title, options);
});

// 4. Notification Click Handler (Jab user notification par tap kare)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickUrl = event.notification.data?.url || 'https://toego.in/shop-home.html';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Agar website pehle se open hai, toh usko focus karo
      for (const client of clientList) {
        if (client.url.indexOf(self.location.origin) !== -1 && 'focus' in client) {
          client.navigate(clickUrl);
          return client.focus();
        }
      }
      // Agar open nahi hai, toh naya tab kholo
      if (clients.openWindow) return clients.openWindow(clickUrl);
    })
  );
});
