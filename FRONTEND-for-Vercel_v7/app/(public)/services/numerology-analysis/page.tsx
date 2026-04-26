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
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const features = [
  { icon: '🔢', title: 'Lucky Numbers & Colors', desc: 'Discover your personal lucky numbers, colors, and days for maximum success' },
  { icon: '📊', title: 'Numerology Grid Analysis', desc: 'Complete grid showing your present and missing numbers with their impact' },
  { icon: '🪐', title: 'Planet Compatibility', desc: 'Which planets govern your numbers and how to harness their energy' },
  { icon: '💼', title: 'Career Guidance', desc: 'Best professions, business directions, and lucky partners for you' },
  { icon: '❤️', title: 'Relationship Compatibility', desc: 'Compatible numbers for marriage, friendship, and business partners' },
  { icon: '🔧', title: 'Personalized Remedies', desc: 'Specific remedies to strengthen weak numbers and enhance positives' },
];

export default function NumerologyAnalysisPage() {
  const { lang } = useUIStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', birthdate: '', birthplace: '', gender: 'male', email: '' });
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (!form.name || !form.birthdate || !form.birthplace) return toast.error('Please fill all required fields');
    setLoading(true);
    await initiateRazorpayPayment({
      amount: 499,
      name: form.name,
      email: form.email,
      phone: '7000343804',
      description: 'Numerology Analysis Report',
      type: 'service',
      orderData: { name: form.name, email: form.email, phone: '7000343804', serviceName: 'Numerology Analysis', amount: 499, formData: form },
      onSuccess: () => { setLoading(false); toast.success('🎉 Booking confirmed! You\'ll receive your report within 48 hours.'); setShowForm(false); },
      onFailure: () => setLoading(false),
    });
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-dark-gradient py-20 relative overflow-hidden">
          <div className="absolute inset-0 mandala-bg opacity-10" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">🔢 Numerology Service</span>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Unlock Your Numerological Blueprint</h1>
                <p className="text-gray-300 text-lg mb-6">Get a comprehensive numerological profile by IVAF Certified Dr. PPS Tomar revealing your lucky numbers, planetary influences, and precise remedies.</p>
                <PriceDisplay original={999} offer={499} size="lg" />
                <p className="text-green-400 text-sm mt-2 mb-6">⚡ 50% OFF — Limited Time Offer!</p>
                <button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-orange-lg">
                  🔢 Get My Analysis @ ₹499
                </button>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="text-9xl animate-float">🔢</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-cream">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold text-text-dark text-center mb-10">What Your Report Includes</h2>
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

        <section className="py-16 bg-saffron-gradient text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Know Your Numbers?</h2>
          <PriceDisplay original={999} offer={499} size="lg" />
          <button onClick={() => setShowForm(true)} className="mt-4 bg-white text-primary hover:bg-cream px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg">
            🔢 Get Numerology Analysis @ ₹499
          </button>
        </section>
      </main>
      <Footer />
      <AppointmentPopup />
      <CartDrawer />
      <WhatsAppButton />

      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold">🔢 Numerology Analysis</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <input type="date" value={form.birthdate} onChange={e => setForm({ ...form, birthdate: e.target.value })} className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <input value={form.birthplace} onChange={e => setForm({ ...form, birthplace: e.target.value })} placeholder="Birthplace (City) *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email (for report delivery) *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
                <button onClick={handleBuy} disabled={loading} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">
                  {loading ? 'Processing...' : 'Pay ₹499'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
