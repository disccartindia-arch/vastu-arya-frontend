'use client';
/**
 * hooks/useRequireLogin.ts
 * Small helper — call before any purchase / booking action.
 * If not logged in, stashes the current URL as ?redirect=... and
 * pushes /login. Returns true if the caller may proceed.
 */
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export function useRequireLogin() {
  const router = useRouter();
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);

  return function requireLogin(next?: string): boolean {
    if (isLoggedIn()) return true;
    const path = next
      ?? (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
    toast('Please log in to continue', { icon: '🔐' });
    router.push(`/login?redirect=${encodeURIComponent(path)}`);
    return false;
  };
}
