import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar - Komponen input pencarian yang dapat digunakan kembali (reusable).
 * 
 * @param {Object} props
 * @param {string} props.value - Nilai input pencarian (controlled component)
 * @param {Function} props.onChange - Callback saat nilai input berubah
 * @param {string} [props.placeholder='Cari makanan...'] - Placeholder teks input
 * @param {string} [props.className=''] - Class tambahan untuk wrapper
 */
export default function SearchBar({ value, onChange, placeholder = 'Cari makanan...', className = '' }) {
  /**
   * Menghapus teks pencarian (reset ke string kosong)
   */
  const handleClear = () => {
    // Memanggil onChange dengan event sintetis agar kompatibel dengan useState
    onChange({ target: { value: '' } });
  };

  return (
    <div className={`relative flex items-center bg-gray-100 rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 focus-within:bg-white transition-all ${className}`}>
      {/* Ikon pencarian di kiri */}
      <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />

      {/* Input teks pencarian */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none pl-3 pr-8 text-sm font-medium text-gray-800 placeholder-gray-400"
        aria-label="Kolom pencarian"
      />

      {/* Tombol hapus (hanya muncul jika ada teks) */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 p-1 rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
          aria-label="Hapus pencarian"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
