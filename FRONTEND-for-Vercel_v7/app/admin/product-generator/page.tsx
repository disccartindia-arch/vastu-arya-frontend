'use client';
import { useState } from 'react';
import { Sparkles, Save, RefreshCw, Plus, Eye, Upload, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsAPI, uploadAPI } from '../../../lib/api';
import { STORE_CATEGORIES } from '../../../lib/utils';

/* ─── Types ─────────────────────────────────────────────────── */
interface GeneratedProduct {
  name:        { en: string; hi: string };
  slug:        string;
  category:    string;
  description: { en: string; hi: string };
  benefits:    string[];
  price:       number;
  offerPrice:  number;
  sku:         string;
  images:      string[];
  stock:       number;
  isFeatured:  boolean;
  isNewLaunch: boolean;
  isActive:    boolean;
}

const EMPTY: GeneratedProduct = {
  name:{ en:'', hi:'' }, slug:'', category:'bracelets',
  description:{ en:'', hi:'' }, benefits:['','',''],
  price:0, offerPrice:0, sku:'', images:[''], stock:50,
  isFeatured:false, isNewLaunch:true, isActive:true,
};

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ProductGeneratorPage() {
  const [inputText, setInputText]         = useState('');
  const [selectedCategory, setCategory]   = useState('bracelets');
  const [generating, setGenerating]       = useState(false);
  const [saving, setSaving]               = useState(false);
  const [uploadingImg, setUploadingImg]   = useState(false);
  const [product, setProduct]             = useState<GeneratedProduct | null>(null);
  const [showPreview, setShowPreview]     = useState(false);
  const [showAdvanced, setShowAdvanced]   = useState(false);
  const [savedId, setSavedId]             = useState<string | null>(null);

  /* ── Generate via backend AI ── */
  const generate = async () => {
    if (!inputText.trim() || inputText.trim().length < 5) {
      toast.error('Enter a product name or description (min 5 chars)');
      return;
    }
    setGenerating(true);
    setProduct(null);
    setSavedId(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://vastu-arya-backend-1.onrender.com'}/api/products/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('vastu_token') || '' : ''}` },
          body: JSON.stringify({ input: inputText.trim(), category: selectedCategory }),
        }
      );
      const data = await res.json();
      if (data.success && data.data) {
        setProduct(data.data);
        toast.success('Product content generated! Review and save.');
      } else {
        toast.error(data.message || 'Generation failed');
      }
    } catch {
      // Fallback: create a smart template without AI
      const name = inputText.trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const fallback: GeneratedProduct = {
        name:{ en: name, hi: '' },
        slug,
        category: selectedCategory,
        description:{ en: `Natural ${name} — a powerful spiritual and wellness product. ${name} carries unique energy properties that benefit the wearer on physical, emotional and spiritual levels.`, hi: '' },
        benefits:[
          `Enhances spiritual awareness and energy`,
          `Promotes wellbeing and positive vibrations`,
          `Ideal for meditation and daily wear`,
          `Vastu recommended for home and office`,
        ],
        price: 999, offerPrice: 699, sku: `VA-${slug.slice(0,6).toUpperCase()}`,
        images:[''], stock:50, isFeatured:false, isNewLaunch:true, isActive:true,
      };
      setProduct(fallback);
      toast('Generated template — edit fields and save', { icon: '✏️' });
    } finally { setGenerating(false); }
  };

  /* ── Upload image ── */
  const uploadImage = async (file: File, idx: number) => {
    setUploadingImg(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const { data } = await uploadAPI.single(fd);
      setProduct(p => {
        if (!p) return p;
        const imgs = [...p.images]; imgs[idx] = data.data.url;
        return { ...p, images: imgs };
      });
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploadingImg(false); }
  };

  /* ── Save to DB ── */
  const save = async (publish: boolean) => {
    if (!product) return;
    if (!product.name.en.trim()) { toast.error('Product name is required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...product,
        isActive: publish,
        images: product.images.filter(u => u.trim()),
        benefits: product.benefits.filter(b => b.trim()),
        slug: product.slug || product.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };
      const r = await productsAPI.create(payload);
      setSavedId(r.data.data?._id);
      toast.success(publish ? 'Product published!' : 'Saved as draft!');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const upd = (key: keyof GeneratedProduct, val: any) =>
    setProduct(p => p ? { ...p, [key]: val } : p);
  const updBenefit = (i: number, v: string) =>
    setProduct(p => { if (!p) return p; const b=[...p.benefits]; b[i]=v; return {...p,benefits:b}; });
  const updImg = (i: number, v: string) =>
    setProduct(p => { if (!p) return p; const imgs=[...p.images]; imgs[i]=v; return {...p,images:imgs}; });

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles size={22} className="text-primary" /> AI Product Generator
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Enter a product name or rough description — AI will generate full product content instantly
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="label-style">Product Name / Description *</label>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              rows={3}
              placeholder="e.g. Raw Pyrite Bracelet, or: Black tourmaline bracelet for protection and grounding..."
              className="input-style w-full resize-none"
            />
          </div>
          <div>
            <label className="label-style">Category</label>
            <select value={selectedCategory} onChange={e => setCategory(e.target.value)} className="input-style w-full">
              {STORE_CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.emoji} {c.label}</option>
              ))}
            </select>
            <div className="mt-3 space-y-1 text-xs text-gray-400">
              <p>💡 Be specific for best results</p>
              <p>💡 Include stone type, use case</p>
              <p>💡 Mention Vedic significance</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={generate} disabled={generating}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-orange disabled:opacity-60"
          >
            {generating ? <><Loader2 size={15} className="animate-spin" />Generating…</> : <><Sparkles size={15} />Generate with AI</>}
          </button>
          {product && (
            <button onClick={generate} disabled={generating}
              className="flex items-center gap-2 px-4 py-2.5 border border-orange-200 text-primary rounded-xl text-sm font-medium hover:bg-orange-50 transition-all">
              <RefreshCw size={14} />Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Generated Product Editor */}
      {product && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Product Ready — Review & Save
            </h2>
            <button onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
              <Eye size={12} />{showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>

          {/* Core Fields */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-style">Product Name (English) *</label>
                <input value={product.name.en} onChange={e => upd('name',{...product.name,en:e.target.value})} className="input-style w-full" />
              </div>
              <div>
                <label className="label-style">Name (Hindi)</label>
                <input value={product.name.hi} onChange={e => upd('name',{...product.name,hi:e.target.value})} className="input-style w-full font-hindi" placeholder="हिंदी नाम" />
              </div>
              <div>
                <label className="label-style">Slug (URL)</label>
                <input value={product.slug} onChange={e => upd('slug',e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))} className="input-style w-full font-mono text-xs" />
              </div>
              <div>
                <label className="label-style">Category</label>
                <select value={product.category} onChange={e => upd('category',e.target.value)} className="input-style w-full">
                  {STORE_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label-style">Original Price (₹)</label>
                <input type="number" value={product.price} onChange={e => upd('price',+e.target.value)} className="input-style w-full" />
              </div>
              <div>
                <label className="label-style">Offer Price (₹)</label>
                <input type="number" value={product.offerPrice} onChange={e => upd('offerPrice',+e.target.value)} className="input-style w-full" />
              </div>
              <div>
                <label className="label-style">SKU</label>
                <input value={product.sku} onChange={e => upd('sku',e.target.value)} className="input-style w-full" placeholder="VA-BR-001" />
              </div>
              <div>
                <label className="label-style">Stock Quantity</label>
                <input type="number" value={product.stock} onChange={e => upd('stock',+e.target.value)} className="input-style w-full" />
              </div>
            </div>

            <div>
              <label className="label-style">Description (English)</label>
              <textarea value={product.description.en} onChange={e => upd('description',{...product.description,en:e.target.value})} rows={5} className="input-style w-full resize-y" />
            </div>

            {/* Benefits */}
            <div>
              <label className="label-style">Key Benefits</label>
              <div className="space-y-2">
                {product.benefits.map((b, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={b} onChange={e => updBenefit(i,e.target.value)} className="flex-1 input-style" placeholder={`Benefit ${i+1}`} />
                    {product.benefits.length > 1 && (
                      <button onClick={() => setProduct(p => p ? {...p,benefits:p.benefits.filter((_,j)=>j!==i)} : p)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><X size={13}/></button>
                    )}
                  </div>
                ))}
                <button onClick={() => setProduct(p => p ? {...p,benefits:[...p.benefits,'']} : p)}
                  className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                  <Plus size={11}/>Add Benefit
                </button>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="label-style">Product Images</label>
              <div className="space-y-2">
                {product.images.map((url, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-orange-200 bg-orange-50 flex items-center justify-center flex-shrink-0">
                      {url ? <img src={url} alt="" className="w-full h-full object-cover" onError={e=>{(e.target as any).style.display='none'}} /> : <Upload size={14} className="text-gray-300"/>}
                    </div>
                    <label className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl font-semibold cursor-pointer border transition-all flex-shrink-0 ${uploadingImg ? 'bg-gray-100 text-gray-400 border-gray-200':'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-primary'}`}>
                      <Upload size={11}/>{uploadingImg?'Uploading…':'Upload'}
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingImg}
                        onChange={e=>{const f=e.target.files?.[0]; if(f) uploadImage(f,i); e.target.value='';}} />
                    </label>
                    <input value={url} onChange={e=>updImg(i,e.target.value)} className="flex-1 input-style text-xs" placeholder="Or paste image URL…" />
                    {product.images.length > 1 && (
                      <button onClick={()=>setProduct(p=>p?{...p,images:p.images.filter((_,j)=>j!==i)}:p)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><X size={13}/></button>
                    )}
                  </div>
                ))}
                {product.images.length < 5 && (
                  <button onClick={()=>setProduct(p=>p?{...p,images:[...p.images,'']}:p)}
                    className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                    <Plus size={11}/>Add Image
                  </button>
                )}
              </div>
            </div>

            {/* Flags */}
            <div className="flex gap-5">
              {[
                {key:'isActive'   as const, label:'Active'},
                {key:'isFeatured' as const, label:'Featured'},
                {key:'isNewLaunch'as const, label:'New Launch'},
              ].map(({key,label})=>(
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!product[key]} onChange={e=>upd(key,e.target.checked)} className="w-4 h-4 accent-primary"/>
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>

            {/* Advanced */}
            <button onClick={()=>setShowAdvanced(!showAdvanced)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600">
              {showAdvanced?<ChevronUp size={13}/>:<ChevronDown size={13}/>} Advanced Fields
            </button>
            {showAdvanced && (
              <div>
                <label className="label-style">Description (Hindi)</label>
                <textarea value={product.description.hi} onChange={e=>upd('description',{...product.description,hi:e.target.value})} rows={3} className="input-style w-full resize-none font-hindi" placeholder="हिंदी विवरण…"/>
              </div>
            )}
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
              <h3 className="font-bold text-gray-700 mb-3 text-sm">Preview</h3>
              <div className="flex gap-4">
                {product.images[0] && <img src={product.images[0]} alt={product.name.en} className="w-24 h-24 object-cover rounded-xl border border-orange-200"/>}
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{product.name.en}</p>
                  <p className="text-xs text-gray-400 capitalize mb-1">{product.category}</p>
                  <div className="flex gap-3 mb-2">
                    <span className="line-through text-gray-400 text-sm">₹{product.price}</span>
                    <span className="font-bold text-primary">₹{product.offerPrice}</span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {product.benefits.filter(b=>b).map((b,i)=><li key={i}>✓ {b}</li>)}
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">{product.description.en}</p>
            </div>
          )}

          {/* Save buttons */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={()=>save(false)} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              <Save size={14}/>{saving?'Saving…':'Save as Draft'}
            </button>
            <button onClick={()=>save(true)} disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-orange disabled:opacity-60">
              <Eye size={14}/>{saving?'Publishing…':'Publish Product'}
            </button>
          </div>

          {savedId && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
              <span>✅ Saved!</span>
              <a href="/admin/products" className="underline font-medium">View in Products →</a>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .label-style { display:block; font-size:.8rem; font-weight:500; color:#5C3D1E; margin-bottom:4px; }
        .input-style { padding:8px 12px; border:1px solid #fed7aa; border-radius:10px; font-size:.875rem; outline:none; transition:border-color .2s; width:100%; }
        .input-style:focus { border-color:#FF6B00; box-shadow:0 0 0 2px rgba(255,107,0,.1); }
        .font-hindi { font-family: 'Noto Sans Devanagari', sans-serif; }
      `}</style>
    </div>
  );
}
