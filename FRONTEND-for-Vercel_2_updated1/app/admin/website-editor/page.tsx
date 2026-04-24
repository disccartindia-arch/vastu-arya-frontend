'use client';
import { useEffect, useState } from 'react';
import {
  contentAPI, configAPI, uploadAPI,
  homepageSettingsAPI, testimonialsAPI, themeSettingsAPI,
} from '../../../lib/api';
import {
  Save, RefreshCw, Eye, Type, Zap, Image as ImageIcon,
  Home, Star, Palette, Plus, Pencil, Trash2, X,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Existing constants (unchanged) ──────────────────────────────────────────

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

const THEME_FIELDS = [
  { key: 'primaryColor', label: 'Primary Color' },
  { key: 'secondaryColor', label: 'Secondary Color' },
  { key: 'accentColor', label: 'Accent / Gold Color' },
  { key: 'buttonBgColor', label: 'Button Background' },
  { key: 'buttonTextColor', label: 'Button Text Color' },
  { key: 'heroOverlayColor', label: 'Hero Overlay Color' },
  { key: 'gradientFrom', label: 'Gradient Start Color' },
  { key: 'gradientTo', label: 'Gradient End Color' },
  { key: 'cardBgColor', label: 'Card Background Color' },
  { key: 'textColor', label: 'Main Text Color' },
  { key: 'borderColor', label: 'Border Color' },
];

type TabId = 'content' | 'homepage' | 'testimonials' | 'theme' | 'background' | 'logo';

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: 'content', label: 'Content Editor', icon: Type },
  { id: 'homepage', label: 'Homepage Settings', icon: Home },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'theme', label: 'Theme & Colors', icon: Palette },
  { id: 'background', label: 'Background & FX', icon: Zap },
  { id: 'logo', label: 'Logo & Branding', icon: ImageIcon },
];

const DEFAULT_HP = {
  contactNumber: '+91-9999999999',
  heroHeading: 'Transform Your Space, Transform Your Life',
  heroSubheading: "India's Premier Vastu Shastra & Astrology Platform by Dr. PPS",
  cta1Text: 'Book Appointment @ ₹11',
  cta1Link: '/book-appointment',
  cta2Text: 'Explore Vastu Store',
  cta2Link: '/vastu-store',
  trustBadges: [
    { label: 'IVAF Awarded', order: 0 },
    { label: '10,000+ Consultations', order: 1 },
    { label: 'New Delhi Recognized', order: 2 },
  ],
  stats: [
    { value: '10,000+', label: 'Happy Clients', order: 0 },
    { value: '15+', label: 'Years Experience', order: 1 },
    { value: '100+', label: 'Services', order: 2 },
    { value: '50+', label: 'Cities Served', order: 3 },
  ],
};

const DEFAULT_THEME = {
  primaryColor: '#FF6B00', secondaryColor: '#FF9933', accentColor: '#D4A017',
  buttonBgColor: '#FF6B00', buttonTextColor: '#FFFFFF', heroOverlayColor: '#0D0500',
  gradientFrom: '#0D0500', gradientTo: '#2D1000', cardBgColor: '#FEFAF5',
  textColor: '#1A0A00', borderColor: '#FED7AA',
};

