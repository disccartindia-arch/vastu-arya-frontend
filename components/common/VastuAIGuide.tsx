'use client';
/**
 * VastuAIGuide — Floating "Ask AI" button + slide-up drawer
 * Guides new users to the right product or service based on their concern.
 * Uses /api/ai/vastu-analysis, falls back to keyword matching if AI unavailable.
 */
import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, ChevronRight, Loader2, RotateCcw } from 'lucide-react';
import { aiAPI } from '../../lib/api';
import Link from 'next/link';

const CHIPS = [
  'Financial problems', 'Relationship issues', 'Health problems',
  'Career obstacles', 'Sleep disturbances', 'Family conflicts',
  'Business losses', 'Which gemstone to wear',
];

const PRODUCT_MAP = [
  { kw: 'rudraksha',   title: 'Rudraksha',             slug: 'rudraksha',         emoji: '🌰' },
  { kw: 'gemstone',    title: 'Gemstones & Crystals',  slug: 'gemstones',         emoji: '💎' },
  { kw: 'crystal',     title: 'Gemstones & Crystals',  slug: 'gemstones',         emoji: '💎' },
  { kw: 'yantra',      title: 'Yantras',               slug: 'yantras',           emoji: '🔱' },
  { kw: 'bracelet',    title: 'Vastu Bracelets',       slug: 'bracelets',         emoji: '📿' },
  { kw: 'pyramid',     title: 'Pyramids',              slug: 'pyramids',          emoji: '🔺' },
  { kw: 'mala',        title: 'Sacred Mala',           slug: 'sacred-mala',       emoji: '📿' },
  { kw: 'pendant',     title: 'Gemstone Pendants',     slug: 'gemstone-pendants', emoji: '🔮' },
  { kw: 'kuber',       title: 'Yantras',               slug: 'yantras',           emoji: '🔱' },
  { kw: 'ganesha',     title: 'Divine Frames & Murthy',slug: 'murthy',            emoji: '🪆' },
  { kw: 'money',       title: 'Spiritual Products',    slug: 'spiritual',         emoji: '🌟' },
  { kw: 'charging',    title: 'Charging Plates',       slug: 'charging-plates',   emoji: '🧿' },
];

const SERVICE_MAP = [
  { kw: 'home vastu',    title: 'Home Energy Analysis',     href: '/services/home-energy-analysis',    emoji: '🏠' },
  { kw: 'business',      title: 'Business Vastu',           href: '/services/business-vastu',          emoji: '🏢' },
  { kw: 'new property',  title: 'New Property Vastu Check', href: '/services/new-property-vastu',      emoji: '🏗️' },
  { kw: 'gemstone',      title: 'Gemstone Guidance',        href: '/services/gemstone-guidance',       emoji: '💎' },
  { kw: 'rudraksha',     title: 'Rudraksha Recommendation', href: '/services/rudraksha-recommendation', emoji: '🌰' },
  { kw: 'numerology',    title: 'Numerology Analysis',      href: '/services/numerology-analysis',     emoji: '🔢' },
  { kw: 'mobile',        title: 'Mobile Numerology',        href: '/services/mobile-numerology',       emoji: '📱' },
  { kw: 'floor plan',    title: 'Smart Layout Plan',        href: '/services/smart-layout',            emoji: '📐' },
  { kw: 'vastu check',   title: 'Complete Vastu Check',     href: '/services/vastu-check',             emoji: '✅' },
];

function getRecs(aiText: string, concern: string) {
  const txt = (aiText + ' ' + concern).toLowerCase();
  const recs: any[] = [];
  const seen = new Set<string>();
  for (const p of PRODUCT_MAP) {
    if (txt.includes(p.kw) && !seen.has(p.slug)) {
      seen.add(p.slug);
      recs.push({ type: 'product', title: p.title, link: `/vastu-store/${p.slug}`, emoji: p.emoji, reason: 'Recommended product for your concern' });
    }
  }
  for (const s of SERVICE_MAP) {
    if (txt.includes(s.kw) && !seen.has(s.href)) {
      seen.add(s.href);
      recs.push({ type: 'service', title: s.title, link: s.href, emoji: s.emoji, reason: 'Expert consultation available' });
    }
  }
  if (!seen.has('/services/vastu-consultancy')) {
    recs.push({ type: 'service', title: 'Personal Consultation', link: '/services/vastu-consultancy', emoji: '🌟', reason: 'Personalised analysis by Dr. PPS Tomar' });
  }
  return recs.slice(0, 5);
}

