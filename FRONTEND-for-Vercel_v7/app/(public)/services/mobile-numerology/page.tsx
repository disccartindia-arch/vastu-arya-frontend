'use client';
import { useState } from 'react';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import AppointmentPopup from '../../../../components/common/AppointmentPopup';
import CartDrawer from '../../../../components/common/CartDrawer';
import WhatsAppButton from '../../../../components/common/WhatsAppButton';
import PriceDisplay from '../../../../components/common/PriceDisplay';
import { useUIStore } from '../../../../store/uiStore';
import { initiateRazorpayPayment } from '../../../../lib/razorpay';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, FileText, Zap, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const features = [
  { icon: '📄', title: 'Detailed PDF Report', desc: 'Comprehensive analysis of your number\'s energy and vibrations' },
  { icon: '🔋', title: 'Energy Analysis', desc: 'Deep dive into positive/negative energy of each digit' },
  { icon: '🍀', title: 'Lucky Number Verification', desc: 'Confirm if your current number supports your destiny' },
  { icon: '💼', title: 'Career Compatibility', desc: 'How your number aligns with your professional goals' },
  { icon: '🔮', title: 'Planetary Influence', desc: 'Which planets govern your number and their impact' },
  { icon: '💊', title: 'Practical Remedies', desc: 'What to do if your number is unfavorable' },
];

const faqs = [
  { q: 'How does mobile number numerology work?', a: 'Every number carries a specific vibration and energy. Your mobile number, being in constant use, directly influences your aura, relationships, and opportunities. Dr. PPS Tomar analyzes the numeric values using ancient Vedic numerology principles.' },
  { q: 'How will I receive my report?', a: 'Your detailed PDF report will be emailed to you within 24-48 hours of booking. The report includes all findings, lucky remedies, and personalized guidance.' },
  { q: 'What if my number is unfavorable?', a: 'Dr. PPS Tomar provides specific remedies such as recommended number changes, mantras, or complementary numbers to add to offset negative effects.' },
  { q: 'Do I need to change my number?', a: 'Not necessarily. The report will first confirm whether your number needs changing. Many numbers can be remedied without switching.' },
];

export default function MobileNumerologyPage() {
  const { lang } = useUIStore();
  const [showForm, setShowForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleBuy = async () => {
    if (!name || !phone) return toast.error('Please fill name and phone');
    setLoading(true);
    await initiateRazorpayPayment({
      amount: 199, name, email, phone,
      description: 'Mobile Number Numerology Report',
      type: 'service',
      orderData: { name, phone, email, serviceName: 'Mobile Number Numerology', amount: 199, formData: { analyzeNumber: phone } },
      onSuccess: () => { setLoading(false); toast.success('🎉 Booking confirmed! You\'ll receive your report in 24-48 hours.'); setShowForm(false); },
      onFailure: () => setLoading(false),
    });
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-dark-gradient py-20 relative overflow-hidden">
          <div className="absolute inset-0 mandala-bg opacity-10" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">📱 Numerology Service</span>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Is Your Mobile Number Lucky For You?</h1>
                <p className="text-gray-300 text-lg mb-6">Get a detailed expert analysis by Dr. PPS Tomar (IVAF Certified). Know if your number brings fortune or holds you back.</p>
                <PriceDisplay original={999} offer={199} size="lg" />
                <p className="text-green-400 text-sm mt-2 mb-6">⚡ 80% OFF — Limited Time Offer!</p>
                <button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-orange-lg">
                  📱 Get My Analysis @ ₹199
                </button>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="text-9xl animate-float">📱</div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16 bg-cream">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold text-text-dark text-center mb-10">What You'll Receive</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-5 rounded-2xl border border-orange-100">
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <h3 className="font-semibold text-text-dark mb-1">{f.title}</h3>
                  <p className="text-text-light text-sm">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display text-3xl font-bold text-text-dark mb-10">How It Works</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[{ step: '1', icon: <Phone size={28} />, title: 'Share Your Number', desc: 'Book and share the mobile number to be analyzed' }, { step: '2', icon: <Zap size={28} />, title: 'Expert Analysis', desc: 'Dr. PPS Tomar personally analyzes using Vedic numerology' }, { step: '3', icon: <FileText size={28} />, title: 'Receive Report', desc: 'Get detailed PDF report in your email within 48 hours' }].map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">{s.icon}</div>
                  <div className="w-6 h-6 bg-primary rounded-full text-white text-xs font-bold flex items-center justify-center mb-2">{s.step}</div>
                  <h3 className="font-semibold text-text-dark mb-1">{s.title}</h3>
                  <p className="text-text-light text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold text-text-dark text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-orange-100 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left font-semibold text-text-dark hover:text-primary transition-colors">
                    {faq.q} <ChevronDown size={18} className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && <div className="px-5 pb-5 text-text-light text-sm">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-saffron-gradient text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Find Your Lucky Number?</h2>
          <p className="text-white/90 mb-6">Get expert analysis by IVAF Certified Dr. PPS Tomar</p>
          <PriceDisplay original={999} offer={199} size="lg" />
          <button onClick={() => setShowForm(true)} className="mt-4 bg-white text-primary hover:bg-cream px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg">
            📱 Book Analysis @ ₹199
          </button>
        </section>
      </main>
      <Footer />
      <AppointmentPopup />
      <CartDrawer />
      <WhatsAppButton />

      {/* Booking Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-display text-xl font-bold mb-4">📱 Mobile Number Analysis</h3>
            <div className="space-y-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Full Name *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile Number to Analyze *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (for report delivery) *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
                <button onClick={handleBuy} disabled={loading} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">
                  {loading ? 'Processing...' : 'Pay ₹199'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
