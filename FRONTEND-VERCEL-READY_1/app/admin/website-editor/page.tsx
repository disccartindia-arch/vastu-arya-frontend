'use client';
import { useEffect, useState } from 'react';
import { contentAPI, configAPI, uploadAPI } from '../../../lib/api';
import { Save, RefreshCw, Eye, Type, Zap, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const PAGES = [
  { key: 'home', label: 'Home Page' },
  { key: 'global', label: 'Global (Navbar / Footer / SEO / Popup)' },
];

const SECTIONS: Record<string, any[]> = {
  home: [
    { key: 'hero', label: 'Hero Section', fields: [
      { key: 'title1', label: 'Title Line 1' }, { key: 'title2', label: 'Title Line 2 (gold)' },
      { key: 'subtitle', label: 'Subtitle' }, { key: 'cta1', label: 'Primary Button' },
      { key: 'cta2', label: 'Secondary Button' }, { key: 'badge', label: 'Badge Text' },
    ]},
    { key: 'stats', label: 'Statistics', fields: [
      { key: 'clients', label: 'Happy Clients Count' }, { key: 'experience', label: 'Years Experience' },
      { key: 'services', label: 'Services Count' }, { key: 'cities', label: 'Cities Served' },
    ]},
    { key: 'cta', label: 'Bottom CTA Banner', fields: [
      { key: 'title', label: 'CTA Title' }, { key: 'subtitle', label: 'CTA Subtitle' },
      { key: 'button', label: 'Button Text' },
    ]},
    { key: 'featured', label: 'Services Section', fields: [
      { key: 'title', label: 'Section Heading' }, { key: 'subtitle', label: 'Section Subheading' },
    ]},
  ],
  global: [
    { key: 'navbar', label: 'Navbar', fields: [
      { key: 'phone', label: 'Phone Number' }, { key: 'badge', label: 'Top Banner Badge' },
    ]},
    { key: 'popup', label: 'Appointment Popup', fields: [
      { key: 'title', label: 'Popup Title' }, { key: 'subtitle', label: 'Popup Subtitle' },
      { key: 'badge', label: 'Offer Badge' }, { key: 'cta', label: 'Book Button Text' },
    ]},
    { key: 'seo', label: 'SEO & Meta', fields: [
      { key: 'title', label: 'Page Title (SEO)' }, { key: 'description', label: 'Meta Description' },
    ]},
    { key: 'footer', label: 'Footer', fields: [
      { key: 'tagline', label: 'Footer Tagline' }, { key: 'copyright', label: 'Copyright Line' },
    ]},
  ],
};

const BG_FIELDS = [
  { key: 'bg_animations_enabled', label: 'Enable Animations', type: 'bool' },
  { key: 'bg_particles_enabled', label: 'Enable Gold Particles', type: 'bool' },
  { key: 'bg_gold_intensity', label: 'Gold Intensity (0–1)', type: 'num', min: 0, max: 1, step: 0.05 },
  { key: 'bg_animation_speed', label: 'Animation Speed (0.1–3)', type: 'num', min: 0.1, max: 3, step: 0.1 },
  { key: 'bg_particle_opacity', label: 'Particle Opacity (0–1)', type: 'num', min: 0, max: 1, step: 0.05 },
  { key: 'bg_star_density', label: 'Star Count (20–200)', type: 'num', min: 20, max: 200, step: 5 },
];

export default function WebsiteEditorPage() {
  const [activePage, setActivePage] = useState('home');
  const [activeTab, setActiveTab] = useState<'content' | 'background' | 'logo'>('content');
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [config, setConfig] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [activePage]);

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, cfgRes] = await Promise.all([contentAPI.getPage(activePage), configAPI.get()]);
      setContent(cRes.data.data || {});
      setConfig(cfgRes.data.data || {});
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const updateContent = (section: string, key: string, value: string) => {
    setContent(p => ({ ...p, [section]: { ...p[section], [key]: value } }));
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const items: any[] = [];
      (SECTIONS[activePage] || []).forEach((sec: any) => {
        sec.fields.forEach((f: any) => {
          items.push({ page: activePage, section: sec.key, key: f.key, value: content[sec.key]?.[f.key] || '', type: 'text', label: f.label });
        });
      });
      await contentAPI.bulkUpdate(items);
      toast.success('Content saved! Changes are live.');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await configAPI.update(config);
      toast.success('Settings saved!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      const { data } = await uploadAPI.single(fd);
      setConfig(c => ({ ...c, logo_url: data.data.url }));
      await configAPI.update({ logo_url: data.data.url });
      toast.success('Logo updated!');
    } catch { toast.error('Upload failed'); }
  };

  const sections = SECTIONS[activePage] || [];

  const TABS = [
    { id: 'content', label: 'Content Editor', icon: Type },
    { id: 'background', label: 'Background & Animations', icon: Zap },
    { id: 'logo', label: 'Logo & Branding', icon: Image },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Website Editor</h1>
          <p className="text-gray-500 text-sm">Edit all website content — no coding required</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"><RefreshCw size={14} /> Refresh</button>
          <a href="/" target="_blank" className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"><Eye size={14} /> View Site</a>
          <button onClick={activeTab === 'background' || activeTab === 'logo' ? saveConfig : saveContent} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-orange disabled:opacity-60">
            <Save size={14} />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-3 flex-wrap">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === t.id ? 'bg-primary text-white shadow-orange' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <Icon size={14} />{t.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      {activeTab === 'content' && (
        <div className="grid lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm h-fit">
            <p className="font-semibold text-gray-700 text-sm mb-3">Pages</p>
            <div className="space-y-1">
              {PAGES.map(p => (
                <button key={p.key} onClick={() => setActivePage(p.key)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${activePage === p.key ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {loading ? [...Array(3)].map((_,i) => <div key={i} className="h-32 skeleton rounded-2xl" />) :
              sections.map((sec: any) => (
                <div key={sec.key} className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">{sec.label}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {sec.fields.map((f: any) => (
                      <div key={f.key}>
                        <label className="label-style">{f.label}</label>
                        <input value={content[sec.key]?.[f.key] || ''} onChange={e => updateContent(sec.key, f.key, e.target.value)}
                          className="input-style" placeholder={`Enter ${f.label}...`} />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* BACKGROUND */}
      {activeTab === 'background' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl space-y-4">
          <h3 className="font-semibold text-gray-800 pb-2 border-b border-gray-100">Gold Particle Background Controls</h3>
          {BG_FIELDS.map(f => (
            <div key={f.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium text-gray-800 text-sm">{f.label}</p>
                <p className="text-xs text-gray-400">{f.key}</p>
              </div>
              {f.type === 'bool' ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={!!config[f.key]} onChange={e => setConfig(c => ({ ...c, [f.key]: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              ) : (
                <div className="flex items-center gap-2">
                  <input type="range" min={f.min} max={f.max} step={f.step} value={config[f.key] ?? f.max/2}
                    onChange={e => setConfig(c => ({ ...c, [f.key]: parseFloat(e.target.value) }))}
                    className="w-24 accent-primary" />
                  <span className="text-sm font-mono w-10 text-right text-gray-600">{config[f.key] ?? '-'}</span>
                </div>
              )}
            </div>
          ))}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700">
            💡 Background animations are GPU-optimized. Changes apply on next page load.
          </div>
        </div>
      )}

      {/* LOGO */}
      {activeTab === 'logo' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md space-y-5">
          <h3 className="font-semibold text-gray-800 pb-2 border-b border-gray-100">Logo & Branding</h3>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-200 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={config.logo_url || '/logo.jpg'} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">Current Logo</p>
              <p className="text-xs text-gray-400 mt-0.5">{config.logo_url || '/logo.jpg'}</p>
            </div>
          </div>
          <div>
            <label className="label-style mb-2">Upload New Logo</label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
              <Image size={18} className="text-primary" />
              <span className="text-sm text-gray-600">Click to choose file (PNG/JPG/SVG)</span>
              <input type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
            </label>
          </div>
          <div>
            <label className="label-style">Or enter image URL</label>
            <input value={config.logo_url || ''} onChange={e => setConfig(c => ({ ...c, logo_url: e.target.value }))}
              className="input-style" placeholder="/logo.jpg or https://..." />
          </div>
          <button onClick={saveConfig} disabled={saving} className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm shadow-orange disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Logo'}
          </button>
        </div>
      )}

      <style jsx global>{`.label-style{display:block;font-size:.8rem;font-weight:500;color:#5C3D1E;margin-bottom:4px}.input-style{padding:8px 12px;border:1px solid #fed7aa;border-radius:10px;font-size:.875rem;outline:none;width:100%;transition:border-color .2s}.input-style:focus{border-color:#FF6B00;box-shadow:0 0 0 2px rgba(255,107,0,.1)}`}</style>
    </div>
  );
}
