'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { authAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Enter email and password');
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      if (!data.success) throw new Error(data.message);
      if (data.user.role !== 'admin') { toast.error('Access denied. Admin only.'); setLoading(false); return; }
      setAuth(data.user, data.token);
      toast.success('Welcome back, Admin!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0D0500 0%, #1A0800 40%, #0D0500 100%)' }}>

      {/* Animated background rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[320, 520, 720].map((size, i) => (
          <div key={i} className="absolute top-1/2 left-1/2 rounded-full border border-yellow-700/10"
            style={{ width: size, height: size, marginLeft: -size/2, marginTop: -size/2,
              animation: `spin-slow ${22 + i * 9}s linear infinite` }} />
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 420, height: 420, background: 'radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 70%)' }} />
        {/* Gold floating dots */}
        {[...Array(18)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: (1 + Math.random() * 3) + 'px', height: (1 + Math.random() * 3) + 'px',
              background: 'rgba(212,160,23,0.4)',
              left: (Math.random() * 100) + '%', top: (Math.random() * 100) + '%',
              animation: `float ${3 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: (Math.random() * 4) + 's',
            }} />
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="relative w-28 h-28 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full animate-gold-pulse"
              style={{ background: 'radial-gradient(circle, rgba(212,160,23,0.25) 0%, transparent 70%)' }} />
            <div className="relative w-28 h-28 rounded-full overflow-hidden"
              style={{ border: '2px solid rgba(212,160,23,0.4)', boxShadow: '0 0 40px rgba(212,160,23,0.25), 0 0 80px rgba(212,160,23,0.08)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Vastu Arya" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">Vastu Arya</h1>
          <p className="font-accent text-xs tracking-widest mt-1" style={{ color: '#D4A017' }}>ADMIN CONTROL PANEL</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,160,23,0.18)' }}>

          <div className="flex items-center justify-center gap-2 mb-5">
            <Shield size={13} style={{ color: '#D4A017' }} />
            <span className="text-gray-400 text-xs tracking-widest uppercase font-medium">Secure Admin Access</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wider uppercase">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                  placeholder="Vastuarya@Admin.com"
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,160,23,0.15)' }}
                  required />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wider uppercase">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input value={password} onChange={e => setPassword(e.target.value)}
                  type={showPw ? 'text' : 'password'} placeholder="Enter password"
                  className="w-full pl-9 pr-10 py-3 rounded-xl text-white text-sm focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,160,23,0.15)' }}
                  required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all mt-2 disabled:opacity-50"
              style={{
                background: loading ? 'rgba(212,160,23,0.3)' : 'linear-gradient(135deg, #D4A017 0%, #F0C040 50%, #D4A017 100%)',
                backgroundSize: '200% auto', color: '#1A0A00',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(212,160,23,0.35)',
              }}>
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>
          <p className="text-center text-gray-700 text-xs mt-4">IVAF Certified · Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
