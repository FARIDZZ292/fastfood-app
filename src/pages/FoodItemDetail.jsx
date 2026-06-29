import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Clock, Minus, Plus, Check } from 'lucide-react';
import { foodItems } from '../data/mockData';
import { useCart } from '../context/CartContext';

export default function FoodItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const foodItem = useMemo(() => {
    return foodItems.find(item => item.id === parseInt(id));
  }, [id]);

  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!foodItem) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Menu Makanan Tidak Ditemukan</h2>
        <p className="text-gray-400 text-sm mt-2">Menu yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
        <Link 
          to="/home" 
          className="mt-6 bg-orange-500 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition-all"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Handle Addon Selection
  const toggleAddon = (addon) => {
    setSelectedAddons((prevSelected) => {
      const exists = prevSelected.some(a => a.id === addon.id);
      if (exists) {
        return prevSelected.filter(a => a.id !== addon.id);
      } else {
        return [...prevSelected, addon];
      }
    });
  };

  // Compute Item Total Price (represented in Rupiah)
  const computedTotal = useMemo(() => {
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return (foodItem.price + addonsPrice) * quantity * 12000;
  }, [foodItem.price, selectedAddons, quantity]);

  const handleAddToOrder = () => {
    addToCart(
      {
        id: foodItem.id,
        name: foodItem.name,
        price: foodItem.price,
        image: foodItem.image,
      },
      quantity,
      selectedAddons
    );
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative flex flex-col justify-between">
      {/* Top Banner and Navigation */}
      <div className="relative">
        <img 
          src={foodItem.image} 
          alt={foodItem.name} 
          className="w-full h-80 object-cover rounded-b-[3.5rem] shadow-sm"
        />
        
        {/* Navigation Action Overlays */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-md text-gray-800 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-md active:scale-95 transition-all"
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-850'}`} />
          </button>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="px-6 pt-5 pb-28 space-y-5 flex-1">
        {/* Title and Price */}
        <div className="flex items-start justify-between">
          <div className="text-left">
            <span className="text-xs uppercase font-extrabold text-orange-500 tracking-wider">
              {foodItem.restaurant}
            </span>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight mt-1">{foodItem.name}</h1>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-orange-500 whitespace-nowrap">Rp {(foodItem.price * 12000).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Rating and Delivery Information */}
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 bg-gray-50 p-3 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-1 text-orange-500 font-bold">
            <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>{foodItem.rating}</span>
            <span className="text-gray-400 font-normal">({foodItem.reviews} ulasan)</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{foodItem.deliveryTime} waktu pengantar</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5 text-left">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Deskripsi</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{foodItem.description}</p>
        </div>

        {/* Quantity Selector Section */}
        <div className="flex items-center justify-between py-2 border-y border-gray-50">
          <span className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">Jumlah</span>
          <div className="flex items-center gap-4 bg-gray-150 p-1.5 rounded-2xl">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="w-10 h-10 bg-white hover:bg-gray-100 active:scale-95 text-gray-800 flex items-center justify-center rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-base font-extrabold text-gray-800 w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-10 h-10 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add-ons Section */}
        {foodItem.addons && foodItem.addons.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest text-left">Sesuaikan Ekstra</h3>
            <div className="space-y-2.5">
              {foodItem.addons.map((addon) => {
                const isSelected = selectedAddons.some(a => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50 border-orange-500 shadow-sm'
                        : 'bg-white border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? 'bg-orange-500 text-white' : 'border-2 border-gray-300 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 stroke-[3px]" />}
                      </div>
                      <span className="text-sm font-bold text-gray-700">{addon.name}</span>
                    </div>
                    <span className="text-sm font-bold text-orange-500">+Rp {(addon.price * 12000).toLocaleString('id-ID')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Place Order Action Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-150 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleAddToOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white py-4.5 px-6 rounded-2xl font-extrabold text-base shadow-lg shadow-orange-500/20 transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Tambahkan ke Pesanan</span>
            <span>Rp {computedTotal.toLocaleString('id-ID')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
