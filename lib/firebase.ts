/**
 * lib/firebase.ts
 *
 * Client-side Firebase Messaging (FCM) initialisation.
 *
 * All Firebase config comes from NEXT_PUBLIC_FIREBASE_* env vars. If any
 * required var is missing (dev / preview / self-hosted setups), the module
 * degrades gracefully: `getMessagingClient()` returns null, no imports throw,
 * and the rest of the app is unaffected.
 *
 * The service worker lives at /public/firebase-messaging-sw.js and is
 * registered lazily by useFcmToken. This module ONLY sets up the browser-side
 * app + messaging instance — token retrieval / permission is handled by the
 * hook so it can be triggered on an explicit user gesture (login /
 * dashboard visit) rather than at module-load time.
 */
import { FirebaseApp, initializeApp, getApps, getApp } from 'firebase/app';
import { Messaging, getMessaging, isSupported } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** All required client fields present? */
export function firebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    firebaseConfig.messagingSenderId &&
    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
  );
}

let cachedApp: FirebaseApp | null = null;
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (!firebaseConfigured()) return null;
  if (cachedApp) return cachedApp;
  cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig as any);
  return cachedApp;
}

/**
 * Return a Messaging instance if the environment supports FCM (secure origin,
 * ServiceWorker + PushManager APIs, Notification, and the SDK's own
 * `isSupported()` check). Otherwise returns null.
 */
export async function getMessagingClient(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    const ok = await isSupported();
    if (!ok) return null;
    return getMessaging(app);
  } catch {
    return null;
  }
}

export const FCM_VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '';
