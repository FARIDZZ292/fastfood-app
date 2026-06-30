import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Plus, Minus, X, ShieldAlert, CreditCard, MapPin, Ticket, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

/**
 * Halaman Keranjang Belanja & Checkout (Cart Page)
 * 
 * Fitur Tambahan & Modifikasi:
 * 1. Opsi Kurir Pengiriman (Express, Reguler, Hemat) dengan tarif berbeda.
 * 2. Sistem Klaim Voucher Diskon (e.g., 'DISKON30', 'MAKANGRATIS').
 * 3. 12+ Pilihan Metode Pembayaran Terstruktur (E-Wallet, VA Bank, Konter, Kredit, PayLater, COD).
 * 4. Rincian Biaya Transaksi Lengkap (Subtotal, Ongkir, Diskon, Pajak, Biaya Layanan, Total Akhir).
 * 5. Validasi Keamanan PIN Transaksi sebelum pembayaran diproses.
 */
export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  // State Kontrol Modal & Data Transaksi
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('gopay');
  const [paymentCategory, setPaymentCategory] = useState('ewallet'); // 'ewallet' | 'bank' | 'counter' | 'kredit' | 'paylater' | 'cod'
  const [address, setAddress] = useState('Jl. Sukarno Hatta No. 15A, Lowokwaru, Kota Malang');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Fitur 1: Pilihan Kurir & Tarif Ongkir
  const [deliveryOption, setDeliveryOption] = useState('regular'); // 'express' | 'regular' | 'economy'
  const deliveryFees = {
    express: 18000,
    regular: 10000,
    economy: 5000
  };
  const deliveryNames = {
    express: 'Sangat Cepat (Express)',
    regular: 'Pengiriman Reguler',
    economy: 'Hemat (Economy)'
  };

  // Fitur 2: Sistem Voucher Diskon
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null); // { code: string, discount: number }
  const [voucherError, setVoucherError] = useState('');

  // Menghitung Biaya-Biaya Dasar
  const convertedTotal = useMemo(() => cartTotal * 12000, [cartTotal]);
  const deliveryFee = deliveryFees[deliveryOption];

  // Kalkulasi Diskon Voucher
  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.code === 'DISKON30') {
      return Math.min(convertedTotal * 0.3, 30000); // Diskon 30% maks Rp 30rb
    }
    if (appliedVoucher.code === 'MAKANGRATIS') {
      return Math.min(convertedTotal, 50000); // Diskon Rp 50rb
    }
    return 0;
  }, [appliedVoucher, convertedTotal]);

  // Pajak, Biaya Aplikasi & Grand Total
  const subtotalAfterDiscount = Math.max(0, convertedTotal - discountAmount);
  const tax = subtotalAfterDiscount * 0.1;
  const serviceFee = 2000; // Biaya aplikasi tetap
  const grandTotal = subtotalAfterDiscount + deliveryFee + tax + serviceFee;

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucherCode.trim().toUpperCase();

    if (code === 'DISKON30') {
      setAppliedVoucher({ code: 'DISKON30', name: 'Diskon Harian 30%' });
      setVoucherCode('');
    } else if (code === 'MAKANGRATIS') {
      setAppliedVoucher({ code: 'MAKANGRATIS', name: 'Potongan Rp 50.000' });
      setVoucherCode('');
    } else {
      setVoucherError('Kode voucher tidak valid atau kedaluwarsa.');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // hanya angka
    if (val.length <= 6) {
      setPin(val);
      setPinError('');
    }
  };

  const handleProcessCheckout = (e) => {
    e.preventDefault();
    const storedHashedPin = localStorage.getItem('secure_hash_pin');
    
    // Default PIN akun demo jika tidak diatur saat signup adalah 123456
    const expectedPin = storedHashedPin 
      ? storedHashedPin.split('').reverse().join('') 
      : '123456';

    if (pin === expectedPin) {
      setPinError('');
      // Simpan rincian pembayaran untuk dibaca di halaman tracking
      localStorage.setItem('checkout_address', address);
      localStorage.setItem('checkout_payment', paymentMethod.toUpperCase());
      localStorage.setItem('checkout_total', grandTotal.toLocaleString('id-ID'));
      localStorage.setItem('checkout_delivery', deliveryNames[deliveryOption]);
      
      clearCart();
      setIsCheckoutOpen(false);
      navigate('/order-tracking');
    } else {
      setPinError('PIN Transaksi Keamanan Salah!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col justify-between relative pb-72">
      {/* Top Header sticky bar */}
      <div className="sticky top-0 bg-white z-20 px-4 py-4.5 flex items-center justify-between border-b border-gray-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition-all text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black text-gray-800 tracking-tight">Keranjang Saya</h1>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-500 hover:text-red-650 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Kosongkan
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-orange-50 p-6 rounded-full text-orange-500 mb-5 animate-pulse">
              <ShoppingBag className="w-14 h-14" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Keranjang Belanja Kosong</h2>
            <p className="text-gray-400 text-sm max-w-xs mt-2 leading-relaxed">
              Sepertinya Anda belum menambahkan menu apa pun ke keranjang belanja. Yuk cari menu lezat!
            </p>
            <Link
              to="/home"
              className="mt-6 bg-orange-500 hover:bg-orange-650 active:scale-98 text-white px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-md shadow-orange-500/20 transition-all"
            >
              Cari Menu Makanan
            </Link>
          </div>
        ) : (
          cartItems.map((item) => {
            const addOnSummary = item.addons.map((a) => a.name).join(', ');
            const addOnTotal = item.addons.reduce((sum, a) => sum + a.price, 0);
            const unitPrice = (item.price + addOnTotal) * 12000;

            return (
              <div
                key={item.cartItemId}
                className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs flex gap-3.5 relative overflow-hidden group text-left"
              >
                {/* Item Thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                />

                {/* Details info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 truncate pr-6">{item.name}</h4>
                    {addOnSummary && (
                      <p className="text-xs text-gray-400 font-medium mt-1 truncate">
                        Ekstra: <span className="text-gray-500">{addOnSummary}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-sm font-extrabold text-orange-500">Rp {unitPrice.toLocaleString('id-ID')}</span>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="p-1 hover:bg-white hover:shadow-xs active:scale-90 rounded-lg text-gray-600 transition-all cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-extrabold text-gray-800 w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="p-1 bg-orange-500 hover:bg-orange-600 hover:shadow-xs active:scale-90 rounded-lg text-white transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove action button */}
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-500 active:scale-90 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Rincian Checkout di bagian bawah */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-[2.5rem] border-t border-gray-150 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          <div className="max-w-md mx-auto space-y-4">
            
            {/* Input Voucher Diskon */}
            <form onSubmit={handleApplyVoucher} className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="w-4.5 h-4.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Masukkan Voucher (DISKON30)"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-orange-500 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-gray-700 outline-none transition-all uppercase placeholder-gray-450"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Klaim
              </button>
            </form>
            {voucherError && <p className="text-red-500 text-[10px] font-bold text-left pl-1">⚠️ {voucherError}</p>}

            {/* Opsi Voucher yang sedang Aktif */}
            {appliedVoucher && (
              <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-xs">
                <span className="text-orange-600 font-extrabold">🎟️ Voucher Aktif: {appliedVoucher.name}</span>
                <button type="button" onClick={handleRemoveVoucher} className="text-red-500 hover:text-red-650">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Pilihan Kurir Pengiriman */}
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-orange-500" /> Kurir Pengiriman</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'economy', label: 'Hemat 🛵', price: 'Rp 5.000' },
                  { id: 'regular', label: 'Reguler 🛵', price: 'Rp 10.000' },
                  { id: 'express', label: 'Express ⚡', price: 'Rp 18.000' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDeliveryOption(opt.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${
                      deliveryOption === opt.id
                        ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-xs'
                        : 'bg-gray-50 border-gray-150 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="opacity-80 mt-0.5">{opt.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Rincian Biaya */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Subtotal Makanan</span>
                <span className="text-gray-800 font-bold">Rp {convertedTotal.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-green-600 font-bold">
                  <span>Diskon Voucher</span>
                  <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Tarif Ongkos Kirim</span>
                <span className="text-gray-800 font-bold">Rp {deliveryFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Pajak Restoran (10%)</span>
                <span className="text-gray-800 font-bold">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Biaya Layanan Aplikasi</span>
                <span className="text-gray-800 font-bold">Rp {serviceFee.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-200 my-1"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-gray-800">Total Pembayaran</span>
                <span className="text-lg font-black text-orange-500">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Tombol Lanjut ke Pembayaran */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white py-4 px-6 rounded-2xl font-extrabold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center cursor-pointer"
            >
              Pilih Metode & Bayar
            </button>
          </div>
        </div>
      )}

      {/* Secure Checkout Modal overlay */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] rounded-b-[2.5rem] overflow-hidden shadow-2xl animate-slide-up flex flex-col text-left max-h-[85vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-black text-gray-800">Metode & Keamanan Pembayaran</h3>
              </div>
              <button 
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setPin('');
                  setPinError('');
                }}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessCheckout} className="p-5 space-y-4 overflow-y-auto flex-1">
              
              {/* Delivery Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-450 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" /> Konfirmasi Alamat Pengiriman
                </label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none rounded-xl p-2.5 text-xs font-semibold text-gray-700 placeholder-gray-400 transition-all resize-none h-14"
                />
              </div>

              {/* Multi-Feature Payment Categories */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-450 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-orange-500" /> Kategori Metode Pembayaran
                </label>
                
                {/* Tab Kategori */}
                <div className="flex gap-1 overflow-x-auto pb-1.5 no-scrollbar">
                  {[
                    { id: 'ewallet', label: 'E-Wallet 📱' },
                    { id: 'bank', label: 'Transfer VA 🏦' },
                    { id: 'kredit', label: 'Kartu Kredit 💳' },
                    { id: 'counter', label: 'Tunai Konter 🏪' },
                    { id: 'paylater', label: 'PayLater ⏱️' },
                    { id: 'cod', label: 'COD 💵' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setPaymentCategory(cat.id);
                        // Atur metode default dari kategori yang dipilih
                        const defaults = {
                          ewallet: 'gopay',
                          bank: 'vabca',
                          kredit: 'credit_card',
                          counter: 'indomaret',
                          paylater: 'gopaylater',
                          cod: 'cod'
                        };
                        setPaymentMethod(defaults[cat.id]);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap border transition-all cursor-pointer ${
                        paymentCategory === cat.id
                          ? 'bg-orange-500 border-orange-500 text-white shadow-xs'
                          : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* List Pilihan Sub-Metode Pembayaran */}
                <div className="grid grid-cols-2 gap-2">
                  {/* E-Wallet */}
                  {paymentCategory === 'ewallet' && [
                    { id: 'gopay', label: 'GoPay (Diskon 2%)' },
                    { id: 'ovo', label: 'OVO' },
                    { id: 'dana', label: 'DANA' },
                    { id: 'shopeepay', label: 'ShopeePay' }
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${
                        paymentMethod === item.id 
                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                          : 'bg-white border-gray-150 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subpayment"
                        value={item.id}
                        checked={paymentMethod === item.id}
                        onChange={() => setPaymentMethod(item.id)}
                        className="hidden"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}

                  {/* Transfer Bank Virtual Account */}
                  {paymentCategory === 'bank' && [
                    { id: 'vabca', label: 'BCA Virtual Account' },
                    { id: 'vamandiri', label: 'Mandiri Bill Payment' },
                    { id: 'vabni', label: 'BNI Virtual Account' },
                    { id: 'vabri', label: 'BRI Virtual Account' }
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${
                        paymentMethod === item.id 
                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                          : 'bg-white border-gray-150 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subpayment"
                        value={item.id}
                        checked={paymentMethod === item.id}
                        onChange={() => setPaymentMethod(item.id)}
                        className="hidden"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}

                  {/* Kartu Kredit */}
                  {paymentCategory === 'kredit' && [
                    { id: 'credit_card', label: 'Kartu Kredit (Visa/Mastercard)' }
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`col-span-2 flex items-center justify-between p-2.5 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${
                        paymentMethod === item.id 
                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                          : 'bg-white border-gray-150 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subpayment"
                        value={item.id}
                        checked={paymentMethod === item.id}
                        onChange={() => setPaymentMethod(item.id)}
                        className="hidden"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}

                  {/* Tunai Konter */}
                  {paymentCategory === 'counter' && [
                    { id: 'indomaret', label: 'Indomaret / Ceriamart' },
                    { id: 'alfamart', label: 'Alfamart / Alfamidi' }
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${
                        paymentMethod === item.id 
                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                          : 'bg-white border-gray-150 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subpayment"
                        value={item.id}
                        checked={paymentMethod === item.id}
                        onChange={() => setPaymentMethod(item.id)}
                        className="hidden"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}

                  {/* PayLater */}
                  {paymentCategory === 'paylater' && [
                    { id: 'gopaylater', label: 'GoPayLater (Bunga 0%)' },
                    { id: 'spaylater', label: 'SPayLater (Cicilan 3x)' }
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${
                        paymentMethod === item.id 
                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                          : 'bg-white border-gray-150 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subpayment"
                        value={item.id}
                        checked={paymentMethod === item.id}
                        onChange={() => setPaymentMethod(item.id)}
                        className="hidden"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}

                  {/* COD */}
                  {paymentCategory === 'cod' && [
                    { id: 'cod', label: 'Tunai Saat Pengantaran (COD)' }
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`col-span-2 flex items-center justify-between p-2.5 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${
                        paymentMethod === item.id 
                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                          : 'bg-white border-gray-150 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subpayment"
                        value={item.id}
                        checked={paymentMethod === item.id}
                        onChange={() => setPaymentMethod(item.id)}
                        className="hidden"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Secure PIN code validation */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-extrabold text-gray-450 uppercase tracking-wider flex items-center justify-center gap-1.5">
                  Masukkan PIN Transaksi (6 Digit)
                </label>
                <input
                  type="password"
                  required
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="••••••"
                  className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none rounded-xl py-3 px-4 text-center text-lg font-extrabold tracking-[0.75em] text-gray-800 transition-all font-mono"
                />
                {pinError && (
                  <span className="text-red-500 text-[10px] font-bold block text-center mt-1 animate-pulse">
                    ⚠️ {pinError}
                  </span>
                )}
                <p className="text-[9px] text-gray-450 text-center">PIN default akun demo adalah: <strong>123456</strong></p>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={pin.length < 6}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:shadow-none active:scale-98 text-white py-3.5 px-6 rounded-2xl font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all text-center cursor-pointer mt-4"
              >
                Konfirmasi & Bayar Rp {grandTotal.toLocaleString('id-ID')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
