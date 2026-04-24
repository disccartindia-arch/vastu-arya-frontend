import { create } from 'zustand';
import { Lang } from '../types';

interface UIStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
  showAppointmentPopup: boolean;
  setShowAppointmentPopup: (show: boolean) => void;
  showCartDrawer: boolean;
  setShowCartDrawer: (show: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  // Admin-configurable contact number loaded from HomepageSettings
  contactNumber: string;
  setContactNumber: (num: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  lang: 'en',
  setLang: (lang) => {
    set({ lang });
    if (typeof window !== 'undefined') localStorage.setItem('vastu_lang', lang);
  },
  showAppointmentPopup: false,
  setShowAppointmentPopup: (show) => set({ showAppointmentPopup: show }),
  showCartDrawer: false,
  setShowCartDrawer: (show) => set({ showCartDrawer: show }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  contactNumber: '+91-9999999999',
  setContactNumber: (num) => set({ contactNumber: num }),
}));
