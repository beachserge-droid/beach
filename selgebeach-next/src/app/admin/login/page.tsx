'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, User, Key, ChevronRight } from 'lucide-react';

export default function AdminLogin() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'admin123') {
      localStorage.setItem('selge_admin_auth', 'active_session_token_' + Date.now());
      router.push('/admin/reservations');
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] flex items-center justify-center p-4" style={{
      backgroundImage: 'radial-gradient(circle at 50% 0%, #17243b 0%, #0a0f18 60%)'
    }}>
      <div className="w-full max-w-[420px] relative">
        {/* Decorative elements behind */}
        <div className="absolute -top-20 -left-20 w-64 h-64 border-[1px] border-blue-500/20 rounded-full opacity-50"/>
        <div className="absolute top-40 -right-20 w-48 h-48 border-[1px] border-emerald-500/10 rounded-full opacity-50"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"/>

        {/* Login Box */}
        <div className="relative bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"/>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10 relative">
              <Lock size={28} className="text-white"/>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#111827] flex items-center justify-center">
                <ShieldCheck size={12} className="text-white"/>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight">Secure Gateway</h1>
            <p className="text-sm font-medium text-blue-400 mt-1 uppercase tracking-widest">Admin Control Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Kullanıcı Adı</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={user} 
                  onChange={e => setUser(e.target.value)} 
                  className="w-full bg-[#0a0f18] border border-white/10 rounded-xl px-4 py-3.5 text-white/90 font-medium pl-11 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-white/20"
                  placeholder="admin"
                />
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Şifre</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={pass} 
                  onChange={e => setPass(e.target.value)} 
                  className="w-full bg-[#0a0f18] border border-white/10 rounded-xl px-4 py-3.5 text-white/90 font-medium pl-11 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-white/20 tracking-widest"
                  placeholder="••••••••"
                />
                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"/>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-2 rounded-lg text-center animate-in slide-in-from-top-1">
                Kullanıcı adı veya şifre hatalı!
              </div>
            )}

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all group mt-2">
              Giriş Yap <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center flex flex-col items-center">
             <div className="flex gap-4">
               {['256-bit SSL', 'End-to-End', 'PCI DSS'].map(txt => (
                 <div key={txt} className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-widest font-semibold">
                   <ShieldCheck size={10}/> {txt}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
