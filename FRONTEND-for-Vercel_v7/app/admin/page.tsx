'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import { TrendingUp, Users, ShoppingBag, Calendar, Layers, Package, Sparkles, Wand2, Globe, Rss, Bot } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  stats: { totalUsers: number; totalOrders: number; totalBookings: number; totalServices: number; totalProducts: number; totalRevenue: number; totalBlogs: number };
  revenueChart: { _id: string; revenue: number; count: number }[];
  recentOrders: any[];
  recentBookings: any[];
  recentUsers: any[];
}

const StatCard = ({ label, value, icon: Icon, color, href }: any) => (
  <Link href={href} className={`bg-white rounded-2xl p-5 border-l-4 hover:shadow-md transition-all group ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="font-display text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity ${color.replace('border-', 'bg-').replace('-500','-100')}`}>
        <Icon size={22} className={color.replace('border-l-4 border-', 'text-')} />
      </div>
    </div>
  </Link>
);

const AI_TOOLS = [
  { href: '/admin/ai-settings',       icon: Sparkles, label: 'AI Vastu Settings',    desc: 'Edit system prompt, CTA text, quick suggestions, disclaimer and trusted advice blocks that control the AI chatbot',  badge: 'LIVE', badgeBg: '#DCFCE7', badgeColor: '#16A34A', g1: '#FF6B00', g2: '#FF9933' },
  { href: '/admin/product-generator', icon: Wand2,    label: 'AI Product Generator', desc: 'Generate complete product listings — title, price, description, benefits, SEO — in one click using Gemini or Claude', badge: 'AI',   badgeBg: '#EDE9FE', badgeColor: '#7C3AED', g1: '#7C3AED', g2: '#6D28D9' },
  { href: '/admin/website-editor',    icon: Globe,    label: 'Website Editor',       desc: 'Edit homepage hero, CTA, SEO meta, stats banners, background theme and all section text through a visual CMS',         badge: 'CMS',  badgeBg: '#DBEAFE', badgeColor: '#2563EB', g1: '#2563EB', g2: '#1D4ED8' },
  { href: '/admin/social-posts',      icon: Rss,      label: 'Vastu Feed',           desc: 'Create and publish Vastu tips, insights and social-style posts that appear on the public Vastu Feed page',              badge: 'NEW',  badgeBg: '#FEF9C3', badgeColor: '#CA8A04', g1: '#F59E0B', g2: '#D97706' },
];

const QUICK_ACTIONS = [
  { href: '/admin/ai-settings',       label: 'AI Settings',       icon: '🤖' },
  { href: '/admin/product-generator', label: 'Generate Product',  icon: '✨' },
  { href: '/admin/services',          label: 'Add Service',        icon: '➕' },
  { href: '/admin/products',          label: 'Add Product',        icon: '📦' },
  { href: '/admin/blogs',             label: 'Write Blog',         icon: '✍️' },
  { href: '/admin/social-posts',      label: 'Vastu Feed Post',    icon: '📲' },
  { href: '/admin/website-editor',    label: 'Edit Homepage',      icon: '🌐' },
  { href: '/admin/settings',          label: 'Site Settings',      icon: '⚙️' },
];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(r => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_,i) => <div key={i} className="h-24 skeleton rounded-2xl"/>)}
      </div>
    </div>
  );

  const s = data?.stats;

  const stats = [
    { label: 'Total Revenue', value: formatPrice(s?.totalRevenue || 0), icon: TrendingUp, color: 'border-l-4 border-primary', href: '/admin/orders' },
    { label: 'Total Orders',  value: s?.totalOrders  || 0, icon: ShoppingBag, color: 'border-l-4 border-blue-500',   href: '/admin/orders' },
    { label: 'Bookings',      value: s?.totalBookings || 0, icon: Calendar,    color: 'border-l-4 border-green-500',  href: '/admin/bookings' },
    { label: 'Users',         value: s?.totalUsers    || 0, icon: Users,       color: 'border-l-4 border-purple-500', href: '/admin/users' },
    { label: 'Services',      value: s?.totalServices || 0, icon: Layers,      color: 'border-l-4 border-yellow-500', href: '/admin/services' },
    { label: 'Products',      value: s?.totalProducts || 0, icon: Package,     color: 'border-l-4 border-pink-500',   href: '/admin/products' },
  ];

  const statusColor: Record<string, string> = {
    paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700',
    delivered: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700', called: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin 🙏</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ── AI Tools & Automation Panel ── */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: '1.5px solid rgba(255,107,0,0.18)' }}>
        <div className="flex items-center gap-3 px-5 py-4" style={{ background: 'linear-gradient(135deg,#0D0500,#1A0800)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#FF6B00,#FF9933)' }}>
            <Bot size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">AI Tools &amp; Automation</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Control every AI feature, content agent and CMS for vastuarya.com
            </p>
          </div>
          <Link href="/vastu-ai" target="_blank"
            className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-70 flex-shrink-0"
            style={{ background: 'rgba(255,107,0,0.2)', color: '#FF9933' }}>
            Preview AI →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 bg-white">
          {AI_TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} href={tool.href}
                className={`flex gap-4 p-5 hover:bg-orange-50/60 transition-all group ${
                  idx < 2 ? 'border-b border-orange-50' : ''
                } ${idx % 2 === 0 ? 'sm:border-r border-orange-50' : ''}`}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg,${tool.g1},${tool.g2})` }}>
                  <Icon size={19} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-gray-800 text-sm group-hover:text-primary transition-colors">{tool.label}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: tool.badgeBg, color: tool.badgeColor }}>{tool.badge}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-snug">{tool.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Revenue Chart */}
      {data?.revenueChart && data.revenueChart.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Revenue (Last 30 Days)
          </h2>
          <div className="flex items-end gap-1 h-24 overflow-x-auto">
            {data.revenueChart.slice(-20).map((d, i) => {
              const max = Math.max(...data.revenueChart.map(x => x.revenue));
              const pct = max > 0 ? (d.revenue / max) * 100 : 0;
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[20px] group relative">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                    {formatPrice(d.revenue)}
                  </div>
                  <div className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all" style={{ height: `${Math.max(pct, 4)}%` }} />
                  <span className="text-[9px] text-gray-400 rotate-45 origin-left">{d._id.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Orders + Bookings */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary text-xs hover:underline">View All →</Link>
          </div>
          <div className="space-y-2">
            {data?.recentOrders?.slice(0,6).map((o: any) => (
              <div key={o._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{o.customerInfo?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-400">{o.orderId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-800">{formatPrice(o.totalAmount)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                </div>
              </div>
            ))}
            {(!data?.recentOrders || data.recentOrders.length === 0) && <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-primary text-xs hover:underline">View All →</Link>
          </div>
          <div className="space-y-2">
            {data?.recentBookings?.slice(0,6).map((b: any) => (
              <div key={b._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.serviceName} • {b.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-800">{formatPrice(b.amount)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[b.status] || 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
                </div>
              </div>
            ))}
            {(!data?.recentBookings || data.recentBookings.length === 0) && <p className="text-gray-400 text-sm text-center py-6">No bookings yet</p>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(a => (
            <Link key={a.href} href={a.href}
              className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-orange-50 transition-all text-sm font-medium text-gray-600 hover:text-primary">
              <span className="text-xl">{a.icon}</span>{a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
