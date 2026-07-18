'use client';
/**
 * app/account/bookings/[bookingId]/page.tsx
 * Full booking detail with:
 *  - Booking ID, Transaction ID, Service, Payment Status, Booking
 *    Status, Consultation Status, Date, Time, Meeting Mode, Join Link,
 *    Support / Contact Consultant, Refresh Status, Last Updated
 *  - Refresh button re-fetches without page reload
 *  - Consultation card (scheduled → details + countdown + join;
 *    unscheduled → notify-later message)
 *  - Verified vs unverified conditional support number
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { accountAPI } from '../../../../lib/accountAPI';
import { formatPrice } from '../../../../lib/utils';
import { formatIST, formatInstantIST } from '../../../../lib/datetime';
import { LoadingSkeleton, ErrorState } from '../../../../components/account/AccountStates';
import PaymentTimeline, { PaymentTimelineStep, StepStatus } from '../../../../components/payment/PaymentTimeline';
import { Copy, ExternalLink, Calendar, Video, RefreshCw, Clock, MessageCircle, Phone, Link2, MapPin, Mail, Bell, Send, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookingDetail {
  bookingId: string; name: string; serviceName: string; amount: number;
  paymentStatus: string; bookingStatus: string; createdAt: string; updatedAt: string;
  paymentId?: string;
  consultationDate?: string;   // ISO date/time — IST wall-clock
  consultationTime?: string;   // HH:MM — IST wall-clock
  meetingType?: string;        // 'google_meet' | 'whatsapp' | 'phone' | 'offline'
  meetingMode?: string;        // legacy fallback
  meetingLink?: string;
  meetingAddress?: string;
  customerNote?: string;
  formData?: Record<string, any>;
  // Optional per-channel delivery flags. Rendered ONLY when the backend
  // returns them; nothing is faked. See Backend Dependencies in project docs.
  emailSent?: boolean;
  smsSent?: boolean;
  pushSent?: boolean;
  whatsappSent?: boolean;
  timeline: { field: string; newValue: string; timestamp: string }[];
}

const PUBLIC_SUPPORT_WA = '919111036751';   // Support (all public + unverified bookings)
const CONSULTANT_WA     = '917000343804';   // Dr PPS Tomar — shown ONLY when payment is verified

const PAYMENT_ORDER = ['pending', 'submitted', 'verified'];
const BOOKING_ORDER = ['pending_payment', 'payment_submitted', 'confirmed', 'consultation_scheduled', 'in_progress', 'completed'];
function statusForStep(currentIdx: number, stepIdx: number, isFailedTerminal = false): StepStatus {
  if (isFailedTerminal) return 'failed';
  if (currentIdx > stepIdx) return 'done';
  if (currentIdx === stepIdx) return 'active';
  return 'pending';
}
const NICE = (s?: string) => (s || '').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());

function useCountdown(target: Date | null) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  if (!target) return null;
  const diff = target.getTime() - now;
  if (diff <= 0) return 'Starting now';
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export default function BookingDetailPage() {
  const { bookingId } = useParams();
  const [data, setData] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const lastSeenUpdatedAt = useRef<string | null>(null);

  const load = async (mode: 'full' | 'refresh' | 'silent' = 'full') => {
    if (mode === 'full') setLoading(true);
    else if (mode === 'refresh') setRefreshing(true);
    setError('');
    try {
      const r = await accountAPI.getBookingDetail(bookingId as string);
      const next: BookingDetail = r.data.data;
      // Poll-driven live updates: if the server's updatedAt changed since the
      // last silent poll, notify the customer visually. This is the polling
      // fallback for real-time updates until the backend exposes a SSE/WS
      // endpoint. Reuses the existing GET endpoint — no new API needed.
      if (
        mode === 'silent' &&
        lastSeenUpdatedAt.current &&
        next?.updatedAt &&
        next.updatedAt !== lastSeenUpdatedAt.current
      ) {
        toast.success('Booking updated — showing latest status.');
      }
      lastSeenUpdatedAt.current = next?.updatedAt || lastSeenUpdatedAt.current;
      setData(next);
    } catch (e: any) {
      if (mode !== 'silent') {
        setError(e?.response?.data?.message || 'Could not load this booking.');
      }
    } finally {
      if (mode === 'full') setLoading(false);
      else if (mode === 'refresh') setRefreshing(false);
    }
  };
  useEffect(() => { if (bookingId) load('full'); /* eslint-disable-next-line */ }, [bookingId]);

  // Live-updates polling fallback (backend has no SSE/WS yet). Polls every
  // 30 s while the tab is visible; pauses in background to save battery.
  useEffect(() => {
    if (!bookingId) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (timer) return;
      timer = setInterval(() => {
        if (document.visibilityState === 'visible') load('silent');
      }, 30_000);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    start();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') { load('silent'); start(); }
      else stop();
    });
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  // Consultation info — check top-level fields first (backend contract),
  // then formData nested (legacy). Never fabricate data. All date/time
  // display uses lib/datetime.formatIST which treats consultationDate +
  // consultationTime as IST wall-clock (Asia/Kolkata).
  const consultation = useMemo(() => {
    if (!data) return { scheduled: false } as any;
    const fd = data.formData || {};
    const dateRaw = data.consultationDate || fd.consultationDate || fd.consultation_date;
    const timeRaw = data.consultationTime || fd.consultationTime || fd.consultation_time;
    const typeRaw = (data as any).meetingType || data.meetingMode || fd.meetingType || fd.meetingMode || fd.meeting_mode;
    const link    = data.meetingLink     || fd.meetingLink     || fd.meeting_link;
    const address = data.meetingAddress  || fd.meetingAddress  || fd.meeting_address;
    const customerNote = data.customerNote || fd.customerNote || fd.customer_note;
    const TYPE_LABELS: Record<string, string> = {
      google_meet: 'Google Meet',
      whatsapp: 'WhatsApp Call',
      phone: 'Phone Call',
      offline: 'Offline (in-person)',
    };
    const mode = typeRaw ? (TYPE_LABELS[typeRaw as string] || typeRaw) : undefined;
    const scheduled = !!(dateRaw && (data.bookingStatus === 'consultation_scheduled' || data.bookingStatus === 'in_progress'));
    const ist = formatIST(dateRaw as string | undefined, timeRaw as string | undefined);
    return {
      scheduled,
      dt: ist.dt,
      dateRaw,
      timeRaw,
      mode,
      link,
      address,
      customerNote,
      istDate: ist.date,
      istTime: ist.time,
      istCombined: ist.combined,
    };
  }, [data]);
  const countdown = useCountdown(consultation.scheduled ? consultation.dt : null);

  const timelineSteps: PaymentTimelineStep[] = useMemo(() => {
    if (!data) return [];
    const paymentIdx = PAYMENT_ORDER.indexOf(data.paymentStatus);
    const rejected  = data.paymentStatus === 'rejected';
    const refunded  = data.paymentStatus === 'refunded';
    const bookingIdx = BOOKING_ORDER.indexOf(data.bookingStatus);
    const cancelled = data.bookingStatus === 'cancelled';
    const findWhen = (field: 'paymentStatus' | 'bookingStatus', value: string) =>
      data.timeline.find(t => t.field === field && t.newValue === value)?.timestamp;
    return [
      { key: 'pending',         label: 'Pending',          status: statusForStep(paymentIdx, 0, refunded), timestamp: data.createdAt },
      { key: 'payment-received',label: 'Payment Received', status: rejected ? 'failed' : (paymentIdx >= 2 ? 'done' : paymentIdx === 1 ? 'active' : 'pending'), timestamp: findWhen('paymentStatus', 'verified') || findWhen('paymentStatus', 'submitted') },
      { key: 'confirmed',       label: 'Confirmed',        status: cancelled ? 'failed' : statusForStep(bookingIdx, 2), timestamp: findWhen('bookingStatus', 'confirmed') },
      { key: 'scheduled',       label: 'Scheduled',        status: cancelled ? 'skipped' : statusForStep(bookingIdx, 3), timestamp: findWhen('bookingStatus', 'consultation_scheduled') },
      { key: 'completed',       label: 'Completed',        status: cancelled ? 'failed'  : statusForStep(bookingIdx, 5), timestamp: findWhen('bookingStatus', 'completed') },
    ];
  }, [data]);

  if (loading) return <LoadingSkeleton rows={3} />;
  if (error || !data) return <ErrorState message={error} onRetry={() => load('full')} />;

  const isVerified = data.paymentStatus === 'verified';
  const supportWA  = isVerified ? CONSULTANT_WA : PUBLIC_SUPPORT_WA;
  const supportLbl = isVerified ? 'Contact Your Consultant' : 'Contact Support';
  const waMsg = encodeURIComponent(
    isVerified
      ? `Namaste 🙏 I have a question about my confirmed booking ${data.bookingId} (${data.serviceName}).`
      : `Hi, I need help with my booking ${data.bookingId}.`
  );

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Header + IDs */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden" style={{ border: '1px solid rgba(212,160,23,0.22)' }}>
        <div className="bg-orange-50 px-4 sm:px-5 py-3 flex items-center justify-between gap-3" style={{ borderBottom: '1px solid rgba(255,107,0,0.15)' }}>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Booking ID</p>
            <p className="font-mono font-bold text-sm text-primary truncate">{data.bookingId}</p>
          </div>
          <button data-testid="refresh-btn" onClick={() => load('refresh')} disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-200 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors disabled:opacity-60 whitespace-nowrap">
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing…' : 'Refresh Status'}
          </button>
        </div>

        <div className="p-4 sm:p-5 grid grid-cols-2 gap-3 text-sm">
          <Field label="Service" value={<span className="font-semibold text-gray-800 break-words">{data.serviceName}</span>} />
          <Field label="Amount"  value={<span className="font-bold text-primary">{formatPrice(data.amount)}</span>} />
          <Field label="Payment Status" value={<span data-testid="payment-status" className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${isVerified ? 'bg-green-100 text-green-700' : data.paymentStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{NICE(data.paymentStatus)}</span>} />
          <Field label="Booking Status" value={<span data-testid="booking-status" className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-primary">{NICE(data.bookingStatus)}</span>} />
          <Field label="Consultation" value={<span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${consultation.scheduled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{consultation.scheduled ? 'Scheduled' : 'Awaiting'}</span>} />
          {data.paymentId && (
            <Field label="Transaction ID" value={
              <button data-testid="copy-txn-btn"
                onClick={() => { navigator.clipboard?.writeText(data.paymentId as string); toast.success('Copied'); }}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-gray-700 hover:text-primary truncate max-w-[160px]">
                {data.paymentId} <Copy size={10} />
              </button>
            } />
          )}
        </div>
        <div className="px-4 sm:px-5 pb-3 flex items-center gap-1 text-[11px] text-gray-400"><Clock size={11} /> Last updated {formatInstantIST(data.updatedAt)}</div>
      </div>

      {/* Consultation card */}
      <div className="bg-white rounded-2xl border border-orange-100 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Video size={16} className="text-primary flex-shrink-0" />
          <h2 className="font-semibold text-gray-800 text-sm">Consultation</h2>
        </div>
        {consultation.scheduled ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {consultation.istDate && (
                <Field label="Date" value={<span data-testid="consultation-date" className="font-semibold text-gray-800">{consultation.istDate}</span>} />
              )}
              {consultation.istTime && (
                <Field label="Time (IST)" value={<span data-testid="consultation-time" className="font-semibold text-gray-800">{consultation.istTime}</span>} />
              )}
              {consultation.mode && (
                <Field label="Meeting Type" value={<span data-testid="meeting-type" className="font-semibold text-gray-800">{consultation.mode}</span>} />
              )}
            </div>
            <p className="text-[10px] text-gray-400 -mt-1" data-testid="tz-label">All times shown in India Standard Time (IST · Asia/Kolkata)</p>

            {consultation.customerNote && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-gray-700 leading-relaxed" data-testid="customer-note">
                <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">Note from your consultant</p>
                {consultation.customerNote}
              </div>
            )}

            {/* Notification-delivery indicators. Rendered ONLY for channels the
                backend actually reports on. `undefined` = channel not tracked
                by backend yet → hidden. `false` = attempted but failed → grey.
                `true` = delivered → primary. Never mocked. */}
            <NotificationChannels
              email={data.emailSent}
              sms={data.smsSent}
              push={data.pushSent}
              whatsapp={data.whatsappSent}
            />

            {countdown && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
                <Clock size={14} className="text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-800"><span className="font-semibold">Starts in:</span> {countdown}</p>
              </div>
            )}

            {consultation.link && (
              <a href={consultation.link} target="_blank" rel="noopener noreferrer" data-testid="join-link"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9933)' }}>
                <Link2 size={14} /> Join Meeting
              </a>
            )}
            {consultation.address && (
              <div className="flex items-start gap-2 text-xs text-gray-600 bg-orange-50 border border-orange-100 rounded-xl p-3">
                <MapPin size={13} className="mt-0.5 text-primary flex-shrink-0" />
                <span>{consultation.address}</span>
              </div>
            )}
            {isVerified && (
              <a href={`https://wa.me/${CONSULTANT_WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" data-testid="consultant-btn"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors">
                <Phone size={13} /> Contact Your Consultant
              </a>
            )}
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm text-gray-700 leading-relaxed" data-testid="consultation-awaiting-msg">
            Our team will notify you once your consultation time is confirmed.
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-orange-100 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3"><Calendar size={16} className="text-primary" /><h2 className="font-semibold text-gray-800 text-sm">Booking Timeline</h2></div>
        <PaymentTimeline steps={timelineSteps} testId="booking-timeline" />
      </div>

      {/* Status history */}
      {data.timeline?.length > 0 && (
        <div className="bg-white rounded-2xl border border-orange-100 p-4 sm:p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-2 text-sm">Status History</h2>
          <div className="space-y-1.5">
            {data.timeline.map((t, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-50 last:border-0 gap-3">
                <span className="text-gray-600 capitalize truncate">{t.field === 'paymentStatus' ? 'Payment' : 'Booking'} → {NICE(t.newValue)}</span>
                <span className="text-gray-400 flex-shrink-0">{formatInstantIST(t.timestamp, { withTime: true, withTz: false })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support / consultant CTA (bottom, always visible) */}
      <a href={`https://wa.me/${supportWA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" data-testid="support-btn"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm text-white bg-[#25D366] hover:brightness-105 transition-all">
        <MessageCircle size={15} /> {supportLbl}
      </a>

      <a href={`/status/${data.bookingId}`} target="_blank" rel="noopener noreferrer" data-testid="public-tracking-link"
        className="flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-primary py-1">
        View public tracking page <ExternalLink size={11} />
      </a>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-sm">{value}</div>
    </div>
  );
}

/**
 * Per-channel notification-delivery pills.
 *
 * Rendered ONLY when the backend actually populates the corresponding boolean
 * on the booking response. When a channel is `undefined` (backend does not
 * track it yet), the pill is not rendered at all — never faked.
 *
 * Colour legend:
 *   • primary  → true  (delivered)
 *   • grey     → false (attempted, failed) — graceful, non-alarming
 */
function NotificationChannels({
  email, sms, push, whatsapp,
}: {
  email?: boolean; sms?: boolean; push?: boolean; whatsapp?: boolean;
}) {
  const items: { key: string; label: string; sent?: boolean; Icon: any }[] = [];
  if (email    !== undefined) items.push({ key: 'email',    label: 'Email',    sent: email,    Icon: Mail });
  if (sms      !== undefined) items.push({ key: 'sms',      label: 'SMS',      sent: sms,      Icon: Send });
  if (push     !== undefined) items.push({ key: 'push',     label: 'Push',     sent: push,     Icon: Bell });
  if (whatsapp !== undefined) items.push({ key: 'whatsapp', label: 'WhatsApp', sent: whatsapp, Icon: MessageCircle });
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5" data-testid="notification-channels">
      {items.map(({ key, label, sent, Icon }) => (
        <span
          key={key}
          data-testid={`notif-${key}`}
          data-sent={sent ? 'true' : 'false'}
          title={sent ? `${label} notification delivered` : `${label} notification not delivered yet`}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            sent
              ? 'bg-orange-50 text-primary border-orange-200'
              : 'bg-gray-50 text-gray-400 border-gray-200'
          }`}
        >
          <Icon size={10} />
          {label}
          {sent && <Check size={10} className="ml-0.5" />}
        </span>
      ))}
    </div>
  );
}
