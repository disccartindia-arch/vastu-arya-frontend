'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, Package, ShoppingBag, Calendar, BookOpen,
  Users, Settings, ImageIcon, MessageSquare, LogOut, Menu, X,
  Layers, ChevronRight, Globe, Sparkles, Rss, Brain, FileText
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/website-editor', label: 'Website Editor', icon: Globe, badge: 'NEW' },
  { href: '/admin/ai-settings', label: 'AI Vastu Settings', icon: Sparkles },
  { href: '/admin/about', label: 'About Page', icon: FileText },
  { href: '/admin/services', label: 'Services', icon: Layers },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/social-posts', label: 'Vastu Feed', icon: Rss },
  { href: '/admin/slider', label: 'Slider', icon: ImageIcon },
  { href: '/admin/popups', label: 'Popups', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    if (!user || !isAdmin()) router.push('/admin/login');
  }, [user, pathname]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!user || !isAdmin()) return (
    <div className="min-h-screen bg-[#0D0500] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden" style={{ border: '2px solid rgba(212,160,23,0.3)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="VA" className="w-full h-full object-cover" />
        </div>
        <p className="text-gray-400 text-sm">Loading admin panel...</p>
      </div>
    </div>
  );

  const activeItem = navItems.find(n => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href)));

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 admin-sidebar transition-transform duration-300 lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo in sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ border: '1.5px solid rgba(212,160,23,0.4)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="VA" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-white font-bold text-sm font-display">Vastu Arya</div>
              <div className="text-xs font-accent" style={{ color: '#D4A017' }}>Admin v2.0</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={18} /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                style={active ? { background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(255,107,0,0.12))', border: '1px solid rgba(212,160,23,0.2)' } : {}}>
                <Icon size={17} style={active ? { color: '#D4A017' } : {}} className={active ? '' : 'group-hover:text-yellow-600'} />
                <span className="flex-1">{item.label}</span>
                {(item as any).badge && (
                  <span className="text-black font-bold rounded-full px-1.5 py-0.5" style={{ background: '#D4A017', fontSize: '9px' }}>
                    {(item as any).badge}
                  </span>
                )}
                {active && <ChevronRight size={13} style={{ color: '#D4A017' }} />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #D4A017, #FF6B00)' }}>
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{user.name}</div>
              <div className="text-gray-500 text-xs">Administrator</div>
            </div>
          </div>
          <button onClick={() => { logout(); router.push('/admin/login'); }}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-30 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu size={20} /></button>
          <div className="flex items-center gap-2">
            {activeItem && (() => { const Icon = activeItem.icon; return <Icon size={16} className="text-primary" />; })()}
            <h1 className="font-semibold text-gray-700 text-sm">{activeItem?.label || 'Admin'}</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              <Sparkles size={11} style={{ color: '#D4A017' }} /> Vastu Arya v2.0
            </span>
            <Link href="/" target="_blank" className="text-xs text-primary hover:underline font-medium">View Site →</Link>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
