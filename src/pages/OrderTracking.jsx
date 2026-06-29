import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Phone, MessageSquare, CheckCircle2, ChevronRight, Navigation } from 'lucide-react';

export default function OrderTracking() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2); // Step 2: "On the way"
  const [courierProgress, setCourierProgress] = useState(25); // percentage along the route

  const address = localStorage.getItem('checkout_address') || 'Jl. Soekarno Hatta 15A, Lowokwaru, Kota Malang';
  const paymentMethod = localStorage.getItem('checkout_payment') || 'gopay';
  const totalPaid = localStorage.getItem('checkout_total') || '145.000';

  const steps = [
    { label: 'Pesanan Diterima', time: '21:30', desc: 'Restoran telah menerima pesanan Anda' },
    { label: 'Sedang Disiapkan', time: '21:42', desc: 'Koki sedang menyiapkan hidangan lezat Anda' },
    { label: 'Dalam Perjalanan', time: '21:55', desc: 'Kurir sedang mengantarkan makanan ke tempat Anda' },
    { label: 'Tiba di Tujuan', time: 'Est: 22:15', desc: 'Selamat menikmati hidangan lezat Anda!' }
  ];

  // Animate courier movement along the route
  useEffect(() => {
    const interval = setInterval(() => {
      setCourierProgress((prev) => {
        if (prev >= 90) {
          setCurrentStep(3); // Mark as Delivered when progress reaches near 100
        }
        if (prev >= 100) {
          return 100;
        }
        return prev + 5;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Compute courier coordinate position along the curved path
  // Start point (Restaurant): x=60, y=190
  // Control point: x=200, y=100
  // End point (Home): x=340, y=70
  const getCourierCoords = (tPercent) => {
    const t = tPercent / 100;
    // Quadratic Bezier curve formula
    const p0 = { x: 60, y: 190 };
    const p1 = { x: 200, y: 100 };
    const p2 = { x: 340, y: 70 };

    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    return { x, y };
  };

  const courierPos = getCourierCoords(courierProgress);

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col justify-between relative text-left">
      {/* Sticky Header bar */}
      <div className="sticky top-0 bg-white z-20 px-4 py-4.5 flex items-center justify-between border-b border-gray-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition-all text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black text-gray-800 tracking-tight">Lacak Pesanan</h1>
        </div>
        <span className="bg-orange-100 text-orange-600 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
          {courierProgress < 100 ? 'Diproses' : 'Selesai'}
        </span>
      </div>

      {/* Map Mockup visual */}
      <div className="bg-gray-100 h-64 w-full relative overflow-hidden border-b border-gray-200">
        <svg className="w-full h-full" viewBox="0 0 400 240">
          {/* Grid pattern background */}
          <defs>
            <pattern id="grid-tracking" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-tracking)" />

          {/* Simple streets outline */}
          <path d="M 0,120 Q 200,80 400,120" fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
          <path d="M 0,120 Q 200,80 400,120" fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4,4" />

          {/* Route path from Rest to Home */}
          <path 
            d="M 60,190 Q 200,100 340,70" 
            fill="none" 
            stroke="rgba(249,115,22,0.15)" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          <path 
            d="M 60,190 Q 200,100 340,70" 
            fill="none" 
            stroke="#f97316" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeDasharray="6,6"
          />

          {/* Pin: Restaurant */}
          <g transform="translate(60, 190)">
            <circle r="6" fill="#f97316" stroke="white" strokeWidth="2" shadow-sm="true" />
            <rect x="-35" y="-30" width="70" height="18" rx="6" fill="white" stroke="#ffedd5" strokeWidth="1" />
            <text x="0" y="-18" textAnchor="middle" fill="#7c2d12" fontSize="8" fontWeight="bold">🍔 Restoran</text>
          </g>

          {/* Pin: Home Delivery */}
          <g transform="translate(340, 70)">
            <circle r="6" fill="#ef4444" stroke="white" strokeWidth="2" className={courierProgress < 100 ? "animate-bounce" : ""} />
            <rect x="-30" y="-30" width="60" height="18" rx="6" fill="white" stroke="#fee2e2" strokeWidth="1" />
            <text x="0" y="-18" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold">📍 Rumah Anda</text>
          </g>

          {/* Courier Pin floating dynamically */}
          <g transform={`translate(${courierPos.x}, ${courierPos.y})`}>
            {courierProgress < 100 && (
              <circle r="14" fill="#f97316" opacity="0.3" className="animate-ping" />
            )}
            <circle r="10" fill="#f97316" stroke="white" strokeWidth="2" className="shadow-md" />
            <text x="0" y="3" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">🛵</text>
          </g>
        </svg>

        {/* Live GPS badge overlay */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-orange-500 shadow-xs flex items-center gap-1.5">
          <Navigation className="w-3 h-3 text-orange-500 fill-orange-500 animate-pulse" />
          <span>Lacak Kurir Langsung ({courierProgress}%)</span>
        </div>
      </div>

      {/* Driver info block */}
      <div className="bg-white px-4 py-5 border-y border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" 
            alt="Courier Driver"
            className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-150"
          />
          <div>
            <h4 className="text-sm font-extrabold text-gray-800 tracking-tight">Randi Hernando</h4>
            <p className="text-gray-400 text-xs mt-0.5">Mitra Pengantar Anda</p>
          </div>
        </div>
        
        <div className="flex gap-2.5">
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100 text-orange-500 active:scale-95 transition-all cursor-pointer">
            <Phone className="w-4.5 h-4.5" />
          </button>
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100 text-orange-500 active:scale-95 transition-all cursor-pointer">
            <MessageSquare className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Delivery Tracking Stepper */}
      <div className="flex-1 bg-white p-6 space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50">
          <span>Estimasi Waktu Tiba</span>
          <span className="text-orange-500 flex items-center gap-1">
            <Clock className="w-4 h-4" /> {courierProgress < 100 ? '10 - 15 mnt' : 'Tiba!'}
          </span>
        </div>

        <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="relative pl-6">
                {/* Stepper Dot node */}
                <div className={`absolute -left-2.5 top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-orange-500 border-white shadow-sm ring-4 ring-orange-100' 
                    : 'bg-white border-gray-300'
                }`}></div>

                {/* Steps Details */}
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className={`text-sm font-bold tracking-tight ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                      {step.label}
                    </h5>
                    <p className={`text-xs mt-1 ${isCurrent ? 'text-orange-500 font-semibold' : 'text-gray-400'}`}>
                      {step.desc}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-450">{step.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Paid and Address Details */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs space-y-2 mt-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Metode Pembayaran:</span>
            <span className="font-bold text-gray-700 capitalize">{paymentMethod === 'gopay' ? 'GoPay 📱' : paymentMethod === 'ovo' ? 'OVO 📱' : paymentMethod === 'bank' ? 'Virtual Account 🏦' : 'Bayar di Tempat (COD) 💵'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Pembayaran:</span>
            <span className="font-bold text-orange-500">Rp {totalPaid}</span>
          </div>
          <div className="border-t border-dashed border-gray-200 my-1.5"></div>
          <div className="text-left">
            <span className="text-gray-400 block mb-1">Alamat Pengiriman:</span>
            <span className="font-medium text-gray-700 block leading-relaxed">{address}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/home')}
          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-md shadow-orange-500/10 transition-all text-center mt-4 cursor-pointer"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
