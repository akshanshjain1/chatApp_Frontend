// scripts/firebase-sw-template.js

const config = {
    apiKey: 'AIzaSyBs70X-TB9OUYifkwAP9Y6JHMLYip0vXas',
    authDomain: 'chatkaro-6f5a6.firebaseapp.com',
    projectId: 'chatkaro-6f5a6',
    storageBucket: 'chatkaro-6f5a6',
    messagingSenderId: '586021872062',
    appId: '1:586021872062:web:a5e5bbe32ca0e44a51d9ef',
    measurementId: 'G-1KF9XY71Y2',
  };
  
// scripts/firebase-sw-base.js

importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp(config);

const messaging = firebase.messaging();

// Handle background notification
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  const { link, content } = payload.data;
  
  self.registration.showNotification(title, {
    body: content || body,
    icon: '/logo.png',
    data: { link }, // 🔥 attach link to use in notificationclick
  });
});
// 👉 Handle click on notification
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