'use client';
import { useState } from 'react';
import { X, Phone, User } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { initiateRazorpayPayment } from '../../lib/razorpay';
import { getWhatsAppUrl } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AppointmentPopup() {
  const { showAppointmentPopup, setShowAppointmentPopup, lang } = useUIStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showAppointmentPopup) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return toast.error('Please fill all fields');
    if (!/^[6-9]\d{9}$/.test(phone)) return toast.error('Enter a valid 10-digit Indian mobile number');

    setLoading(true);
    await initiateRazorpayPayment({
      amount: 11,
      name,
      phone,
      description: 'Book Appointment with Dr. PPS',
      type: 'booking',
      orderData: { name, phone, serviceName: 'Book Appointment', amount: 11 },
      onSuccess: (data) => {
        setLoading(false);
        setShowAppointmentPopup(false);
        toast.success('🎉 Appointment booked! Connecting you on WhatsApp...');
        setTimeout(() => {
          const msg = `🙏 Namaste Dr. PPS!\n\nI have booked my appointment.\n\n📋 Booking ID: ${data.bookingId}\n👤 Name: ${name}\n📞 My Number: ${phone}\n\nPlease connect me at your earliest.\n\nDhanyawad 🙏`;
          window.open(getWhatsAppUrl('919999999999', msg), '_blank');
        }, 1500);
      },
      onFailure: () => setLoading(false),
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowAppointmentPopup(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-saffron-gradient p-6 text-center relative">
          <button onClick={() => setShowAppointmentPopup(false)} className="absolute top-3 right-3 text-white/80 hover:text-white">
            <X size={20} />
          </button>
          <div className="text-5xl mb-2">🕉️</div>
          <h2 className="font-display text-2xl font-bold text-white">
            {lang === 'en' ? 'Book Your Appointment' : 'अपॉइंटमेंट बुक करें'}
          </h2>
          <p className="text-white/90 text-sm mt-1">
            {lang === 'en' ? 'Connect with Dr. PPS on WhatsApp' : 'डॉ. PPS से WhatsApp पर जुड़ें'}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
            <span className="text-yellow-300">⚡</span>
            {lang === 'en' ? 'Only ₹11 — Limited Offer!' : 'केवल ₹11 — सीमित समय!'}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-mid mb-1.5">{lang === 'en' ? 'Your Name' : 'आपका नाम'} *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder={lang === 'en' ? 'Enter your full name' : 'पूरा नाम दर्ज करें'} className="w-full pl-9 pr-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-mid mb-1.5">{lang === 'en' ? 'Phone Number' : 'फोन नंबर'} *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} type="tel" maxLength={10} placeholder="10-digit mobile number" className="w-full pl-9 pr-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-orange">
            {loading ? '⏳ Processing...' : `📅 ${lang === 'en' ? 'Book @ ₹11' : '₹11 में बुक करें'}`}
          </button>
          <p className="text-center text-xs text-gray-400">
            🔒 {lang === 'en' ? 'Secure payment via Razorpay. You will be connected on WhatsApp.' : 'Razorpay द्वारा सुरक्षित भुगतान।'}
          </p>
        </form>
      </div>
    </div>
  );
}