export default function VastuAIGuide() {
  const [open, setOpen]       = useState(false);
  const [concern, setConcern] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<any>(null);
  const [pulse, setPulse]     = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { const t = setTimeout(() => setPulse(true), 5000); return () => clearTimeout(t); }, []);
  useEffect(() => { if (open && !result) setTimeout(() => textRef.current?.focus(), 250); }, [open, result]);

  const handleAsk = async () => {
    const q = concern.trim();
    if (q.length < 5) return;
    setLoading(true); setResult(null);
    try {
      const r = await aiAPI.vastuAnalysis({ concern: q });
      const d = r?.data?.data;
      const fullTxt = d ? [d.analysis || '', (d.remedies || []).map((x: any) => `${x.title} ${x.action}`).join(' '), d.note || ''].join(' ') : '';
      setResult({ greeting: d?.greeting || 'Namaste! 🙏', summary: d?.analysis || '', recs: getRecs(fullTxt, q), tip: d?.note || '' });
    } catch {
      setResult({ greeting: 'Namaste! 🙏', summary: `Based on "${q.slice(0, 60)}", here are the most relevant products and services for you.`, recs: getRecs('', q), tip: 'For a deeper analysis visit our full Vastu AI page.' });
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Floating Button — sits above WhatsApp (which is at bottom:80px) */}
      <button
        onClick={() => setOpen(true)}
        title="Ask AI — Find the right product or service"
        style={{
          position: 'fixed', bottom: '148px', right: '20px', zIndex: 998,
          background: 'linear-gradient(135deg,#FF6B00,#FF9933)',
          boxShadow: '0 4px 20px rgba(255,107,0,0.5)',
          border: 'none', borderRadius: '999px', height: '48px', padding: '0 16px 0 12px',
          display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: '14px',
          animation: pulse && !open ? 'vastuAIPulse 2.5s ease-in-out 3' : 'none',
        }}
      >
        <Sparkles size={17} />
        <span>Ask AI</span>
      </button>

      {/* Backdrop */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} />}

      {/* Drawer */}
      <div style={{
        position: 'fixed', bottom: 0, right: 0, zIndex: 1001,
        width: '100%', maxWidth: '420px', maxHeight: '88vh',
        background: '#fff', borderRadius: '24px 24px 0 0',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9933)', borderRadius: '24px 24px 0 0', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', margin: 0 }}>Vastu AI Guide</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0 }}>Tell me your problem — I'll find what helps</p>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <X size={15} color="#fff" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {!result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
                Describe your concern — I'll suggest the right products &amp; services from our store.
              </p>
              {/* Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CHIPS.map(c => (
                  <button key={c} onClick={() => setConcern(p => p ? `${p}, ${c}` : c)}
                    style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '999px', border: `1px solid ${concern.includes(c) ? '#FF6B00' : '#FED7AA'}`, background: concern.includes(c) ? '#FF6B00' : '#fff', color: concern.includes(c) ? '#fff' : '#4B5563', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {c}
                  </button>
                ))}
              </div>
              <textarea ref={textRef} value={concern} onChange={e => setConcern(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); }}}
                rows={3} placeholder="e.g. I have financial problems and poor sleep..."
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', border: '1.5px solid #FED7AA', borderRadius: '12px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', transition: 'border 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#FF6B00'}
                onBlur={e => e.target.style.borderColor = '#FED7AA'}
              />
              <button onClick={handleAsk} disabled={loading || concern.trim().length < 5}
                style={{ padding: '14px', borderRadius: '12px', border: 'none', background: concern.trim().length < 5 ? '#E5E7EB' : 'linear-gradient(135deg,#FF6B00,#FF9933)', color: concern.trim().length < 5 ? '#9CA3AF' : '#fff', fontWeight: 700, fontSize: '14px', cursor: concern.trim().length < 5 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />Finding best matches…</> : <><Send size={14} />Find My Vastu Solution</>}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Greeting box */}
              <div style={{ background: '#FFF7ED', borderRadius: '16px', padding: '16px', border: '1px solid #FED7AA' }}>
                <p style={{ color: '#FF6B00', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>{result.greeting}</p>
                <p style={{ color: '#4B5563', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{result.summary}</p>
              </div>
              {/* Recommendations */}
              {result.recs.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Recommended for you</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.recs.map((rec: any, i: number) => (
                      <Link key={i} href={rec.link} onClick={() => setOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '16px', border: '1px solid #FED7AA', background: '#fff', textDecoration: 'none', transition: 'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#FF6B00'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(255,107,0,0.1)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#FED7AA'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                        <span style={{ fontSize: '24px', flexShrink: 0 }}>{rec.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: '13px', color: '#1F2937', margin: '0 0 2px' }}>{rec.title}</p>
                          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>{rec.reason}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '999px', fontWeight: 600, background: rec.type === 'product' ? '#EFF6FF' : '#F0FDF4', color: rec.type === 'product' ? '#2563EB' : '#16A34A' }}>
                            {rec.type === 'product' ? '🛍 Shop' : '📞 Book'}
                          </span>
                          <ChevronRight size={13} color="#D1D5DB" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {/* Full AI link */}
              <Link href="/vastu-ai" onClick={() => setOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '12px', border: '1.5px solid #FED7AA', color: '#FF6B00', fontWeight: 600, fontSize: '13px', textDecoration: 'none', transition: 'all 0.2s', background: '#fff' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FF6B00'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = '#FF6B00'; }}>
                <Sparkles size={14} /> Get Full AI Vastu Analysis
              </Link>
              {/* Reset */}
              <button onClick={() => { setResult(null); setConcern(''); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'none', border: 'none', color: '#9CA3AF', fontSize: '12px', cursor: 'pointer', padding: '4px' }}>
                <RotateCcw size={11} /> Ask something else
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes vastuAIPulse { 0%,100%{transform:scale(1);box-shadow:0 4px 20px rgba(255,107,0,0.5)} 50%{transform:scale(1.1);box-shadow:0 4px 28px rgba(255,107,0,0.75)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </>
  );
}
