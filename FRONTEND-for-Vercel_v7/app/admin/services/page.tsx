'use client';
import { useEffect, useState } from 'react';
import { servicesAPI, adminAPI } from '../../../lib/api';
import { Service } from '../../../types';
import { formatPrice } from '../../../lib/utils';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyService = {
  title: { en: '', hi: '' }, slug: '', category: 'general',
  shortDesc: { en: '', hi: '' }, description: { en: '', hi: '' },
  originalPrice: 0, offerPrice: 0, icon: '🕉️',
  formFields: [], redirectType: 'razorpay', isActive: true, showOnHome: false, sortOrder: 0,
  seo: { title: '', description: '', keywords: '' },
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState<any>(null);
  const [form, setForm]         = useState<any>(emptyService);
  const [saving, setSaving]     = useState(false);
  const [seeding, setSeeding]   = useState(false);

  const load = () => {
    setLoading(true);
    servicesAPI.getAll()
      .then((r: any) => setServices(r.data.data || []))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSeed = async () => {
    if (!confirm('This will seed all 11 default services (skips any already existing). Continue?')) return;
    setSeeding(true);
    try {
      const { data } = await adminAPI.seedServices();
      toast.success(data.message || 'Services seeded!');
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Seed failed — redeploy backend first');
    } finally { setSeeding(false); }
  };

  const openAdd  = () => { setEditing(null); setForm(emptyService); setShowModal(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ ...s }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title.en) return toast.error('Service title is required');
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || form.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
      if (editing) { await servicesAPI.update(editing._id, payload); toast.success('Service updated!'); }
      else { await servicesAPI.create(payload); toast.success('Service created!'); }
      setShowModal(false); load();
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try { await servicesAPI.delete(id); toast.success('Deleted!'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const toggleActive = async (s: Service) => {
    try { await servicesAPI.update(s._id, { isActive: !s.isActive }); load(); }
    catch { toast.error('Update failed'); }
  };

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
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
          >
            {seeding ? '⏳ Seeding…' : '🌿 Seed Default Services'}
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-orange"
          >
            <Plus size={16} /> Add Service
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Service', 'Category', 'Price', 'Offer', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{s.icon}</span>
                        <div>
                          <p className="font-medium text-sm text-gray-800 line-clamp-1">{s.title.en}</p>
                          <p className="text-xs text-gray-400">{s.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 capitalize">{s.category}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 line-through">{formatPrice(s.originalPrice)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-primary">{formatPrice(s.offerPrice)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(s)}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
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
                <p className="font-medium mb-1">No services yet</p>
                <p className="text-sm">Click <strong className="text-green-600">🌿 Seed Default Services</strong> to populate all 11 services</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-display font-bold text-lg">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-style">Title (English) *</label>
                  <input value={form.title.en} onChange={e => setForm({ ...form, title: { ...form.title, en: e.target.value } })} className="input-style w-full" placeholder="Service name" />
                </div>
                <div>
                  <label className="label-style">Title (Hindi)</label>
                  <input value={form.title.hi} onChange={e => setForm({ ...form, title: { ...form.title, hi: e.target.value } })} className="input-style w-full" placeholder="हिंदी नाम" />
                </div>
                <div>
                  <label className="label-style">Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="input-style w-full" placeholder="auto-generated" />
                </div>
                <div>
                  <label className="label-style">Icon (emoji)</label>
                  <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="input-style w-full" placeholder="🕉️" />
                </div>
                <div>
                  <label className="label-style">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-style w-full">
                    {['vastu', 'numerology', 'astrology', 'gemstone', 'rudraksha', 'general'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-style">Redirect Type</label>
                  <select value={form.redirectType} onChange={e => setForm({ ...form, redirectType: e.target.value })} className="input-style w-full">
                    <option value="razorpay">Razorpay Payment</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="form">Form Only</option>
                  </select>
                </div>
                <div>
                  <label className="label-style">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: +e.target.value })} className="input-style w-full" />
                </div>
                <div>
                  <label className="label-style">Offer Price (₹)</label>
                  <input type="number" value={form.offerPrice} onChange={e => setForm({ ...form, offerPrice: +e.target.value })} className="input-style w-full" />
                </div>
              </div>

              <div>
                <label className="label-style">Short Description (English)</label>
                <textarea value={form.shortDesc?.en || ''} onChange={e => setForm({ ...form, shortDesc: { ...form.shortDesc, en: e.target.value } })} rows={2} className="input-style w-full resize-none" />
              </div>

              <div>
                <label className="label-style">Full Description (English)</label>
                <textarea value={form.description?.en || ''} onChange={e => setForm({ ...form, description: { ...form.description, en: e.target.value } })} rows={4} className="input-style w-full resize-none" />
              </div>

              <div className="flex gap-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-primary" />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.showOnHome} onChange={e => setForm({ ...form, showOnHome: e.target.checked })} className="w-4 h-4 accent-primary" />
                  <span className="text-sm">Show on Homepage</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                <Save size={15} />{saving ? 'Saving…' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .label-style { display:block; font-size:.8rem; font-weight:500; color:#5C3D1E; margin-bottom:4px; }
        .input-style { padding:8px 12px; border:1px solid #fed7aa; border-radius:10px; font-size:.875rem; outline:none; transition:border-color .2s; }
        .input-style:focus { border-color:#FF6B00; box-shadow:0 0 0 2px rgba(255,107,0,.1); }
      `}</style>
    </div>
  );
}
