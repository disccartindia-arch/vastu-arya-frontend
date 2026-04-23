'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', en: 'Home', hi: 'होम' },
  { href: '/vastu-store', en: 'Vastu Store', hi: 'वास्तु स्टोर' },
  { href: '/services', en: 'Services', hi: 'सेवाएं' },
  { href: '/blog', en: 'Blog', hi: 'ब्लॉग' },
  { href: '/about', en: 'About', hi: 'हमारे बारे में' },
  { href: '/contact', en: 'Contact', hi: 'संपर्क' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, setShowAppointmentPopup, mobileMenuOpen, setMobileMenuOpen, setShowCartDrawer } = useUIStore();
  const totalItems = useCartStore(s => s.totalItems());
  const { user, logout, isAdmin } = useAuthStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="text-white text-xs py-1.5 px-4 flex items-center justify-between" style={{ background: '#0D0500' }}>
        <div className="flex items-center gap-4">
          <a href="tel:+919999999999" className="hover:text-yellow-400 transition-colors" style={{ color: '#D4A017' }}>
            +91-9999999999
          </a>
          <span className="hidden sm:block text-xs font-accent" style={{ color: '#D4A017' }}>
            IVAF Certified • New Delhi Recognized
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs">Lang:</span>
          {['en', 'hi'].map(l => (
            <button key={l} onClick={() => setLang(l as any)}
              className="px-2 py-0.5 rounded text-xs font-medium transition-colors"
              style={lang === l ? { background: '#D4A017', color: '#1A0A00' } : { color: '#9CA3AF' }}>
              {l === 'en' ? 'EN' : 'हि'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 transition-all duration-300"
        style={{ background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,160,23,0.1)', boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 transition-all group-hover:scale-105"
                style={{ border: '2px solid rgba(212,160,23,0.35)', boxShadow: '0 0 12px rgba(212,160,23,0.12)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="Vastu Arya" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-display font-bold text-lg leading-none" style={{ color: '#1A0A00' }}>Vastu Arya</div>
                <div className="text-xs font-accent" style={{ color: '#D4A017' }}>IVAF Certified</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className="px-3 py-2 text-sm font-medium transition-colors rounded-lg"
                  style={{ color: '#5C3D1E' }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.06)'; e.currentTarget.style.color = '#FF6B00'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5C3D1E'; }}>
                  {lang === 'en' ? link.en : link.hi}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => setShowCartDrawer(true)} className="relative p-2 rounded-lg transition-colors hover:bg-orange-50">
                <ShoppingCart size={20} style={{ color: '#5C3D1E' }} />
                {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: '#FF6B00' }}>{totalItems}</span>
                )}
              </button>

              <button onClick={() => setShowAppointmentPopup(true)}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all text-white animate-pulse-orange"
                style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C33)', boxShadow: '0 2px 12px rgba(255,107,0,0.3)' }}>
                {lang === 'en' ? 'Book @ ₹11' : '₹11 में बुक'}
              </button>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-1">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg, #D4A017, #FF6B00)' }}>{user.name[0]}</span>
                    <ChevronDown size={13} style={{ color: '#5C3D1E' }} />
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                    style={{ border: '1px solid rgba(212,160,23,0.15)' }}>
                    {isAdmin() && <Link href="/admin" className="block px-4 py-2 text-sm font-semibold hover:bg-orange-50 transition-colors" style={{ color: '#FF6B00' }}>Admin Panel</Link>}
                    <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-orange-50 transition-colors" style={{ color: '#5C3D1E' }}>My Account</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">Logout</button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block text-sm font-medium transition-colors hover:text-primary" style={{ color: '#5C3D1E' }}>Login</Link>
              )}

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-orange-50 transition-colors">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 py-4 space-y-1 border-t bg-white" style={{ borderColor: 'rgba(212,160,23,0.1)' }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium rounded-xl transition-colors hover:text-primary hover:bg-orange-50"
                style={{ color: '#5C3D1E' }}>
                {lang === 'en' ? link.en : link.hi}
              </Link>
            ))}
            <button onClick={() => { setShowAppointmentPopup(true); setMobileMenuOpen(false); }}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C33)' }}>
              {lang === 'en' ? 'Book Appointment @ ₹11' : '₹11 में अपॉइंटमेंट बुक करें'}
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
