'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Svc {
  _id: string;
  title: { en: string; hi: string };
  slug: string;
  category: string;
  shortDesc: { en: string; hi: string };
  description: { en: string; hi: string };
  originalPrice: number;
  offerPrice: number;
  icon: string;
  redirectType: string;
  isActive: boolean;
  showOnHome: boolean;
  sortOrder: number;
}

type FormData = Omit<Svc, '_id'>;

const EMPTY: FormData = {
  title: { en: '', hi: '' }, slug: '', category: 'vastu',
  shortDesc: { en: '', hi: '' }, description: { en: '', hi: '' },
  originalPrice: 0, offerPrice: 0, icon: '🕉️',
  redirectType: 'razorpay', isActive: true, showOnHome: false, sortOrder: 0,
};

function getToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    const s = localStorage.getItem('vastu-auth-store');
    if (s) { const p = JSON.parse(s); return p?.state?.token || ''; }
  } catch {}
  return '';
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://vastu-arya-backend-1.onrender.com';
  const res = await fetch(`${base}/api${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...(opts.headers || {}) },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Svc[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState<Svc | null>(null);
  const [form, setForm]         = useState<FormData>(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [seeding, setSeeding]   = useState(false);

  const load = () => {
    setLoading(true);
    apiFetch('/services?limit=100&admin=true')
      .then(d => setServices(d.data || []))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSeed = async () => {
    if (!confirm('Seed all 11 default services? (skips existing)')) return;
    setSeeding(true);
    try {
      const d = await apiFetch('/admin/seed-services', { method: 'POST' });
      toast.success(d.message || 'Services seeded!');
      load();
    } catch (e: any) { toast.error(e.message || 'Seed failed'); }
    finally { setSeeding(false); }
  };

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (s: Svc) => {
    setEditing(s);
    setForm({
      title: s.title, slug: s.slug, category: s.category,
      shortDesc: s.shortDesc || { en: '', hi: '' },
      description: s.description || { en: '', hi: '' },
      originalPrice: s.originalPrice, offerPrice: s.offerPrice,
      icon: s.icon || '🕉️', redirectType: s.redirectType || 'razorpay',
      isActive: s.isActive, showOnHome: s.showOnHome, sortOrder: s.sortOrder || 0,
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.title.en.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || form.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };
      if (editing) {
        await apiFetch(`/services/${editing._id}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast.success('Service updated!');
      } else {
        await apiFetch('/services', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('Service created!');
      }
      setModal(false);
      load();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try { await apiFetch(`/services/${id}`, { method: 'DELETE' }); toast.success('Deleted!'); load(); }
    catch (e: any) { toast.error(e.message || 'Delete failed'); }
  };

  const toggleActive = async (s: Svc) => {
    try {
      await apiFetch(`/services/${s._id}`, { method: 'PUT', body: JSON.stringify({ isActive: !s.isActive }) });
      setServices(prev => prev.map(x => x._id === s._id ? { ...x, isActive: !x.isActive } : x));
    } catch (e: any) { toast.error(e.message || 'Update failed'); }
  };

  const upd = (key: keyof FormData, val: any) => setForm(f => ({ ...f, [key]: val }));
  const updTitle = (lang: 'en' | 'hi', val: string) => setForm(f => ({ ...f, title: { ...f.title, [lang]: val } }));
  const updShort = (lang: 'en' | 'hi', val: string) => setForm(f => ({ ...f, shortDesc: { ...f.shortDesc, [lang]: val } }));
  const updDesc  = (lang: 'en' | 'hi', val: string) => setForm(f => ({ ...f, description: { ...f.description, [lang]: val } }));

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Services</h1>
          <p className="text-gray-500 text-sm">Manage all consultation services</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60 transition-all"
          >
            {seeding ? '⏳ Seeding…' : '🌿 Seed 11 Services'}
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-orange"
          >
            <Plus size={16} /> Add Service
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[0,1,2,3,4].map(i => <div key={i} className="h-12 skeleton rounded-xl" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Service', 'Category', 'Price', 'Offer', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{s.icon || '🕉️'}</span>
                        <div>
                          <p className="font-medium text-sm text-gray-800 line-clamp-1">{s.title?.en}</p>
                          <p className="text-xs text-gray-400">{s.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 capitalize">{s.category}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 line-through">{fmt(s.originalPrice)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-primary">{fmt(s.offerPrice)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(s)}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {s.isActive ? <Eye size={11} /> : <EyeOff size={11} />}
                        {s.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(s)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(s._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {services.length === 0 && (
              <div className="text-center py-14 text-gray-400">
                <div className="text-4xl mb-3">🕉️</div>
                <p className="font-medium mb-2">No services yet</p>
                <p className="text-sm">Click <strong className="text-green-600">🌿 Seed 11 Services</strong> to populate all default services</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-display font-bold text-lg">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="lbl">Title (English) *</label>
                  <input value={form.title.en} onChange={e => updTitle('en', e.target.value)} className="inp w-full" placeholder="Service name" />
                </div>
                <div>
                  <label className="lbl">Title (Hindi)</label>
                  <input value={form.title.hi} onChange={e => updTitle('hi', e.target.value)} className="inp w-full" placeholder="हिंदी नाम" />
                </div>
                <div>
                  <label className="lbl">Slug</label>
                  <input value={form.slug} onChange={e => upd('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="inp w-full font-mono text-xs" placeholder="auto-generated" />
                </div>
                <div>
                  <label className="lbl">Icon (emoji)</label>
                  <input value={form.icon} onChange={e => upd('icon', e.target.value)} className="inp w-full" placeholder="🕉️" />
                </div>
                <div>
                  <label className="lbl">Category</label>
                  <select value={form.category} onChange={e => upd('category', e.target.value)} className="inp w-full">
                    {['vastu','numerology','astrology','gemstone','rudraksha','general'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">Redirect Type</label>
                  <select value={form.redirectType} onChange={e => upd('redirectType', e.target.value)} className="inp w-full">
                    <option value="razorpay">Razorpay Payment</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="form">Form Only</option>
                  </select>
                </div>
                <div>
                  <label className="lbl">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={e => upd('originalPrice', +e.target.value)} className="inp w-full" />
                </div>
                <div>
                  <label className="lbl">Offer Price (₹)</label>
                  <input type="number" value={form.offerPrice} onChange={e => upd('offerPrice', +e.target.value)} className="inp w-full" />
                </div>
              </div>

              <div>
                <label className="lbl">Short Description (English)</label>
                <textarea value={form.shortDesc.en} onChange={e => updShort('en', e.target.value)} rows={2} className="inp w-full resize-none" />
              </div>
              <div>
                <label className="lbl">Full Description (English)</label>
                <textarea value={form.description.en} onChange={e => updDesc('en', e.target.value)} rows={4} className="inp w-full resize-none" />
              </div>

              <div className="flex gap-5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.isActive} onChange={e => upd('isActive', e.target.checked)} className="w-4 h-4 accent-primary" />
                  Active
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.showOnHome} onChange={e => upd('showOnHome', e.target.checked)} className="w-4 h-4 accent-primary" />
                  Show on Homepage
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                <Save size={15} />{saving ? 'Saving…' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .lbl { display:block; font-size:.8rem; font-weight:500; color:#5C3D1E; margin-bottom:4px; }
        .inp { padding:8px 12px; border:1px solid #fed7aa; border-radius:10px; font-size:.875rem; outline:none; transition:border-color .2s; }
        .inp:focus { border-color:#FF6B00; box-shadow:0 0 0 2px rgba(255,107,0,.1); }
      `}</style>
    </div>
  );
}
