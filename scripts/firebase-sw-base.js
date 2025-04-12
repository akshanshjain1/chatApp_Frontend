// scripts/firebase-sw-base.js

importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, link } = payload.data;

  self.registration.showNotification(title, {
    body,
    icon: '/icon_badge.png',    // Custom notification icon
    badge: '/icon_badge.png',  // Custom badge icon (smaller, simpler)
    vibrate: [100, 50, 100],                 // Subtle vibration feedback
    data: { link },
    actions: [
      {
        action: 'open_chat',
        title: 'Open Chat'
      }
    ]
  });
});

self.addEventListener('notificationclick', function (event) {
  const link = event.notification.data?.link;
  event.notification.close();

  if (link) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === link && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(link);
        }
      })
    );
  }
});
