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
import { CheckCircle, Video, Phone, Award, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VastuConsultancyPage() {
  const { lang } = useUIStore();
  const [showForm, setShowForm] = useState(false);
  const [payType, setPayType] = useState<'advance'|'full'>('advance');
  const [form, setForm] = useState({ name:'', phone:'', email:'' });
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!form.name || !form.phone) return toast.error('Fill all fields');
    setLoading(true);
    const amount = payType === 'advance' ? 1100 : 11000;
    await initiateRazorpayPayment({
      amount, name: form.name, phone: form.phone, email: form.email,
      description: `Vastu Consultancy by Dr. PPS Tomar - ${payType === 'advance' ? 'Advance' : 'Full Package'}`,
      type: 'service',
      orderData: { name:form.name, phone:form.phone, email:form.email, serviceName:'Vastu Consultancy by Dr. PPS Tomar', amount, formData:{payType} },
      onSuccess: () => { setLoading(false); toast.success('🎉 Confirmed! Dr. PPS Tomar will call you within 24 hours.'); setShowForm(false); },
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
                <span className="inline-block bg-gold/20 text-yellow-300 px-4 py-1.5 rounded-full text-sm font-semibold font-accent mb-4">🌟 Premium Consultation</span>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">One-on-One with Dr. PPS Tomar</h1>
                <p className="text-gray-300 text-lg mb-6">The most comprehensive Vastu & Astrology consultation. Dr. PPS Tomar personally connects with you via video or phone call.</p>
                <div className="space-y-3 mb-8">
                  {['Personal video/phone call with Dr. PPS Tomar','Complete Vastu analysis of your space','Astrology & gemology guidance included','Personalized remedies & solutions','Lifetime follow-up support'].map((f,i)=>(
                    <div key={i} className="flex items-center gap-3"><CheckCircle size={18} className="text-green-400 flex-shrink-0"/><span className="text-gray-200 text-sm">{f}</span></div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={()=>{setPayType('advance');setShowForm(true);}} className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-orange">
                    📞 Book Advance <br/><span className="font-normal text-sm opacity-90">Pay ₹1,100 Now</span>
                  </button>
                  <button onClick={()=>{setPayType('full');setShowForm(true);}} className="flex-1 bg-gold hover:bg-yellow-600 text-white px-6 py-4 rounded-2xl font-bold transition-all">
                    🌟 Full Package <br/><span className="font-normal text-sm opacity-90">Pay ₹11,000</span>
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="w-20 h-20 bg-saffron-gradient rounded-full flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-4">PPS</div>
                  <h3 className="text-white font-display text-xl font-bold text-center mb-2">Dr. PPS Tomar</h3>
                  <p className="text-primary text-sm text-center font-accent mb-4">IVAF Certified Vastu Expert</p>
                  {[{icon:Award, text:'International Vedic Astrology Federation (USA)'},{icon:Award, text:'Vastu Vadana Doctorate Degree'},{icon:Award, text:'Recognized in New Delhi'},{icon:Phone, text:'15+ Years of Expert Consultation'},{icon:Video, text:'1,000+ Video Consultations Done'}].map((c,i)=>(
                    <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/10 last:border-0">
                      <c.icon size={14} className="text-gold flex-shrink-0"/>
                      <span className="text-gray-300 text-xs">{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display text-3xl font-bold text-text-dark mb-3">Pricing Plans</h2>
            <p className="text-text-light mb-10">Book advance to secure your slot, pay the rest at consultation time.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 hover:border-primary transition-all shadow-sm">
                <div className="text-3xl mb-3">📞</div>
                <h3 className="font-display font-bold text-xl mb-1">Advance Booking</h3>
                <p className="text-text-light text-sm mb-4">Book your slot now, pay balance at consultation</p>
                <PriceDisplay original={1500} offer={1100} size="md" />
                <button onClick={()=>{setPayType('advance');setShowForm(true);}} className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-bold transition-all hover:bg-primary-dark">Book @ ₹1,100</button>
              </div>
              <div className="bg-white rounded-2xl p-6 border-2 border-gold hover:border-yellow-500 transition-all shadow-sm relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-gold text-white text-xs px-2 py-1 rounded-full font-bold">BEST VALUE</div>
                <div className="text-3xl mb-3">🌟</div>
                <h3 className="font-display font-bold text-xl mb-1">Full Package</h3>
                <p className="text-text-light text-sm mb-4">Complete access to all Dr. PPS Tomar services</p>
                <div className="text-3xl font-display font-bold text-primary">₹11,000</div>
                <button onClick={()=>{setPayType('full');setShowForm(true);}} className="w-full mt-4 bg-gold hover:bg-yellow-600 text-white py-3 rounded-xl font-bold transition-all">Get Full Package</button>
              </div>
            </div>
          </div>
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
              <h3 className="font-display text-xl font-bold">📞 {payType==='advance'?'Advance Booking (₹1,100)':'Full Package (₹11,000)'}</h3>
              <button onClick={()=>setShowForm(false)}><X size={18} className="text-gray-400"/></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your Full Name *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm"/>
              <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone Number *" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm"/>
              <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email Address" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm"/>
              <div className="flex gap-3">
                <button onClick={()=>setShowForm(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm">Cancel</button>
                <button onClick={handlePay} disabled={loading} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">{loading?'Processing...':payType==='advance'?'Pay ₹1,100':'Pay ₹11,000'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
