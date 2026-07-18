/**
 * public/firebase-messaging-sw.js
 *
 * Background Service Worker for Firebase Cloud Messaging.
 *
 * Loaded by the browser at the origin root (/firebase-messaging-sw.js) —
 * this is REQUIRED by Firebase; a Next.js-served route will not work. Keep
 * this file in /public.
 *
 * If firebase env vars are not set at build time, the SW still installs
 * cleanly (Firebase treats the missing config as a no-op) so the site never
 * breaks. Push simply won't be delivered until config is provided.
 *
 * Deep link: on notification click, focus an already-open tab that matches
 * the target URL, or open a fresh tab. When the push payload contains a
 * `bookingId` under `data`, we deep-link to /account/bookings/<id>.
 */
/* eslint-disable no-undef, no-restricted-globals */
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// NOTE: Service workers cannot read process.env — Next.js does not inline
// env vars into files served from /public. So we read config from the URL
// query string that the client passes when registering the SW. Client code:
//   navigator.serviceWorker.register(
//     `/firebase-messaging-sw.js?apiKey=...&projectId=...&appId=...`
//   );
try {
  const urlParams = new URLSearchParams(self.location.search);
  const cfg = {
    apiKey:            urlParams.get('apiKey')            || '',
    authDomain:        urlParams.get('authDomain')        || '',
    projectId:         urlParams.get('projectId')         || '',
    storageBucket:     urlParams.get('storageBucket')     || '',
    messagingSenderId: urlParams.get('messagingSenderId') || '',
    appId:             urlParams.get('appId')             || '',
  };

  if (cfg.apiKey && cfg.projectId && cfg.appId) {
    firebase.initializeApp(cfg);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const title =
        (payload.notification && payload.notification.title) ||
        (payload.data && payload.data.title) ||
        'Vastu Arya';
      const body =
        (payload.notification && payload.notification.body) ||
        (payload.data && payload.data.body) ||
        '';
      const bookingId = payload.data && payload.data.bookingId;
      const url = bookingId ? `/account/bookings/${bookingId}` : '/account';

      self.registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: { url },
        tag: bookingId ? `booking-${bookingId}` : undefined,
      });
    });
  }
} catch (e) {
  // Never crash the SW — silent-degrade.
  // eslint-disable-next-line no-console
  console.warn('[fcm-sw] init skipped:', e && e.message);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/account';
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      // Focus an already-open tab for the same origin/path
      if ('focus' in c && c.url.includes(target)) return c.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow(target);
    return null;
  })());
});
