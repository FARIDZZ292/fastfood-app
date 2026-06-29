import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Bike, Store, ChevronRight } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'customer',
      title: 'Pelanggan / Customer',
      desc: 'Pesan makanan lezat, pantau kurir secara real-time, dan nikmati diskon harian menarik.',
      icon: User,
      color: 'bg-orange-50 text-orange-500 border-orange-100 hover:border-orange-500',
      path: '/register/customer'
    },
    {
      id: 'courier',
      title: 'Mitra Pengantar / Kurir',
      desc: 'Antarkan makanan lezat, kelola jam kerja fleksibel Anda sendiri, dan dapatkan penghasilan tambahan.',
      icon: Bike,
      color: 'bg-blue-50 text-blue-500 border-blue-100 hover:border-blue-500',
      path: '/register/courier'
    },
    {
      id: 'merchant',
      title: 'Mitra Bisnis / Merchant',
      desc: 'Buka toko kuliner Anda, terima pesanan pelanggan, dan kelola menu makanan dengan mudah.',
      icon: Store,
      color: 'bg-green-50 text-green-500 border-green-100 hover:border-green-500',
      path: '/register/merchant'
    }
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col justify-between p-6 overflow-hidden text-left">
      {/* Header bar */}
      <div>
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => navigate('/onboarding')}
            className="p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 active:scale-95 transition-all text-gray-800 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="mt-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pilih Jenis Akun</h1>
          <p className="text-gray-500 text-sm mt-2">Silakan pilih peran pendaftaran Anda untuk memulai di platform FastFood.</p>
        </div>

        {/* Roles List */}
        <div className="mt-8 space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => navigate(role.path)}
                className={`w-full text-left p-4.5 rounded-[2rem] border-2 bg-white flex items-center justify-between gap-4 active:scale-98 cursor-pointer transition-all duration-300 ${role.color.split(' ').slice(2).join(' ')}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3.5 rounded-2xl ${role.color.split(' ').slice(0, 2).join(' ')}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 pr-2">
                    <h3 className="text-sm font-black text-gray-800 tracking-tight">{role.title}</h3>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{role.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer footer */}
      <div className="text-center pt-6">
        <p className="text-gray-500 text-sm">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-bold underline transition-colors">
            MASUK
          </Link>
        </p>
      </div>
    </div>
  );
}
