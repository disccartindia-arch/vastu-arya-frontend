'use client';
import { useEffect } from 'react';
import { themeSettingsAPI } from '../../lib/api';

/**
 * ThemeApplier — fetches admin-configured theme and injects CSS variables into :root.
 * Rendered once in layout.tsx alongside LuxuryBackground.
 * Falls back silently if the API is unavailable.
 */
export default function ThemeApplier() {
  useEffect(() => {
    themeSettingsAPI
      .get()
      .then((r: any) => {
        const theme = r?.data?.data;
        if (!theme) return;
        const root = document.documentElement;
        if (theme.primaryColor) root.style.setProperty('--primary', theme.primaryColor);
        if (theme.accentColor) root.style.setProperty('--gold', theme.accentColor);
        if (theme.cardBgColor) root.style.setProperty('--cream', theme.cardBgColor);
        if (theme.textColor) root.style.setProperty('--text-dark', theme.textColor);
        // Extended variables used by tailwind / inline styles
        if (theme.secondaryColor) root.style.setProperty('--secondary', theme.secondaryColor);
        if (theme.buttonBgColor) root.style.setProperty('--btn-bg', theme.buttonBgColor);
        if (theme.buttonTextColor) root.style.setProperty('--btn-text', theme.buttonTextColor);
        if (theme.heroOverlayColor) root.style.setProperty('--hero-overlay', theme.heroOverlayColor);
        if (theme.gradientFrom) root.style.setProperty('--gradient-from', theme.gradientFrom);
        if (theme.gradientTo) root.style.setProperty('--gradient-to', theme.gradientTo);
        if (theme.borderColor) root.style.setProperty('--border-color', theme.borderColor);
      })
      .catch(() => {
        // Silently fail — default CSS vars from globals.css remain in effect
      });
  }, []);

  return null;
}
