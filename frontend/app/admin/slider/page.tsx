'use client';
import { useEffect, useState } from 'react';
import { settingsAPI } from '../../../lib/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = { title:'', subtitle:'', image:'', ctaText:'Book Now', ctaLink:'/book-appointment', isActive:true, sortOrder:0 };

export default function AdminSliderPage() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => settingsAPI.getAllSliders().then(r=>setSliders(r.data.data||[])).finally(()=>setLoading(false));
  useEffect(()=>{load();},[]);

  const openAdd = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (s:any) => { setEditing(s); setForm({...s}); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title || !form.image) return toast.error('Title and image are required');
    setSaving(true);
    try {
      if (editing) { await settingsAPI.updateSlider(editing._id, form); toast.success('Slider updated!'); }
      else { await settingsAPI.createSlider(form); toast.success('Slider created!'); }
      setShowModal(false); load();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id:string) => {
    if (!confirm('Delete?')) return;
    try { await settingsAPI.deleteSlider(id); toast.success('Deleted!'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-800">Hero Slider</h1><p className="text-gray-500 text-sm">Manage homepage hero slides</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-orange"><Plus size={16}/>Add Slide</button>
      </div>

      <div className="grid gap-4">
        {loading ? [...Array(3)].map((_,i)=><div key={i} className="h-24 skeleton rounded-2xl"/>) : sliders.map(s=>(
          <div key={s._id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-20 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              {s.image ? <img src={s.image} alt={s.title} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">🖼️</div>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{s.title}</p>
              <p className="text-xs text-gray-400 truncate">{s.subtitle}</p>
              <p className="text-xs text-primary mt-0.5">{s.ctaText} → {s.ctaLink}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full ${s.isActive?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{s.isActive?'Active':'Off'}</span>
              <button onClick={()=>openEdit(s)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14}/></button>
              <button onClick={()=>handleDelete(s._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
        {!loading && sliders.length===0 && <div className="text-center py-16 text-gray-400">No slides yet</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">{editing?'Edit Slide':'Add Slide'}</h2>
              <button onClick={()=>setShowModal(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="label-style">Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="input-style w-full" placeholder="Hero slide title"/></div>
              <div><label className="label-style">Subtitle</label><input value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})} className="input-style w-full"/></div>
              <div><label className="label-style">Image URL *</label><input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className="input-style w-full" placeholder="https://..."/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label-style">CTA Button Text</label><input value={form.ctaText} onChange={e=>setForm({...form,ctaText:e.target.value})} className="input-style w-full"/></div>
                <div><label className="label-style">CTA Link</label><input value={form.ctaLink} onChange={e=>setForm({...form,ctaLink:e.target.value})} className="input-style w-full"/></div>
              </div>
              <div><label className="label-style">Sort Order</label><input type="number" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:+e.target.value})} className="input-style w-full"/></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="w-4 h-4 accent-primary"/><span className="text-sm">Active</span></label>
            </div>
            <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
              <button onClick={()=>setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"><Save size={14}/>{saving?'Saving...':'Save'}</button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`.label-style{display:block;font-size:.8rem;font-weight:500;color:#5C3D1E;margin-bottom:4px}.input-style{padding:8px 12px;border:1px solid #fed7aa;border-radius:10px;font-size:.875rem;outline:none;transition:border-color .2s}.input-style:focus{border-color:#FF6B00;box-shadow:0 0 0 2px rgba(255,107,0,.1)}`}</style>
    </div>
  );
}
