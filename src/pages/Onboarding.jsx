import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Pizza, Coffee, Salad, Star } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col justify-between overflow-hidden relative">
      {/* Top Banner Illustration */}
      <div className="relative flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white px-6 pt-10 pb-6 rounded-b-[3.5rem] shadow-sm">
        {/* Floating Icons Background */}
        <div className="absolute top-8 left-8 bg-white p-3 rounded-2xl shadow-md transform -rotate-12 border border-orange-100 animate-pulse">
          <Pizza className="w-8 h-8 text-orange-500" />
        </div>
        <div className="absolute top-20 right-8 bg-white p-3 rounded-2xl shadow-md transform rotate-12 border border-orange-100 animate-pulse delay-75">
          <Salad className="w-8 h-8 text-green-500" />
        </div>
        <div className="absolute bottom-8 left-12 bg-white p-3 rounded-2xl shadow-md transform rotate-6 border border-orange-100 animate-pulse delay-150">
          <Coffee className="w-8 h-8 text-orange-400" />
        </div>

        {/* Central visual */}
        <div className="w-56 h-56 bg-orange-100 rounded-full flex items-center justify-center relative shadow-inner mt-4">
          <div className="w-44 h-44 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Star className="w-20 h-20 fill-white" />
          </div>
          <span className="absolute -bottom-2 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-orange-600 shadow-md border border-orange-100">
            ⭐ Lebih dari 1Juta+ Pesanan
          </span>
        </div>
      </div>

      {/* Text Info Section */}
      <div className="px-8 py-6 text-center">
        <h2 className="text-gray-400 text-xs uppercase tracking-widest font-extrabold mb-1">Selamat datang di</h2>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Pengiriman Fast<span className="text-orange-500">Food</span>
        </h1>
        <p className="text-gray-500 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
          Pesan makanan favorit Anda dari dapur lokal terbaik dan antarkan selagi hangat langsung ke pintu Anda!
        </p>
      </div>

      {/* Buttons Actions Section */}
      <div className="px-6 pb-8 pt-2 space-y-3.5">
        <button
          onClick={() => navigate('/signup')}
          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white py-4 px-6 rounded-2xl font-semibold text-base shadow-lg shadow-orange-500/20 flex items-center justify-center gap-3 transition-all duration-200"
        >
          <Mail className="w-5 h-5" />
          Mulai dengan email
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/home')}
            className="border-2 border-gray-100 hover:border-gray-200 active:scale-98 bg-white py-3.5 px-4 rounded-2xl font-semibold text-gray-700 text-sm flex items-center justify-center gap-2 transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            onClick={() => navigate('/home')}
            className="border-2 border-gray-100 hover:border-gray-200 active:scale-98 bg-white py-3.5 px-4 rounded-2xl font-semibold text-gray-700 text-sm flex items-center justify-center gap-2 transition-all duration-200"
          >
            <svg className="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-gray-500 text-sm">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-bold underline transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
