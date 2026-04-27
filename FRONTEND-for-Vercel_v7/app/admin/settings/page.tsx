'use client';
import { useEffect, useState } from 'react';
import { settingsAPI } from '../../../lib/api';
import { Save, Globe, Phone, Mail, MapPin, Share2, Search, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [form, setForm] = useState<any>({ siteName:'Vastu Arya', tagline:{en:'',hi:''}, phone:'', whatsappNumber:'', email:'', address:'', socialLinks:{instagram:'',facebook:'',youtube:'',twitter:''}, seo:{defaultTitle:'',defaultDescription:''}, enableHindi:true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsAPI.get().then(r => { if (r.data.data) setForm(r.data.data); }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await settingsAPI.update(form); toast.success('Settings saved!'); }
    catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <h2 className="font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100"><Icon size={18} className="text-primary"/>{title}</h2>
      {children}
    </div>
  );

  if (loading) return <div className="space-y-4">{[...Array(4)].map((_,i)=><div key={i} className="h-32 skeleton rounded-2xl"/>)}</div>;

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-800">Site Settings</h1><p className="text-gray-500 text-sm">Configure your website globally</p></div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60 shadow-orange">
          <Save size={15}/>{saving?'Saving...':'Save All'}
        </button>
      </div>

      <Section title="General" icon={Globe}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label-style">Site Name</label><input value={form.siteName} onChange={e=>setForm({...form,siteName:e.target.value})} className="input-style w-full"/></div>
          <div><label className="label-style">Tagline (English)</label><input value={form.tagline?.en} onChange={e=>setForm({...form,tagline:{...form.tagline,en:e.target.value}})} className="input-style w-full"/></div>
          <div><label className="label-style">Tagline (Hindi)</label><input value={form.tagline?.hi} onChange={e=>setForm({...form,tagline:{...form.tagline,hi:e.target.value}})} className="input-style w-full font-hindi"/></div>
          <div className="flex items-center gap-2 mt-4"><input type="checkbox" id="enableHindi" checked={form.enableHindi} onChange={e=>setForm({...form,enableHindi:e.target.checked})} className="w-4 h-4 accent-primary"/><label htmlFor="enableHindi" className="text-sm font-medium cursor-pointer">Enable Hindi Language</label></div>
        </div>
      </Section>

      <Section title="Contact Information" icon={Phone}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label-style">Phone Number</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-style w-full" placeholder="+91-XXXXXXXXXX"/></div>
          <div><label className="label-style">WhatsApp Number (with country code)</label><input value={form.whatsappNumber} onChange={e=>setForm({...form,whatsappNumber:e.target.value})} className="input-style w-full" placeholder="91XXXXXXXXXX"/></div>
          <div><label className="label-style">Email Address</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-style w-full"/></div>
          <div><label className="label-style">Address</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="input-style w-full"/></div>
        </div>
      </Section>

      <Section title="Social Media Links" icon={Share2}>
        <div className="grid sm:grid-cols-2 gap-4">
          {[['instagram','Instagram URL'],['facebook','Facebook URL'],['youtube','YouTube URL'],['twitter','Twitter/X URL']].map(([k,l])=>(
            <div key={k}><label className="label-style">{l}</label><input value={form.socialLinks?.[k]||''} onChange={e=>setForm({...form,socialLinks:{...form.socialLinks,[k]:e.target.value}})} className="input-style w-full" placeholder="https://..."/></div>
          ))}
        </div>
      </Section>

      <Section title="SEO Settings" icon={Search}>
        <div className="space-y-4">
          <div><label className="label-style">Default Page Title</label><input value={form.seo?.defaultTitle} onChange={e=>setForm({...form,seo:{...form.seo,defaultTitle:e.target.value}})} className="input-style w-full" placeholder="Vastu Arya - Transform Your Space"/></div>
          <div><label className="label-style">Default Meta Description</label><textarea value={form.seo?.defaultDescription} onChange={e=>setForm({...form,seo:{...form.seo,defaultDescription:e.target.value}})} className="input-style w-full" rows={3} placeholder="India's premier Vastu Shastra & Astrology platform..."/></div>
        </div>
      </Section>

      <Section title="Razorpay Keys" icon={CreditCard}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 mb-3">⚠️ Keep your API keys secure. Never share them publicly.</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label-style">Razorpay Key ID</label><input type="password" placeholder="rzp_live_XXXXXXXXXX" className="input-style w-full" onChange={e=>setForm({...form,razorpayKeyId:e.target.value})}/></div>
          <div><label className="label-style">Key Secret (stored encrypted)</label><input type="password" placeholder="Enter to update..." className="input-style w-full"/></div>
        </div>
      </Section>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-sm disabled:opacity-60 shadow-orange">
          <Save size={15}/>{saving?'Saving...':'Save All Settings'}
        </button>
      </div>

      <style jsx global>{`.label-style{display:block;font-size:.8rem;font-weight:500;color:#5C3D1E;margin-bottom:4px}.input-style{padding:8px 12px;border:1px solid #fed7aa;border-radius:10px;font-size:.875rem;outline:none;transition:border-color .2s}.input-style:focus{border-color:#FF6B00;box-shadow:0 0 0 2px rgba(255,107,0,.1)}`}</style>
    </div>
  );
}
