'use client';
import { useState } from 'react';
import {
  Sparkles, Save, RefreshCw, Plus, Eye, EyeOff,
  Upload, X, ChevronDown, ChevronUp, Loader2, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productsAPI, uploadAPI, productGeneratorAPI } from '../../../lib/api';
import { STORE_CATEGORIES } from '../../../lib/utils';

interface GenProduct {
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

const EMPTY_PRODUCT: GenProduct = {
  name:{ en:'', hi:'' }, slug:'', category:'bracelets',
  description:{ en:'', hi:'' }, benefits:['','',''],
  price:999, offerPrice:699, sku:'', images:[''],
  stock:50, isFeatured:false, isNewLaunch:true, isActive:false,
};

function makeSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProductGeneratorPage() {
  const [inputText,  setInputText]   = useState('');
  const [category,   setCategory]    = useState('bracelets');
  const [generating, setGenerating]  = useState(false);
  const [saving,     setSaving]      = useState(false);
  const [uploading,  setUploading]   = useState(false);
  const [product,    setProduct]     = useState<GenProduct | null>(null);
  const [showAdvanced, setShowAdv]   = useState(false);
  const [showPreview,  setShowPrev]  = useState(false);
  const [savedId,    setSavedId]     = useState<string | null>(null);

  /* ── Generate ── */
  const generate = async () => {
    const input = inputText.trim();
    if (input.length < 3) { toast.error('Enter a product name (min 3 characters)'); return; }
    setGenerating(true);
    setProduct(null);
    setSavedId(null);
    try {
      const r = await productGeneratorAPI.generate({ input, category });
      if (r?.data?.success && r.data.data) {
        setProduct(r.data.data);
        toast.success('Product generated! Review and save.', { icon: '✨' });
      } else {
        throw new Error(r?.data?.message || 'Generation failed');
      }
    } catch (e: any) {
      // Smart template fallback when AI is unavailable
      const slug = makeSlug(input);
      const template: GenProduct = {
        name:{ en: input, hi: '' },
        slug,
        category,
        description:{
          en: `Natural ${input} — a premium spiritual product with powerful energetic properties. ` +
              `Carries authentic vibrational energy beneficial for meditation, wellbeing and Vastu space enhancement. ` +
              `Sourced from quality origins and energised with sacred intentions. ` +
              `Comes with a Dr. PPS Tomar usage and placement guide.`,
          hi: '',
        },
        benefits: [
          'Enhances positive energy & spiritual awareness',
          'Activates relevant chakra for healing & balance',
          'Vastu recommended — home, office & meditation',
          'Premium quality, authenticity guaranteed',
        ],
        price: 999, offerPrice: 699,
        sku: `VA-${category.slice(0,3).toUpperCase()}-${slug.slice(0,4).toUpperCase()}`,
        images: [''], stock: 50,
        isFeatured: false, isNewLaunch: true, isActive: false,
      };
      setProduct(template);
      toast('Template created — edit fields and save', { icon: '✏️' });
    } finally {
      setGenerating(false);
    }
  };

  /* ── Upload image ── */
  const handleImageUpload = async (file: File, idx: number) => {
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const { data } = await uploadAPI.single(fd);
      setProduct(p => {
        if (!p) return p;
        const imgs = [...p.images]; imgs[idx] = data.data.url;
        return { ...p, images: imgs };
      });
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed. Try again.'); }
    finally { setUploading(false); }
  };

  /* ── Save ── */
  const save = async (publish: boolean) => {
    if (!product) return;
    if (!product.name.en.trim()) { toast.error('Product name is required'); return; }
    if (!product.slug.trim()) { toast.error('Slug is required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...product,
        isActive: publish,
        images: product.images.filter(u => u.trim()),
        benefits: product.benefits.filter(b => b.trim()),
        slug: product.slug || makeSlug(product.name.en),
      };
      const r = await productsAPI.create(payload);
      setSavedId(r.data.data?._id || 'saved');
      toast.success(publish ? '✅ Product published!' : '📝 Saved as draft!');
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Save failed';
      if (msg.includes('duplicate') || msg.includes('slug')) {
        toast.error('Slug already exists — change the slug field');
      } else {
        toast.error(msg);
      }
    } finally { setSaving(false); }
  };

  /* ── Helpers ── */
  const upd = (key: keyof GenProduct, val: any) =>
    setProduct(p => p ? { ...p, [key]: val } : p);
  const updName = (lang: 'en'|'hi', v: string) =>
    setProduct(p => p ? { ...p, name: { ...p.name, [lang]: v }, slug: lang==='en' ? makeSlug(v) : p.slug } : p);
  const updDesc = (lang: 'en'|'hi', v: string) =>
    setProduct(p => p ? { ...p, description: { ...p.description, [lang]: v } } : p);
  const updBenefit = (i: number, v: string) =>
    setProduct(p => { if (!p) return p; const b=[...p.benefits]; b[i]=v; return {...p,benefits:b}; });
  const addBenefit = () =>
    setProduct(p => p ? { ...p, benefits: [...p.benefits, ''] } : p);
  const delBenefit = (i: number) =>
    setProduct(p => p ? { ...p, benefits: p.benefits.filter((_,j)=>j!==i) } : p);
  const updImg = (i: number, v: string) =>
    setProduct(p => { if (!p) return p; const imgs=[...p.images]; imgs[i]=v; return {...p,images:imgs}; });
  const addImg = () =>
    setProduct(p => p && p.images.length < 5 ? { ...p, images: [...p.images, ''] } : p);
  const delImg = (i: number) =>
    setProduct(p => p ? { ...p, images: p.images.filter((_,j)=>j!==i) } : p);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles size={22} className="text-primary" /> AI Product Generator
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Enter a product name — AI generates full content. Edit and publish instantly.
          </p>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="sm:col-span-2">
            <label className="label-style">Product Name or Description *</label>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              rows={3}
              placeholder="e.g. 7 Chakra Bracelet&#10;or: Black tourmaline bracelet for EMF protection and grounding..."
              className="input-style w-full resize-none"
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) generate(); }}
            />
            <p className="text-xs text-gray-400 mt-1">Tip: Ctrl+Enter to generate</p>
          </div>
          <div>
            <label className="label-style">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-style w-full mb-3">
              {STORE_CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
            <div className="bg-orange-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
              <p>💡 Be specific for better AI output</p>
              <p>💡 Mention stone type or tradition</p>
              <p>💡 Include Vedic/Vastu significance</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <button onClick={generate} disabled={generating}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-orange disabled:opacity-60">
            {generating
              ? <><Loader2 size={15} className="animate-spin" />Generating…</>
              : <><Sparkles size={15} />Generate with AI</>}
          </button>
          {product && (
            <button onClick={generate} disabled={generating}
              className="flex items-center gap-2 px-4 py-2.5 border border-orange-200 text-primary rounded-xl text-sm font-medium hover:bg-orange-50 transition-all">
              <RefreshCw size={13} />Regenerate
            </button>
          )}
          <span className="text-xs text-gray-400">Works with Gemini, Claude, or creates a smart template</span>
        </div>
      </div>

      {/* Generated Product Editor */}
      {product && (
        <div className="space-y-4">
          {/* Status bar */}
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <span className="flex items-center gap-2 text-sm text-green-700 font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Product ready — review and save
            </span>
            <button onClick={() => setShowPrev(!showPrev)}
              className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-800 font-medium">
              {showPrev ? <EyeOff size={12}/> : <Eye size={12}/>}{showPrev ? 'Hide' : 'Preview'}
            </button>
          </div>

          {/* Preview Panel */}
          {showPrev && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Live Preview</p>
              <div className="flex gap-4 flex-wrap">
                {product.images[0] && (
                  <img src={product.images[0]} alt="" className="w-24 h-24 object-cover rounded-xl border border-orange-100 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-base">{product.name.en || 'Product Name'}</p>
                  <p className="text-xs text-gray-400 capitalize mb-2">{product.category} • SKU: {product.sku}</p>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="line-through text-gray-400 text-sm">₹{product.price.toLocaleString()}</span>
                    <span className="font-bold text-primary text-lg">₹{product.offerPrice.toLocaleString()}</span>
                    {product.price > 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{Math.round((1-product.offerPrice/product.price)*100)}% off</span>}
                  </div>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {product.benefits.filter(b=>b).slice(0,4).map((b,i)=>(
                      <li key={i} className="flex items-start gap-1.5"><CheckCircle2 size={11} className="text-green-500 flex-shrink-0 mt-0.5"/>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {product.description.en && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3 border-t border-gray-100 pt-3">{product.description.en}</p>
              )}
            </div>
          )}

          {/* Main Edit Fields */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            {/* Names */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-style">Product Name (English) *</label>
                <input value={product.name.en} onChange={e => updName('en', e.target.value)} className="input-style w-full" placeholder="e.g. 7 Chakra Healing Bracelet" />
              </div>
              <div>
                <label className="label-style">Name (Hindi)</label>
                <input value={product.name.hi} onChange={e => updName('hi', e.target.value)} className="input-style w-full" placeholder="हिंदी नाम" />
              </div>
              <div>
                <label className="label-style">URL Slug *</label>
                <input
                  value={product.slug}
                  onChange={e => upd('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))}
                  className="input-style w-full font-mono text-xs"
                  placeholder="7-chakra-healing-bracelet"
                />
                <p className="text-xs text-gray-400 mt-0.5">Auto-generated from name. Must be unique.</p>
              </div>
              <div>
                <label className="label-style">Category</label>
                <select value={product.category} onChange={e => upd('category',e.target.value)} className="input-style w-full">
                  {STORE_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label-style">Original Price (₹)</label>
                <input type="number" min="0" value={product.price} onChange={e => upd('price',+e.target.value)} className="input-style w-full" />
              </div>
              <div>
                <label className="label-style">Offer Price (₹)</label>
                <input type="number" min="0" value={product.offerPrice} onChange={e => upd('offerPrice',+e.target.value)} className="input-style w-full" />
              </div>
              <div>
                <label className="label-style">Stock Qty</label>
                <input type="number" min="0" value={product.stock} onChange={e => upd('stock',+e.target.value)} className="input-style w-full" />
              </div>
            </div>

            {/* SKU */}
            <div className="max-w-xs">
              <label className="label-style">SKU</label>
              <input value={product.sku} onChange={e => upd('sku',e.target.value)} className="input-style w-full" placeholder="VA-BR-001" />
            </div>

            {/* Description */}
            <div>
              <label className="label-style">Description (English)</label>
              <textarea value={product.description.en} onChange={e => updDesc('en',e.target.value)} rows={5} className="input-style w-full resize-y" />
              <p className="text-xs text-gray-400 mt-0.5">{product.description.en.length} chars (aim for 150-300)</p>
            </div>

            {/* Benefits */}
            <div>
              <label className="label-style">Key Benefits (shown as bullet points)</label>
              <div className="space-y-2">
                {product.benefits.map((b, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-primary text-sm pt-2 flex-shrink-0">✓</span>
                    <input value={b} onChange={e => updBenefit(i,e.target.value)} className="flex-1 input-style" placeholder={`Benefit ${i+1} — be specific`} />
                    {product.benefits.length > 1 && (
                      <button onClick={() => delBenefit(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><X size={13}/></button>
                    )}
                  </div>
                ))}
                <button onClick={addBenefit} className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                  <Plus size={11}/>Add Benefit
                </button>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="label-style">Product Images (up to 5)</label>
              <div className="space-y-2">
                {product.images.map((url, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-xl border border-orange-200 bg-orange-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {url ? (
                        <img src={url} alt="" className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect fill="%23FFF8EE" width="48" height="48"/><text y="32" x="12" font-size="24">📦</text></svg>'; }} />
                      ) : (
                        <Upload size={14} className="text-gray-300" />
                      )}
                    </div>
                    <label className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl font-semibold cursor-pointer border transition-all flex-shrink-0 ${uploading?'opacity-50 cursor-not-allowed':'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-primary'}`}>
                      {uploading ? <Loader2 size={11} className="animate-spin"/> : <Upload size={11}/>}
                      {uploading ? 'Uploading…' : 'Upload'}
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploading}
                        onChange={e => { const f=e.target.files?.[0]; if(f) handleImageUpload(f,i); e.target.value=''; }} />
                    </label>
                    <input value={url} onChange={e => updImg(i,e.target.value)} className="flex-1 input-style text-xs" placeholder="Or paste Cloudinary/external URL…"/>
                    {product.images.length > 1 && (
                      <button onClick={() => delImg(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><X size={13}/></button>
                    )}
                  </div>
                ))}
                {product.images.length < 5 && (
                  <button onClick={addImg} className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                    <Plus size={11}/>Add Another Image
                  </button>
                )}
              </div>
            </div>

            {/* Flags */}
            <div className="flex flex-wrap gap-5 pt-2 border-t border-gray-100">
              {([
                { k:'isActive'    as const, label:'Active (visible on site)' },
                { k:'isFeatured'  as const, label:'Featured'                },
                { k:'isNewLaunch' as const, label:'New Launch badge'         },
              ]).map(({k,label}) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!product[k]} onChange={e => upd(k,e.target.checked)} className="w-4 h-4 accent-primary"/>
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>

            {/* Advanced */}
            <div>
              <button onClick={() => setShowAdv(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 font-medium">
                {showAdvanced ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                {showAdvanced ? 'Hide' : 'Show'} Advanced Fields
              </button>
              {showAdvanced && (
                <div className="mt-3">
                  <label className="label-style">Description (Hindi)</label>
                  <textarea value={product.description.hi} onChange={e => updDesc('hi',e.target.value)} rows={3} className="input-style w-full resize-none" placeholder="हिंदी विवरण यहाँ लिखें…"/>
                </div>
              )}
            </div>
          </div>

          {/* Save Actions */}
          <div className="flex gap-3 flex-wrap items-center">
            <button onClick={() => save(false)} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all">
              <Save size={14}/>{saving?'Saving…':'Save as Draft'}
            </button>
            <button onClick={() => save(true)} disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-orange disabled:opacity-60">
              <Eye size={14}/>{saving?'Publishing…':'Publish Product'}
            </button>
            <button onClick={() => { setProduct(null); setSavedId(null); setInputText(''); }}
              className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2">
              Clear
            </button>
          </div>

          {savedId && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl text-sm text-green-700">
              <CheckCircle2 size={20} className="flex-shrink-0"/>
              <span>Product saved successfully!</span>
              <a href="/admin/products" className="ml-auto underline font-semibold hover:text-green-900">View All Products →</a>
            </div>
          )}
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
