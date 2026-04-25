'use client';
import { useEffect, useState } from 'react';
import { servicesAPI } from '../../../lib/api';
import { Service } from '../../../types';
import { formatPrice } from '../../../lib/utils';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyService = {
  title: { en: '', hi: '' }, slug: '', category: 'general',
  shortDesc: { en: '', hi: '' }, description: { en: '', hi: '' },
  originalPrice: 0, offerPrice: 0, icon: '🕉️',
  formFields: [], redirectType: 'razorpay', isActive: true, showOnHome: false, sortOrder: 0,
  seo: { title: '', description: '', keywords: '' }
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyService);
  const [saving, setSaving] = useState(false);

  const load = () => servicesAPI.getAll().then(r => setServices(r.data.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyService); setShowModal(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ ...s }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title.en) return toast.error('English title is required');
    setSaving(true);
    try {
      if (!form.slug) form.slug = form.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (editing) { await servicesAPI.update(editing._id, form); toast.success('Service updated!'); }
      else { await servicesAPI.create(form); toast.success('Service created!'); }
      setShowModal(false); load();
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try { await servicesAPI.delete(id); toast.success('Deleted!'); load(); } catch { toast.error('Delete failed'); }
  };

  const toggleActive = async (s: Service) => {
    try { await servicesAPI.update(s._id, { isActive: !s.isActive }); load(); } catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-800">Services</h1><p className="text-gray-500 text-sm">Manage all consultation services</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-orange">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_,i)=><div key={i} className="h-12 skeleton rounded-xl"/>)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Service','Category','Original','Offer','Home','Status','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{s.icon}</span>
                        <div>
                          <p className="font-medium text-sm text-gray-800">{s.title.en}</p>
                          <p className="text-xs text-gray-400">{s.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 capitalize">{s.category}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 line-through">{formatPrice(s.originalPrice)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-primary">{formatPrice(s.offerPrice)}</td>
                    <td className="px-4 py-3">{s.showOnHome ? <span className="text-green-600 text-xs font-medium">✓ Yes</span> : <span className="text-gray-400 text-xs">No</span>}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(s)} className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(s)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={14}/></button>
                        <button onClick={() => handleDelete(s._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {services.length === 0 && <div className="text-center py-12 text-gray-400">No services yet. Add your first service!</div>}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">{editing ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="label-style">Title (English) *</label><input value={form.title.en} onChange={e=>setForm({...form,title:{...form.title,en:e.target.value}})} className="input-style w-full" placeholder="Service name in English"/></div>
                <div><label className="label-style">Title (Hindi)</label><input value={form.title.hi} onChange={e=>setForm({...form,title:{...form.title,hi:e.target.value}})} className="input-style w-full font-hindi" placeholder="हिंदी में सेवा नाम"/></div>
                <div><label className="label-style">Icon (emoji)</label><input value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} className="input-style w-full" placeholder="🕉️"/></div>
                <div><label className="label-style">Category</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input-style w-full">
                    {['general','vastu','numerology','astrology','consultation','gemology'].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="label-style">Original Price (₹)</label><input type="number" value={form.originalPrice} onChange={e=>setForm({...form,originalPrice:+e.target.value})} className="input-style w-full"/></div>
                <div><label className="label-style">Offer Price (₹) *</label><input type="number" value={form.offerPrice} onChange={e=>setForm({...form,offerPrice:+e.target.value})} className="input-style w-full"/></div>
              </div>
              <div><label className="label-style">Short Description (English)</label><textarea value={form.shortDesc.en} onChange={e=>setForm({...form,shortDesc:{...form.shortDesc,en:e.target.value}})} className="input-style w-full" rows={2} placeholder="Brief description for cards"/></div>
              <div><label className="label-style">Short Description (Hindi)</label><textarea value={form.shortDesc.hi} onChange={e=>setForm({...form,shortDesc:{...form.shortDesc,hi:e.target.value}})} className="input-style w-full font-hindi" rows={2} placeholder="हिंदी में संक्षिप्त विवरण"/></div>
              <div><label className="label-style">Full Description (English)</label><textarea value={form.description.en} onChange={e=>setForm({...form,description:{...form.description,en:e.target.value}})} className="input-style w-full" rows={4} placeholder="Detailed service description"/></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="label-style">Redirect Type</label>
                  <select value={form.redirectType} onChange={e=>setForm({...form,redirectType:e.target.value})} className="input-style w-full">
                    <option value="razorpay">Razorpay Payment</option>
                    <option value="whatsapp">WhatsApp Connect</option>
                    <option value="form">Contact Form</option>
                  </select>
                </div>
                <div><label className="label-style">Sort Order</label><input type="number" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:+e.target.value})} className="input-style w-full"/></div>
              </div>
              <div><label className="label-style">SEO Title</label><input value={form.seo?.title} onChange={e=>setForm({...form,seo:{...form.seo,title:e.target.value}})} className="input-style w-full" placeholder="SEO page title"/></div>
              <div><label className="label-style">SEO Description</label><textarea value={form.seo?.description} onChange={e=>setForm({...form,seo:{...form.seo,description:e.target.value}})} className="input-style w-full" rows={2}/></div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="w-4 h-4 accent-primary"/><span className="text-sm font-medium">Active</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.showOnHome} onChange={e=>setForm({...form,showOnHome:e.target.checked})} className="w-4 h-4 accent-primary"/><span className="text-sm font-medium">Show on Home</span></label>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark disabled:opacity-60 flex items-center justify-center gap-2">
                <Save size={15}/>{saving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .label-style { display: block; font-size: 0.8rem; font-weight: 500; color: #5C3D1E; margin-bottom: 4px; }
        .input-style { padding: 8px 12px; border: 1px solid #fed7aa; border-radius: 10px; font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
        .input-style:focus { border-color: #FF6B00; box-shadow: 0 0 0 2px rgba(255,107,0,0.1); }
      `}</style>
    </div>
  );
}
