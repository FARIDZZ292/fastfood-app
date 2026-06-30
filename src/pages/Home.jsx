/**
 * Home.jsx - Halaman Beranda aplikasi FastFood.
 * 
 * Fitur:
 * - Menampilkan banner promo
 * - Kategori makanan dengan filter real-time (useState)
 * - Daftar makanan dari TheMealDB API (useEffect + fetch)
 * - Daftar restoran dari Supabase database (useEffect + fetch)
 * - Loading state & error handling
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Flame, ArrowRight } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import FoodCard from '../components/FoodCard';
import SearchBar from '../components/SearchBar';
import { supabase } from '../lib/supabaseClient';
import { categories, restaurants } from '../data/mockData';

// URL dasar TheMealDB API (free tier, tanpa API key)
const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Mengkonversi data dari TheMealDB ke format yang digunakan aplikasi.
 * 
 * @param {Object} meal - Data meal dari TheMealDB API
 * @param {number} index - Index untuk kalkulasi harga & rating
 * @returns {Object} Data makanan dalam format aplikasi
 */
function mapMealToFoodItem(meal, index) {
  // Harga variatif berdasarkan posisi (karena TheMealDB tidak menyediakan harga)
  const prices = [8.99, 10.49, 12.99, 9.49, 11.99, 7.99, 13.49, 9.99];
  const ratings = [4.5, 4.7, 4.8, 4.6, 4.9, 4.4, 4.7, 4.5];
  const times = ['15-20 mnt', '10-15 mnt', '20-25 mnt', '5-10 mnt', '15-20 mnt', '10-15 mnt'];

  return {
    id: `meal-${meal.idMeal}`,
    name: meal.strMeal,
    description: meal.strInstructions
      ? meal.strInstructions.substring(0, 120) + '...'
      : 'Menu lezat dari dapur terbaik.',
    price: prices[index % prices.length],
    rating: ratings[index % ratings.length],
    reviews: Math.floor(Math.random() * 150) + 30,
    // Kategori makanan dari TheMealDB
    category: meal.strCategory || 'Semua',
    restaurant: meal.strArea ? `${meal.strArea} Kitchen` : 'Restoran Pilihan',
    deliveryTime: times[index % times.length],
    // Gambar dari TheMealDB (URL langsung)
    image: meal.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    addons: [
      { id: `${meal.idMeal}-1`, name: 'Ekstra Porsi', price: 2.00 },
      { id: `${meal.idMeal}-2`, name: 'Saus Spesial', price: 0.75 },
    ],
    source: 'mealdb', // Menandai sumber data dari TheMealDB
  };
}

