'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { authAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

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
      if (data.user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        setLoading(false);
        return;
      }
      setAuth(data.user, data.token);
      toast.success('Welcome back, Admin!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mandala-bg opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
          {[80,60,40,20].map((r,i)=><circle key={i} cx="100" cy="100" r={r} fill="none" stroke="#FF6B00" strokeWidth="0.5"/>)}
        </svg>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-saffron-gradient rounded-2xl flex items-center justify-center text-white font-accent font-bold text-3xl mx-auto mb-4 shadow-orange-lg">VA</div>
          <h1 className="font-display text-2xl font-bold text-white">Vastu Arya</h1>
          <p className="text-primary text-sm font-accent mt-1">Admin Control Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-white font-semibold text-lg mb-5 text-center">Sign In to Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  type="email" placeholder="Vastuarya@Admin.com"
                  className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={password} onChange={e => setPassword(e.target.value)}
                  type={showPw ? 'text' : 'password'} placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold transition-all shadow-orange disabled:opacity-60 mt-2"
            >
              {loading ? '⏳ Signing in...' : '🔐 Sign In to Admin'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-xs mt-4">Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
}
