import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BottomNavbar() {
  const location = useLocation();
  const { cartCount } = useCart();
  const path = location.pathname;

  const navItems = [
    { label: 'Beranda', path: '/home', icon: Home },
    { label: 'Cari', path: '/search', icon: Search },
    { label: 'Keranjang', path: '/cart', icon: ShoppingBag, badge: cartCount },
    { label: 'Restoran', path: '/restaurants', icon: Heart }, // Pointing to restaurants list as placeholder/favorites
    { label: 'Profil', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-150 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto flex items-center justify-around py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = path === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`relative flex flex-col items-center gap-1.5 py-1 px-4 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-orange-500 scale-105' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5.5 h-5.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight font-semibold ${isActive ? 'text-orange-500 font-bold' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
