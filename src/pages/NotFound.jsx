import React from 'react';
import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';

/**
 * NotFound - Halaman 404 untuk route yang tidak dikenal.
 * Ditampilkan saat pengguna mengakses URL yang tidak terdaftar di router.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center">
      {/* Ilustrasi ikon 404 */}
      <div className="bg-orange-50 p-8 rounded-full text-orange-500 mb-6">
        <SearchX className="w-16 h-16" />
      </div>

      {/* Kode error */}
      <h1 className="text-7xl font-black text-orange-500 leading-none">404</h1>

      {/* Judul & deskripsi */}
      <h2 className="text-2xl font-black text-gray-800 mt-4 tracking-tight">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-xs">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>

      {/* Tombol kembali ke beranda */}
      <Link
        to="/home"
        className="mt-8 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
      >
        <Home className="w-5 h-5" />
        Kembali ke Beranda
      </Link>
    </div>
  );
}
