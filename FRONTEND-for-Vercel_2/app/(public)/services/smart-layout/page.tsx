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
import { CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const features = [
  { icon: '📐', title: 'Precise Scale Floor Plan', desc: 'Exact measurements with proper scale — ready to use for construction' },
  { icon: '🚪', title: 'Door & Window Placement', desc: 'Vastu-compliant placement for all openings to maximize positive energy' },
  { icon: '🛋️', title: 'Furniture Layout Map', desc: 'Exact placement for all furniture — bed, desk, sofa, dining table' },
  { icon: '🍳', title: 'Kitchen & Utility Zones', desc: 'Optimal placement for kitchen, bathroom, store room per Vastu' },
  { icon: '🏢', title: 'Office/Factory Plans', desc: 'Commercial layouts for maximum productivity and prosperity' },
  { icon: '📋', title: 'Detailed Report', desc: 'Complete explanation of every placement decision with Vastu logic' },
];

export default function SmartLayoutPage() {
  const { lang } = useUIStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', plotSize: '', floors: '1', propertyType: 'home' });
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (!form.name || !form.phone || !form.plotSize) return toast.error('Please fill all required fields');
    setLoading(true);
    await initiateRazorpayPayment({
      amount: 1100, name: form.name, phone: form.phone, email: form.email,
      description: 'Smart Layout Plan by Dr. PPS',
      type: 'service',
      orderData: { name: form.name, phone: form.phone, email: form.email, serviceName: 'Smart Layout Plan', amount: 1100, formData: form },
      onSuccess: () => { setLoading(false); toast.success('🎉 Confirmed! Dr. PPS will deliver your layout within 72 hours.'); setShowForm(false); },
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
                <span className="inline-block bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">🏗️ 78% OFF — Limited Time</span>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Professional Smart Layout Plan</h1>
                <p className="text-gray-300 text-lg mb-4">Get a complete Vastu-compliant floor plan by IVAF Certified Dr. PPS — for your home, flat, office, or factory plot.</p>
                <PriceDisplay original={5100} offer={1100} size="lg" />
                <p className="text-yellow-400 text-sm mt-1 mb-6">⚡ Save ₹4,000 — Offer ends soon!</p>
                <div className="space-y-2 mb-6">
                  {['IVAF Certified Expert', 'Delivery in 48-72 Hours', 'Complete Vastu Compliant', 'PDF + CAD format'].map((f, i) => (
                    <div key={i} className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /><span className="text-gray-200 text-sm">{f}</span></div>
                  ))}
                </div>
                <button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-orange-lg">
                  📐 Get My Layout @ ₹1,100
                </button>
              </div>
              <div className="hidden lg:flex items-center justify-center"><div className="text-9xl animate-float">📐</div></div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-cream">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold text-text-dark text-center mb-10">What's Included in Your Layout</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-orange-100">
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <h3 className="font-semibold text-text-dark mb-1">{f.title}</h3>
                  <p className="text-text-light text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-saffron-gradient text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Get Your Vastu Layout Today</h2>
          <PriceDisplay original={5100} offer={1100} size="lg" />
          <button onClick={() => setShowForm(true)} className="mt-4 bg-white text-primary hover:bg-cream px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg">📐 Book Layout @ ₹1,100</button>
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
              <h3 className="font-display text-xl font-bold">📐 Smart Layout Plan</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email Address" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <input value={form.plotSize} onChange={e => setForm({ ...form, plotSize: e.target.value })} placeholder="Plot Size (e.g. 30x40 feet) *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
              <select value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })} className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm">
                <option value="home">🏠 Home / Residential</option>
                <option value="office">🏢 Office / Commercial</option>
                <option value="factory">🏭 Factory / Industrial</option>
                <option value="flat">🏗️ Flat / Apartment</option>
              </select>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm">Cancel</button>
                <button onClick={handleBuy} disabled={loading} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">
                  {loading ? 'Processing...' : 'Pay ₹1,100'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
