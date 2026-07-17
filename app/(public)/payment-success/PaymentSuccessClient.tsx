'use client';
/**
 * app/(public)/payment-success/PaymentSuccessClient.tsx
 * Order-confirmation experience (AstroTalk-style flow, own UI).
 * Auto-fetches full booking / order data via accountAPI when the URL
 * has bookingId or orderId — so the page shows Customer Name,
 * Transaction ID, Payment Status, Booking Status, Expected
 * Confirmation Time WITHOUT the caller needing to pass everything in
 * the URL. Falls back to URL params for guest checkouts.
 */
export const dynamic = 'force-dynamic';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import PaymentTimeline, { PaymentTimelineStep } from '../../../components/payment/PaymentTimeline';
import Invoice from '../../../components/invoice/Invoice';
import { accountAPI } from '../../../lib/accountAPI';
import { CheckCircle, ShoppingBag, Calendar, Copy, MessageCircle, Download, MapPin, FileText, Sparkles, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface FetchedBooking {
  bookingId: string; name: string; serviceName: string; amount: number;
  paymentStatus: string; bookingStatus: string; paymentId?: string;
  email?: string | null; phone?: string | null; createdAt?: string;
}
interface FetchedOrder {
  orderId: string; customerInfo: { name: string; email: string; phone: string; address?: string; city?: string; pincode?: string };
  items: { name: string; qty: number; price: number }[]; totalAmount: number; status: string;
  paymentId?: string; paymentMethod?: string; createdAt?: string;
}

const NICE = (s?: string) => (s || '').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());

