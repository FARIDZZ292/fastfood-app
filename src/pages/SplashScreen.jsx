import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      onClick={() => navigate('/onboarding')}
      className="flex min-h-screen max-w-md mx-auto flex-col items-center justify-center bg-orange-500 text-white cursor-pointer relative overflow-hidden select-none"
    >
      {/* Decorative background shapes */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-600 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-400 rounded-full opacity-30 blur-2xl"></div>
      
      <div className="flex flex-col items-center justify-center animate-bounce duration-1000">
        <div className="bg-white p-4 rounded-full shadow-2xl mb-4 flex items-center justify-center w-24 h-24">
          <img src="/logo.png" alt="FastFood Logo" className="w-16 h-16 object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-8 h-8 text-white fill-current animate-pulse" />
          <h1 className="text-4xl font-extrabold tracking-wider">FastFood</h1>
        </div>
        <p className="text-white/80 text-sm mt-2 font-medium tracking-wide">Makanan lezat, diantar cepat</p>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/60 text-xs">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span>Menyiapkan kelezatan...</span>
      </div>
    </div>
  );
}
