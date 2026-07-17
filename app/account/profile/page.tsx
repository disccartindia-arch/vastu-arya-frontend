'use client';
/**
 * app/account/profile/page.tsx — NEW (Feature 7: Account Profile)
 * PRODUCTION HOTFIX ROUND 11 — Phase D.
 *
 * Also hosts the "Find a past booking" claim UI — your modified linkage
 * strategy's retroactive-linking mechanism. Placed on the Profile page
 * since it's a one-time/occasional action, not a primary nav item.
 */
import { useEffect, useState } from 'react';
import { accountAPI } from '../../../lib/accountAPI';
import { LoadingSkeleton, ErrorState } from '../../../components/account/AccountStates';
import { useNotificationPreferences } from '../../../hooks/useNotificationPreferences';
import AvatarUpload from '../../../components/account/AvatarUpload';
import { Save, Link2, CheckCircle, MessageCircle, Mail, MessageSquare, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

interface Profile { name: string; email: string; phone: string | null; memberSince: string; totalBookings: number; totalOrders: number; }

export default function ProfilePage() {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const { prefs, update: updatePrefs, hydrated: prefsReady } = useNotificationPreferences();

  // Claim flow state
  const [claimBookingId, setClaimBookingId] = useState('');
  const [claimPhone, setClaimPhone] = useState('');
  const [claimEmail, setClaimEmail] = useState('');
  const [claiming, setClaiming] = useState(false);

  const load = () => {
    setLoading(true); setError('');
    accountAPI.getProfile()
      .then(r => { setData(r.data.data); setName(r.data.data.name); setPhone(r.data.data.phone || ''); })
      .catch(() => setError('Could not load your profile.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await accountAPI.updateProfile({ name, phone });
      toast.success('Profile updated');
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const claim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimBookingId.trim() || !claimPhone.trim()) { toast.error('Booking ID and phone are required'); return; }
    setClaiming(true);
    try {
      const { data: res } = await accountAPI.claimBooking({ bookingId: claimBookingId.trim(), phone: claimPhone.trim(), email: claimEmail.trim() || undefined });
      toast.success(res.message || 'Booking linked to your account!');
      setClaimBookingId(''); setClaimPhone(''); setClaimEmail('');
    } catch (e: any) {
      // Deliberately the same generic message the backend returns for
      // every failure mode — see accountClaim.controller.ts. The
      // frontend doesn't add its own more-specific error text here,
      // since doing so could reintroduce the exact enumeration risk
      // the backend's generic response was designed to prevent.
      toast.error(e?.response?.data?.message || 'Could not verify these details.');
    } finally { setClaiming(false); }
  };

  if (loading) return <LoadingSkeleton rows={2} />;
  if (error || !data) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-5 max-w-lg">
      <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm">
        <AvatarUpload userId={data.email} name={data.name} />
      </div>
      <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">Profile Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email (cannot be changed)</label>
            <input value={data.email} disabled className="w-full px-3 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
        <button onClick={save} disabled={saving} className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-60">
          <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm text-center">
          <p className="font-display font-bold text-xl text-primary">{data.totalBookings}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total Bookings</p>
        </div>
        <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm text-center">
          <p className="font-display font-bold text-xl text-primary">{data.totalOrders}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total Orders</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">Member since {new Date(data.memberSince).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>

      <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2"><Bell size={16} className="text-primary" /> Notification Preferences</h2>
        <p className="text-xs text-gray-500 mb-4">Choose how we should update you about bookings, payments and orders. Saved on this device.</p>
        <div className="space-y-2">
          {[
            { key: 'whatsapp' as const, label: 'WhatsApp updates',  icon: MessageCircle, note: 'Live status changes on your phone' },
            { key: 'email'    as const, label: 'Email updates',     icon: Mail,          note: 'Confirmations + monthly summaries' },
            { key: 'sms'      as const, label: 'SMS updates',       icon: MessageSquare, note: 'Critical alerts only' },
            { key: 'push'     as const, label: 'Push notifications', icon: Bell,         note: 'When you have the app installed' },
          ].map(item => {
            const Icon = item.icon;
            const on = prefs[item.key];
            return (
              <label key={item.key} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-orange-50/40 cursor-pointer transition-colors" data-testid={`notif-${item.key}`}>
                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0"><Icon size={15} className="text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-[11px] text-gray-400">{item.note}</p>
                </div>
                <button type="button" role="switch" aria-checked={on}
                  onClick={() => updatePrefs({ [item.key]: !on })}
                  disabled={!prefsReady}
                  className={`w-10 h-6 rounded-full flex items-center transition-colors ${on ? 'bg-primary' : 'bg-gray-200'} disabled:opacity-50`}>
                  <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </label>
            );
          })}
        </div>
        <p className="text-[11px] text-gray-400 mt-3">Backend delivery via WhatsApp / SMS / push will activate as those channels come online. Email is already active.</p>
      </div>

      <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
        <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2"><Link2 size={16} className="text-primary" /> Find a Past Booking</h2>
        <p className="text-xs text-gray-500 mb-4">If you booked before creating this account, link it here using your Booking ID and the phone number (and email, if you provided one) used at the time.</p>
        <form onSubmit={claim} className="space-y-3">
          <input value={claimBookingId} onChange={e => setClaimBookingId(e.target.value)} placeholder="Booking ID (e.g. BK1718...)" className="w-full px-3 py-2.5 border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white" />
          <input value={claimPhone} onChange={e => setClaimPhone(e.target.value)} placeholder="Phone number used at booking" className="w-full px-3 py-2.5 border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white" />
          <input value={claimEmail} onChange={e => setClaimEmail(e.target.value)} placeholder="Email used at booking (if any)" className="w-full px-3 py-2.5 border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white" />
          <button type="submit" disabled={claiming} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60">
            <CheckCircle size={15} /> {claiming ? 'Verifying…' : 'Link This Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
