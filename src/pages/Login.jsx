import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutTime, setLockoutTime] = useState(0);

  // Handle lockout countdown
  useEffect(() => {
    if (lockoutTime <= 0) return;
    const interval = setInterval(() => {
      setLockoutTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    const failedAttempts = parseInt(localStorage.getItem('failed_attempts') || '0', 10);

    // 1. Block admin login from user portal
    if (email.toLowerCase() === 'admin@fastfood.com') {
      setErrorMsg('Akun admin tidak dapat masuk melalui portal ini. Gunakan Portal Admin.');
      return;
    }

    try {
      // 2. Fetch user from Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error(error);
        setErrorMsg('Gagal terhubung ke database.');
        return;
      }

      if (user && user.password === password) {
        // Check verification status
        if (user.status === 'pending') {
          setErrorMsg('Akun Anda sedang dalam peninjauan oleh Admin. Harap tunggu verifikasi.');
          return;
        }
        if (user.status === 'rejected') {
          setErrorMsg('Pendaftaran akun Anda ditolak oleh Admin.');
          return;
        }

        // Successful login
        localStorage.setItem('failed_attempts', '0');
        setErrorMsg('');
        localStorage.setItem('user_name', user.name);
        localStorage.setItem('user_email', user.email);
        localStorage.setItem('active_user_role', user.role);
        navigate('/home');
      } else {
        // Increment failed attempts
        const newAttempts = failedAttempts + 1;
        localStorage.setItem('failed_attempts', newAttempts.toString());
        if (newAttempts >= 3) {
          setLockoutTime(30);
          setErrorMsg('Terlalu banyak percobaan gagal. Akun dikunci sementara.');
        } else {
          setErrorMsg(`Email atau kata sandi salah. Percobaan tersisa: ${3 - newAttempts}`);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan sistem. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col justify-between p-6 overflow-hidden">
      {/* Header bar */}
      <div>
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => navigate('/onboarding')}
            className="p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 active:scale-95 transition-all text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-400">Langkah 1 dari 2</span>
        </div>

        {/* Title */}
        <div className="mt-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Masuk</h1>
          <p className="text-gray-500 text-sm mt-2">Silakan masuk ke akun Anda yang terdaftar</p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-650 text-xs font-semibold rounded-2xl animate-shake">
            {errorMsg} {lockoutTime > 0 && `Silakan coba lagi dalam ${lockoutTime} detik.`}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Alamat Email</label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Kata Sandi</label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-4 pl-12 pr-12 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 p-1 hover:bg-gray-200 rounded-lg text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300 accent-orange-500"
              />
              <span className="text-gray-500 font-medium">Ingat saya</span>
            </label>
            <Link to="/reset-password" className="text-red-500 hover:text-red-650 font-bold transition-colors">
              Lupa kata sandi?
            </Link>
          </div>

          <button
            type="submit"
            disabled={lockoutTime > 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:shadow-none active:scale-98 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg shadow-orange-500/20 mt-6 transition-all"
          >
            {lockoutTime > 0 ? `Terkunci (${lockoutTime}s)` : 'Masuk'}
          </button>
        </form>
      </div>

      {/* Footer footer */}
      <div className="text-center pt-6 space-y-3">
        <p className="text-gray-500 text-sm">
          Belum punya akun?{' '}
          <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-bold underline transition-colors">
            DAFTAR SEKARANG
          </Link>
        </p>
        <div className="border-t border-gray-100 pt-3">
          <Link
            to="/portalmasuk"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-semibold transition-colors"
          >
            <span>🔐</span>
            <span>Portal Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
