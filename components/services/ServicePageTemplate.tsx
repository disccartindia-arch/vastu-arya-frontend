'use client';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import WhatsAppButton from '../common/WhatsAppButton';
import AppointmentPopup from '../common/AppointmentPopup';
import { useUIStore } from '../../store/uiStore';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Video, Star, MessageCircle, Calendar, ChevronRight } from 'lucide-react';

interface FAQ { q: string; a: string; }
interface Props {
  icon: string; title: string; subtitle: string; description: string;
  price: number; originalPrice: number; duration: string;
  benefits: string[]; process: { step: string; title: string; desc: string }[];
  faqs: FAQ[]; badge?: string;
}

export default function ServicePageTemplate({ icon, title, subtitle, description, price, originalPrice, duration, benefits, process, faqs, badge }: Props) {
  const { setShowAppointmentPopup } = useUIStore();
  const WA = '917000343804';
  const waMsg = encodeURIComponent(`Namaste Dr. PPS ji 🙏 I want to book "${title}". Please guide me.`);
  const discount = Math.round((1 - price / originalPrice) * 100);

  return (
    <>
      <Navbar />
      <main style={{ background: '#FFFDF7' }}>
        <section className="bg-dark-gradient py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 mandala-bg opacity-10 pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-4">
            {badge && <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 border" style={{ background: 'rgba(212,160,23,0.15)', color: '#D4A017', borderColor: 'rgba(212,160,23,0.3)' }}>{badge}</span>}
            <div className="text-6xl mb-4">{icon}</div>
            <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">{title}</motion.h1>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }} className="text-gray-300 text-lg mb-6">{subtitle}</motion.p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="flex items-center gap-1.5 text-sm text-gray-300"><Clock size={14}/>{duration}</span>
              <span className="flex items-center gap-1.5 text-sm text-gray-300"><Video size={14}/>Video / Phone Call</span>
              <span className="flex items-center gap-1.5 text-sm text-gray-300"><Star size={14} className="fill-yellow-400 text-yellow-400"/>IVAF Certified</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="text-center">
                <span className="text-gray-400 line-through text-lg">₹{originalPrice.toLocaleString()}</span>
                <div className="text-4xl font-bold text-white">₹{price.toLocaleString()}</div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(255,107,0,0.2)', color: '#FF9933' }}>{discount}% OFF</span>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button onClick={() => setShowAppointmentPopup(true)} className="px-8 py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9933)', boxShadow: '0 8px 24px rgba(255,107,0,0.4)' }}>
                  <Calendar size={16}/> Book Now
                </button>
                <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 bg-[#25D366]">
                  <MessageCircle size={16}/> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100">
            <p className="text-gray-600 text-base leading-relaxed">{description}</p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-5">What You Get</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <motion.div key={i} initial={{ opacity:0, x:-12 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay: i*0.07 }}
                  className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5"/>
                  <span className="text-gray-700 text-sm">{b}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-5">How It Works</h2>
            <div className="space-y-3">
              {process.map((p, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-orange-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9933)' }}>{p.step}</div>
                  <div><p className="font-bold text-gray-800 mb-1">{p.title}</p><p className="text-gray-500 text-sm">{p.desc}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg,#0D0500,#1A0A00)', border: '1px solid rgba(212,160,23,0.25)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: 'rgba(212,160,23,0.5)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="Dr. PPS Tomar" className="w-full h-full object-cover"/>
              </div>
              <div>
                <p className="font-bold text-white">Dr. Pranveer Pratap Singh Tomar</p>
                <p className="text-xs mt-0.5" style={{ color: '#D4A017' }}>IVAF Certified • 15+ Years • 45,000+ Clients</p>
                <div className="flex gap-0.5 mt-1">{[...Array(5)].map((_,i)=><Star key={i} size={11} className="fill-yellow-400 text-yellow-400"/>)}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Dr. PPS Tomar is among India's most trusted IVAF certified Vastu and astrology experts. His guidance has transformed thousands of homes, businesses and lives across India and internationally.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowAppointmentPopup(true)} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9933)' }}>
                <Calendar size={14}/> Book ₹{price.toLocaleString()}
              </button>
              <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-[#25D366]">
                <MessageCircle size={14}/> WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-gray-800 text-sm list-none">
                    {faq.q}<ChevronRight size={16} className="text-primary flex-shrink-0 group-open:rotate-90 transition-transform"/>
                  </summary>
                  <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>

          <div className="text-center py-6">
            <h3 className="font-display text-2xl font-bold text-gray-800 mb-2">Ready to Transform Your Life?</h3>
            <p className="text-gray-500 mb-6">Book your session with Dr. PPS Tomar today</p>
            <button onClick={() => setShowAppointmentPopup(true)} className="px-10 py-4 rounded-2xl font-bold text-lg text-white inline-flex items-center gap-2" style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9933)', boxShadow: '0 8px 32px rgba(255,107,0,0.35)' }}>
              <Calendar size={20}/> Book @ ₹{price.toLocaleString()} Now
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <AppointmentPopup />
      <WhatsAppButton />
    </>
  );
}
