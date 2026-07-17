'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { useAuthStore } from '../../../store/authStore';
import { authAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

// Only allow same-origin redirects — never send the user to an
// external URL supplied via the query string.
function safeRedirect(raw: string | null): string {
  if (!raw) return '/';
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded.startsWith('/') && !decoded.startsWith('//')) return decoded;
  } catch { /* fall through */ }
  return '/';
}

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = safeRedirect(params.get('redirect'));
  const { setAuth } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = isLogin ? await authAPI.login({ email:form.email, password:form.password }) : await authAPI.register(form);
      if (!data.success) throw new Error(data.message);
      setAuth(data.user, data.token);
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      router.push(redirectTo);
    } catch(e:any) { toast.error(e?.response?.data?.message || e.message); }
    finally { setLoading(false); }
  };
  return (<><Navbar /><main className="min-h-screen bg-cream flex items-center justify-center py-16 px-4">
    <div className="bg-white rounded-2xl shadow-orange p-8 w-full max-w-sm">
      <div className="text-center mb-6"><div className="text-4xl mb-2">🕉️</div><h1 className="font-display text-2xl font-bold text-text-dark">{isLogin?'Welcome Back':'Create Account'}</h1>
        {redirectTo !== '/' && <p className="text-xs text-primary mt-1" data-testid="redirect-hint">Sign in to continue your booking</p>}
      </div>
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6"><button onClick={()=>setIsLogin(true)} data-testid="login-tab" className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${isLogin?'bg-white text-primary shadow-sm':'text-gray-500'}`}>Sign In</button><button onClick={()=>setIsLogin(false)} data-testid="register-tab" className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${!isLogin?'bg-white text-primary shadow-sm':'text-gray-500'}`}>Register</button></div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {!isLogin&&<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full Name *" data-testid="login-name" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm"/>}
        <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email Address *" data-testid="login-email" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm"/>
        {!isLogin&&<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone Number" data-testid="login-phone" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm"/>}
        <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password *" data-testid="login-password" className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:border-primary text-sm"/>
        <button type="submit" disabled={loading} data-testid="login-submit" className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-60">{loading?'Please wait...':(isLogin?'Sign In':'Create Account')}</button>
      </form>
    </div>
  </main><Footer /></>);
}
