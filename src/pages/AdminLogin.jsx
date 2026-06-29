import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Simulate database network lag for premium feel
    setTimeout(() => {
      if (email.toLowerCase() === 'admin@fastfood.com' && password === 'admin123') {
        localStorage.setItem('admin_authenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        setErrorMsg('Kredensial administrasi tidak sah. Periksa kembali email & sandi Anda.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 max-w-md mx-auto flex flex-col justify-between p-6 relative font-sans overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-[-25%] right-[-25%] w-[80%] h-[50%] rounded-full bg-orange-500/10 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[40%] rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mt-2 z-10">
          <button
            onClick={() => navigate('/portalmasuk')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-800 active:scale-95 transition-all text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-500 tracking-wider">Akses Keamanan Tinggi</span>
        </div>

        {/* Title */}
        <div className="mt-8 z-10 relative">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-orange-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none">Autentikasi Admin</h1>
          <p className="text-slate-400 text-xs mt-2 font-medium">Masukkan kunci akses Anda untuk masuk ke sistem.</p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-6 p-4 bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-semibold rounded-2xl flex gap-2.5 items-start">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 z-10 relative">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Administrator</label>
            <div className="relative flex items-center">
              <Mail className="w-4.5 h-4.5 text-slate-500 absolute left-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fastfood.com"
                className="w-full bg-slate-900/60 border border-slate-850 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none rounded-2xl py-4.5 pl-12 pr-4 text-xs font-semibold text-slate-200 placeholder-slate-600 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Sandi Rahasia</label>
            <div className="relative flex items-center">
              <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/60 border border-slate-850 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none rounded-2xl py-4.5 pl-12 pr-12 text-xs font-semibold text-slate-200 placeholder-slate-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 p-1 hover:bg-slate-850 rounded-lg text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 active:scale-98 text-white py-4.5 px-6 rounded-2xl font-bold text-xs shadow-lg shadow-orange-500/10 mt-8 transition-all flex justify-center items-center cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mengecek Kredensial...
              </span>
            ) : (
              'Buka Akses Panel'
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 z-10">
        <p className="text-[10px] text-slate-650 tracking-wider font-semibold uppercase">
          Strictly Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
