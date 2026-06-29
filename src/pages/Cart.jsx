import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus, X, ShieldAlert, CreditCard, MapPin, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('gopay');
  const [address, setAddress] = useState('Jl. Soekarno Hatta 15A, Lowokwaru, Kota Malang');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const rawTax = cartTotal * 0.1;
  const rawGrandTotal = cartTotal + rawTax;

  const convertedTotal = useMemo(() => cartTotal * 12000, [cartTotal]);
  const convertedTax = useMemo(() => rawTax * 12000, [rawTax]);
  const convertedGrandTotal = useMemo(() => rawGrandTotal * 12000, [rawGrandTotal]);

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // numbers only
    if (val.length <= 6) {
      setPin(val);
      setPinError('');
    }
  };

  const handleProcessCheckout = (e) => {
    e.preventDefault();
    const storedHashedPin = localStorage.getItem('secure_hash_pin');
    
    // Fallback PIN to 123456 if none set in SignUp
    const expectedPin = storedHashedPin 
      ? storedHashedPin.split('').reverse().join('') 
      : '123456';

    if (pin === expectedPin) {
      setPinError('');
      // Save checkout details for tracking page
      localStorage.setItem('checkout_address', address);
      localStorage.setItem('checkout_payment', paymentMethod);
      localStorage.setItem('checkout_total', convertedGrandTotal.toLocaleString('id-ID'));
      
      // Clear cart items on successful order
      clearCart();
      setIsCheckoutOpen(false);
      navigate('/order-tracking');
    } else {
      setPinError('PIN Transaksi Keamanan Salah!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col justify-between relative">
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 pb-72">
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

      {/* Checkout details static panel */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-[2.5rem] border-t border-gray-150 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-800 font-bold">Rp {convertedTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
                <span>Pajak (10%)</span>
                <span className="text-gray-800 font-bold">Rp {convertedTax.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-200 my-2"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-gray-800">Total Harga</span>
                <span className="text-xl font-black text-orange-500">Rp {convertedGrandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white py-4.5 px-6 rounded-2xl font-extrabold text-base shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center cursor-pointer"
            >
              Lanjutkan ke Pembayaran
            </button>
          </div>
        </div>
      )}

      {/* Secure Checkout Modal overlay */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] rounded-b-[2.5rem] overflow-hidden shadow-2xl animate-slide-up flex flex-col text-left">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-black text-gray-800">Checkout Keamanan</h3>
              </div>
              <button 
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setPin('');
                  setPinError('');
                }}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleProcessCheckout} className="p-6 space-y-5">
              {/* Delivery Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" /> Alamat Pengiriman
                </label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl p-3 text-sm font-medium text-gray-700 placeholder-gray-400 transition-all resize-none h-18"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-orange-500" /> Pilih Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'gopay', label: 'GoPay 📱' },
                    { id: 'ovo', label: 'OVO 📱' },
                    { id: 'bank', label: 'Virtual Account 🏦' },
                    { id: 'cod', label: 'Bayar di Tempat 💵' }
                  ].map((method) => (
                    <label 
                      key={method.id} 
                      className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                        paymentMethod === method.id 
                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                          : 'bg-white border-gray-150 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="hidden"
                      />
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Secure PIN code validation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
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
                  className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3.5 px-4 text-center text-xl font-extrabold tracking-[0.75em] text-gray-800 transition-all font-mono"
                />
                {pinError && (
                  <span className="text-red-500 text-xs font-semibold block text-center mt-1 animate-pulse">
                    ⚠️ {pinError}
                  </span>
                )}
                <p className="text-[10px] text-gray-400 text-center">Demi keamanan transaksi, masukkan 6 digit PIN akun Anda.</p>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={pin.length < 6}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:shadow-none active:scale-98 text-white py-4 px-6 rounded-2xl font-extrabold text-sm shadow-lg shadow-orange-500/20 transition-all text-center cursor-pointer mt-4"
              >
                Konfirmasi & Bayar Rp {convertedGrandTotal.toLocaleString('id-ID')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
