'use client';
import { useEffect, useState } from 'react';
import { settingsAPI } from '../../../lib/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = {
  title: '', content: '', ctaText: 'Book Now', ctaLink: '/book-appointment',
  delay: 3, isActive: true, type: 'general', showOnPages: [] as string[]
};

export default function AdminPopupsPage() {
  const [popups, setPopups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => settingsAPI.getPopups().then(r => setPopups(r.data.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ ...p }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title) return toast.error('Title is required');
    setSaving(true);
    try {
      if (editing) { await settingsAPI.updatePopup(editing._id, form); toast.success('Popup updated!'); }
      else { await settingsAPI.createPopup(form); toast.success('Popup created!'); }
      setShowModal(false); load();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this popup?')) return;
    try { await settingsAPI.deletePopup(id); toast.success('Deleted!'); load(); } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-800">Popups</h1><p className="text-gray-500 text-sm">Manage website popups and announcements</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-orange"><Plus size={16}/> Add Popup</button>
      </div>

      <div className="grid gap-4">
        {loading ? [...Array(3)].map((_,i)=><div key={i} className="h-20 skeleton rounded-2xl"/>) :
          popups.map(p => (
            <div key={p._id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800">{p.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{p.type}</span>
                </div>
                <p className="text-xs text-gray-400">{p.ctaText} → {p.ctaLink} | Delay: {p.delay}s</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14}/></button>
                <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
              </div>
            </div>
          ))
        }
        {!loading && popups.length === 0 && <div className="text-center py-16 text-gray-400">No popups yet</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">{editing ? 'Edit Popup' : 'Add Popup'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="label-style">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-style w-full" placeholder="Popup title"/></div>
              <div><label className="label-style">Content</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="input-style w-full" rows={3} placeholder="Popup message..."/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label-style">CTA Button Text</label><input value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })} className="input-style w-full"/></div>
                <div><label className="label-style">CTA Link</label><input value={form.ctaLink} onChange={e => setForm({ ...form, ctaLink: e.target.value })} className="input-style w-full"/></div>
                <div><label className="label-style">Delay (seconds)</label><input type="number" value={form.delay} onChange={e => setForm({ ...form, delay: +e.target.value })} className="input-style w-full"/></div>
                <div><label className="label-style">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-style w-full">
                    <option value="general">General</option>
                    <option value="appointment">Appointment</option>
                    <option value="offer">Offer</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-primary"/><span className="text-sm">Active</span></label>
            </div>
            <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"><Save size={14}/>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`.label-style{display:block;font-size:.8rem;font-weight:500;color:#5C3D1E;margin-bottom:4px}.input-style{padding:8px 12px;border:1px solid #fed7aa;border-radius:10px;font-size:.875rem;outline:none;transition:border-color .2s;width:100%}.input-style:focus{border-color:#FF6B00;box-shadow:0 0 0 2px rgba(255,107,0,.1)}`}</style>
    </div>
  );
}
