import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedAdminRoute - Komponen Higher-Order untuk melindungi route admin.
 * 
 * Mengecek apakah admin sudah terautentikasi via localStorage.
 * Jika belum login, otomatis redirect ke halaman login admin.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Komponen anak yang dilindungi
 */
export default function ProtectedAdminRoute({ children }) {
  // Cek status autentikasi admin dari localStorage
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';

  // Jika belum autentikasi, redirect ke halaman login admin
  if (!isAdminAuthenticated) {
    return <Navigate to="/portalmasuk/login" replace />;
  }

  // Jika sudah autentikasi, tampilkan konten yang dilindungi
  return children;
}
