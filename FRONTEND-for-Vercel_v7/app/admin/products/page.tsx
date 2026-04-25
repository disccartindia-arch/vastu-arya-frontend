'use client';
import { useEffect, useState } from 'react';
import { productsAPI, adminAPI } from '../../../lib/api';
import { Product } from '../../../types';
import { formatPrice } from '../../../lib/utils';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { STORE_CATEGORIES } from '../../../lib/utils';

const emptyProduct = {
  name: { en: '', hi: '' }, slug: '', category: 'gemstones',
  description: { en: '', hi: '' }, benefits: [''],
  price: 0, offerPrice: 0, images: [''], stock: 0,
  sku: '', isFeatured: false, isNewLaunch: false, isActive: true
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [catFilter, setCatFilter] = useState('');
  const [seeding, setSeeding] = useState(false);

  const load = (cat?: string) => {
    const params: any = {};
    if (cat) params.category = cat;
    productsAPI.getAdminAll(params).then(r => setProducts(r.data.data || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSeed = async () => {
    if (!confirm('This will insert all 45 sample products (skips any that already exist). Continue?')) return;
    setSeeding(true);
    try {
      const { data } = await adminAPI.seedProducts();
      toast.success(data.message || 'Products seeded!');
      load(catFilter);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Seed failed');
    } finally { setSeeding(false); }
  };

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setShowModal(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ ...p, images: p.images.length ? p.images : [''], benefits: p.benefits.length ? p.benefits : [''] }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.en) return toast.error('Product name is required');
    setSaving(true);
    try {
      const data = { ...form, images: form.images.filter((u: string) => u.trim()), benefits: form.benefits.filter((b: string) => b.trim()) };
      if (!data.slug) data.slug = data.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (editing) { await productsAPI.update(editing._id, data); toast.success('Product updated!'); }
      else { await productsAPI.create(data); toast.success('Product created!'); }
      setShowModal(false); load(catFilter);
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try { await productsAPI.delete(id); toast.success('Deleted!'); load(catFilter); } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-2xl font-bold text-gray-800">Products</h1><p className="text-gray-500 text-sm">Manage Vastu Store products</p></div>
        <div className="flex gap-2">
          <button onClick={handleSeed} disabled={seeding} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60" title="Insert 45 sample products (skips existing)">
            {seeding ? '⏳ Seeding...' : '🌱 Seed 45 Products'}
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-orange">
          <Plus size={16}/> Add Product
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setCatFilter(''); load(''); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!catFilter ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>All</button>
        {STORE_CATEGORIES.map(c => (
          <button key={c.slug} onClick={() => { setCatFilter(c.slug); load(c.slug); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catFilter === c.slug ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[...Array(5)].map((_,i)=><div key={i} className="h-12 skeleton rounded-xl"/>)}</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Product','Category','Price','Offer','Stock','Status','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-cream rounded-lg flex-shrink-0 overflow-hidden">
                          {p.images[0] ? <img src={p.images[0]} alt={p.name.en} className="w-full h-full object-cover"/> : <span className="w-full h-full flex items-center justify-center text-lg">🕉️</span>}
                        </div>
                        <div><p className="font-medium text-sm text-gray-800 line-clamp-1">{p.name.en}</p><p className="text-xs text-gray-400">{p.sku || '-'}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 capitalize">{p.category}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 line-through">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-primary">{formatPrice(p.offerPrice)}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{p.stock}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                        {p.isFeatured && <span className="text-xs px-2 py-0.5 rounded-full font-medium w-fit bg-yellow-100 text-yellow-700">Featured</span>}
                        {p.isNewLaunch && <span className="text-xs px-2 py-0.5 rounded-full font-medium w-fit bg-blue-100 text-blue-700">New</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14}/></button>
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <div className="text-center py-12 text-gray-400">No products yet.</div>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="label-style">Name (English) *</label><input value={form.name.en} onChange={e=>setForm({...form,name:{...form.name,en:e.target.value}})} className="input-style w-full" placeholder="Product name"/></div>
                <div><label className="label-style">Name (Hindi)</label><input value={form.name.hi} onChange={e=>setForm({...form,name:{...form.name,hi:e.target.value}})} className="input-style w-full font-hindi" placeholder="हिंदी नाम"/></div>
                <div><label className="label-style">Category *</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input-style w-full">
                    {STORE_CATEGORIES.map(c=><option key={c.slug} value={c.slug}>{c.emoji} {c.label}</option>)}
                  </select>
                </div>
                <div><label className="label-style">SKU</label><input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="input-style w-full" placeholder="SKU-001"/></div>
                <div><label className="label-style">Original Price (₹) *</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:+e.target.value})} className="input-style w-full"/></div>
                <div><label className="label-style">Offer Price (₹) *</label><input type="number" value={form.offerPrice} onChange={e=>setForm({...form,offerPrice:+e.target.value})} className="input-style w-full"/></div>
                <div><label className="label-style">Stock Quantity</label><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:+e.target.value})} className="input-style w-full"/></div>
              </div>
              <div><label className="label-style">Description (English)</label><textarea value={form.description.en} onChange={e=>setForm({...form,description:{...form.description,en:e.target.value}})} className="input-style w-full" rows={3}/></div>
              <div>
                <label className="label-style">Image URLs (one per line)</label>
                {form.images.map((url: string, i: number) => (
                  <input key={i} value={url} onChange={e=>{const imgs=[...form.images];imgs[i]=e.target.value;setForm({...form,images:imgs});}} className="input-style w-full mb-2" placeholder="https://example.com/image.jpg"/>
                ))}
                <button onClick={()=>setForm({...form,images:[...form.images,'']})} className="text-primary text-xs hover:underline">+ Add Image URL</button>
              </div>
              <div>
                <label className="label-style">Benefits (one per line)</label>
                {form.benefits.map((b: string, i: number) => (
                  <input key={i} value={b} onChange={e=>{const bens=[...form.benefits];bens[i]=e.target.value;setForm({...form,benefits:bens});}} className="input-style w-full mb-2" placeholder={`Benefit ${i+1}`}/>
                ))}
                <button onClick={()=>setForm({...form,benefits:[...form.benefits,'']})} className="text-primary text-xs hover:underline">+ Add Benefit</button>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="w-4 h-4 accent-primary"/><span className="text-sm">Active</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})} className="w-4 h-4 accent-primary"/><span className="text-sm">Featured</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isNewLaunch} onChange={e=>setForm({...form,isNewLaunch:e.target.checked})} className="w-4 h-4 accent-primary"/><span className="text-sm">New Launch</span></label>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={()=>setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark disabled:opacity-60 flex items-center justify-center gap-2">
                <Save size={15}/>{saving?'Saving...':'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`.label-style{display:block;font-size:.8rem;font-weight:500;color:#5C3D1E;margin-bottom:4px}.input-style{padding:8px 12px;border:1px solid #fed7aa;border-radius:10px;font-size:.875rem;outline:none;transition:border-color .2s}.input-style:focus{border-color:#FF6B00;box-shadow:0 0 0 2px rgba(255,107,0,.1)}`}</style>
    </div>
  );
}
