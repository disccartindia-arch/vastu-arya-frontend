'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import FeaturedServices from '../components/home/FeaturedServices';
import TestimonialsSection from '../components/home/TestimonialsSection';
import AppointmentPopup from '../components/common/AppointmentPopup';
import CartDrawer from '../components/common/CartDrawer';
import WhatsAppButton from '../components/common/WhatsAppButton';
import ProductCard from '../components/store/ProductCard';
import { useUIStore } from '../store/uiStore';
import { servicesAPI, productsAPI } from '../lib/api';
import { Service, Product } from '../types';
import { motion } from 'framer-motion';
import Link from 'next/link';

const WhyCards = [
  { icon: '🏆', title: 'IVAF Certified Expert', titleHi: 'IVAF प्रमाणित विशेषज्ञ', desc: 'International Vedic Astrology Federation certified — USA recognized globally', descHi: 'अंतर्राष्ट्रीय वैदिक ज्योतिष महासंघ प्रमाणित' },
  { icon: '🎓', title: 'Doctorate in Vastu Vadana', titleHi: 'वास्तु वादना में डॉक्टरेट', desc: 'Dr. PPS holds a doctorate degree in Vastu Shastra from a prestigious institute', descHi: 'डॉ. PPS के पास प्रतिष्ठित संस्थान से वास्तु शास्त्र में डॉक्टरेट की डिग्री है' },
  { icon: '🌟', title: '10,000+ Happy Clients', titleHi: '10,000+ खुश ग्राहक', desc: 'Transforming lives across India and worldwide with authentic Vastu solutions', descHi: 'प्रामाणिक वास्तु समाधानों से पूरे भारत में जीवन बदल रहे हैं' },
  { icon: '📱', title: 'WhatsApp Connect', titleHi: 'WhatsApp कनेक्ट', desc: 'Direct access to Dr. PPS via WhatsApp for urgent consultations at just ₹11', descHi: 'केवल ₹11 में डॉ. PPS तक सीधी WhatsApp पहुंच' },
  { icon: '🔒', title: 'Authentic & Trusted', titleHi: 'प्रामाणिक और विश्वसनीय', desc: 'Government recognized, New Delhi awarded, media featured expert', descHi: 'सरकारी मान्यता प्राप्त, नई दिल्ली पुरस्कृत विशेषज्ञ' },
  { icon: '💯', title: 'Guaranteed Results', titleHi: 'गारंटीड परिणाम', desc: '15+ years of proven results with scientific Vastu methodology', descHi: '15+ साल के सिद्ध परिणाम वैज्ञानिक वास्तु पद्धति के साथ' },
];

export default function HomePage() {
  const { lang, setShowAppointmentPopup } = useUIStore();
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem('vastu_lang');
    if (savedLang) useUIStore.getState().setLang(savedLang as any);

    Promise.all([
      servicesAPI.getAll({ showOnHome: true, isActive: true }),
      productsAPI.getAll({ isFeatured: true, limit: 8 }),
    ]).then(([sRes, pRes]) => {
      setServices(sRes.data.data || []);
      setProducts(pRes.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection onBookClick={() => setShowAppointmentPopup(true)} />

        <FeaturedServices services={services} onBookAppointment={() => setShowAppointmentPopup(true)} />

        {/* Stats */}
        <section className="py-16 bg-saffron-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
              {[
                { num: '10,000+', label: lang === 'en' ? 'Happy Clients' : 'खुश ग्राहक' },
                { num: '15+', label: lang === 'en' ? 'Years Experience' : 'साल का अनुभव' },
                { num: '100+', label: lang === 'en' ? 'Services' : 'सेवाएं' },
                { num: '50+', label: lang === 'en' ? 'Cities Served' : 'शहरों में सेवा' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="font-display font-bold text-4xl sm:text-5xl mb-1">{s.num}</div>
                  <div className={`text-white/80 text-sm ${lang === 'hi' ? 'font-hindi' : ''}`}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Remedies */}
        {products.length > 0 && (
          <section className="py-20 bg-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                <span className="font-accent text-primary text-sm tracking-widest uppercase">Vastu Store</span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-dark mt-2 mb-3">
                  {lang === 'en' ? 'Top Selling Remedies' : 'टॉप सेलिंग उपाय'}
                </h2>
                <p className="text-text-light">{lang === 'en' ? 'Authentic spiritual products for positive energy & prosperity' : 'सकारात्मक ऊर्जा के लिए प्रामाणिक आध्यात्मिक उत्पाद'}</p>
              </motion.div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((p, i) => (
                  <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href="/vastu-store" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-orange">
                  🙏 {lang === 'en' ? 'Visit Vastu Store' : 'वास्तु स्टोर देखें'}
                </Link>
              </div>
            </div>
          </section>
        )}

        <TestimonialsSection />

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-dark mb-3">
                {lang === 'en' ? 'Why Choose Vastu Arya?' : 'वास्तु आर्या क्यों चुनें?'}
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WhyCards.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border border-orange-100 hover:border-primary/30 hover:shadow-orange transition-all">
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <h3 className="font-display font-bold text-text-dark mb-2">{lang === 'hi' ? c.titleHi : c.title}</h3>
                  <p className={`text-text-light text-sm leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>{lang === 'hi' ? c.descHi : c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Book Appointment CTA Banner */}
        <section className="py-20 bg-dark-gradient relative overflow-hidden">
          <div className="absolute inset-0 mandala-bg opacity-20" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <div className="text-6xl mb-4">🕉️</div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                {lang === 'en' ? 'Transform Your Life Today' : 'आज अपना जीवन बदलें'}
              </h2>
              <p className={`text-gray-300 text-lg mb-8 ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'en' ? 'Connect with Dr. PPS on WhatsApp for personalized Vastu & Astrology guidance. Only ₹11.' : 'व्यक्तिगत वास्तु और ज्योतिष मार्गदर्शन के लिए डॉ. PPS से WhatsApp पर जुड़ें। केवल ₹11।'}
              </p>
              <button onClick={() => setShowAppointmentPopup(true)} className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold text-xl transition-all shadow-orange-lg animate-pulse-orange">
                📅 {lang === 'en' ? 'Book Appointment @ ₹11' : '₹11 में अपॉइंटमेंट बुक करें'}
              </button>
              <p className="text-gray-400 text-sm mt-4">
                {lang === 'en' ? 'IVAF Certified • 10,000+ Happy Clients • 15+ Years Experience' : 'IVAF प्रमाणित • 10,000+ खुश ग्राहक • 15+ साल का अनुभव'}
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <AppointmentPopup />
      <CartDrawer />
      <WhatsAppButton />

      {/* Mobile floating book button */}
      <button onClick={() => setShowAppointmentPopup(true)} className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:hidden z-40 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm shadow-orange-lg animate-pulse-orange">
        📅 {lang === 'en' ? 'Book @ ₹11' : '₹11 में बुक करें'}
      </button>
    </>
  );
}
