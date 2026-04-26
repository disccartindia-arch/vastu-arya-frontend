'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUIStore } from '../../store/uiStore';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { homepageSettingsAPI } from '../../lib/api';

export default function Footer() {
  const { lang } = useUIStore();
  const [fd, setFd] = useState({ phone: '+91-9999999999', email: 'contact@vastuarya.com', address: 'New Delhi, India', whatsapp: '919999999999', copyright: '© 2024 Vastu Arya | IVAF Certified | Made with love in India', instagram: '#', facebook: '#', youtube: '#', twitter: '#' });

  useEffect(() => {
    homepageSettingsAPI.get().then((r: any) => {
      const d = r?.data?.data;
      if (d) setFd(prev => ({
        ...prev,
        phone: d.contactPhone || d.contactNumber || prev.phone,
        email: d.contactEmail || prev.email,
        address: d.contactAddress || prev.address,
        whatsapp: d.contactWhatsapp || prev.whatsapp,
      }));
    }).catch(() => {});
  }, []);

  const socials = [
    { label: 'FB', href: fd.facebook },
    { label: 'IG', href: fd.instagram },
    { label: 'YT', href: fd.youtube },
    { label: 'TW', href: fd.twitter },
  ];

  return (
    <footer style={{ background: '#0D0500', color: '#9CA3AF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ border: '2px solid rgba(212,160,23,0.35)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Vastu Arya" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-display font-bold text-xl text-white">Vastu Arya</div>
              <div className="text-xs font-accent" style={{ color: '#D4A017' }}>IVAF Certified</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-4 text-gray-500">
            {lang === 'en'
              ? "India's premier Vastu Shastra & Astrology platform by IVAF Certified Expert Dr. PPS Tomar. 45,000+ Happy Clients."
              : 'IVAF प्रमाणित विशेषज्ञ डॉ. PPS द्वारा भारत का प्रमुख वास्तु और ज्योतिष प्लेटफॉर्म।'}
          </p>
          <div className="flex gap-2">
            {socials.map((s, i) => (
              <a key={i} href={s.href} target={s.href !== '#' ? '_blank' : '_self'} rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', color: '#D4A017' }}
                onMouseOver={e => { e.currentTarget.style.background = '#D4A017'; e.currentTarget.style.color = '#1A0A00'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#D4A017'; }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">{lang === 'en' ? 'Services' : 'सेवाएं'}</h4>
          <ul className="space-y-2">
            {[
              ['/book-appointment', lang === 'en' ? 'Book Appointment (₹11)' : 'अपॉइंटमेंट (₹11)'],
              ['/mobile-numerology', lang === 'en' ? 'Mobile Numerology' : 'मोबाइल नंबर ज्योतिष'],
              ['/vastu-check', lang === 'en' ? 'Vastu Check' : 'वास्तु जांच'],
              ['/smart-layout', lang === 'en' ? 'Smart Layout Plan' : 'स्मार्ट लेआउट प्लान'],
              ['/vastu-consultancy', lang === 'en' ? 'Dr. PPS Tomar Consultancy' : 'डॉ. PPS परामर्श'],
            ].map(([slug, label]) => (
              <li key={slug}>
                <Link href={`/services${slug}`} className="text-sm transition-colors hover:text-yellow-400" style={{ color: '#6B7280' }}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">{lang === 'en' ? 'Vastu Store' : 'वास्तु स्टोर'}</h4>
          <ul className="space-y-2">
            {[
              ['rudraksha', lang === 'en' ? 'Rudraksha' : 'रुद्राक्ष'],
              ['gemstones', lang === 'en' ? 'Gemstones' : 'रत्न'],
              ['yantras', lang === 'en' ? 'Yantras' : 'यंत्र'],
              ['sacred-mala', lang === 'en' ? 'Sacred Mala' : 'पवित्र माला'],
              ['divine-frames', lang === 'en' ? 'Divine Frames' : 'दिव्य फ्रेम'],
            ].map(([slug, label]) => (
              <li key={slug}>
                <Link href={`/vastu-store/${slug}`} className="text-sm transition-colors hover:text-yellow-400" style={{ color: '#6B7280' }}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">{lang === 'en' ? 'Contact Us' : 'संपर्क करें'}</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <Phone size={13} style={{ color: '#D4A017' }} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-500">{fd.phone}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={13} style={{ color: '#D4A017' }} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-500">{fd.email}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={13} style={{ color: '#D4A017' }} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-500">{fd.address}</span>
            </li>
            <li>
              <a href={`https://wa.me/${fd.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white transition-colors mt-1"
                style={{ background: '#25D366' }}>
                <MessageCircle size={15} /> WhatsApp Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            {lang === 'hi' ? '© 2024 वास्तु आर्या | IVAF प्रमाणित | भारत में बना' : fd.copyright}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-600 hover:text-yellow-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-600 hover:text-yellow-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
