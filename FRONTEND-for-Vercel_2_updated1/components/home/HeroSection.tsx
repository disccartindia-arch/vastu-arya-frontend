'use client';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { ArrowRight, Star, Award, Users } from 'lucide-react';
import Link from 'next/link';

export interface HeroSettings {
  heroHeading?: string;
  heroSubheading?: string;
  cta1Text?: string;
  cta1Link?: string;
  cta2Text?: string;
  cta2Link?: string;
  trustBadges?: { label: string; order: number }[];
  stats?: { value: string; label: string; order: number }[];
}

const MandalaBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10">
      <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
        {[90, 75, 60, 45, 30, 15].map((r, i) => (
          <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="#FF6B00" strokeWidth="0.5" strokeDasharray={`${r * 0.3} ${r * 0.5}`} />
        ))}
        {[0, 45, 90, 135].map((deg, i) => (
          <line key={i} x1="100" y1="10" x2="100" y2="190" stroke="#FF6B00" strokeWidth="0.3" transform={`rotate(${deg} 100 100)`} />
        ))}
      </svg>
    </div>
    <div className="absolute top-10 right-10 w-40 h-40 opacity-5">
      <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-reverse">
        {[40, 30, 20].map((r, i) => <circle key={i} cx="50" cy="50" r={r} fill="none" stroke="#FF9933" strokeWidth="1" />)}
      </svg>
    </div>
    <div className="absolute bottom-20 left-10 w-32 h-32 opacity-5">
      <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
        {[40, 30].map((r, i) => <circle key={i} cx="50" cy="50" r={r} fill="none" stroke="#D4A017" strokeWidth="1" />)}
      </svg>
    </div>
  </div>
);

const DEFAULT_TRUST_BADGES = [
  'IVAF Awarded',
  '10,000+ Consultations',
  'New Delhi Recognized',
];

const DEFAULT_STATS_EN = [
  { value: '10,000+', label: 'Happy Clients' },
  { value: '15+', label: 'Years Experience' },
  { value: '100+', label: 'Services' },
  { value: '50+', label: 'Cities Served' },
];

interface Props {
  onBookClick: () => void;
  settings?: HeroSettings;
}

export default function HeroSection({ onBookClick, settings }: Props) {
  const { lang } = useUIStore();

  // Defaults — overridden by admin settings when provided
  const heroHeading = settings?.heroHeading || (
    lang === 'hi' ? 'अपना वास्तु बदलें, अपना जीवन बदलें' : 'Transform Your Space, Transform Your Life'
  );
  const heroSubheading = settings?.heroSubheading || (
    lang === 'hi'
      ? 'डॉ. PPS द्वारा भारत का प्रमुख वास्तु शास्त्र और ज्योतिष प्लेटफॉर्म'
      : "India's Premier Vastu Shastra & Astrology Platform by Dr. PPS"
  );
  const cta1Text = settings?.cta1Text || (lang === 'hi' ? '📅 ₹11 में अपॉइंटमेंट बुक करें' : '📅 Book Appointment @ ₹11');
  const cta1Link = settings?.cta1Link || '/book-appointment';
  const cta2Text = settings?.cta2Text || (lang === 'hi' ? '🙏 वास्तु स्टोर देखें' : '🙏 Explore Vastu Store');
  const cta2Link = settings?.cta2Link || '/vastu-store';

  const trustBadges: string[] =
    settings?.trustBadges && settings.trustBadges.length > 0
      ? [...settings.trustBadges].sort((a, b) => a.order - b.order).map((b) => b.label)
      : DEFAULT_TRUST_BADGES;

  const stats =
    settings?.stats && settings.stats.length > 0
      ? [...settings.stats].sort((a, b) => a.order - b.order)
      : DEFAULT_STATS_EN;

  // Split heading into two lines at first comma if no manual split needed
  const headingParts = heroHeading.split(',');
  const title1 = headingParts[0] ? headingParts[0].trim() + (headingParts.length > 1 ? ',' : '') : heroHeading;
  const title2 = headingParts.slice(1).join(',').trim();

  return (
    <section className="relative min-h-screen bg-dark-gradient flex items-center overflow-hidden">
      <MandalaBackground />
      {/* Om symbol watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[20rem] font-devanagari text-white/[0.02] leading-none select-none">ॐ</span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Star size={14} fill="currentColor" />
            <span className={lang === 'hi' ? 'font-hindi' : ''}>
              {lang === 'hi' ? '🏆 IVAF प्रमाणित • नई दिल्ली मान्यता प्राप्त • 15+ साल' : '🏆 IVAF Certified • New Delhi Recognized • 15+ Years'}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-2"
          >
            {title1}
          </motion.h1>
          {title2 && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 gradient-text"
            >
              {title2}
            </motion.h1>
          )}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}
          >
            {heroSubheading}
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {trustBadges.map((badge, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full">
                <Award size={11} className="text-gold" /> {badge}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            {cta1Link === '/book-appointment' ? (
              <button
                onClick={onBookClick}
                className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-orange-lg animate-pulse-orange"
              >
                {cta1Text}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link
                href={cta1Link}
                className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-orange-lg animate-pulse-orange"
              >
                {cta1Text}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link
              href={cta2Link}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all"
            >
              {cta2Text}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="font-display font-bold text-2xl text-primary">{stat.value}</div>
                <div className={`text-xs text-gray-400 mt-0.5 ${lang === 'hi' ? 'font-hindi' : ''}`}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
        <span className="text-xs">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-0.5 h-8 bg-gradient-to-b from-white/40 to-transparent rounded-full"
        />
      </div>
    </section>
  );
}
