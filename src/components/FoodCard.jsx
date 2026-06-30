import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

/**
 * FoodCard - Komponen kartu makanan yang dapat digunakan kembali (reusable).
 * 
 * @param {Object} props
 * @param {Object} props.item - Data item makanan
 * @param {number} props.item.id - ID unik makanan
 * @param {string} props.item.name - Nama makanan
 * @param {string} props.item.restaurant - Nama restoran
 * @param {number} props.item.price - Harga makanan (dalam USD, dikonversi ke IDR)
 * @param {number} props.item.rating - Rating makanan (0-5)
 * @param {string} props.item.deliveryTime - Estimasi waktu pengiriman
 * @param {string} props.item.image - URL gambar makanan
 * @param {'horizontal'|'vertical'} [props.variant='vertical'] - Tampilan kartu
 */
export default function FoodCard({ item, variant = 'vertical' }) {
  // Konversi harga dari USD ke IDR (kurs 12.000)
  const priceInRupiah = (item.price * 12000).toLocaleString('id-ID');

  // Tampilan horizontal (untuk halaman search/list)
  if (variant === 'horizontal') {
    return (
      <Link
        to={`/food/${item.id}`}
        className="flex items-center bg-white rounded-3xl p-3 border border-gray-100 shadow-xs hover:shadow-sm active:scale-99 transition-all gap-3.5 text-left"
      >
        {/* Gambar makanan */}
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
          onError={(e) => {
            // Fallback gambar jika URL error
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
          }}
        />
        {/* Informasi makanan */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase font-extrabold text-orange-500 tracking-wider">
            {item.restaurant}
          </span>
          <h4 className="text-sm font-bold text-gray-800 truncate mt-0.5">{item.name}</h4>

          {/* Rating & Waktu Pengiriman */}
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

        {/* Harga */}
        <div className="text-right flex-shrink-0">
          <span className="text-xs font-black text-gray-900 whitespace-nowrap">
            Rp {priceInRupiah}
          </span>
        </div>
      </Link>
    );
  }

  // Tampilan vertikal (default, untuk halaman home/grid)
  return (
    <Link
      to={`/food/${item.id}`}
      className="w-44 flex-shrink-0 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-98 text-left"
    >
      {/* Gambar + badge waktu pengiriman */}
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-28 object-cover"
          onError={(e) => {
            // Fallback gambar jika URL error
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
          }}
        />
        {/* Badge estimasi waktu pengiriman */}
        <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-orange-500 flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3 text-orange-500" />
          {item.deliveryTime}
        </span>
      </div>

      {/* Informasi makanan */}
      <div className="p-3">
        {/* Nama restoran */}
        <span className="text-[10px] uppercase font-extrabold text-orange-500 tracking-wider">
          {item.restaurant}
        </span>
        {/* Nama makanan */}
        <h4 className="text-sm font-bold text-gray-800 truncate mt-0.5">{item.name}</h4>

        {/* Harga & Rating */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
          <span className="text-xs font-extrabold text-gray-900">Rp {priceInRupiah}</span>
          <div className="flex items-center gap-0.5 bg-orange-50 px-1.5 py-0.5 rounded-lg text-orange-600">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-bold">{item.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