const EMPTY_TESTIMONIAL = {
  name: '', city: '', service: '', text: '', rating: 5, avatar: '', order: 0, isActive: true,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function WebsiteEditorPage() {
  // Existing state
  const [activePage, setActivePage] = useState('home');
  const [activeTab, setActiveTab] = useState<TabId>('content');
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [config, setConfig] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New state
  const [homepageSettings, setHomepageSettings] = useState<any>(DEFAULT_HP);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [themeSettings, setThemeSettings] = useState<any>(DEFAULT_THEME);

  // Testimonial modal state
  const [showTModal, setShowTModal] = useState(false);
  const [editingT, setEditingT] = useState<any>(null);
  const [tForm, setTForm] = useState<any>(EMPTY_TESTIMONIAL);
  const [tSaving, setTSaving] = useState(false);

  // Trust badge / stat inline edit helpers
  const [newBadge, setNewBadge] = useState('');
  const [newStat, setNewStat] = useState({ value: '', label: '' });

  useEffect(() => { load(); }, [activePage]);

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, cfgRes, hRes, tRes, thRes] = await Promise.all([
        contentAPI.getPage(activePage),
        configAPI.get(),
        homepageSettingsAPI.get().catch(() => ({ data: { data: null } })),
        testimonialsAPI.getAll().catch(() => ({ data: { data: [] } })),
        themeSettingsAPI.get().catch(() => ({ data: { data: null } })),
      ]);
      setContent(cRes.data.data || {});
      setConfig(cfgRes.data.data || {});
      if (hRes?.data?.data) setHomepageSettings((p: any) => ({ ...p, ...hRes.data.data }));
      setTestimonials(tRes?.data?.data || []);
      if (thRes?.data?.data) setThemeSettings((p: any) => ({ ...p, ...thRes.data.data }));
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // ── Save helpers ────────────────────────────────────────────────────────────

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
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await configAPI.update(config);
      toast.success('Settings saved!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const saveHomepageSettings = async () => {
    setSaving(true);
    try {
      await homepageSettingsAPI.update(homepageSettings);
      toast.success('Homepage settings saved!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const saveTheme = async () => {
    setSaving(true);
    try {
      await themeSettingsAPI.update(themeSettings);
      // Apply immediately to current page
      const root = document.documentElement;
      Object.entries(themeSettings).forEach(([k, v]) => {
        if (k === 'primaryColor') root.style.setProperty('--primary', v as string);
        if (k === 'accentColor') root.style.setProperty('--gold', v as string);
        if (k === 'cardBgColor') root.style.setProperty('--cream', v as string);
        if (k === 'textColor') root.style.setProperty('--text-dark', v as string);
      });
      toast.success('Theme saved and applied!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (activeTab === 'content') return saveContent();
    if (activeTab === 'background' || activeTab === 'logo') return saveConfig();
    if (activeTab === 'homepage') return saveHomepageSettings();
    if (activeTab === 'theme') return saveTheme();
    // testimonials tab saves per-item; no global save needed
  };

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      const { data } = await uploadAPI.single(fd);
      setConfig((c: any) => ({ ...c, logo_url: data.data.url }));
      await configAPI.update({ logo_url: data.data.url });
      toast.success('Logo updated!');
    } catch {
      toast.error('Upload failed');
    }
  };

  // ── Testimonial CRUD ────────────────────────────────────────────────────────

  const openAddT = () => { setEditingT(null); setTForm(EMPTY_TESTIMONIAL); setShowTModal(true); };
  const openEditT = (t: any) => { setEditingT(t); setTForm({ ...t }); setShowTModal(true); };

  const saveTestimonial = async () => {
    if (!tForm.name || !tForm.text) return toast.error('Name and text are required');
    setTSaving(true);
    try {
      if (editingT) {
        await testimonialsAPI.update(editingT._id, tForm);
        toast.success('Testimonial updated!');
      } else {
        await testimonialsAPI.create(tForm);
        toast.success('Testimonial added!');
      }
      setShowTModal(false);
      const tRes = await testimonialsAPI.getAll().catch(() => ({ data: { data: [] } }));
      setTestimonials(tRes?.data?.data || []);
    } catch {
      toast.error('Save failed');
    } finally {
      setTSaving(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await testimonialsAPI.delete(id);
      toast.success('Deleted!');
      setTestimonials((prev: any[]) => prev.filter((t: any) => t._id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  // ── Trust badge helpers ─────────────────────────────────────────────────────

  const addBadge = () => {
    if (!newBadge.trim()) return;
    const badges = [...(homepageSettings.trustBadges || []), { label: newBadge.trim(), order: (homepageSettings.trustBadges || []).length }];
    setHomepageSettings((p: any) => ({ ...p, trustBadges: badges }));
    setNewBadge('');
  };

  const removeBadge = (idx: number) => {
    const badges = [...(homepageSettings.trustBadges || [])];
    badges.splice(idx, 1);
    setHomepageSettings((p: any) => ({ ...p, trustBadges: badges }));
  };

  const updateBadgeLabel = (idx: number, label: string) => {
    const badges = [...(homepageSettings.trustBadges || [])];
    badges[idx] = { ...badges[idx], label };
    setHomepageSettings((p: any) => ({ ...p, trustBadges: badges }));
  };

  // ── Stat helpers ────────────────────────────────────────────────────────────

  const addStat = () => {
    if (!newStat.value.trim() || !newStat.label.trim()) return toast.error('Fill both value and label');
    const stats = [...(homepageSettings.stats || []), { ...newStat, order: (homepageSettings.stats || []).length }];
    setHomepageSettings((p: any) => ({ ...p, stats }));
    setNewStat({ value: '', label: '' });
  };

  const removeStat = (idx: number) => {
    const stats = [...(homepageSettings.stats || [])];
    stats.splice(idx, 1);
    setHomepageSettings((p: any) => ({ ...p, stats }));
  };

  const updateStat = (idx: number, field: 'value' | 'label', val: string) => {
    const stats = [...(homepageSettings.stats || [])];
    stats[idx] = { ...stats[idx], [field]: val };
    setHomepageSettings((p: any) => ({ ...p, stats }));
  };

  const sections = SECTIONS[activePage] || [];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Website Editor</h1>
          <p className="text-gray-500 text-sm">Edit all website content — no coding required</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"><RefreshCw size={14} /> Refresh</button>
          <a href="/" target="_blank" className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"><Eye size={14} /> View Site</a>
          {activeTab !== 'testimonials' && (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-orange disabled:opacity-60">
              <Save size={14} />{saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap border-b border-gray-100 pb-3">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === t.id ? 'bg-primary text-white shadow-orange' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <Icon size={14} />{t.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB: Content Editor ─────────────────────────────────────────────── */}
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
            {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />) :
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

      {/* ── TAB: Homepage Settings ──────────────────────────────────────────── */}
      {activeTab === 'homepage' && (
        <div className="space-y-5 max-w-3xl">
          {/* Basic fields */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 pb-2 border-b border-gray-100">Contact & Hero Content</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-style">Top-Left Contact Number</label>
                <input value={homepageSettings.contactNumber} onChange={e => setHomepageSettings((p: any) => ({ ...p, contactNumber: e.target.value }))} className="input-style" placeholder="+91-9999999999" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-style">Hero Main Heading</label>
                <input value={homepageSettings.heroHeading} onChange={e => setHomepageSettings((p: any) => ({ ...p, heroHeading: e.target.value }))} className="input-style" placeholder="Transform Your Space, Transform Your Life" />
                <p className="text-xs text-gray-400 mt-1">Use a comma to split into two lines. The text after the comma turns gold.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="label-style">Hero Subheading</label>
                <input value={homepageSettings.heroSubheading} onChange={e => setHomepageSettings((p: any) => ({ ...p, heroSubheading: e.target.value }))} className="input-style" placeholder="India's Premier Vastu Shastra & Astrology Platform by Dr. PPS" />
              </div>
              <div>
                <label className="label-style">CTA Button 1 Text</label>
                <input value={homepageSettings.cta1Text} onChange={e => setHomepageSettings((p: any) => ({ ...p, cta1Text: e.target.value }))} className="input-style" placeholder="Book Appointment @ ₹11" />
              </div>
              <div>
                <label className="label-style">CTA Button 1 Link</label>
                <input value={homepageSettings.cta1Link} onChange={e => setHomepageSettings((p: any) => ({ ...p, cta1Link: e.target.value }))} className="input-style" placeholder="/book-appointment" />
              </div>
              <div>
                <label className="label-style">CTA Button 2 Text</label>
                <input value={homepageSettings.cta2Text} onChange={e => setHomepageSettings((p: any) => ({ ...p, cta2Text: e.target.value }))} className="input-style" placeholder="Explore Vastu Store" />
              </div>
              <div>
                <label className="label-style">CTA Button 2 Link</label>
                <input value={homepageSettings.cta2Link} onChange={e => setHomepageSettings((p: any) => ({ ...p, cta2Link: e.target.value }))} className="input-style" placeholder="/vastu-store" />
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-800 pb-2 border-b border-gray-100">Trust Badges / Labels</h3>
            <div className="space-y-2">
              {(homepageSettings.trustBadges || []).map((badge: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input value={badge.label} onChange={e => updateBadgeLabel(idx, e.target.value)} className="input-style flex-1" placeholder="Badge label" />
                  <button onClick={() => removeBadge(idx)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input value={newBadge} onChange={e => setNewBadge(e.target.value)} onKeyDown={e => e.key === 'Enter' && addBadge()} className="input-style flex-1" placeholder="New badge label (e.g. IVAF Awarded)" />
              <button onClick={addBadge} className="flex items-center gap-1 px-3 py-2 bg-primary text-white rounded-xl text-sm font-semibold"><Plus size={14} /> Add</button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-800 pb-2 border-b border-gray-100">Hero Stats Cards</h3>
            <div className="space-y-2">
              {(homepageSettings.stats || []).map((stat: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input value={stat.value} onChange={e => updateStat(idx, 'value', e.target.value)} className="input-style w-28 flex-shrink-0" placeholder="10,000+" />
                  <input value={stat.label} onChange={e => updateStat(idx, 'label', e.target.value)} className="input-style flex-1" placeholder="Happy Clients" />
                  <button onClick={() => removeStat(idx)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <input value={newStat.value} onChange={e => setNewStat(s => ({ ...s, value: e.target.value }))} className="input-style w-28" placeholder="Value (e.g. 50+)" />
              <input value={newStat.label} onChange={e => setNewStat(s => ({ ...s, label: e.target.value }))} className="input-style flex-1 min-w-[120px]" placeholder="Label (e.g. Cities Served)" />
              <button onClick={addStat} className="flex items-center gap-1 px-3 py-2 bg-primary text-white rounded-xl text-sm font-semibold whitespace-nowrap"><Plus size={14} /> Add Stat</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Testimonials ───────────────────────────────────────────────── */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">{testimonials.length} testimonial(s) — shown on homepage</p>
            <button onClick={openAddT} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-orange"><Plus size={16} /> Add Testimonial</button>
          </div>

          <div className="grid gap-3">
            {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />) :
              testimonials.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Star size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No testimonials yet. Add your first one!</p>
                </div>
              ) : (
                testimonials.map((t: any) => (
                  <div key={t._id} className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-saffron-gradient flex items-center justify-center text-white font-bold flex-shrink-0">{t.name?.[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                        <span className="text-xs text-gray-400">{t.city}{t.city && t.service ? ' • ' : ''}{t.service}</span>
                        <div className="flex">{[...Array(t.rating || 5)].map((_, j) => <Star key={j} size={10} className="text-yellow-400 fill-yellow-400" />)}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{t.isActive ? 'Active' : 'Hidden'}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 italic">"{t.text}"</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEditT(t)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => deleteTestimonial(t._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))
              )
            }
          </div>
        </div>
      )}

      {/* ── TAB: Theme & Colors ─────────────────────────────────────────────── */}
      {activeTab === 'theme' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl space-y-1">
          <h3 className="font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-2">Color Palette</h3>
          {THEME_FIELDS.map(f => (
            <div key={f.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium text-gray-800 text-sm">{f.label}</p>
                <p className="text-xs text-gray-400">{themeSettings[f.key]}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <input type="color" value={themeSettings[f.key] || '#000000'}
                    onChange={e => setThemeSettings((p: any) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-10 h-10 -m-1 cursor-pointer border-0 bg-transparent" />
                </div>
                <input value={themeSettings[f.key] || ''} onChange={e => setThemeSettings((p: any) => ({ ...p, [f.key]: e.target.value }))}
                  className="input-style w-28 font-mono text-xs" placeholder="#FF6B00" />
              </div>
            </div>
          ))}
          <div className="pt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
            💡 Colors apply live to the frontend via CSS variables. Click <strong>Save Changes</strong> to persist.
          </div>
        </div>
      )}

      {/* ── TAB: Background & FX ───────────────────────────────────────────── */}
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
                  <input type="checkbox" checked={!!config[f.key]} onChange={e => setConfig((c: any) => ({ ...c, [f.key]: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              ) : (
                <div className="flex items-center gap-2">
                  <input type="range" min={f.min} max={f.max} step={f.step} value={config[f.key] ?? (((f.max as number) + (f.min as number)) / 2)}
                    onChange={e => setConfig((c: any) => ({ ...c, [f.key]: parseFloat(e.target.value) }))}
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

      {/* ── TAB: Logo & Branding ────────────────────────────────────────────── */}
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
              <ImageIcon size={18} className="text-primary" />
              <span className="text-sm text-gray-600">Click to choose file (PNG/JPG/SVG)</span>
              <input type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
            </label>
          </div>
          <div>
            <label className="label-style">Or enter image URL</label>
            <input value={config.logo_url || ''} onChange={e => setConfig((c: any) => ({ ...c, logo_url: e.target.value }))}
              className="input-style" placeholder="/logo.jpg or https://..." />
          </div>
          <button onClick={saveConfig} disabled={saving} className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm shadow-orange disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Logo'}
          </button>
        </div>
      )}

      {/* ── Testimonial Modal ───────────────────────────────────────────────── */}
      {showTModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">{editingT ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setShowTModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div><label className="label-style">Customer Name *</label><input value={tForm.name} onChange={e => setTForm((p: any) => ({ ...p, name: e.target.value }))} className="input-style w-full" placeholder="Rajesh Kumar" /></div>
                <div><label className="label-style">City / Location</label><input value={tForm.city} onChange={e => setTForm((p: any) => ({ ...p, city: e.target.value }))} className="input-style w-full" placeholder="New Delhi" /></div>
                <div><label className="label-style">Service Used</label><input value={tForm.service} onChange={e => setTForm((p: any) => ({ ...p, service: e.target.value }))} className="input-style w-full" placeholder="Vastu Check" /></div>
                <div><label className="label-style">Rating (1–5)</label>
                  <select value={tForm.rating} onChange={e => setTForm((p: any) => ({ ...p, rating: +e.target.value }))} className="input-style w-full">
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label-style">Testimonial Text *</label><textarea value={tForm.text} onChange={e => setTForm((p: any) => ({ ...p, text: e.target.value }))} className="input-style w-full" rows={4} placeholder="What the customer said about Vastu Arya..." /></div>
              <div><label className="label-style">Avatar Image URL (optional)</label><input value={tForm.avatar} onChange={e => setTForm((p: any) => ({ ...p, avatar: e.target.value }))} className="input-style w-full" placeholder="https://..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label-style">Sort Order</label><input type="number" value={tForm.order} onChange={e => setTForm((p: any) => ({ ...p, order: +e.target.value }))} className="input-style w-full" /></div>
                <div className="flex items-end pb-1"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={tForm.isActive} onChange={e => setTForm((p: any) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-primary" /><span className="text-sm font-medium">Active / Visible</span></label></div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3">
              <button onClick={() => setShowTModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm">Cancel</button>
              <button onClick={saveTestimonial} disabled={tSaving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                <Save size={14} />{tSaving ? 'Saving...' : 'Save Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .label-style { display:block; font-size:.8rem; font-weight:500; color:#5C3D1E; margin-bottom:4px; }
        .input-style { padding:8px 12px; border:1px solid #fed7aa; border-radius:10px; font-size:.875rem; outline:none; width:100%; transition:border-color .2s; }
        .input-style:focus { border-color:#FF6B00; box-shadow:0 0 0 2px rgba(255,107,0,.1); }
      `}</style>
    </div>
  );
}
