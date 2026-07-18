/**
 * hooks/useFcmToken.ts
 *
 * Request notification permission, retrieve a Firebase Cloud Messaging (FCM)
 * device token, and register it with the backend so the server can push to
 * this browser. Called once per authenticated session — no polling.
 *
 * Design goals:
 *  - Never break the UI: every failure mode (unsupported browser, missing
 *    env config, denied permission, backend endpoint 404) is silent from the
 *    user's perspective, only logged to the console.
 *  - Never re-prompt: once the browser has been asked, we do not ask again
 *    until localStorage is cleared. This matches the "ask on login / first
 *    dashboard visit" requirement without becoming annoying.
 *  - Idempotent registration: the same token is not resent on every render.
 *
 * Backend contract (documented as required; will 404 today):
 *   POST /api/notifications/fcm-token
 *     body: { token: string, platform: 'web', userAgent: string }
 *     auth: Bearer JWT (existing vastu_token from lib/api.ts)
 *
 * If the endpoint returns 404 (backend has not yet implemented it) the token
 * is stashed in localStorage under `vastu_fcm_pending_token` so the next
 * successful visit (once backend is live) can retry.
 */
'use client';
import { useEffect, useRef } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import toast from 'react-hot-toast';
import {
  FCM_VAPID_KEY,
  firebaseConfig,
  firebaseConfigured,
  getMessagingClient,
} from '../lib/firebase';
import { notificationsAPI } from '../lib/api';

const LS_KEY_ASKED = 'vastu_fcm_asked_v1';
const LS_KEY_TOKEN = 'vastu_fcm_token_v1';
const LS_KEY_PENDING = 'vastu_fcm_pending_token';

async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    // Pass firebase config via query string so the SW (which cannot read
    // process.env) can initialise itself. See public/firebase-messaging-sw.js.
    const q = new URLSearchParams({
      apiKey:            firebaseConfig.apiKey            || '',
      authDomain:        firebaseConfig.authDomain        || '',
      projectId:         firebaseConfig.projectId         || '',
      storageBucket:     firebaseConfig.storageBucket     || '',
      messagingSenderId: firebaseConfig.messagingSenderId || '',
      appId:             firebaseConfig.appId             || '',
    });
    return await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?${q.toString()}`,
      { scope: '/' },
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[fcm] SW registration failed:', e);
    return null;
  }
}

async function pushTokenToBackend(token: string): Promise<'ok' | 'missing-endpoint' | 'error'> {
  try {
    await notificationsAPI.registerFcmToken({
      token,
      platform: 'web',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });
    return 'ok';
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 404) return 'missing-endpoint';
    return 'error';
  }
}

export interface UseFcmTokenOptions {
  /**
   * If true, the browser permission prompt is triggered immediately when
   * conditions are met. Defaults to true. Pass false for a screen that only
   * wants to LISTEN to foreground pushes.
   */
  requestPermission?: boolean;
  /** Called when a foreground push arrives (page open + focused). */
  onForegroundMessage?: (payload: any) => void;
}

/**
 * React hook — call once from an authenticated layout. Safe to call from
 * multiple components; internal ref-guard prevents duplicate registration in
 * the same tab.
 */
export function useFcmToken(opts: UseFcmTokenOptions = {}): void {
  const started = useRef(false);
  const { requestPermission = true, onForegroundMessage } = opts;

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let unsubForeground: (() => void) | undefined;

    (async () => {
      // Silent-degrade if browser or config isn't ready.
      if (typeof window === 'undefined') return;
      if (!('Notification' in window)) return;
      if (!firebaseConfigured()) return;

      const messaging = await getMessagingClient();
      if (!messaging) return;

      // Wire foreground handler unconditionally — the caller may want it
      // even when permission has already been granted.
      unsubForeground = onMessage(messaging, (payload) => {
        onForegroundMessage?.(payload);
        // Default UX: gentle toast; deep-link if payload has bookingId.
        const title = payload.notification?.title || payload.data?.title || 'Update';
        const body  = payload.notification?.body  || payload.data?.body  || '';
        toast.success(`${title}${body ? `\n${body}` : ''}`);
      });

      // 1. If we already registered a token this browser+session, just retry
      //    the pending one if backend endpoint might be up now.
      const pending = localStorage.getItem(LS_KEY_PENDING);
      if (pending) {
        const r = await pushTokenToBackend(pending);
        if (r === 'ok') localStorage.removeItem(LS_KEY_PENDING);
      }
      const already = localStorage.getItem(LS_KEY_TOKEN);
      if (already) return;

      // 2. Ask permission — only if the caller wants us to, we've never asked
      //    before in THIS browser, and current state is 'default' (i.e. not
      //    already denied). Denied users can re-enable via browser settings.
      if (!requestPermission) return;
      const asked = localStorage.getItem(LS_KEY_ASKED);
      if (asked && Notification.permission !== 'granted') return;

      let permission = Notification.permission;
      if (permission === 'default') {
        localStorage.setItem(LS_KEY_ASKED, '1');
        try {
          permission = await Notification.requestPermission();
        } catch {
          return;
        }
      }
      if (permission !== 'granted') return;

      // 3. Register SW and fetch token.
      const swReg = await registerServiceWorker();
      if (!swReg) return;

      let token: string | null = null;
      try {
        token = await getToken(messaging, {
          vapidKey: FCM_VAPID_KEY,
          serviceWorkerRegistration: swReg,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[fcm] getToken failed:', e);
        return;
      }
      if (!token) return;

      // 4. Send to backend (silent-fail if endpoint 404).
      const result = await pushTokenToBackend(token);
      if (result === 'ok') {
        localStorage.setItem(LS_KEY_TOKEN, token);
        localStorage.removeItem(LS_KEY_PENDING);
      } else {
        // Stash so the next mount can retry once the backend endpoint exists.
        localStorage.setItem(LS_KEY_PENDING, token);
      }
    })();

    return () => {
      if (unsubForeground) unsubForeground();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
