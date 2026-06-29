import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Clock, X, MapPin, Map, List, Navigation } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import { supabase } from '../lib/supabaseClient';
import { restaurants } from '../data/mockData';

export default function Restaurants() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedMapRest, setSelectedMapRest] = useState(null);
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

  const filters = ['Semua', 'Dekat Anda', 'Populer', 'Peringkat Atas', 'Baru'];

  // Map filters to match restaurants mockData
  const filteredRestaurants = useMemo(() => {
    return allRestaurants.filter((rest) => {
      const matchesSearch = rest.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === 'Semua') return matchesSearch;
      if (activeFilter === 'Peringkat Atas') return matchesSearch && rest.rating >= 4.7;
      if (activeFilter === 'Dekat Anda') return matchesSearch && rest.id % 2 === 0;
      if (activeFilter === 'Populer') return matchesSearch && rest.rating >= 4.6;
      
      return matchesSearch;
    });
  }, [allRestaurants, searchQuery, activeFilter]);

  // Coordinates and positions for mock SVG Map
  const mapRestaurants = useMemo(() => {
    // static coordinates for SVG mapping (width 400, height 300)
    const coordinates = [
      { id: 1, x: 80, y: 70, color: '#f97316' },   // Pizza Palace
      { id: 2, x: 300, y: 80, color: '#ef4444' },  // Burger Barn
      { id: 3, x: 280, y: 220, color: '#3b82f6' }, // Pasta House
      { id: 4, x: 100, y: 240, color: '#10b981' }  // Green Bowl
    ];
    return filteredRestaurants.map(rest => {
      const coord = coordinates.find(c => c.id === rest.id) || { x: 200, y: 150, color: '#f97316' };
      return { ...rest, ...coord };
    });
  }, [filteredRestaurants]);

  return (
    <MainLayout>
      {/* Search Input Bar */}
      <div className="px-4 pt-4 flex gap-2">
        <div className="relative flex-1 flex items-center bg-gray-100 rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari restoran..."
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

        {/* View Mode Toggle Button */}
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="p-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-2xl shadow-md transition-all flex items-center justify-center cursor-pointer"
          title={viewMode === 'list' ? 'Tampilan Peta' : 'Tampilan Daftar'}
        >
          {viewMode === 'list' ? <Map className="w-5 h-5" /> : <List className="w-5 h-5" />}
        </button>
      </div>

      {/* Filter Pill Capsules */}
      <div className="mt-4">
        <div 
          className="flex gap-2 overflow-x-auto px-4 pb-2 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filters.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 border-orange-500 text-white shadow-xs'
                    : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        /* RESTAURANTS LIST VIEW */
        <div className="px-4 mt-5 space-y-5 pb-24">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest text-left">
              {filteredRestaurants.length} Restoran Aktif
            </h2>
          </div>

          {filteredRestaurants.length > 0 ? (
            <div className="space-y-4">
              {filteredRestaurants.map((rest) => (
                <div
                  key={rest.id}
                  onClick={() => navigate('/home')}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-left"
                >
                  <div className="relative">
                    <img 
                      src={rest.image} 
                      alt={rest.name} 
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-extrabold text-orange-500 flex items-center gap-1 shadow-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{rest.id === 1 ? '0.8 km' : rest.id === 2 ? '1.5 km' : rest.id === 3 ? '2.1 km' : '2.8 km'} dari Anda</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-gray-800 tracking-tight">{rest.name}</h3>
                        <p className="text-gray-400 text-xs mt-1">Italia • Makanan Cepat Saji • Pizza</p>
                      </div>
                      <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-xl text-orange-600 font-bold text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{rest.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-3.5 border-t border-gray-50 text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{rest.deliveryTime}</span>
                      </div>
                      <span>•</span>
                      <div>
                        Ongkir <span className="text-gray-850 font-bold">Rp 10.000</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">
              Tidak ada restoran yang cocok dengan pencarian Anda.
            </div>
          )}
        </div>
      ) : (
        /* RESTAURANTS MAP VIEW */
        <div className="px-4 mt-5 pb-24 text-left">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">
              Peta Lokasi Restoran
            </h2>
            <span className="text-xs text-orange-500 font-bold flex items-center gap-1 animate-pulse">
              <Navigation className="w-3.5 h-3.5 fill-current" /> GPS Aktif
            </span>
          </div>

          {/* Interactive SVG map panel */}
          <div className="bg-gray-100 border border-gray-200 rounded-[2rem] h-80 w-full relative overflow-hidden shadow-inner">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Roads / Streets Layout */}
              <path d="M 0,150 Q 200,100 400,150" fill="none" stroke="white" strokeWidth="20" strokeLinecap="round" opacity="0.8" />
              <path d="M 0,150 Q 200,100 400,150" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
              <text x="20" y="135" fill="#9ca3af" fontSize="8" fontWeight="bold" transform="rotate(-7 20 135)">Jl. Soekarno Hatta</text>

              <path d="M 180,0 Q 220,150 180,300" fill="none" stroke="white" strokeWidth="16" strokeLinecap="round" opacity="0.8" />
              <path d="M 180,0 Q 220,150 180,300" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
              <text x="210" y="40" fill="#9ca3af" fontSize="8" fontWeight="bold" transform="rotate(75 210 40)">Jl. Borobudur</text>

              {/* User Current Location Marker */}
              <g transform="translate(195, 120)">
                <circle r="12" fill="#22c55e" opacity="0.25" className="animate-ping" />
                <circle r="7" fill="#22c55e" stroke="white" strokeWidth="2" />
                <text x="-25" y="-12" fill="#15803d" fontSize="9" fontWeight="bold">Lokasi Anda</text>
              </g>

              {/* Restaurant Pins */}
              {mapRestaurants.map((rest) => {
                const isSelected = selectedMapRest?.id === rest.id;
                return (
                  <g 
                    key={rest.id} 
                    transform={`translate(${rest.x}, ${rest.y})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedMapRest(rest)}
                  >
                    {/* Ring for selected */}
                    {isSelected && (
                      <circle r="16" fill={rest.color} opacity="0.3" className="animate-pulse" />
                    )}
                    {/* Pin shape */}
                    <path 
                      d="M0 -12 C-6 -12 -10 -8 -10 -2 C-10 4 0 12 0 12 C0 12 10 4 10 -2 C10 -8 6 -12 0 -12 Z" 
                      fill={rest.color} 
                      stroke="white" 
                      strokeWidth="1.5"
                    />
                    <circle r="3" fill="white" cy="-2" />
                  </g>
                );
              })}
            </svg>

            {/* Float prompt if nothing selected */}
            {!selectedMapRest && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-500 shadow-sm">
                Klik pin restoran di peta untuk detail
              </div>
            )}

            {/* Selected Restaurant details Overlay Card at bottom of map */}
            {selectedMapRest && (
              <div className="absolute bottom-3 left-3 right-3 bg-white rounded-2xl p-3 border border-gray-100 shadow-lg flex items-center justify-between animate-slide-up">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={selectedMapRest.image} 
                    alt={selectedMapRest.name} 
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 truncate">{selectedMapRest.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 font-semibold">
                      <span className="text-orange-500 flex items-center gap-0.5">
                        ⭐ {selectedMapRest.rating}
                      </span>
                      <span>•</span>
                      <span>{selectedMapRest.deliveryTime}</span>
                      <span>•</span>
                      <span className="text-gray-400">
                        {selectedMapRest.id === 1 ? '0.8 km' : selectedMapRest.id === 2 ? '1.5 km' : selectedMapRest.id === 3 ? '2.1 km' : '2.8 km'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/home')}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  Buka Menu
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 bg-orange-50 p-4 rounded-2xl border border-orange-100 text-xs text-orange-700 leading-relaxed">
            💡 **Tips Peta**: Semua restoran berada di sekitar wilayah **Soekarno Hatta**. Pengiriman tercepat didukung oleh kurir terdekat dari lokasi Anda saat ini.
          </div>
        </div>
      )}
    </MainLayout>
  );
}
