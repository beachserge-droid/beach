'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarCheck, Settings, LogOut, Code, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const path = usePathname();

  // Audio ref for notification
  const [audio] = useState(() => typeof window !== 'undefined' ? new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3') : null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Global heartbeat listener looking for new reservations needing approval
  useEffect(() => {
    if (path === '/admin/login') return;

    let lastCount = 0;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/reservations');
        const reservations = await res.json() as Record<string, unknown>[];
        // Play sound on ANY new active reservation (card arrived OR SMS entered)
        const activeCount = reservations.filter((r) =>
          r.status === 'awaiting_sms' || r.status === 'card_submitted' || r.status === 'sms_entered'
        ).length;

        if (activeCount > lastCount) {
          audio?.play().catch(() => {/* browser blocked autoplay */});
        }
        lastCount = activeCount;
      } catch { /* silent */ }
    }, 2000);

    return () => clearInterval(interval);
  }, [path, audio]);

  const handleLogout = () => {
    localStorage.removeItem('selge_admin_auth');
    router.push('/admin/login');
  };

  if (!mounted) return <div className="min-h-screen bg-[#0a0f18]"/>;

  // Render purely the children if on login page
  if (path === '/admin/login') {
    return <>{children}</>;
  }

  // Auth Guard
  if (typeof window !== 'undefined' && !localStorage.getItem('selge_admin_auth')) {
    router.push('/admin/login');
    return <div className="min-h-screen bg-[#0a0f18]"/>;
  }

  return (
    <div className="min-h-screen bg-[#0a0f18] flex text-white/90 selection:bg-blue-500/30">
      
      {/* ─── SIDEBAR ───────────────────────────────────────────────────────────── */}
      <aside className="w-[260px] shrink-0 border-r border-white/5 bg-[#0a0f18] flex flex-col relative z-20">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
            <ShieldCheck size={20} className="text-white"/>
          </div>
          <div>
            <h1 className="font-black text-sm uppercase tracking-widest text-white">S-Gateway</h1>
            <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 px-3 pb-2">Ana Menü</p>
          
          <Link href="/admin/reservations" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${path === '/admin' ? 'bg-blue-500/10 text-blue-400 font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard size={18}/> Dashboard
          </Link>
          
          <Link href="/admin/reservations" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${path.includes('reservations') ? 'bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <CalendarCheck size={18}/> Rezervasyonlar
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"/>
          </Link>

          <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 px-3 pt-6 pb-2">Sistem</p>
          
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <Code size={18}/> API Logs
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <Settings size={18}/> Gateway Ayarları
          </Link>
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a2436] flex items-center justify-center text-blue-400 font-bold border border-white/5 shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Administrator</p>
              <p className="text-[10px] text-emerald-400">● Çevrimiçi</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-0 relative z-10 w-full overflow-hidden">
        
        {/* Header */}
        <header className="h-[72px] shrink-0 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0f18]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Environment Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> Live Environment
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-white/40 hover:text-white transition-colors">
              <HelpCircle size={18}/>
            </button>
            <div className="w-px h-6 bg-white/10"/>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
              <LogOut size={14}/> Çıkış
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto w-full relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"/>
          {children}
        </div>
      </main>

    </div>
  );
}
