'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, Package, ShoppingBag, Calendar, BookOpen,
  Users, Settings, Image, MessageSquare, LogOut, Menu, X,
  BarChart2, Layers, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Services', icon: Layers },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/slider', label: 'Slider', icon: Image },
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
    if (!user || !isAdmin()) {
      router.push('/admin/login');
    }
  }, [user, pathname]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!user || !isAdmin()) return (
    <div className="min-h-screen bg-[#0D0500] flex items-center justify-center">
      <div className="text-white text-center"><div className="text-4xl mb-3 animate-spin">🕉️</div><p>Loading admin panel...</p></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 admin-sidebar transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-saffron-gradient flex items-center justify-center text-white font-bold font-accent">VA</div>
            <div>
              <div className="text-white font-bold text-sm">Vastu Arya</div>
              <div className="text-primary text-xs">Admin Panel</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><X size={18} /></button>
        </div>
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Icon size={18} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">{user.name[0]}</div>
            <div>
              <div className="text-white text-xs font-semibold line-clamp-1">{user.name}</div>
              <div className="text-gray-500 text-xs">Administrator</div>
            </div>
          </div>
          <button onClick={() => { logout(); router.push('/admin/login'); }} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu size={20} /></button>
          <h1 className="font-semibold text-gray-700 text-sm">
            {navItems.find(n => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Admin'}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" target="_blank" className="text-xs text-primary hover:underline">View Site →</Link>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
