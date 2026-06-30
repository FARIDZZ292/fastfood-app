/**
 * CartContext.jsx - Global State Management untuk keranjang belanja.
 * 
 * Menyediakan state dan fungsi berikut ke seluruh komponen aplikasi:
 * - cartItems: Array semua item di keranjang
 * - addToCart: Menambah item (dengan dukungan addon/topping)
 * - removeFromCart: Menghapus item berdasarkan cartItemId
 * - updateQuantity: Mengubah jumlah item (auto-remove jika qty = 0)
 * - clearCart: Mengosongkan seluruh keranjang
 * - cartTotal: Total harga (dihitung otomatis dengan useMemo)
 * - cartCount: Jumlah total item (untuk badge di navbar)
 * 
 * Data keranjang di-persist ke localStorage agar tidak hilang saat refresh.
 */

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Membuat Context untuk keranjang belanja
const CartContext = createContext();

/**
 * CartProvider - Komponen Provider yang membungkus seluruh aplikasi.
 * Semua komponen di dalamnya dapat mengakses state keranjang.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Komponen anak
 */
export function CartProvider({ children }) {
  /**
   * State utama keranjang belanja.
   * Diinisialisasi dari localStorage untuk persistensi data saat refresh.
   */
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('fastfood_cart');
      // Parse data dari localStorage, atau gunakan array kosong jika tidak ada
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      // Jika localStorage gagal (misalnya mode private), mulai dengan array kosong
      console.error('Gagal membaca cart dari localStorage:', error);
      return [];
    }
  });

  /**
   * Sinkronisasi cartItems ke localStorage setiap kali berubah.
   * Ini memastikan data keranjang tidak hilang saat halaman di-refresh.
   */
  useEffect(() => {
    try {
      localStorage.setItem('fastfood_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Gagal menyimpan cart ke localStorage:', error);
    }
  }, [cartItems]);

  /**
   * Menambahkan item ke keranjang.
   * Jika item dengan addon yang sama sudah ada, qty-nya ditambah.
   * Jika berbeda addon, dibuat entri baru yang terpisah.
   * 
   * @param {Object} item - Data item makanan
   * @param {number} quantity - Jumlah yang ditambahkan
   * @param {Array} addons - Array addon/topping yang dipilih
   */
  const addToCart = (item, quantity, addons = []) => {
    setCartItems((prevItems) => {
      // Buat kunci unik berdasarkan kombinasi addon yang dipilih
      const addonsKey = addons.map(a => a.name).sort().join('|');
      
      // Cari apakah item dengan addon yang sama sudah ada di keranjang
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && i.addonsKey === addonsKey
      );

      if (existingItemIndex > -1) {
        // Jika sudah ada, tambahkan kuantitasnya
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Jika belum ada, tambahkan sebagai entri baru
        return [
          ...prevItems,
          {
            ...item,
            quantity,
            addons,
            addonsKey,
            // ID unik untuk setiap entri cart (untuk key prop React & operasi remove)
            cartItemId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }
        ];
      }
    });
  };

  /**
   * Menghapus item dari keranjang berdasarkan cartItemId.
   * 
   * @param {string} cartItemId - ID unik item di keranjang
   */
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  /**
   * Mengubah kuantitas item di keranjang.
   * Jika kuantitas mencapai 0 atau kurang, item otomatis dihapus.
   * 
   * @param {string} cartItemId - ID unik item di keranjang
   * @param {number} amount - Jumlah perubahan (positif/negatif)
   */
  const updateQuantity = (cartItemId, amount) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        // Hapus item yang kuantitasnya sudah 0 atau kurang
        .filter((item) => item.quantity > 0)
    );
  };

  /**
   * Mengosongkan seluruh isi keranjang.
   * Dipanggil setelah checkout berhasil.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Total harga semua item di keranjang (dalam USD, dikonversi ke IDR di tampilan).
   * Dihitung ulang hanya ketika cartItems berubah (optimasi dengan useMemo).
   */
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      // Jumlahkan harga semua addon yang dipilih
      const addonsPrice = item.addons.reduce((sum, addon) => sum + addon.price, 0);
      return total + (item.price + addonsPrice) * item.quantity;
    }, 0);
  }, [cartItems]);

  /**
   * Total jumlah item di keranjang (untuk badge notifikasi di BottomNavbar).
   * Dihitung ulang hanya ketika cartItems berubah (optimasi dengan useMemo).
   */
  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart - Custom Hook untuk mengakses CartContext.
 * 
 * Harus digunakan di dalam komponen yang dibungkus CartProvider.
 * Akan melempar error jika digunakan di luar CartProvider.
 * 
 * @returns {Object} Semua nilai dan fungsi dari CartContext
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
}