export default function Home() {
  // State untuk kategori yang sedang aktif (filter makanan)
  const [activeCategory, setActiveCategory] = useState('Semua');

  // State untuk daftar restoran (dari Supabase + mockData)
  const [allRestaurants, setAllRestaurants] = useState([]);

  // State untuk daftar makanan dari TheMealDB API
  const [apiMeals, setApiMeals] = useState([]);

  // State loading saat fetch API sedang berjalan
  const [isMealsLoading, setIsMealsLoading] = useState(true);

  // State untuk pesan error jika fetch API gagal
  const [mealsError, setMealsError] = useState(null);

  // State untuk pencarian di halaman home (link ke SearchFilters)
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * useEffect #1: Fetch daftar makanan dari TheMealDB API.
   * Dijalankan sekali saat komponen pertama kali dimuat.
   * 
   * TheMealDB API (free): https://www.themealdb.com/api/json/v1/1/search.php?s=
   */
  useEffect(() => {
    const fetchMealsFromAPI = async () => {
      setIsMealsLoading(true);
      setMealsError(null);

      try {
        // Fetch daftar makanan dengan kata kunci kosong (mengambil semua)
        const response = await fetch(`${MEALDB_BASE_URL}/search.php?s=`);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
          // Konversi format data TheMealDB ke format aplikasi
          const mappedMeals = data.meals.slice(0, 12).map(mapMealToFoodItem);
          setApiMeals(mappedMeals);
        } else {
          setMealsError('Tidak ada data dari API.');
        }
      } catch (err) {
        // Catat error dan tampilkan pesan ke pengguna
        console.error('Gagal fetch dari TheMealDB:', err);
        setMealsError('Gagal memuat menu dari API.');
      } finally {
        // Matikan loading spinner setelah fetch selesai (berhasil atau gagal)
        setIsMealsLoading(false);
      }
    };

    fetchMealsFromAPI();
  }, []); // Dependency array kosong = hanya dijalankan sekali (on mount)

  /**
   * useEffect #2: Fetch daftar restoran dari Supabase database.
   * Dijalankan sekali saat komponen pertama kali dimuat.
   * Jika fetch gagal, fallback ke data statis mockData.
   */
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Query tabel 'restaurants' dari Supabase
        const { data, error } = await supabase
          .from('restaurants')
          .select('*');

        if (error) {
          // Jika error dari Supabase, gunakan data statis sebagai fallback
          console.error('Supabase error:', error);
          setAllRestaurants(restaurants);
          return;
        }

        // Mapping format data Supabase ke format aplikasi
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

        // Gabungkan data Supabase dengan mockData (hindari duplikasi berdasarkan ID)
        const combined = [...restaurants];
        mappedRests.forEach((r) => {
          if (!combined.some(item => item.id === r.id)) {
            combined.push(r);
          }
        });
        setAllRestaurants(combined);
      } catch (err) {
        // Fallback ke mockData jika terjadi error jaringan
        console.error('Network error:', err);
        setAllRestaurants(restaurants);
      }
    };

    fetchRestaurants();
  }, []); // Dependency array kosong = hanya dijalankan sekali (on mount)

  /**
   * Filter makanan berdasarkan kategori yang aktif.
   * Mapping kategori Indonesia → kategori TheMealDB (dalam Bahasa Inggris).
   */
  const categoryMapping = {
    'Burger': 'Beef',
    'Pizza': 'Pasta',
    'Pasta': 'Pasta',
    'Sehat': 'Side',
    'Minuman': 'Dessert',
    'Pencuci Mulut': 'Dessert',
  };

  const filteredFoodItems = activeCategory === 'Semua'
    ? apiMeals
    : apiMeals.filter(item =>
        item.category === (categoryMapping[activeCategory] || activeCategory)
      );

  return (
    <MainLayout>
      {/* ── Sambutan & Search Bar ── */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-gray-400">Halo, Teman Lapar! 👋</h2>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight mt-1">
          Yuk cari <span className="text-orange-500">Makanan Lezat</span>
        </h1>

        {/* SearchBar reusable component - link ke halaman pencarian */}
        <Link to={`/search${searchQuery ? `?q=${searchQuery}` : ''}`}>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mau makan apa hari ini?"
            className="mt-4 cursor-pointer"
          />
        </Link>
      </div>

      {/* ── Banner Promo ── */}
      <div className="px-4 mt-3">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl p-5 relative overflow-hidden shadow-lg shadow-orange-500/25">
          {/* Elemen dekoratif latar belakang */}
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

          {/* Ilustrasi banner */}
          <div className="absolute right-4 bottom-2 top-2 w-[35%] flex items-center justify-center">
            <div className="w-24 h-24 bg-white/25 rounded-full flex items-center justify-center animate-pulse">
              <Flame className="w-12 h-12 text-white fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Kategori (Filter Horizontal) ── */}
      <div className="mt-5">
        <div className="flex items-center justify-between px-4 mb-2.5">
          <h2 className="text-lg font-black text-gray-800 tracking-tight">Kategori</h2>
        </div>
        <div
          className="flex gap-3 overflow-x-auto px-4 pb-2.5 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Render tombol kategori dari mockData */}
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

      {/* ── Daftar Makanan dari TheMealDB API ── */}
      <div className="mt-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black text-gray-800 tracking-tight">Menu Pilihan</span>
            <span className="text-lg">🍽️</span>
            {/* Badge sumber data API */}
            <span className="text-[9px] bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              TheMealDB API
            </span>
          </div>
          <Link to="/search" className="text-orange-500 hover:text-orange-600 font-bold text-xs transition-colors">
            Lihat semua
          </Link>
        </div>

        {/* Loading State: Tampilkan skeleton/spinner saat data dimuat */}
        {isMealsLoading && (
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 no-scrollbar">
            {/* Skeleton loading cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-44 flex-shrink-0 bg-gray-100 rounded-3xl overflow-hidden animate-pulse">
                <div className="w-full h-28 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State: Tampilkan pesan jika fetch gagal */}
        {!isMealsLoading && mealsError && (
          <div className="mx-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
            <p className="text-red-500 text-sm font-semibold">⚠️ {mealsError}</p>
            <p className="text-gray-400 text-xs mt-1">Periksa koneksi internet Anda.</p>
          </div>
        )}

        {/* Data State: Tampilkan kartu makanan jika data berhasil dimuat */}
        {!isMealsLoading && !mealsError && (
          filteredFoodItems.length > 0 ? (
            <div
              className="flex gap-4 overflow-x-auto px-4 pb-4 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Render FoodCard reusable component untuk setiap item */}
              {filteredFoodItems.map((item) => (
                <FoodCard key={item.id} item={item} variant="vertical" />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
              Tidak ada menu di kategori ini.
            </div>
          )
        )}
      </div>

      {/* ── Restoran Populer (dari Supabase) ── */}
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
                onError={(e) => {
                  // Fallback gambar restoran jika URL error
                  e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop';
                }}
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
