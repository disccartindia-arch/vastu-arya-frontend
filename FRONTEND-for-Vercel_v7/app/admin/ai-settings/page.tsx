'use client';
import { useEffect, useState } from 'react';
import { Save, RotateCcw, Plus, X, Sparkles, MessageCircle, ToggleLeft, ToggleRight, BookOpen, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import { aiSettingsAPI } from '../../../lib/api';

const DEFAULT_SETTINGS = {
  systemPrompt: '',
  commonLines: [''],
  ctaText: 'Book a Consultation with Dr. PPS Tomar',
  showConsultationCTA: true,
  showDisclaimer: true,
  showFollowUp: true,
  disclaimerText: '',
  followUpText: '',
  quickSuggestions: [''],
  trustedAdviceBlocks: [{ title: '', content: '' }],
};

type Settings = typeof DEFAULT_SETTINGS & {
  trustedAdviceBlocks: { title: string; content: string }[];
};

export default function AISettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS as any);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [resetting, setResetting] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'cta' | 'suggestions' | 'advice'>('prompt');

  useEffect(() => {
    aiSettingsAPI.get()
      .then((r: any) => {
        const d = r?.data?.data;
        if (d) setSettings({
          systemPrompt:       d.systemPrompt       || '',
          commonLines:        d.commonLines?.length ? d.commonLines : [''],
          ctaText:            d.ctaText            || '',
          showConsultationCTA: d.showConsultationCTA ?? true,
          showDisclaimer:     d.showDisclaimer     ?? true,
          showFollowUp:       d.showFollowUp       ?? true,
          disclaimerText:     d.disclaimerText     || '',
          followUpText:       d.followUpText       || '',
          quickSuggestions:   d.quickSuggestions?.length ? d.quickSuggestions : [''],
          trustedAdviceBlocks: d.trustedAdviceBlocks?.length ? d.trustedAdviceBlocks : [{ title: '', content: '' }],
        });
      })
      .catch(() => toast.error('Failed to load AI settings'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    const payload = {
      ...settings,
      commonLines:        settings.commonLines.filter(l => l.trim()),
      quickSuggestions:   settings.quickSuggestions.filter(s => s.trim()),
      trustedAdviceBlocks: settings.trustedAdviceBlocks.filter(b => b.title.trim() && b.content.trim()),
    };
    setSaving(true);
    try {
      await aiSettingsAPI.update(payload);
      toast.success('AI settings saved! Changes are live immediately.');
    } catch { toast.error('Save failed. Please try again.'); }
    finally { setSaving(false); }
  };

  const reset = async () => {
    if (!confirm('Reset all AI settings to defaults? This cannot be undone.')) return;
    setResetting(true);
    try {
      const r: any = await aiSettingsAPI.reset();
      const d = r?.data?.data;
      if (d) setSettings({
        systemPrompt: d.systemPrompt || '',
        commonLines: d.commonLines?.length ? d.commonLines : [''],
        ctaText: d.ctaText || '',
        showConsultationCTA: d.showConsultationCTA ?? true,
        showDisclaimer: d.showDisclaimer ?? true,
        showFollowUp: d.showFollowUp ?? true,
        disclaimerText: d.disclaimerText || '',
        followUpText: d.followUpText || '',
        quickSuggestions: d.quickSuggestions?.length ? d.quickSuggestions : [''],
        trustedAdviceBlocks: d.trustedAdviceBlocks?.length ? d.trustedAdviceBlocks : [{ title: '', content: '' }],
      });
      toast.success('Reset to defaults!');
    } catch { toast.error('Reset failed.'); }
    finally { setResetting(false); }
  };

  const toggle = (key: 'showConsultationCTA' | 'showDisclaimer' | 'showFollowUp') =>
    setSettings(s => ({ ...s, [key]: !s[key] }));

  // Array helpers
  const updateArr = (key: 'commonLines' | 'quickSuggestions', idx: number, val: string) =>
    setSettings(s => { const a = [...(s[key] as string[])]; a[idx] = val; return { ...s, [key]: a }; });
  const addArr = (key: 'commonLines' | 'quickSuggestions') =>
    setSettings(s => ({ ...s, [key]: [...(s[key] as string[]), ''] }));
  const removeArr = (key: 'commonLines' | 'quickSuggestions', idx: number) =>
    setSettings(s => { const a = (s[key] as string[]).filter((_, i) => i !== idx); return { ...s, [key]: a.length ? a : [''] }; });

  const updateBlock = (idx: number, field: 'title' | 'content', val: string) =>
    setSettings(s => { const b = [...s.trustedAdviceBlocks]; b[idx] = { ...b[idx], [field]: val }; return { ...s, trustedAdviceBlocks: b }; });
  const addBlock = () =>
    setSettings(s => ({ ...s, trustedAdviceBlocks: [...s.trustedAdviceBlocks, { title: '', content: '' }] }));
  const removeBlock = (idx: number) =>
    setSettings(s => { const b = s.trustedAdviceBlocks.filter((_, i) => i !== idx); return { ...s, trustedAdviceBlocks: b.length ? b : [{ title: '', content: '' }] }; });

  const TABS = [
    { id: 'prompt',      label: 'AI Prompt',       icon: Sparkles },
    { id: 'cta',         label: 'CTA & Toggles',   icon: MessageCircle },
    { id: 'suggestions', label: 'Quick Suggestions', icon: Lightbulb },
    { id: 'advice',      label: 'Advice Blocks',   icon: BookOpen },
  ] as const;

  if (loading) return (
    <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}</div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles size={22} className="text-primary" /> AI Vastu Settings
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Control AI behaviour, prompts, and responses — changes are live immediately</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} disabled={resetting}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            <RotateCcw size={14} className={resetting ? 'animate-spin' : ''} />
            {resetting ? 'Resetting…' : 'Reset Defaults'}
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-orange disabled:opacity-60">
            <Save size={14} />{saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Settings are injected into every AI response in real time — no deployment needed
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-full overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              <Icon size={13} />{tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab: AI Prompt ── */}
      {activeTab === 'prompt' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <label className="label-style text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <Sparkles size={14} className="text-primary" /> System Prompt / Base Instruction
            </label>
            <p className="text-xs text-gray-400 mb-2">This is the core personality and instruction the AI follows for every response.</p>
            <textarea
              value={settings.systemPrompt}
              onChange={e => setSettings(s => ({ ...s, systemPrompt: e.target.value }))}
              rows={14}
              className="w-full px-4 py-3 border border-orange-200 rounded-xl text-xs font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-y leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-style text-sm font-semibold text-gray-700">Common Lines (added to every response)</label>
              <button onClick={() => addArr('commonLines')} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus size={11} />Add Line</button>
            </div>
            <div className="space-y-2">
              {settings.commonLines.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={line}
                    onChange={e => updateArr('commonLines', i, e.target.value)}
                    placeholder="e.g. These remedies follow ancient Vastu Shastra principles."
                    className="flex-1 px-3 py-2.5 border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                  <button onClick={() => removeArr('commonLines', i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: CTA & Toggles ── */}
      {activeTab === 'cta' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          {/* Toggle switches */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Feature Toggles</p>
            {([
              { key: 'showConsultationCTA', label: 'Show Consultation CTA', desc: 'Displays a booking call-to-action after AI response' },
              { key: 'showDisclaimer',      label: 'Show Disclaimer',       desc: 'Adds a disclaimer note below AI remedies' },
              { key: 'showFollowUp',        label: 'Show Follow-up',        desc: 'Shows follow-up suggestion at the bottom of response' },
            ] as const).map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <button onClick={() => toggle(item.key)} className="flex-shrink-0 ml-4">
                  {settings[item.key]
                    ? <ToggleRight size={32} className="text-primary" />
                    : <ToggleLeft  size={32} className="text-gray-300" />
                  }
                </button>
              </div>
            ))}
          </div>

          {/* CTA Text */}
          <div>
            <label className="label-style">Consultation CTA Button Text</label>
            <input
              value={settings.ctaText}
              onChange={e => setSettings(s => ({ ...s, ctaText: e.target.value }))}
              className="input-style w-full"
              placeholder="Book a Consultation with Dr. PPS Tomar"
            />
            <p className="text-xs text-gray-400 mt-1">This text appears on the booking button after AI analysis</p>
          </div>

          {/* Disclaimer */}
          <div>
            <label className="label-style">Disclaimer Text</label>
            <textarea
              value={settings.disclaimerText}
              onChange={e => setSettings(s => ({ ...s, disclaimerText: e.target.value }))}
              rows={3}
              className="input-style w-full resize-none"
              placeholder="This is AI-generated guidance…"
            />
          </div>

          {/* Follow-up */}
          <div>
            <label className="label-style">Follow-up Text</label>
            <textarea
              value={settings.followUpText}
              onChange={e => setSettings(s => ({ ...s, followUpText: e.target.value }))}
              rows={2}
              className="input-style w-full resize-none"
              placeholder="Would you like to analyse another concern…"
            />
          </div>
        </div>
      )}

      {/* ── Tab: Quick Suggestions ── */}
      {activeTab === 'suggestions' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Quick Suggestion Chips</p>
              <p className="text-xs text-gray-400 mt-0.5">These appear as one-tap chips on the AI Vastu page for users to select quickly</p>
            </div>
            <button onClick={() => addArr('quickSuggestions')} className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
              <Plus size={12} />Add
            </button>
          </div>

          {/* Preview */}
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-orange-50 rounded-xl">
            {settings.quickSuggestions.filter(s => s.trim()).map((s, i) => (
              <span key={i} className="text-xs px-3 py-1.5 bg-white border border-orange-200 text-primary rounded-full">{s}</span>
            ))}
            {settings.quickSuggestions.filter(s => s.trim()).length === 0 && (
              <span className="text-xs text-gray-400">Preview appears here</span>
            )}
          </div>

          <div className="space-y-2">
            {settings.quickSuggestions.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={s}
                  onChange={e => updateArr('quickSuggestions', i, e.target.value)}
                  placeholder="e.g. Financial problems"
                  className="flex-1 px-3 py-2.5 border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                />
                <button onClick={() => removeArr('quickSuggestions', i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Trusted Advice Blocks ── */}
      {activeTab === 'advice' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Trusted Advice Blocks</p>
              <p className="text-xs text-gray-400 mt-0.5">These are injected as context into the AI prompt so it always gives advice consistent with your expertise</p>
            </div>
            <button onClick={addBlock} className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
              <Plus size={12} />Add Block
            </button>
          </div>

          <div className="space-y-4">
            {settings.trustedAdviceBlocks.map((block, i) => (
              <div key={i} className="p-4 border border-orange-100 rounded-2xl space-y-2 relative">
                <button onClick={() => removeBlock(i)} className="absolute top-3 right-3 p-1 text-red-400 hover:bg-red-50 rounded-lg">
                  <X size={13} />
                </button>
                <div>
                  <label className="label-style text-xs">Block Title</label>
                  <input
                    value={block.title}
                    onChange={e => updateBlock(i, 'title', e.target.value)}
                    placeholder="e.g. North Zone — Wealth Activation"
                    className="input-style w-full"
                  />
                </div>
                <div>
                  <label className="label-style text-xs">Advice Content</label>
                  <textarea
                    value={block.content}
                    onChange={e => updateBlock(i, 'content', e.target.value)}
                    rows={3}
                    placeholder="e.g. Keep the North zone clutter-free. Place a money plant or Kuber Yantra here…"
                    className="input-style w-full resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Save */}
      <div className="flex justify-end pb-6">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-orange disabled:opacity-60">
          <Save size={15} />{saving ? 'Saving…' : 'Save All Settings'}
        </button>
      </div>

      <style jsx global>{`
        .label-style { display:block; font-size:.8rem; font-weight:500; color:#5C3D1E; margin-bottom:4px; }
        .input-style { padding:8px 12px; border:1px solid #fed7aa; border-radius:10px; font-size:.875rem; outline:none; transition:border-color .2s; }
        .input-style:focus { border-color:#FF6B00; box-shadow:0 0 0 2px rgba(255,107,0,.1); }
      `}</style>
    </div>
  );
}
