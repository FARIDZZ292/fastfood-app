import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, CreditCard, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react';
import MainLayout from '../components/MainLayout';

export default function UserProfile() {
  const navigate = useNavigate();

  const userName = localStorage.getItem('user_name') || 'Nadia Amalia';
  const userEmail = localStorage.getItem('user_email') || 'nadia.amalia@example.com';

  const menuItems = [
    { label: 'Pesanan Saya', icon: ShoppingBag, path: '/order-tracking' },
    { label: 'Metode Pembayaran', icon: CreditCard, path: '/profile' },
    { label: 'Alamat Pengiriman', icon: MapPin, path: '/profile' },
    { label: 'Pengaturan Akun', icon: Settings, path: '/profile' },
  ];

  return (
    <MainLayout>
      {/* Profile Header card */}
      <div className="px-6 pt-6 pb-4 text-center bg-gradient-to-b from-orange-50 to-white rounded-b-[2.5rem] shadow-xs">
        <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-md relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" 
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-black text-gray-800 tracking-tight mt-3.5">{userName}</h2>
        <p className="text-gray-400 text-xs mt-1">{userEmail}</p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-3.5 rounded-2xl border border-gray-50 shadow-2xs text-left">
            <span className="text-[10px] uppercase font-extrabold text-orange-500 tracking-wider">Level Akun</span>
            <p className="text-sm font-black text-gray-850 mt-1">⭐ Penikmat Emas</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-gray-50 shadow-2xs text-left">
            <span className="text-[10px] uppercase font-extrabold text-orange-500 tracking-wider">Total Pesanan</span>
            <p className="text-sm font-black text-gray-850 mt-1">42 Pesanan</p>
          </div>
        </div>
      </div>

      {/* Menu links list */}
      <div className="px-4 mt-6 space-y-2.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 active:scale-99 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          );
        })}

        <button
          onClick={() => {
            // clear authentication mock session
            localStorage.setItem('failed_attempts', '0');
            navigate('/onboarding');
          }}
          className="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100/50 transition-all cursor-pointer mt-6"
        >
          <div className="flex items-center gap-3.5">
            <div className="bg-red-500 p-2 rounded-xl text-white">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-red-650">Keluar Akun</span>
          </div>
          <ChevronRight className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </MainLayout>
  );
}
