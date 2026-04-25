'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import WhatsAppButton from '../../../components/common/WhatsAppButton';
import { motion } from 'framer-motion';
import {
  MessageCircle, CreditCard, Smartphone, Shield,
  Clock, Award, CheckCircle, Copy, ArrowRight, Phone,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function BookingContent() {
  const params = useSearchParams();
  const name = params.get('name') || 'Valued Customer';
  const phone = params.get('phone') || '';
  const refParam = params.get('ref') || '';
  const [bookingRef] = useState(() =>
    refParam || `VA${Date.now().toString().slice(-8).toUpperCase()}`
  );
  const [copied, setCopied] = useState(false);

  const isConfirmed = !!refParam;

  const waMsg = `🙏 Namaste Dr. PPS!\n\nI want to confirm my Vastu consultation booking.\n\nName: ${name}\nPhone: ${phone}\nRef: ${bookingRef}\n\nPlease confirm my appointment @ ₹11.`;
  const waUrl = `https://wa.me/919999999999?text=${encodeURIComponent(waMsg)}`;

  const copyRef = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(bookingRef).then(() => {
      setCopied(true);
      toast.success('Reference copied!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #FFFDF7 0%, #FFF8EE 50%, #FFFAF2 100%)' }}
    >
      <div className="max-w-xl mx-auto px-4 py-10 sm:py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div
            className="w-20 h-20 rounded-full overflow-hidden border-4 mx-auto mb-5"
            style={{ borderColor: 'rgba(212,160,23,0.45)', boxShadow: '0 0 32px rgba(212,160,23,0.22)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Vastu Arya" className="w-full h-full object-cover" />
          </div>

          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <CheckCircle size={15} />
            {isConfirmed ? 'Payment Confirmed! Booking Active' : 'Booking Request Received'}
          </div>

          <h1
            className="font-display text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: '#1A0A00' }}
          >
            Namaste, {name}! 🙏
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            {isConfirmed
              ? 'Your appointment with Dr. PPS is confirmed. We will contact you shortly.'
              : 'Your consultation request has been received. Complete the booking below.'}
          </p>
        </motion.div>

        {/* Booking Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm mb-5 text-center"
          style={{ border: '1px solid rgba(212,160,23,0.25)' }}
        >
          <p className="text-xs text-gray-400 mb-1 tracking-wider uppercase">Booking Reference</p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono font-bold text-2xl" style={{ color: '#FF6B00' }}>
              {bookingRef}
            </span>
            <button
              onClick={copyRef}
              className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
              title="Copy reference"
            >
              <Copy size={15} className={copied ? 'text-green-500' : 'text-gray-400'} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Save this reference for tracking</p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3 mb-5"
        >
          {[
            { icon: Shield, label: '100% Secure', sub: 'Encrypted' },
            { icon: Clock, label: '24hr Response', sub: 'Dr. PPS calls you' },
            { icon: Award, label: 'IVAF Certified', sub: 'Verified expert' },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 text-center shadow-sm"
              style={{ border: '1px solid rgba(212,160,23,0.18)' }}
            >
              <t.icon size={18} className="mx-auto mb-1" style={{ color: '#D4A017' }} />
              <p className="text-xs font-semibold" style={{ color: '#1A0A00' }}>{t.label}</p>
              <p className="text-xs text-gray-400">{t.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Payment / Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-5"
          style={{ border: '1px solid rgba(212,160,23,0.22)' }}
        >
          <h2 className="font-display font-bold text-lg mb-0.5" style={{ color: '#1A0A00' }}>
            {isConfirmed ? 'Connect with Dr. PPS' : 'Complete Your Booking — Only ₹11'}
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            {isConfirmed
              ? 'Reach out on WhatsApp for your personalised consultation.'
              : 'Choose your preferred method to confirm and pay ₹11.'}
          </p>

          {/* WhatsApp - Primary */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full p-4 rounded-xl mb-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: 'white' }}
          >
            <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle size={22} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-base">Book via WhatsApp</p>
              <p className="text-sm opacity-90">Connect with Dr. PPS instantly — fastest & easiest</p>
            </div>
            <span className="text-xs bg-white/25 px-2.5 py-1 rounded-full font-bold flex-shrink-0">
              RECOMMENDED
            </span>
          </a>

          {/* UPI */}
          <div
            className="flex items-start gap-4 p-4 rounded-xl mb-3"
            style={{ background: '#FFF8EE', border: '1px solid rgba(255,107,0,0.2)' }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(255,107,0,0.1)' }}
            >
              <Smartphone size={20} style={{ color: '#FF6B00' }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm mb-0.5" style={{ color: '#1A0A00' }}>Pay ₹11 via UPI</p>
              <p className="text-xs text-gray-500 mb-2">
                Send ₹11 to the UPI ID below, then WhatsApp the payment screenshot.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <code
                  className="text-xs bg-white px-3 py-1.5 rounded-lg border font-mono font-semibold"
                  style={{ color: '#FF6B00', borderColor: 'rgba(255,107,0,0.25)' }}
                >
                  vastuarya@upi
                </code>
                <span className="text-xs text-gray-400">→ then send screenshot on WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Card (coming soon) */}
          <div
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: '#F5F5FF', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(99,102,241,0.1)' }}
            >
              <CreditCard size={20} style={{ color: '#6366F1' }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm mb-0.5" style={{ color: '#1A0A00' }}>Card / Net Banking</p>
              <p className="text-xs text-gray-500">Secure online payment gateway</p>
              <p className="text-xs mt-1 font-medium" style={{ color: '#6366F1' }}>
                ⚡ Activating shortly — use WhatsApp or UPI for now
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-5 shadow-sm mb-6"
          style={{ border: '1px solid rgba(212,160,23,0.18)' }}
        >
          <h3 className="font-semibold text-sm mb-3" style={{ color: '#5C3D1E' }}>
            What happens next?
          </h3>
          {[
            "Dr. PPS's team will contact you within 24 hours on your registered phone.",
            'You\'ll receive personalised Vastu guidance directly on WhatsApp.',
            '45,000+ clients have trusted Dr. PPS — 100% satisfaction guaranteed.',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5 mb-2.5 last:mb-0">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-white"
                style={{ background: '#FF6B00' }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-gray-600 leading-snug">{step}</p>
            </div>
          ))}
        </motion.div>

        {/* Direct Call Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between p-4 rounded-2xl mb-8"
          style={{ background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.15)' }}
        >
          <div className="flex items-center gap-3">
            <Phone size={18} style={{ color: '#FF6B00' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1A0A00' }}>Prefer a call?</p>
              <p className="text-xs text-gray-500">Our team is available Mon–Sat, 9 AM – 7 PM</p>
            </div>
          </div>
          <a
            href="tel:+919999999999"
            className="text-sm font-bold px-4 py-2 rounded-xl text-white flex-shrink-0"
            style={{ background: '#FF6B00' }}
          >
            Call Us
          </a>
        </motion.div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            style={{ color: '#FF6B00' }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: '#FFFDF7' }}
          >
            <div className="text-center">
              <div className="text-5xl mb-3 animate-spin">🕉️</div>
              <p className="text-gray-500 text-sm">Loading your booking...</p>
            </div>
          </div>
        }
      >
        <BookingContent />
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
