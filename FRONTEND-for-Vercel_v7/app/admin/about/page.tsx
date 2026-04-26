'use client';
import { useEffect, useState, useRef } from 'react';
import { contentAPI, uploadAPI } from '../../../lib/api';
import { Save, Upload, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploader from '../../../components/admin/ImageUploader';

const DEFAULT = {
  hero_title: 'About Vastu Arya',
  hero_subtitle: "India's Premier Vastu & Astrology Platform",
  hero_bg_image: '',
  expert_name: 'Dr. Pranveer Pratap Singh Tomar',
  expert_title: 'IVAF Certified Vastu Master',
  expert_image: '',
  expert_bio1: "Dr. Pranveer Pratap Singh Tomar is one of India's most respected Vastu Shastra experts, holding a prestigious Doctorate degree in Vastu Vadana. Awarded by the International Vedic Astrology Federation (IVAF LLC, USA) and recognized in New Delhi, he has transformed over 45,000 lives.",
  expert_bio2: 'With 15+ years spanning residential Vastu, commercial properties, numerology, gemology, and astrology — Dr. Pranveer brings a scientific, evidence-based approach to ancient Vedic wisdom.',
  stat1_value: '45,000+', stat1_label: 'Happy Clients',
  stat2_value: '15+',     stat2_label: 'Years Experience',
  stat3_value: '100+',    stat3_label: 'Services Offered',
  stat4_value: '50+',     stat4_label: 'Cities Covered',
  cta_heading: 'Begin Your Vastu Transformation Today',
  cta_subheading: 'Join 45,000+ families who transformed their lives with authentic Vastu guidance',
};

export default function AdminAboutPage() {
  const [data, setData]     = useState<typeof DEFAULT>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing content from DB
  useEffect(() => {
    contentAPI.getPage('about')
      .then((r: any) => {
        const raw: any[] = r?.data?.raw || [];
        if (raw.length > 0) {
          const merged: any = { ...DEFAULT };
          raw.forEach((item: any) => { if (item.key in DEFAULT) merged[item.key] = item.value; });
          setData(merged);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const items = Object.entries(data).map(([key, value]) => ({
        page: 'about', section: 'main', key, value: String(value),
        type: key.includes('image') || key.includes('bg') ? 'image' : 'text',
        label: key.replace(/_/g, ' '),
      }));
      await contentAPI.bulkUpdate( items );
      toast.success('About page saved!');
    } catch {
      toast.error('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof typeof DEFAULT, val: string) =>
    setData(prev => ({ ...prev, [key]: val }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">About Page Editor</h1>
          <p className="text-gray-500 text-sm">Edit text, upload images and manage the About page</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setData(DEFAULT)} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw size={14}/> Reset
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60 shadow-orange">
            {saving ? <><Loader2 size={14} className="animate-spin"/>Saving…</> : <><Save size={14}/>Save Changes</>}
          </button>
        </div>
      </div>

      {/* ── Section 1: Hero ── */}
      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm space-y-4">
        <h2 className="font-bold text-gray-700 text-base border-b border-gray-100 pb-2">🏠 Hero Section</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-style">Hero Title</label>
            <input value={data.hero_title} onChange={e=>set('hero_title',e.target.value)} className="input-style w-full" placeholder="About Vastu Arya"/>
          </div>
          <div>
            <label className="label-style">Hero Subtitle</label>
            <input value={data.hero_subtitle} onChange={e=>set('hero_subtitle',e.target.value)} className="input-style w-full" placeholder="India's Premier Platform"/>
          </div>
        </div>
        <ImageUploader
          images={data.hero_bg_image ? [data.hero_bg_image] : ['']}
          onChange={imgs => set('hero_bg_image', imgs[0] || '')}
          maxImages={1}
          label="Hero Background Image (optional)"
        />
      </div>

      {/* ── Section 2: Expert Profile ── */}
      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm space-y-4">
        <h2 className="font-bold text-gray-700 text-base border-b border-gray-100 pb-2">👤 Expert Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-style">Expert Full Name</label>
            <input value={data.expert_name} onChange={e=>set('expert_name',e.target.value)} className="input-style w-full" placeholder="Dr. Pranoy Pratap Singh Tomar"/>
          </div>
          <div>
            <label className="label-style">Expert Title / Designation</label>
            <input value={data.expert_title} onChange={e=>set('expert_title',e.target.value)} className="input-style w-full" placeholder="IVAF Certified Vastu Master"/>
          </div>
        </div>

        {/* Expert photo with preview */}
        <div>
          <label className="label-style">Expert Profile Photo</label>
          <p className="text-xs text-gray-400 mb-2">Upload Dr. Pranoy&apos;s photo — will appear as a circular profile image on the About page</p>
          <div className="flex items-start gap-4">
            {/* Circular preview */}
            {data.expert_image && (
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-orange-200 shadow-md">
                  <img src={data.expert_image} alt="Expert" className="w-full h-full object-cover"/>
                </div>
                <p className="text-xs text-gray-400 text-center mt-1">Preview</p>
              </div>
            )}
            <div className="flex-1">
              <ImageUploader
                images={data.expert_image ? [data.expert_image] : ['']}
                onChange={imgs => set('expert_image', imgs[0] || '')}
                maxImages={1}
                label=""
              />
            </div>
          </div>
        </div>

        <div>
          <label className="label-style">Bio Paragraph 1</label>
          <textarea value={data.expert_bio1} onChange={e=>set('expert_bio1',e.target.value)} rows={3} className="input-style w-full"/>
        </div>
        <div>
          <label className="label-style">Bio Paragraph 2</label>
          <textarea value={data.expert_bio2} onChange={e=>set('expert_bio2',e.target.value)} rows={3} className="input-style w-full"/>
        </div>
      </div>

      {/* ── Section 3: Stats ── */}
      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
        <h2 className="font-bold text-gray-700 text-base border-b border-gray-100 pb-3 mb-4">📊 Stats / Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(n => (
            <div key={n} className="bg-orange-50 rounded-xl p-3 border border-orange-100">
              <label className="label-style">Stat {n} Value</label>
              <input value={(data as any)[`stat${n}_value`]} onChange={e=>set(`stat${n}_value` as any,e.target.value)} className="input-style w-full mb-2 text-center font-bold text-primary" placeholder="45,000+"/>
              <label className="label-style">Label</label>
              <input value={(data as any)[`stat${n}_label`]} onChange={e=>set(`stat${n}_label` as any,e.target.value)} className="input-style w-full text-center" placeholder="Happy Clients"/>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 4: CTA ── */}
      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm space-y-3">
        <h2 className="font-bold text-gray-700 text-base border-b border-gray-100 pb-2">📣 Bottom CTA Section</h2>
        <div>
          <label className="label-style">CTA Heading</label>
          <input value={data.cta_heading} onChange={e=>set('cta_heading',e.target.value)} className="input-style w-full" placeholder="Begin Your Vastu Transformation Today"/>
        </div>
        <div>
          <label className="label-style">CTA Subheading</label>
          <input value={data.cta_subheading} onChange={e=>set('cta_subheading',e.target.value)} className="input-style w-full" placeholder="Join 45,000+ families..."/>
        </div>
      </div>

      {/* Save footer */}
      <div className="flex justify-end pb-8">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-60 shadow-orange">
          {saving?<><Loader2 size={14} className="animate-spin"/>Saving…</>:<><Save size={14}/>Save All Changes</>}
        </button>
      </div>

      <style jsx global>{`
        .label-style{display:block;font-size:.8rem;font-weight:500;color:#5C3D1E;margin-bottom:4px}
        .input-style{padding:8px 12px;border:1px solid #fed7aa;border-radius:10px;font-size:.875rem;outline:none;width:100%;transition:border-color .2s}
        .input-style:focus{border-color:#FF6B00;box-shadow:0 0 0 2px rgba(255,107,0,.1)}
      `}</style>
    </div>
  );
}
