'use client';
import { useEffect, useState } from 'react';
import {
  Save, RotateCcw, Plus, X, Sparkles, MessageCircle,
  ToggleLeft, ToggleRight, BookOpen, Lightbulb, CheckCircle,
  AlertCircle, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { aiSettingsAPI, aiStatusAPI } from '../../../lib/api';

/* ─── Types ─────────────────────────────────────────────────── */
interface AdviceBlock { title: string; content: string; }
interface Settings {
  systemPrompt:        string;
  commonLines:         string[];
  ctaText:             string;
  showConsultationCTA: boolean;
  showDisclaimer:      boolean;
  showFollowUp:        boolean;
  disclaimerText:      string;
  followUpText:        string;
  quickSuggestions:    string[];
  trustedAdviceBlocks: AdviceBlock[];
}

const EMPTY: Settings = {
  systemPrompt:        '',
  commonLines:         [''],
  ctaText:             'Book a Consultation with Dr. PPS Tomar',
  showConsultationCTA: true,
  showDisclaimer:      true,
  showFollowUp:        true,
  disclaimerText:      '',
  followUpText:        '',
  quickSuggestions:    [''],
  trustedAdviceBlocks: [{ title: '', content: '' }],
};

type TabId = 'prompt' | 'cta' | 'suggestions' | 'advice';

/* ─── Provider Status Badge ──────────────────────────────────── */
function ProviderStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiStatusAPI.check()
      .then((r: any) => setStatus(r?.data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
      <Loader2 size={14} className="animate-spin" /> Checking AI providers…
    </div>
  );

  if (!status) return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
      <AlertCircle size={14} /> Could not reach backend — check Render deployment
    </div>
  );

  const isLive = status.mode === 'live';

  return (
    <div className={`flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
      isLive ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
    }`}>
      <span className={`flex items-center gap-1.5 font-semibold ${isLive ? 'text-green-700' : 'text-amber-700'}`}>
        {isLive ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
        {isLive ? 'Live AI Mode' : 'Demo Mode — Add API keys in Render'}
      </span>
      {/* Provider pills */}
      {Object.entries(status.providers || {}).map(([name, info]: [string, any]) => (
        <span key={name}
          className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
            info.configured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
          }`}>
          {name}: {info.configured ? `✓ ${info.keyPreview}` : '✗ not set'}
        </span>
      ))}
      {!isLive && (
        <span className="text-xs text-amber-600 ml-auto">
          Add GEMINI_API_KEY or ANTHROPIC_API_KEY in Render → Environment
        </span>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function AISettingsPage() {
  const [settings, setSettings] = useState<Settings>(EMPTY);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [resetting, setResetting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('prompt');

  /* Load settings */
  useEffect(() => {
    aiSettingsAPI.get()
      .then((r: any) => {
        const d = r?.data?.data;
        if (d) setSettings({
          systemPrompt:        d.systemPrompt        || EMPTY.systemPrompt,
          commonLines:         d.commonLines?.length  ? d.commonLines         : [''],
          ctaText:             d.ctaText              || EMPTY.ctaText,
          showConsultationCTA: d.showConsultationCTA  ?? true,
          showDisclaimer:      d.showDisclaimer        ?? true,
          showFollowUp:        d.showFollowUp          ?? true,
          disclaimerText:      d.disclaimerText        || '',
          followUpText:        d.followUpText          || '',
          quickSuggestions:   d.quickSuggestions?.length ? d.quickSuggestions : [''],
          trustedAdviceBlocks: d.trustedAdviceBlocks?.length ? d.trustedAdviceBlocks : [{ title: '', content: '' }],
        });
      })
      .catch(() => toast.error('Failed to load AI settings'))
      .finally(() => setLoading(false));
  }, []);

  /* Save */
  const save = async () => {
    const payload = {
      ...settings,
      commonLines:         settings.commonLines.filter(l => l.trim()),
      quickSuggestions:    settings.quickSuggestions.filter(s => s.trim()),
      trustedAdviceBlocks: settings.trustedAdviceBlocks.filter(b => b.title.trim() && b.content.trim()),
    };
    if (!payload.systemPrompt.trim()) { toast.error('System prompt cannot be empty'); return; }
    if (!payload.ctaText.trim())      { toast.error('CTA text cannot be empty'); return; }
    setSaving(true);
    try {
      await aiSettingsAPI.update(payload);
      toast.success('AI settings saved — changes are live immediately!');
    } catch { toast.error('Save failed. Please try again.'); }
    finally { setSaving(false); }
  };

  /* Reset */
  const reset = async () => {
    if (!confirm('Reset all AI settings to defaults? This cannot be undone.')) return;
    setResetting(true);
    try {
      const r: any = await aiSettingsAPI.reset();
      const d = r?.data?.data;
      if (d) setSettings({
        systemPrompt:        d.systemPrompt        || '',
        commonLines:         d.commonLines?.length  ? d.commonLines         : [''],
        ctaText:             d.ctaText              || EMPTY.ctaText,
        showConsultationCTA: d.showConsultationCTA  ?? true,
        showDisclaimer:      d.showDisclaimer        ?? true,
        showFollowUp:        d.showFollowUp          ?? true,
        disclaimerText:      d.disclaimerText        || '',
        followUpText:        d.followUpText          || '',
        quickSuggestions:   d.quickSuggestions?.length ? d.quickSuggestions : [''],
        trustedAdviceBlocks: d.trustedAdviceBlocks?.length ? d.trustedAdviceBlocks : [{ title: '', content: '' }],
      });
      toast.success('Reset to defaults!');
    } catch { toast.error('Reset failed.'); }
    finally { setResetting(false); }
  };

  /* Helpers */
  const toggle = (k: 'showConsultationCTA' | 'showDisclaimer' | 'showFollowUp') =>
    setSettings(s => ({ ...s, [k]: !s[k] }));

  const setStr = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings(s => ({ ...s, [k]: e.target.value }));

  const updArr = (k: 'commonLines' | 'quickSuggestions', i: number, v: string) =>
    setSettings(s => { const a = [...(s[k] as string[])]; a[i] = v; return { ...s, [k]: a }; });
  const addArr = (k: 'commonLines' | 'quickSuggestions') =>
    setSettings(s => ({ ...s, [k]: [...(s[k] as string[]), ''] }));
  const delArr = (k: 'commonLines' | 'quickSuggestions', i: number) =>
    setSettings(s => { const a = (s[k] as string[]).filter((_, j) => j !== i); return { ...s, [k]: a.length ? a : [''] }; });

  const updBlock = (i: number, f: keyof AdviceBlock, v: string) =>
    setSettings(s => { const b = [...s.trustedAdviceBlocks]; b[i] = { ...b[i], [f]: v }; return { ...s, trustedAdviceBlocks: b }; });
  const addBlock = () =>
    setSettings(s => ({ ...s, trustedAdviceBlocks: [...s.trustedAdviceBlocks, { title: '', content: '' }] }));
  const delBlock = (i: number) =>
    setSettings(s => { const b = s.trustedAdviceBlocks.filter((_, j) => j !== i); return { ...s, trustedAdviceBlocks: b.length ? b : [{ title: '', content: '' }] }; });

  const TABS = [
    { id: 'prompt',      label: 'AI Prompt',         icon: Sparkles },
    { id: 'cta',         label: 'CTA & Toggles',     icon: MessageCircle },
    { id: 'suggestions', label: 'Quick Suggestions',  icon: Lightbulb },
    { id: 'advice',      label: 'Advice Blocks',      icon: BookOpen },
  ] as const;

  if (loading) return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles size={22} className="text-primary" /> AI Vastu Settings
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Control AI behaviour, prompts, and responses — changes are live immediately
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={reset} disabled={resetting}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all">
            <RotateCcw size={14} className={resetting ? 'animate-spin' : ''} />
            {resetting ? 'Resetting…' : 'Reset Defaults'}
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-orange disabled:opacity-60">
            <Save size={14} />{saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Provider status */}
      <ProviderStatus />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
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
            <label className="label-style">System Prompt / Base Instruction *</label>
            <p className="text-xs text-gray-400 mb-2">
              This is the core personality and instruction. The AI follows this for every response.
            </p>
            <textarea
              value={settings.systemPrompt}
              onChange={setStr('systemPrompt')}
              rows={14}
              className="w-full px-4 py-3 border border-orange-200 rounded-xl text-xs font-mono focus:outline-none focus:border-primary resize-y leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-style">Lines added to every response</label>
              <button onClick={() => addArr('commonLines')}
                className="text-xs text-primary hover:underline flex items-center gap-1">
                <Plus size={11} />Add
              </button>
            </div>
            <div className="space-y-2">
              {settings.commonLines.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <input value={line} onChange={e => updArr('commonLines', i, e.target.value)}
                    placeholder="e.g. These remedies follow ancient Vastu Shastra principles."
                    className="flex-1 input-style" />
                  <button onClick={() => delArr('commonLines', i)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: CTA & Toggles ── */}
      {activeTab === 'cta' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          {/* Toggles */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Feature Toggles</p>
            {([
              { key: 'showConsultationCTA' as const, label: 'Show Consultation CTA',  desc: 'Book now button shown after AI response' },
              { key: 'showDisclaimer'      as const, label: 'Show Disclaimer',         desc: 'Disclaimer note shown below remedies' },
              { key: 'showFollowUp'        as const, label: 'Show Follow-up Message',  desc: 'Follow-up suggestion at bottom of response' },
            ]).map(item => (
              <div key={item.key}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <button onClick={() => toggle(item.key)} className="ml-4 flex-shrink-0">
                  {settings[item.key]
                    ? <ToggleRight size={34} className="text-primary" />
                    : <ToggleLeft  size={34} className="text-gray-300" />}
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="label-style">Consultation CTA Text *</label>
            <input value={settings.ctaText} onChange={setStr('ctaText')} className="input-style w-full"
              placeholder="Book a Consultation with Dr. PPS Tomar" />
            <p className="text-xs text-gray-400 mt-1">Text on the booking button after AI analysis</p>
          </div>

          <div>
            <label className="label-style">Disclaimer Text</label>
            <textarea value={settings.disclaimerText} onChange={setStr('disclaimerText')}
              rows={3} className="input-style w-full resize-none"
              placeholder="AI-generated guidance. Personal consultation recommended for precise results." />
          </div>

          <div>
            <label className="label-style">Follow-up Text</label>
            <textarea value={settings.followUpText} onChange={setStr('followUpText')}
              rows={2} className="input-style w-full resize-none"
              placeholder="Book a personal session for deeper insights." />
          </div>
        </div>
      )}

      {/* ── Tab: Quick Suggestions ── */}
      {activeTab === 'suggestions' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-700">Quick Suggestion Chips</p>
              <p className="text-xs text-gray-400 mt-0.5">One-tap chips shown to users on the AI Vastu page</p>
            </div>
            <button onClick={() => addArr('quickSuggestions')}
              className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
              <Plus size={12} />Add
            </button>
          </div>

          {/* Preview */}
          <div className="flex flex-wrap gap-2 my-4 p-3 bg-orange-50 rounded-xl min-h-12">
            {settings.quickSuggestions.filter(s => s.trim()).map((s, i) => (
              <span key={i} className="text-xs px-3 py-1.5 bg-white border border-orange-200 text-primary rounded-full">{s}</span>
            ))}
            {!settings.quickSuggestions.filter(s => s.trim()).length && (
              <span className="text-xs text-gray-400 self-center">Preview appears here</span>
            )}
          </div>

          <div className="space-y-2">
            {settings.quickSuggestions.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s} onChange={e => updArr('quickSuggestions', i, e.target.value)}
                  placeholder="e.g. Financial problems"
                  className="flex-1 input-style" />
                <button onClick={() => delArr('quickSuggestions', i)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><X size={14} /></button>
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
              <p className="text-xs text-gray-400 mt-0.5">
                Injected as context into every AI prompt — AI will always stay consistent with these
              </p>
            </div>
            <button onClick={addBlock}
              className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
              <Plus size={12} />Add Block
            </button>
          </div>

          <div className="space-y-4">
            {settings.trustedAdviceBlocks.map((block, i) => (
              <div key={i} className="p-4 border border-orange-100 rounded-2xl space-y-3 relative">
                <button onClick={() => delBlock(i)}
                  className="absolute top-3 right-3 p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                  <X size={13} />
                </button>
                <div>
                  <label className="label-style text-xs">Block Title</label>
                  <input value={block.title} onChange={e => updBlock(i, 'title', e.target.value)}
                    placeholder="e.g. North Zone — Wealth Activation"
                    className="input-style w-full pr-8" />
                </div>
                <div>
                  <label className="label-style text-xs">Advice Content</label>
                  <textarea value={block.content} onChange={e => updBlock(i, 'content', e.target.value)}
                    rows={3} className="input-style w-full resize-none"
                    placeholder="e.g. Keep the North zone clutter-free. Place a money plant or Kuber Yantra here…" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom save */}
      <div className="flex justify-end pb-6">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-orange disabled:opacity-60">
          <Save size={15} />{saving ? 'Saving…' : 'Save All Settings'}
        </button>
      </div>

      <style jsx global>{`
        .label-style { display:block; font-size:.8rem; font-weight:500; color:#5C3D1E; margin-bottom:4px; }
        .input-style { padding:8px 12px; border:1px solid #fed7aa; border-radius:10px; font-size:.875rem; outline:none; transition:border-color .2s; width:100%; }
        .input-style:focus { border-color:#FF6B00; box-shadow:0 0 0 2px rgba(255,107,0,.1); }
      `}</style>
    </div>
  );
}
