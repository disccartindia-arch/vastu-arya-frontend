'use client';
import { useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import WhatsAppButton from '../../../components/common/WhatsAppButton';
import AppointmentPopup from '../../../components/common/AppointmentPopup';
import { useUIStore } from '../../../store/uiStore';
import { aiAPI } from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Home, ArrowRight, Phone, MessageCircle, Calendar, CheckCircle, Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const CONCERNS = ['Financial problems', 'Relationship issues', 'Health problems', 'Career obstacles', 'Sleep disturbances', 'Family conflicts', 'Business losses', 'Child education', 'New home purchase', 'Office Vastu'];
const ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Home Office', 'Entire Home', 'Shop/Office', 'Factory'];
const DIRECTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

interface Remedy { title: string; action: string; zone: string; benefit: string; }
interface AIResult { greeting: string; analysis: string; remedies: Remedy[]; note: string; consultationCTA: string; }

export default function VastuAIPage() {
  const { setShowAppointmentPopup } = useUIStore();
  const [concern, setConcern] = useState('');
  const [roomType, setRoomType] = useState('');
  const [direction, setDirection] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const handleAnalyse = async () => {
    if (!concern.trim() || concern.trim().length < 10) { toast.error('Please describe your concern in at least 10 characters'); return; }
    setLoading(true);
    setResult(null);
    try {
      const r = await aiAPI.vastuAnalysis({ concern, roomType, direction });
      setResult(r.data.data);
      setIsDemo(r.data.isDemo || false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Analysis failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <main style={{ background: 'linear-gradient(135deg, #FFFDF7 0%, #FFF8EE 100%)' }}>
        {/* Hero */}
        <section className="bg-dark-gradient py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 mandala-bg opacity-10"/>
          <div className="relative max-w-3xl mx-auto px-4">
            <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-5 border border-primary/30">
              <Sparkles size={14}/> AI-Powered Instant Vastu Analysis
            </motion.div>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Get Instant Vastu Guidance
            </motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="text-gray-300 text-lg">
              Describe your concern and receive personalised Vastu remedies in seconds — then connect with Dr. PPS for a deeper consultation.
            </motion.p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Input Form */}
          <AnimatePresence>
            {!result && (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-orange-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Home size={20} className="text-primary"/></div>
                  <div><p className="font-bold text-gray-800">Tell us your Vastu concern</p><p className="text-xs text-gray-400">Be as specific as possible for better results</p></div>
                </div>

                {/* Quick concern chips */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium">Common concerns (tap to select):</p>
                  <div className="flex flex-wrap gap-2">
                    {CONCERNS.map(c => (
                      <button key={c} onClick={() => setConcern(prev => prev ? `${prev}, ${c}` : c)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${concern.includes(c) ? 'bg-primary text-white border-primary' : 'border-orange-200 text-gray-600 hover:border-primary hover:text-primary'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={concern}
                  onChange={e => setConcern(e.target.value)}
                  rows={4}
                  placeholder="e.g. We are facing financial losses for the past 2 years. Money comes but does not stay. Relationships at home are also strained..."
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none mb-4"
                />

                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Room Type (optional)</label>
                    <select value={roomType} onChange={e => setRoomType(e.target.value)} className="w-full px-3 py-2.5 border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-primary">
                      <option value="">Select room type</option>
                      {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Home Facing Direction (optional)</label>
                    <select value={direction} onChange={e => setDirection(e.target.value)} className="w-full px-3 py-2.5 border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-primary">
                      <option value="">Select direction</option>
                      {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <button onClick={handleAnalyse} disabled={loading || concern.trim().length < 10}
                  className="w-full py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9933)', boxShadow: '0 8px 24px rgba(255,107,0,0.35)' }}>
                  {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>Analysing your space...</>) : (<><Sparkles size={20}/>Get My Vastu Analysis</>)}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">AI-powered guidance based on ancient Vastu Shastra principles</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} className="space-y-5">
                {isDemo && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 text-center">
                    ⚡ Demo mode — Add ANTHROPIC_API_KEY to backend for live AI analysis
                  </div>
                )}

                {/* Greeting & Analysis */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-orange-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200">
                      <img src="/logo.jpg" alt="Dr. PPS" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Dr. PPS — IVAF Certified Expert</p>
                      <div className="flex items-center gap-0.5">{[...Array(5)].map((_,i)=><Star key={i} size={11} className="fill-yellow-400 text-yellow-400"/>)}</div>
                    </div>
                  </div>
                  <p className="text-primary font-semibold text-lg mb-2">{result.greeting}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{result.analysis}</p>
                </div>

                {/* Remedies */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-orange-100">
                  <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2"><CheckCircle size={20} className="text-green-500"/>Your Personalised Vastu Remedies</h3>
                  <div className="space-y-4">
                    {result.remedies.map((r, i) => (
                      <motion.div key={i} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
                        className="flex gap-3 p-4 rounded-2xl" style={{background:'rgba(255,107,0,0.05)',border:'1px solid rgba(255,107,0,0.12)'}}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{background:'linear-gradient(135deg,#FF6B00,#FF9933)'}}>{i+1}</div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm mb-1">{r.title}</p>
                          <p className="text-gray-600 text-sm mb-1">✅ {r.action}</p>
                          <p className="text-gray-400 text-xs">📍 {r.zone} &nbsp;•&nbsp; 💡 {r.benefit}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm mt-4 italic">{result.note}</p>
                </div>

                {/* Premium Consultation CTA */}
                <motion.div initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} transition={{delay:0.4}}
                  className="rounded-3xl p-6 text-white" style={{background:'linear-gradient(135deg,#0D0500,#1A0A00)',border:'1px solid rgba(212,160,23,0.3)'}}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0" style={{borderColor:'rgba(212,160,23,0.5)'}}>
                      <img src="/logo.jpg" alt="Dr. PPS" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">Need a Deeper Analysis?</p>
                      <p className="text-xs" style={{color:'#D4A017'}}>IVAF Certified • 45,000+ Clients • 15+ Years</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">{result.consultationCTA} Connect with Dr. PPS for a complete, personalised Vastu consultation of your specific space.</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button onClick={() => setShowAppointmentPopup(true)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all"
                      style={{background:'linear-gradient(135deg,#FF6B00,#FF9933)'}}>
                      <Calendar size={15}/> Book @ ₹11
                    </button>
                    <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#128C7E] transition-all">
                      <MessageCircle size={15}/> WhatsApp
                    </a>
                  </div>
                  <a href="tel:+919999999999" className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-all w-full" style={{borderColor:'rgba(212,160,23,0.3)',color:'#D4A017'}}>
                    <Phone size={14}/> Call Dr. PPS Directly
                  </a>
                </motion.div>

                {/* Try again */}
                <button onClick={() => setResult(null)} className="w-full py-3 rounded-xl border border-orange-200 text-primary font-medium text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                  <Send size={14}/> Analyse Another Concern
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      <AppointmentPopup />
      <WhatsAppButton />
    </>
  );
}
