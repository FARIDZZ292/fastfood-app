/**
 * SearchFilters.jsx - Halaman pencarian dan filter makanan.
 * 
 * Fitur:
 * - Input pencarian real-time dengan useState
 * - Filter kategori horizontal
 * - Data makanan dari TheMealDB API (useEffect + fetch)
 * - Loading state, error handling, dan empty state
 * - Hasil filter menggunakan useMemo untuk optimasi performa
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import FoodCard from '../components/FoodCard';
import SearchBar from '../components/SearchBar';
import { categories } from '../data/mockData';

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
    category: meal.strCategory || 'Semua',
    restaurant: meal.strArea ? `${meal.strArea} Kitchen` : 'Restoran Pilihan',
    deliveryTime: times[index % times.length],
    image: meal.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    addons: [
      { id: `${meal.idMeal}-1`, name: 'Ekstra Porsi', price: 2.00 },
      { id: `${meal.idMeal}-2`, name: 'Saus Spesial', price: 0.75 },
    ],
    source: 'mealdb',
  };
}

export default function SearchFilters() {
  // Baca query params dari URL (misal: /search?q=pizza)
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  // State input pencarian (controlled component)
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // State kategori yang sedang aktif
  const [activeCategory, setActiveCategory] = useState('Semua');

  // State daftar semua makanan dari TheMealDB API
  const [allMeals, setAllMeals] = useState([]);

  // State loading saat fetch API sedang berjalan
  const [isLoading, setIsLoading] = useState(true);

  // State pesan error jika fetch API gagal
  const [error, setError] = useState(null);

  /**
   * useEffect: Fetch semua data makanan dari TheMealDB API.
   * Dijalankan sekali saat komponen pertama kali dimuat.
   * Hasil disimpan ke state allMeals untuk difilter secara lokal.
   */
  useEffect(() => {
    const fetchAllMeals = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch daftar makanan dari TheMealDB API
        const response = await fetch(`${MEALDB_BASE_URL}/search.php?s=`);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
          // Konversi format TheMealDB ke format internal aplikasi
          const mapped = data.meals.map(mapMealToFoodItem);
          setAllMeals(mapped);
        } else {
          setError('Tidak ada data dari API.');
        }
      } catch (err) {
        console.error('Gagal fetch dari TheMealDB:', err);
        setError('Gagal memuat data. Periksa koneksi internet Anda.');
      } finally {
        // Matikan loading setelah fetch selesai (berhasil atau gagal)
        setIsLoading(false);
      }
    };

    fetchAllMeals();
  }, []); // Hanya dijalankan sekali saat komponen mount

  /**
   * useMemo: Filter makanan berdasarkan searchQuery dan activeCategory.
   * 
   * Dihitung ulang hanya jika searchQuery, activeCategory, atau allMeals berubah.
   * Ini mencegah kalkulasi ulang yang tidak perlu saat re-render.
   */
  const filteredFoodItems = useMemo(() => {
    return allMeals.filter((item) => {
      // Cek kecocokan kategori (Semua = tampilkan semua)
      const matchesCategory = activeCategory === 'Semua' ||
        item.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        item.name.toLowerCase().includes(activeCategory.toLowerCase());

      // Cek kecocokan teks pencarian (nama, restoran, atau deskripsi)
      const matchesQuery = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, activeCategory, allMeals]);

  return (
    <MainLayout>
      {/* ── SearchBar (Reusable Component) ── */}
      <div className="px-4 pt-4">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari pizza, burger, pasta..."
        />
      </div>

      {/* ── Filter Kategori (Horizontal Scroll) ── */}
      <div className="mt-4">
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-2 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Render tombol filter untuk setiap kategori */}
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

      {/* ── Area Hasil Pencarian ── */}
      <div className="px-4 mt-5">
        {/* Header hasil pencarian */}
        <div className="flex items-center justify-between mb-4">
          {!isLoading && (
            <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest text-left">
              {filteredFoodItems.length} Hasil ditemukan
            </h2>
          )}
          {/* Badge sumber data */}
          <span className="text-[9px] bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            TheMealDB API
          </span>
        </div>

        {/* Loading State: Skeleton cards saat data dimuat */}
        {isLoading && (
          <div className="space-y-3.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center bg-white rounded-3xl p-3 border border-gray-100 gap-3.5 animate-pulse">
                <div className="w-20 h-20 rounded-2xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        )}

        {/* Error State: Tampilkan pesan jika fetch API gagal */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-red-50 p-4 rounded-full text-red-400 mb-4">
              <CircleAlert className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-gray-800">Gagal Memuat Data</h3>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Data State: Render hasil pencarian */}
        {!isLoading && !error && (
          filteredFoodItems.length > 0 ? (
            <div className="space-y-3.5">
              {/* Render FoodCard horizontal untuk setiap hasil */}
              {filteredFoodItems.map((item) => (
                <FoodCard key={item.id} item={item} variant="horizontal" />
              ))}
            </div>
          ) : (
            // Empty State: Tampilkan pesan jika tidak ada hasil
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-orange-50 p-4 rounded-full text-orange-500 mb-4 animate-pulse">
                <CircleAlert className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Makanan Tidak Ditemukan</h3>
              <p className="text-gray-400 text-sm max-w-xs mt-1 leading-relaxed">
                Kami tidak dapat menemukan menu yang cocok. Silakan coba kata kunci lain!
              </p>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}
