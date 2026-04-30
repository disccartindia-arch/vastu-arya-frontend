import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
};

export const calculateDiscount = (original: number, offer: number): number => {
  return Math.round(((original - offer) / original) * 100);
};

export const getWhatsAppUrl = (number: string, message: string): string => {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const truncate = (str: string, n: number): string =>
  str.length > n ? str.slice(0, n - 1) + '...' : str;

export const slugify = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const STORE_CATEGORIES = [
  { slug: 'bracelets',        label: 'Bracelets',          emoji: '📿', labelHi: 'ब्रेसलेट' },
  { slug: 'box-bracelet',     label: 'Box Bracelet',       emoji: '🎁', labelHi: 'बॉक्स ब्रेसलेट' },
  { slug: 'rudraksha',        label: 'Rudraksha',          emoji: '🌰', labelHi: 'रुद्राक्ष' },
  { slug: 'gemstones',        label: 'Gemstones',          emoji: '💎', labelHi: 'रत्न' },
  { slug: 'gemstone-pendants',label: 'Gemstone Pendants',  emoji: '🔮', labelHi: 'रत्न पेंडेंट' },
  { slug: 'yantras',          label: 'Yantras',            emoji: '🔱', labelHi: 'यंत्र' },
  { slug: 'rashi',            label: 'Shop by Rashi',      emoji: '♈', labelHi: 'राशि अनुसार' },
  { slug: 'murthy',           label: 'Murthy',             emoji: '🪆', labelHi: 'मूर्ती' },
  { slug: 'divine-frames',    label: 'Divine Frames',      emoji: '🖼️', labelHi: 'दिव्य फ्रेम' },
  { slug: 'sacred-mala',      label: 'Sacred Mala',        emoji: '📿', labelHi: 'पवित्र माला' },
  { slug: 'charging-plates',  label: 'Charging Plates',    emoji: '🧿', labelHi: 'चार्जिंग प्लेट' },
  { slug: 'pyramids',         label: 'Pyramids',           emoji: '🔺', labelHi: 'पिरामिड' },
  { slug: 'spiritual',        label: 'Spiritual Products', emoji: '🌟', labelHi: 'आध्यात्मिक' },
];
