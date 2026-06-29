import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, X, CircleAlert } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import { categories, foodItems } from '../data/mockData';

export default function SearchFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Filter foodItems with useMemo for performance optimization
  const filteredFoodItems = useMemo(() => {
    return foodItems.filter((item) => {
      // Map Indonesian categories back to match mockData English category keys
      let itemCategory = item.category;
      let targetCategory = activeCategory;
      if (activeCategory === 'Pencuci Mulut') targetCategory = 'Dessert';
      else if (activeCategory === 'Sehat') targetCategory = 'Healthy';
      else if (activeCategory === 'Minuman') targetCategory = 'Drinks';

      const matchesCategory = activeCategory === 'Semua' || itemCategory === targetCategory;
      const matchesQuery = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, activeCategory]);

  return (
    <MainLayout>
      {/* Search Bar Input */}
      <div className="px-4 pt-4">
        <div className="relative flex items-center bg-gray-100 rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pizza, burger, pasta..."
            className="w-full bg-transparent outline-none pl-3 pr-8 text-sm font-medium text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 p-1 rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Horizontal Pills Scroll */}
      <div className="mt-4">
        <div 
          className="flex gap-2 overflow-x-auto px-4 pb-2 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
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

      {/* Results Section */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest text-left">
            {filteredFoodItems.length} Hasil ditemukan
          </h2>
        </div>

        {filteredFoodItems.length > 0 ? (
          <div className="space-y-3.5">
            {filteredFoodItems.map((item) => (
              <Link
                key={item.id}
                to={`/food/${item.id}`}
                className="flex items-center bg-white rounded-3xl p-3 border border-gray-100 shadow-xs hover:shadow-sm active:scale-99 transition-all gap-3.5 text-left"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-extrabold text-orange-500 tracking-wider">
                    {item.restaurant}
                  </span>
                  <h4 className="text-sm font-bold text-gray-800 truncate mt-0.5">{item.name}</h4>
                  
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-0.5 text-orange-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.rating}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-0.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.deliveryTime}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-gray-900 whitespace-nowrap">Rp {(item.price * 12000).toLocaleString('id-ID')}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-orange-50 p-4 rounded-full text-orange-500 mb-4 animate-pulse">
              <CircleAlert className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Makanan Tidak Ditemukan</h3>
            <p className="text-gray-400 text-sm max-w-xs mt-1 leading-relaxed">
              Kami tidak dapat menemukan menu yang cocok dengan kata kunci Anda. Silakan coba kata kunci lain atau pilih kategori lain!
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
