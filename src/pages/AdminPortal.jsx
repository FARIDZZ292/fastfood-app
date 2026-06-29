import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Home, Users, Bike, Store, Activity } from 'lucide-react';

export default function AdminPortal() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(isAdmin);
  }, []);

  const handleAccessDashboard = () => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    } else {
      navigate('/portalmasuk/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 max-w-md mx-auto flex flex-col justify-between p-6 relative font-sans overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[40%] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mt-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Portal Admin</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Utama</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="my-auto py-8 text-left z-10 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
            FastFood Portal
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Gerbang masuk area administrasi sistem FastFood. Kelola pengguna, validasi pendaftaran kurir, dan setujui merchant dengan aman.
          </p>
        </div>

        {/* System Status Banner */}
        <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-slate-200">Status Sistem</p>
              <p className="text-[10px] text-slate-400">Semua layanan berjalan optimal</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
            <Activity className="w-3 h-3 mr-0.5" /> Online
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-3.5">
          {[
            { icon: Users, label: 'Manajemen Pelanggan', desc: 'Pantau data akun pelanggan terdaftar.' },
            { icon: Bike, label: 'Verifikasi Kurir', desc: 'Validasi berkas SIM dan status pendaftaran kurir.' },
            { icon: Store, label: 'Persetujuan Merchant', desc: 'Tinjau berkas NIB/KTP dan pembuatan restoran baru.' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="group bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/80 rounded-3xl p-4.5 transition-all duration-300 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 group-hover:text-orange-400 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{item.label}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer/Action */}
      <div className="mt-auto space-y-4 z-10">
        <button
          onClick={handleAccessDashboard}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-98 text-white font-bold text-sm py-4.5 rounded-3xl shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 group transition-all cursor-pointer"
        >
          <span>{isAuthenticated ? 'Masuk ke Dashboard' : 'Autentikasi Akses Admin'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="text-[10px] text-center text-slate-500 tracking-wide uppercase font-semibold">
          Sistem Keamanan Terenkripsi • FastFood Co.
        </p>
      </div>
    </div>
  );
}
