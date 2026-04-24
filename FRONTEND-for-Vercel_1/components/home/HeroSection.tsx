'use client';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { ArrowRight, Star, Award, Users } from 'lucide-react';
import Link from 'next/link';

const MandalaBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10">
      <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
        {[90,75,60,45,30,15].map((r, i) => (
          <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="#FF6B00" strokeWidth="0.5" strokeDasharray={`${r * 0.3} ${r * 0.5}`} />
        ))}
        {[0,45,90,135].map((deg, i) => (
          <line key={i} x1="100" y1="10" x2="100" y2="190" stroke="#FF6B00" strokeWidth="0.3" transform={`rotate(${deg} 100 100)`} />
        ))}
      </svg>
    </div>
    <div className="absolute top-10 right-10 w-40 h-40 opacity-5">
      <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-reverse">
        {[40,30,20].map((r,i) => <circle key={i} cx="50" cy="50" r={r} fill="none" stroke="#FF9933" strokeWidth="1" />)}
      </svg>
    </div>
    <div className="absolute bottom-20 left-10 w-32 h-32 opacity-5">
      <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
        {[40,30].map((r,i) => <circle key={i} cx="50" cy="50" r={r} fill="none" stroke="#D4A017" strokeWidth="1" />)}
      </svg>
    </div>
  </div>
);

export default function HeroSection({ onBookClick }: { onBookClick: () => void }) {
  const { lang } = useUIStore();

  const en = {
    badge: '🏆 IVAF Certified • New Delhi Recognized • 15+ Years',
    title1: 'Transform Your Space,',
    title2: 'Transform Your Life',
    sub: 'India\'s Premier Vastu Shastra & Astrology Platform by Dr. PPS',
    cta1: '📅 Book Appointment @ ₹11',
    cta2: '🙏 Explore Vastu Store',
    stats: ['10,000+\nHappy Clients', '15+\nYears Experience', '100+\nServices', '50+\nCities Served'],
    trust: ['IVAF Awarded', '10,000+ Consultations', 'New Delhi Recognized'],
  };
  const hi = {
    badge: '🏆 IVAF प्रमाणित • नई दिल्ली मान्यता प्राप्त • 15+ साल',
    title1: 'अपना वास्तु बदलें,',
    title2: 'अपना जीवन बदलें',
    sub: 'डॉ. PPS द्वारा भारत का प्रमुख वास्तु शास्त्र और ज्योतिष प्लेटफॉर्म',
    cta1: '📅 ₹11 में अपॉइंटमेंट बुक करें',
    cta2: '🙏 वास्तु स्टोर देखें',
    stats: ['10,000+\nखुश ग्राहक', '15+\nसाल का अनुभव', '100+\nसेवाएं', '50+\nशहर'],
    trust: ['IVAF पुरस्कृत', '10,000+ परामर्श', 'नई दिल्ली मान्यता प्राप्त'],
  };
  const c = lang === 'hi' ? hi : en;

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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star size={14} fill="currentColor" />
            <span className={lang === 'hi' ? 'font-hindi' : ''}>{c.badge}</span>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-2">
            {c.title1}
          </motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 gradient-text">
            {c.title2}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className={`text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
            {c.sub}
          </motion.p>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-2 mb-8">
            {c.trust.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full">
                <Award size={11} className="text-gold" /> {b}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-4 mb-16">
            <button onClick={onBookClick} className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-orange-lg animate-pulse-orange">
              {c.cta1}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/vastu-store" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all">
              {c.cta2}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {c.stats.map((stat, i) => {
              const [num, label] = stat.split('\n');
              return (
                <div key={i} className="text-center bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="font-display font-bold text-2xl text-primary">{num}</div>
                  <div className={`text-xs text-gray-400 mt-0.5 ${lang === 'hi' ? 'font-hindi' : ''}`}>{label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
        <span className="text-xs">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-0.5 h-8 bg-gradient-to-b from-white/40 to-transparent rounded-full" />
      </div>
    </section>
  );
}