function SuccessContent() {
  const params = useSearchParams();
  const orderId     = params.get('orderId')   || '';
  const bookingId   = params.get('bookingId') || '';
  const refParam    = params.get('ref')       || orderId || bookingId;
  const amountParam = params.get('amount')    || '';
  const service     = params.get('service')   || '';

  const [booking, setBooking] = useState<FetchedBooking | null>(null);
  const [order,   setOrder]   = useState<FetchedOrder   | null>(null);
  const [now]                 = useState(() => new Date().toISOString());
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (bookingId) accountAPI.getBookingDetail(bookingId).then(r => setBooking(r.data.data)).catch(() => {});
    if (orderId)   accountAPI.getOrderDetail(orderId).then(r => setOrder(r.data.data)).catch(() => {});
  }, [bookingId, orderId]);

  // Unified display data — prefer live-fetched, fall back to URL params.
  const display = useMemo(() => {
    if (booking) return {
      kind: 'booking' as const,
      customerName: booking.name,
      email: booking.email,
      phone: booking.phone,
      service: booking.serviceName,
      amount: booking.amount,
      transactionId: booking.paymentId,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      reference: booking.bookingId,
      timeline: [
        { key: 'pending',        label: 'Pending',         status: 'done' },
        { key: 'payment',        label: 'Payment Received', status: (booking.paymentStatus === 'verified' || booking.paymentStatus === 'refunded') ? 'done' : 'active' },
        { key: 'confirmed',      label: 'Confirmed',       status: booking.bookingStatus === 'confirmed' || ['consultation_scheduled','in_progress','completed'].includes(booking.bookingStatus) ? 'done' : 'pending' },
        { key: 'scheduled',      label: 'Scheduled',       status: ['consultation_scheduled','in_progress','completed'].includes(booking.bookingStatus) ? 'done' : 'pending' },
        { key: 'completed',      label: 'Completed',       status: booking.bookingStatus === 'completed' ? 'done' : 'pending' },
      ] as PaymentTimelineStep[],
    };
    if (order) return {
      kind: 'order' as const,
      customerName: order.customerInfo?.name,
      email: order.customerInfo?.email,
      phone: order.customerInfo?.phone,
      service: order.items?.[0]?.name + (order.items?.length > 1 ? ` +${order.items.length - 1} more` : ''),
      amount: order.totalAmount,
      transactionId: order.paymentId,
      paymentStatus: order.status,
      bookingStatus: order.status,
      reference: order.orderId,
      timeline: [
        { key: 'pending',   label: 'Pending',   status: 'done' },
        { key: 'packed',    label: 'Packed',    status: ['processing','shipped','delivered'].includes(order.status) ? 'done' : 'active' },
        { key: 'shipped',   label: 'Shipped',   status: ['shipped','delivered'].includes(order.status) ? 'done' : 'pending' },
        { key: 'delivered', label: 'Delivered', status: order.status === 'delivered' ? 'done' : 'pending' },
      ] as PaymentTimelineStep[],
    };
    // Guest / URL-only fallback
    return {
      kind: 'unknown' as const,
      customerName: '',
      email: null, phone: null,
      service, amount: amountParam ? Number(amountParam) : 0,
      transactionId: '', paymentStatus: 'verified', bookingStatus: 'confirmed',
      reference: refParam,
      timeline: [
        { key: 'pending',   label: 'Pending',          status: 'done' },
        { key: 'payment',   label: 'Payment Received', status: 'done' },
        { key: 'confirmed', label: 'Confirmed',        status: 'done' },
      ] as PaymentTimelineStep[],
    };
  }, [booking, order, service, amountParam, refParam]);

  const expectedCopy = display.kind === 'order'
    ? 'Packing usually starts within 24 hours. You will receive shipping updates via WhatsApp / email.'
    : 'Our team will reach out within 24 hours to schedule your consultation.';

  const copyRef = () => { if (display.reference) navigator.clipboard?.writeText(display.reference).then(() => toast.success('Reference copied')); };
  const copyTxn = () => { if (display.transactionId) navigator.clipboard?.writeText(display.transactionId).then(() => toast.success('Transaction ID copied')); };
  const download = () => { setPrinting(true); setTimeout(() => { window.print(); setPrinting(false); }, 60); };

  const invoiceItems = display.kind === 'order' && order
    ? order.items.map(i => ({ name: i.name, qty: i.qty, price: i.price }))
    : [{ name: display.service || 'Service', qty: 1, price: display.amount }];

  return (
    <main className="min-h-screen bg-cream py-10 sm:py-14 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-orange p-6 sm:p-8" style={{ border: '1px solid rgba(212,160,23,0.15)' }}
        >
          {/* Animated check */}
          <div className="relative flex justify-center mb-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.55, times: [0, 0.6, 1] }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center relative z-10">
              <CheckCircle size={38} className="text-green-500" />
            </motion.div>
            {[...Array(8)].map((_, i) => (
              <motion.span key={i} aria-hidden
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 1.8] }}
                transition={{ duration: 0.8, delay: 0.2, times: [0, 0.4, 1] }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary"
                style={{ transform: `translate(-50%,-50%) rotate(${i * 45}deg) translateY(-42px)` }}
              />
            ))}
          </div>

          <div className="text-center mb-6">
            <h1 data-testid="payment-success-heading" className="font-display text-2xl sm:text-3xl font-bold text-text-dark mb-1">
              {display.kind === 'order' ? 'Order Confirmed' : 'Booking Confirmed'}
            </h1>
            <p className="text-text-light text-sm">Thank you {display.customerName ? `${display.customerName.split(' ')[0]}, ` : ''}your payment was successful.</p>
          </div>

          {/* Meta grid */}
          <div className="bg-orange-50/60 rounded-2xl p-4 mb-5 border border-orange-100 space-y-2.5 text-sm">
            {display.customerName && (
              <Row icon={<User size={13} />} label="Customer" value={<span className="font-semibold text-gray-800">{display.customerName}</span>} testid="row-customer" />
            )}
            <Row label={display.kind === 'order' ? 'Order ID' : 'Booking ID'}
              value={<button data-testid="copy-ref-btn" onClick={copyRef} className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-gray-800 hover:text-primary transition-colors">{display.reference || '-'} <Copy size={11} /></button>} />
            {display.transactionId && (
              <Row label="Transaction ID"
                value={<button data-testid="copy-txn-btn" onClick={copyTxn} className="inline-flex items-center gap-1.5 font-mono text-xs text-gray-600 hover:text-primary transition-colors max-w-[220px] truncate">{display.transactionId} <Copy size={11} /></button>} />
            )}
            {display.service && <Row label={display.kind === 'order' ? 'Product' : 'Service'} value={<span className="font-medium text-gray-800 text-right">{display.service}</span>} />}
            {display.amount > 0 && <Row label="Amount" value={<span className="font-bold text-primary">₹{display.amount}</span>} />}
            <Row label="Payment"
              value={<span data-testid="payment-status" className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">{NICE(display.paymentStatus) || 'Verified'}</span>} />
            <Row label={display.kind === 'order' ? 'Order Status' : 'Booking Status'}
              value={<span data-testid="booking-status" className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-primary">{NICE(display.bookingStatus) || 'Confirmed'}</span>} />
          </div>

          {/* Expected time card */}
          <div className="bg-white rounded-2xl p-3 mb-5 border border-orange-100 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0"><Clock size={16} className="text-primary" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">Expected Next Step</p>
              <p className="text-sm text-gray-700 leading-relaxed mt-0.5">{expectedCopy}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{display.kind === 'order' ? 'Order' : 'Booking'} Timeline</h2>
            <PaymentTimeline steps={display.timeline} />
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            {bookingId ? (
              <Link href={`/account/bookings/${bookingId}`} data-testid="track-booking-btn"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white text-sm hover:opacity-95 active:scale-[0.99] transition-all"
                style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9933)' }}>
                <Calendar size={16} /> Track Booking
              </Link>
            ) : orderId ? (
              <Link href={`/account/orders/${orderId}`} data-testid="track-order-btn"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white text-sm hover:opacity-95 active:scale-[0.99] transition-all"
                style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9933)' }}>
                <MapPin size={16} /> Track Order
              </Link>
            ) : (
              <Link href="/account" data-testid="go-account-btn"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white text-sm hover:opacity-95 active:scale-[0.99] transition-all"
                style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9933)' }}>
                <User size={16} /> Go to My Account
              </Link>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button onClick={download} data-testid="download-invoice-btn"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-orange-200 text-primary font-semibold text-sm hover:bg-orange-50 transition-colors">
                <FileText size={14} /> Download Invoice
              </button>
              <Link href="/services" data-testid="book-another-btn"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-orange-200 text-primary font-semibold text-sm hover:bg-orange-50 transition-colors">
                <Sparkles size={14} /> Book Another
              </Link>
            </div>
            <a href={`https://wa.me/919111036751?text=${encodeURIComponent(`🙏 Namaste! My payment is confirmed. Ref: ${display.reference || '-'}`)}`}
              target="_blank" rel="noopener noreferrer" data-testid="whatsapp-btn"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#25D366] text-white font-semibold text-sm hover:brightness-105 transition-all">
              <MessageCircle size={14} /> WhatsApp Support
            </a>
            {display.kind === 'order' ? (
              <Link href="/vastu-store" data-testid="continue-shopping-btn" className="block text-center text-xs text-gray-400 hover:text-primary transition-colors py-1">
                <ShoppingBag size={12} className="inline mr-1" /> Continue Shopping
              </Link>
            ) : null}
          </div>
        </motion.div>
      </div>

      {/* Off-screen printable invoice — print CSS shows only this on print */}
      {printing && (
        <div className="print-only fixed top-0 left-0 w-full">
          <Invoice
            invoiceNumber={display.kind === 'order' ? `INV-O-${display.reference}` : `INV-B-${display.reference}`}
            date={now}
            customerName={display.customerName || 'Customer'}
            customerEmail={display.email}
            customerPhone={display.phone}
            customerAddress={order?.customerInfo?.address ? `${order.customerInfo.address}, ${order.customerInfo.city || ''} ${order.customerInfo.pincode || ''}`.trim() : null}
            items={invoiceItems}
            subtotal={display.amount}
            total={display.amount}
            paymentId={display.transactionId}
            paymentMethod={order?.paymentMethod || 'razorpay'}
            paymentStatus={display.paymentStatus}
          />
        </div>
      )}
    </main>
  );
}

function Row({ icon, label, value, testid }: { icon?: React.ReactNode; label: string; value: React.ReactNode; testid?: string }) {
  return (
    <div className="flex justify-between items-center gap-4" data-testid={testid}>
      <span className="flex items-center gap-1.5 text-gray-500 text-xs">{icon}{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-spin">🕉️</div></div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
