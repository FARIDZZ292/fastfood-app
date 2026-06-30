/**
 * supabaseClient.js - Konfigurasi koneksi ke Supabase.
 * 
 * Supabase adalah Backend-as-a-Service (BaaS) yang menyediakan:
 * - Database PostgreSQL
 * - Autentikasi pengguna (Email, Google, Facebook)
 * - Real-time subscriptions
 * - Storage file
 * 
 * Variabel environment (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)
 * dibaca dari file .env untuk keamanan (tidak di-hardcode di kode sumber).
 */

import { createClient } from '@supabase/supabase-js';

// URL project Supabase dari variabel environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Kunci anon (public) Supabase dari variabel environment
// Kunci ini aman untuk digunakan di frontend (Row Level Security melindungi data)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi: Pastikan variabel environment sudah dikonfigurasi
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase URL atau Anon Key tidak ditemukan!\n' +
    'Pastikan file .env sudah dikonfigurasi dengan benar:\n' +
    'VITE_SUPABASE_URL=your_supabase_url\n' +
    'VITE_SUPABASE_ANON_KEY=your_anon_key'
  );
}

// Ekspor instance Supabase client untuk digunakan di seluruh aplikasi
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
