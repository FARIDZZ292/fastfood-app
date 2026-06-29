import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Flame, ArrowRight } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import { supabase } from '../lib/supabaseClient';
import { categories, foodItems, restaurants } from '../data/mockData';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [allRestaurants, setAllRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*');
        
        if (error) {
          console.error(error);
          setAllRestaurants(restaurants);
          return;
        }

        const mappedRests = data.map(r => ({
          id: r.id,
          name: r.name,
          rating: Number(r.rating) || 4.5,
          deliveryTime: r.delivery_time || '15-20 mnt',
          image: r.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop',
          category: r.category,
          lat: r.lat,
          lng: r.lng
        }));

        const combined = [...restaurants];
        mappedRests.forEach((r) => {
          if (!combined.some(item => item.id === r.id)) {
            combined.push(r);
          }
        });
        setAllRestaurants(combined);
      } catch (err) {
        console.error(err);
        setAllRestaurants(restaurants);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter items by category. activeCategory name comes from categories.name
  const filteredFoodItems = activeCategory === 'Semua'
    ? foodItems
    : foodItems.filter(item => item.category === (activeCategory === 'Pencuci Mulut' ? 'Dessert' : activeCategory === 'Sehat' ? 'Healthy' : activeCategory === 'Minuman' ? 'Drinks' : activeCategory));

  return (
    <MainLayout>
      {/* Welcome & Craving Input */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-gray-400">Halo, Teman Lapar! 👋</h2>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight mt-1">
          Yuk cari <span className="text-orange-500">Makanan Lezat</span>
        </h1>

        <Link 
          to="/search" 
          className="mt-4 flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3.5 text-gray-400 hover:bg-gray-150 active:scale-99 transition-all"
        >
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium">Mau makan apa hari ini?</span>
        </Link>
      </div>

      {/* Promos Slider / Banner */}
      <div className="px-4 mt-3">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl p-5 relative overflow-hidden shadow-lg shadow-orange-500/25">
          {/* Decorative shapes */}
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full"></div>
          <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-white/10 rounded-full"></div>

          <div className="relative z-10 max-w-[65%] text-left">
            <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
              Penawaran Terbatas
            </span>
            <h3 className="text-white text-2xl font-black leading-tight mt-3">
              Dapatkan Diskon Harian 30% Sekarang!
            </h3>
            <p className="text-white/80 text-xs mt-1">Untuk semua pesanan di atas Rp 150.000</p>
            <button className="bg-white text-orange-500 font-bold text-xs px-4 py-2.5 rounded-xl mt-4 hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
              Pesan Sekarang <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Banner image/artwork dummy */}
          <div className="absolute right-4 bottom-2 top-2 w-[35%] flex items-center justify-center">
            <div className="w-24 h-24 bg-white/25 rounded-full flex items-center justify-center animate-pulse">
              <Flame className="w-12 h-12 text-white fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Slider */}
      <div className="mt-5">
        <div className="flex items-center justify-between px-4 mb-2.5">
          <h2 className="text-lg font-black text-gray-800 tracking-tight">Kategori</h2>
        </div>
        <div 
          className="flex gap-3 overflow-x-auto px-4 pb-2.5 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fastest Delivery section */}
      <div className="mt-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black text-gray-800 tracking-tight">Pengiriman Tercepat</span>
            <span className="text-lg">⚡</span>
          </div>
          <Link to="/search" className="text-orange-500 hover:text-orange-600 font-bold text-xs transition-colors">
            Lihat semua
          </Link>
        </div>

        {filteredFoodItems.length > 0 ? (
          <div 
            className="flex gap-4 overflow-x-auto px-4 pb-4 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredFoodItems.map((item) => (
              <Link
                key={item.id}
                to={`/food/${item.id}`}
                className="w-44 flex-shrink-0 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-98 text-left"
              >
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-28 object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-orange-500 flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3 text-orange-500" />
                    {item.deliveryTime}
                  </span>
                </div>
                <div className="p-3">
                  <span className="text-[10px] uppercase font-extrabold text-orange-500 tracking-wider">
                    {item.restaurant}
                  </span>
                  <h4 className="text-sm font-bold text-gray-800 truncate mt-0.5">{item.name}</h4>
                  
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-55">
                    <span className="text-xs font-extrabold text-gray-900">Rp {(item.price * 12000).toLocaleString('id-ID')}</span>
                    <div className="flex items-center gap-0.5 bg-orange-50 px-1.5 py-0.5 rounded-lg text-orange-600">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-bold">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">Tidak ada menu di kategori ini.</div>
        )}
      </div>

      {/* Popular Restaurants Section */}
      <div className="mt-4 px-4 pb-6">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg font-black text-gray-800 tracking-tight">Restoran Populer 🏪</h2>
          <Link to="/restaurants" className="text-orange-500 hover:text-orange-600 font-bold text-xs transition-colors">
            Lihat Peta
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {allRestaurants.map((rest) => (
            <Link
              key={rest.id}
              to="/restaurants"
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-sm transition-all flex flex-col active:scale-98 text-left"
            >
              <img 
                src={rest.image} 
                alt={rest.name} 
                className="w-full h-24 object-cover"
              />
              <div className="p-3 flex-1 flex flex-col justify-between">
                <h4 className="text-sm font-bold text-gray-800 truncate">{rest.name}</h4>
                <div className="flex items-center justify-between mt-2.5 text-[11px] text-gray-500 font-medium">
                  <div className="flex items-center gap-0.5 text-orange-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{rest.rating}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{rest.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
