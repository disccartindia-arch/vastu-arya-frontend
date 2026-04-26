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
import { CheckCircle, Phone, X } from 'lucide-react';
import toast from 'react-hot-toast';

const included = [
  { icon: '🎯', title: 'Brahm Bindu Analysis', desc: 'Centre of Gravity (CG) identification of your space for optimal energy flow' },
  { icon: '🌀', title: 'Shakti Chakra Placement', desc: 'Strategic placement for maximum positive energy in your home or office' },
  { icon: '🏠', title: 'Basic Vastu Analysis', desc: 'Ideal placement: locker, entrance, kitchen, toilet, office desk, AC, mirror, study table' },
  { icon: '⚡', title: 'Marma Analysis', desc: 'Critical energy points and intersections of energy lines — vital for health & wealth' },
  { icon: '🗺️', title: '16 Zone Complete Analysis', desc: 'All 16 Vastu zones analyzed with sq.ft breakdown and percentage allocation' },
  { icon: '🙏', title: 'Devta Energy Fields', desc: 'Brahm Sthan, 8 Devta, and complete 32 Devta energy field mapping' },
  { icon: '📐', title: 'Advance Energy Mapping', desc: 'Detailed energy field analysis with recommendations for corrections' },
  { icon: '🏗️', title: 'Design Recommendations', desc: 'New house design suggestions and custom factory/office layout designs' },
];

export default function VastuCheckPage() {
  const { lang } = useUIStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'', propertyType:'home' });
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (!form.name || !form.phone) return toast.error('Name and phone are required');
    setLoading(true);
    await initiateRazorpayPayment({
      amount: 5100, name: form.name, phone: form.phone, email: form.email,
      description: 'Vastu Check & Assistant Service',
      type: 'service',
      orderData: { name:form.name, phone:form.phone, email:form.email, serviceName:'Vastu Check & Assistant', amount:5100, formData:form },
      onSuccess: () => { setLoading(false); toast.success('🎉 Booking confirmed! Dr. PPS Tomar will contact you within 24 hours.'); setShowForm(false); },
      onFailure: () => setLoading(false),
    });
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-dark-gradient py-20 relative overflow-hidden">
          <div className="absolute inset-0 mandala-bg opacity-10"/>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-red-500/20 text-red-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">🔥 90% OFF — Limited Period</span>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Complete Vastu Check & Assistant</h1>
                <p className="text-gray-300 text-lg mb-4">India's most comprehensive Vastu analysis by IVAF Certified Dr. PPS Tomar. 8+ specialized services in one package.</p>
                <PriceDisplay original={51000} offer={5100} size="lg" />
                <p className="text-yellow-400 text-sm mt-1 mb-6">⚡ Save ₹45,900 — Offer ends soon!</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowForm(true)} className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-orange-lg">🏠 Book Vastu Check @ ₹5,100</button>
                </div>
              </div>
              <div className="hidden lg:flex flex-col gap-3">
                {['IVAF Certified Expert','Detailed Report in 48-72 Hours','Complete Energy Analysis','Actionable Recommendations'].map((f,i)=>(
                  <div key={i} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                    <CheckCircle size={18} className="text-green-400 flex-shrink-0"/>
                    <span className="text-white text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-cream">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold text-text-dark text-center mb-10">What's Included in This Package</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {included.map((item, i) => (
                <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}} className="bg-white p-5 rounded-2xl border border-orange-100 hover:shadow-orange transition-all flex gap-4">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div><h3 className="font-semibold text-text-dark mb-1">{item.title}</h3><p className="text-text-light text-sm">{item.desc}</p></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-saffron-gradient text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Transform Your Space Today</h2>
          <PriceDisplay original={51000} offer={5100} size="lg" />
          <button onClick={() => setShowForm(true)} className="mt-4 bg-white text-primary hover:bg-cream px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg">🏠 Book Complete Vastu Check</button>
        </section>
      </main>
      <Footer />
      <AppointmentPopup />
      <CartDrawer />
      <WhatsAppButton />

      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4"><h3 className="font-display text-xl font-bold">🏠 Vastu Check Booking</h3><button onClick={()=>setShowForm(false)}><X size={18} className="text-gray-400"/></button></div>
            <div className="space-y-3">
              {[['name','Full Name *','text'],['phone','Phone Number *','tel'],['email','Email Address','email'],['address','Property Address','text']].map(([k,p,t])=>(
                <input key={k} type={t} value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={p} className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm"/>
              ))}
              <select value={form.propertyType} onChange={e=>setForm({...form,propertyType:e.target.value})} className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm">
                <option value="home">🏠 Home</option>
                <option value="office">🏢 Office</option>
                <option value="factory">🏭 Factory</option>
                <option value="plot">🏗️ Plot/Under Construction</option>
              </select>
              <div className="flex gap-3">
                <button onClick={()=>setShowForm(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm">Cancel</button>
                <button onClick={handleBuy} disabled={loading} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">{loading?'Processing...':'Pay ₹5,100'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
