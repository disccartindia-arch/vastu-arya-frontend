'use client';
/**
 * hooks/useNotificationPreferences.ts
 * localStorage-backed preferences the frontend keeps ready for
 * WhatsApp / Email / SMS / Push. Backend integration comes later —
 * this hook is the single reference point every screen reads/writes.
 */
import { useEffect, useState } from 'react';

export interface NotificationPrefs {
  whatsapp: boolean;
  email:    boolean;
  sms:      boolean;
  push:     boolean;
}

const KEY = 'vastu_notif_prefs_v1';
const DEFAULTS: NotificationPrefs = { whatsapp: true, email: true, sms: false, push: false };

export function useNotificationPreferences() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* ignore corrupt storage */ }
    setHydrated(true);
  }, []);

  const update = (patch: Partial<NotificationPrefs>) => {
    setPrefs(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* quota / SSR */ }
      return next;
    });
  };

  return { prefs, update, hydrated };
}
